import { createFileRoute } from '@tanstack/react-router'
import { findSocialServices } from '@/lib/open211'
import { getCfEnv } from '@/lib/env'

export const Route = createFileRoute('/api/social-services/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const cfEnv = getCfEnv()
        const apiKey = cfEnv.OPEN211_API_KEY

        if (!apiKey) {
          return new Response(
            JSON.stringify({ error: '211 API not configured' }),
            { status: 503, headers: { 'Content-Type': 'application/json' } },
          )
        }

        const url = new URL(request.url)
        const lat = parseFloat(url.searchParams.get('lat') ?? '')
        const lng = parseFloat(url.searchParams.get('lng') ?? '')
        const keyword = url.searchParams.get('keyword') ?? 'health'
        const radius = parseInt(url.searchParams.get('radius') ?? '10', 10)
        const limit = parseInt(url.searchParams.get('limit') ?? '20', 10)

        if (isNaN(lat) || isNaN(lng)) {
          return new Response(
            JSON.stringify({ error: 'lat and lng are required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          )
        }

        try {
          const services = await findSocialServices(
            lat,
            lng,
            keyword,
            apiKey,
            radius,
            limit,
          )
          return new Response(JSON.stringify({ services }), {
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
