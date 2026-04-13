import { createFileRoute } from '@tanstack/react-router'
import {
  type MrfInsurer, type PlanFileEntry,
  buildAetnaIndexUrl, buildAnthemIndexUrl,
  UHC_BLOBS_URL, UHC_DOWNLOAD_BASE, CIGNA_PORTAL_URL,
  extractPlanFiles, monthOffset,
} from '@/lib/mrf'

// GET /api/mrf/discover?insurer=aetna&query=silver+ppo
// Returns a list of in-network rate file URLs for the given insurer.
// The optional query param filters results by plan name keywords.

export const Route = createFileRoute('/api/mrf/discover/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const insurer = url.searchParams.get('insurer') as MrfInsurer | null
        const query = url.searchParams.get('query') ?? ''

        if (!insurer) {
          return json({ error: 'insurer is required' }, 400)
        }

        try {
          const files = await discoverFiles(insurer, query)
          return json({ insurer, files })
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Discovery failed'
          return json({ insurer, files: [], error: message })
        }
      },
    },
  },
})

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

async function discoverFiles(insurer: MrfInsurer, query: string): Promise<PlanFileEntry[]> {
  switch (insurer) {
    case 'aetna': return discoverAetna(query)
    case 'uhc': return discoverUhc(query)
    case 'cigna': return discoverCigna(query)
    case 'anthem': return discoverAnthem(query)
    case 'bcbs': return []
  }
}

// Aetna: fetch table-of-contents JSON from HealthSparq CDN.
// Tries up to 3 months back until a valid response is found.
async function discoverAetna(query: string): Promise<PlanFileEntry[]> {
  const brandCodes = ['ALICFI', 'ALICSI']
  for (const brand of brandCodes) {
    for (let offset = 1; offset <= 3; offset++) {
      const indexUrl = buildAetnaIndexUrl(brand, monthOffset(new Date(), -offset))
      const res = await fetch(indexUrl)
      if (!res.ok) continue

      const ds = new DecompressionStream('gzip')
      const piped = res.body!.pipeThrough(ds)
      const text = await new Response(piped).text()
      const toc = JSON.parse(text) as unknown
      const all = extractPlanFiles(toc)
      return query ? fuzzyFilter(all, query) : all.slice(0, 50)
    }
  }
  return []
}

// UHC: blobs listing API returns an array of file names; filter to index files
// matching the query, then build download URLs.
async function discoverUhc(query: string): Promise<PlanFileEntry[]> {
  const res = await fetch(UHC_BLOBS_URL, {
    headers: { Accept: 'application/json' },
    // Use a signal to prevent hanging if the response is enormous
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) return []

  // Read up to 10 MB of the response to avoid exhausting Worker memory
  const reader = res.body!.pipeThrough(new TextDecoderStream()).getReader()
  let raw = ''
  while (raw.length < 10 * 1024 * 1024) {
    const { done, value } = await reader.read()
    if (done) break
    raw += value
  }
  reader.cancel()

  // The listing may be truncated; parse what we have
  // It's a JSON array - find complete file name strings
  const names = [...raw.matchAll(/"([^"]*_index\.json[^"]*)"/g)].map(m => m[1])
  const keywords = query.toLowerCase().split(/\s+/).filter(Boolean)
  const matched = keywords.length
    ? names.filter(n => keywords.every(k => n.toLowerCase().includes(k)))
    : names.slice(0, 50)

  return matched.map(name => {
    const date = name.match(/^(\d{4}-\d{2}-\d{2})_/)?.[1] ?? ''
    const planName = name.replace(/^\d{4}-\d{2}-\d{2}_/, '').replace(/_index\.json.*$/, '').replace(/-/g, ' ')
    const downloadUrl = `${UHC_DOWNLOAD_BASE}?fd=${date}&fn=${encodeURIComponent(name)}`
    return { planName, description: 'UHC in-network rates index', url: downloadUrl }
  })
}

// Cigna: fetch the portal page and extract CloudFront .json.gz URLs from HTML.
// Signed URLs expire but are fresh at request time.
async function discoverCigna(query: string): Promise<PlanFileEntry[]> {
  const res = await fetch(CIGNA_PORTAL_URL, {
    headers: { 'User-Agent': 'CoverCare/1.0 (MRF Transparency Lookup)' },
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) return []

  const html = await res.text()
  // Extract CloudFront URLs for in-network rates files
  const matches = [
    ...html.matchAll(/https:\/\/d25kgz5rikkq4n\.cloudfront\.net[^"'\s]+in-network[^"'\s]*\.json(?:\.gz)?[^"'\s]*/g),
  ]
  const urls = [...new Set(matches.map(m => m[0]))]
  const keywords = query.toLowerCase().split(/\s+/).filter(Boolean)

  const files: PlanFileEntry[] = urls.map(u => {
    const namePart = u.split('/').pop()?.split('?')[0] ?? u
    return { planName: namePart, description: 'Cigna in-network rates', url: u }
  })

  return keywords.length ? fuzzyFilter(files, query) : files.slice(0, 50)
}

// Anthem: try S3 bucket index. Returns empty if the bucket is inaccessible.
async function discoverAnthem(query: string): Promise<PlanFileEntry[]> {
  for (let offset = 1; offset <= 3; offset++) {
    const indexUrl = buildAnthemIndexUrl(monthOffset(new Date(), -offset))
    const res = await fetch(indexUrl, { signal: AbortSignal.timeout(10000) })
    if (!res.ok) continue

    const ds = new DecompressionStream('gzip')
    const piped = res.body!.pipeThrough(ds)
    const text = await new Response(piped).text()
    const toc = JSON.parse(text) as unknown
    const all = extractPlanFiles(toc)
    return query ? fuzzyFilter(all, query) : all.slice(0, 50)
  }
  return []
}

function fuzzyFilter(files: PlanFileEntry[], query: string): PlanFileEntry[] {
  const keywords = query.toLowerCase().split(/\s+/).filter(Boolean)
  return files
    .filter(f => keywords.some(k =>
      f.planName.toLowerCase().includes(k) || f.description.toLowerCase().includes(k),
    ))
    .slice(0, 20)
}
