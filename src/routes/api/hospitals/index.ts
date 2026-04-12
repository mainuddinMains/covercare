import { createFileRoute } from '@tanstack/react-router'
import { findHospitals } from '@/lib/google-places'
import { getCfEnv } from '@/lib/env'

export const Route = createFileRoute('/api/hospitals/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const lat = parseFloat(url.searchParams.get('lat') ?? '')
        const lng = parseFloat(url.searchParams.get('lng') ?? '')

        if (isNaN(lat) || isNaN(lng)) {
          return new Response(
            JSON.stringify({ error: 'lat and lng are required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          )
        }

        const env = getCfEnv()
        const hospitals = await findHospitals(
          env.GOOGLE_PLACES_API_KEY,
          lat,
          lng,
        )
        return new Response(JSON.stringify(hospitals), {
          headers: { 'Content-Type': 'application/json' },
        })
      },
    },
  },
})
