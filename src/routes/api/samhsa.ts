import { createFileRoute } from '@tanstack/react-router'
import { findTreatmentFacilities } from '@/lib/samhsa'

export const Route = createFileRoute('/api/samhsa')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const lat = parseFloat(url.searchParams.get('lat') ?? '')
        const lng = parseFloat(url.searchParams.get('lng') ?? '')
        const radius = parseInt(url.searchParams.get('radius') ?? '25', 10)

        if (isNaN(lat) || isNaN(lng)) {
          return new Response(
            JSON.stringify({ error: 'lat and lng are required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          )
        }

        try {
          const facilities = await findTreatmentFacilities(lat, lng, radius)
          return new Response(JSON.stringify({ facilities }), {
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
