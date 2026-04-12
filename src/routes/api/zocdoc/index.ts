import { createFileRoute } from '@tanstack/react-router'
import { findZocdocProviders } from '@/lib/zocdoc'
import { getCfEnv } from '@/lib/env'

export const Route = createFileRoute('/api/zocdoc/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const cfEnv = getCfEnv()
        const apiKey = cfEnv.ZOCDOC_API_KEY

        if (!apiKey) {
          return new Response(
            JSON.stringify({ error: 'Zocdoc API not configured' }),
            { status: 503, headers: { 'Content-Type': 'application/json' } },
          )
        }

        const url = new URL(request.url)
        const lat = parseFloat(url.searchParams.get('lat') ?? '')
        const lng = parseFloat(url.searchParams.get('lng') ?? '')
        const specialty = url.searchParams.get('specialty') ?? 'Primary Care'
        const insurance = url.searchParams.get('insurance') ?? ''
        const limit = parseInt(url.searchParams.get('limit') ?? '15', 10)

        if (isNaN(lat) || isNaN(lng)) {
          return new Response(
            JSON.stringify({ error: 'lat and lng are required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          )
        }

        try {
          const providers = await findZocdocProviders(
            lat,
            lng,
            specialty,
            insurance,
            apiKey,
            limit,
          )
          return new Response(JSON.stringify({ providers }), {
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Unknown error'
          return new Response(JSON.stringify({ error: message }), {
            status: 502,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      },
    },
  },
})
