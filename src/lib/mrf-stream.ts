import type { RateSummary } from './mrf'

// Stream-scan an MRF in-network rates file for a specific CPT billing code.
// Decompresses gzip on the fly, scans text for the billing code, collects
// negotiated_rate values, and stops once maxRates samples are gathered.
// Returns null if the billing code is not found within MAX_BYTES of decompressed text.
//
// Compatible with Cloudflare Workers (DecompressionStream, TextDecoderStream).

const MAX_BYTES = 150 * 1024 * 1024 // 150 MB decompressed before giving up

export async function scanStreamForRate(
  body: ReadableStream<Uint8Array>,
  isGzip: boolean,
  billingCode: string,
  maxRates = 5000,
): Promise<RateSummary | null> {
  let stream: ReadableStream<Uint8Array> = body
  if (isGzip) stream = stream.pipeThrough(new DecompressionStream('gzip'))
  const reader = stream.pipeThrough(new TextDecoderStream()).getReader()

  const searchStr = `"billing_code":"${billingCode}"`
  const rateRe = /"negotiated_rate":(\d+(?:\.\d+)?)/g

  let boundary = ''    // tail from previous chunk carried over for boundary crossing
  let collecting = false
  let depth = 0
  let description = ''
  const rates: number[] = []
  let totalBytes = 0

  try {
    outer: while (true) {
      const { done, value } = await reader.read()
      if (done) break
      totalBytes += value.length
      if (totalBytes > MAX_BYTES) break

      const chunk = boundary + value
      boundary = ''

      if (!collecting) {
        const idx = chunk.indexOf(searchStr)
        if (idx === -1) {
          // Keep tail to handle search string split across chunk boundary
          boundary = chunk.slice(-searchStr.length)
          continue
        }
        // Found billing code - extract nearby description
        const ctx = chunk.slice(idx, idx + 400)
        const dm = ctx.match(/"description":"([^"]*)"/)
        if (dm) description = dm[1]

        collecting = true
        depth = 0

        // Process the portion of this chunk after the billing code
        const rest = chunk.slice(idx + searchStr.length)
        for (const ch of rest) {
          if (ch === '{') depth++
          else if (ch === '}') {
            depth--
            if (depth < -1) break outer
          }
        }
        rateRe.lastIndex = 0
        for (const m of rest.matchAll(rateRe)) {
          if (rates.length >= maxRates) break outer
          rates.push(parseFloat(m[1]))
        }
        continue
      }

      // Collecting mode: track JSON nesting depth and extract rate values
      let shouldStop = false
      for (const ch of chunk) {
        if (ch === '{') depth++
        else if (ch === '}') {
          depth--
          if (depth < -1) { shouldStop = true; break }
        }
      }
      rateRe.lastIndex = 0
      for (const m of chunk.matchAll(rateRe)) {
        if (rates.length >= maxRates) { shouldStop = true; break }
        rates.push(parseFloat(m[1]))
      }
      if (shouldStop) break
    }
  } finally {
    reader.cancel()
  }

  if (rates.length === 0) return null

  rates.sort((a, b) => a - b)
  const n = rates.length
  return {
    billingCode,
    description,
    min: rates[0],
    max: rates[n - 1],
    median: rates[Math.floor(n / 2)],
    avg: Math.round((rates.reduce((s, r) => s + r, 0) / n) * 100) / 100,
    sampleSize: n,
  }
}
