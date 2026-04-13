import { createFileRoute } from '@tanstack/react-router'
import { eq } from 'drizzle-orm'
import { createDb } from '@/lib/db/client'
import { getCfEnv } from '@/lib/env'
import { mrfRateCache } from '@/lib/db/schema'
import { scanStreamForRate } from '@/lib/mrf-stream'
import type { MrfInsurer } from '@/lib/mrf'

// GET /api/mrf/rates?insurer=aetna&cpt=99213&file_url=https%3A%2F%2F...
//
// Stream-scans the given MRF in-network file for the billing code, returns
// rate statistics. Results are cached in D1 for 30 days (files update monthly).

const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000

export const Route = createFileRoute('/api/mrf/rates/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const insurer = (url.searchParams.get('insurer') ?? '') as MrfInsurer
        const cpt = url.searchParams.get('cpt') ?? ''
        const fileUrl = url.searchParams.get('file_url') ?? ''

        if (!cpt || !fileUrl) {
          return json({ error: 'cpt and file_url are required' }, 400)
        }

        const db = createDb(getCfEnv().DB)
        const cacheId = await hashKey(`${fileUrl}:${cpt}`)

        // Check D1 cache first
        const cached = await db
          .select()
          .from(mrfRateCache)
          .where(eq(mrfRateCache.id, cacheId))
          .get()

        if (cached && Date.now() - new Date(cached.fetchedAt).getTime() < CACHE_TTL_MS) {
          return json({
            billingCode: cached.billingCode,
            description: cached.description,
            min: cached.rateMin,
            max: cached.rateMax,
            median: cached.rateMedian,
            avg: cached.rateAvg,
            sampleSize: cached.sampleSize,
            cached: true,
          })
        }

        // Fetch and stream-parse the MRF file
        const res = await fetch(fileUrl, { signal: AbortSignal.timeout(25000) })
        if (!res.ok) {
          return json({ error: `File fetch failed: ${res.status}` }, 502)
        }

        const contentType = res.headers.get('content-type') ?? ''
        const isGzip = fileUrl.endsWith('.gz') || contentType.includes('gzip')

        const summary = await scanStreamForRate(res.body!, isGzip, cpt)

        if (!summary) {
          return json({ error: `Billing code ${cpt} not found in this plan file` }, 404)
        }

        // Cache in D1
        await db
          .insert(mrfRateCache)
          .values({
            id: cacheId,
            insurer,
            billingCode: cpt,
            fileUrl,
            description: summary.description,
            rateMin: summary.min,
            rateMax: summary.max,
            rateMedian: summary.median,
            rateAvg: summary.avg,
            sampleSize: summary.sampleSize,
          })
          .onConflictDoUpdate({
            target: mrfRateCache.id,
            set: {
              rateMin: summary.min,
              rateMax: summary.max,
              rateMedian: summary.median,
              rateAvg: summary.avg,
              sampleSize: summary.sampleSize,
              description: summary.description,
              fetchedAt: new Date(),
            },
          })

        return json({ ...summary, cached: false })
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

async function hashKey(input: string): Promise<string> {
  const enc = new TextEncoder()
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(input))
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('')
}
