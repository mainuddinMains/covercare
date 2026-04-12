import { createFileRoute } from '@tanstack/react-router'
import { findHospitalsWithRatings } from '@/lib/cms-hospital-compare'

export const Route = createFileRoute('/api/hospital-compare/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const state = url.searchParams.get('state') ?? ''
        const city = url.searchParams.get('city') ?? undefined
        const limit = parseInt(url.searchParams.get('limit') ?? '20', 10)

        if (!state) {
          return new Response(
            JSON.stringify({ error: 'state is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          )
        }

        try {
          const hospitals = await findHospitalsWithRatings(state, city, limit)
          return new Response(JSON.stringify({ hospitals }), {
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
