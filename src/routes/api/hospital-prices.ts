import { createFileRoute } from '@tanstack/react-router'
import { lookupHospitalPrices } from '@/lib/cms-hospital-prices'

export const Route = createFileRoute('/api/hospital-prices')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const keyword = url.searchParams.get('keyword') ?? ''
        const state = url.searchParams.get('state') ?? undefined
        const limit = parseInt(url.searchParams.get('limit') ?? '20', 10)

        if (!keyword) {
          return new Response(
            JSON.stringify({ error: 'keyword is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          )
        }

        try {
          const prices = await lookupHospitalPrices(keyword, state, limit)
          return new Response(JSON.stringify({ prices }), {
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
