import { createFileRoute } from '@tanstack/react-router'
import { getCfEnv } from '@/lib/env'

// Google Distance Matrix API
// Enable "Distance Matrix API" in Google Cloud Console (same project as Places API)

interface DistanceElement {
  status: string
  duration?: { text: string }
  distance?: { text: string }
}

interface DistanceRow {
  elements: DistanceElement[]
}

interface DistanceMatrixResponse {
  rows: DistanceRow[]
  status: string
}

async function fetchMode(
  origin: string,
  dests: string,
  mode: string,
  apiKey: string,
): Promise<Array<{ duration: string; distance: string } | null>> {
  const params = new URLSearchParams({
    origins: origin,
    destinations: dests,
    mode,
    key: apiKey,
  })

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/distancematrix/json?${params}`,
  )

  if (!res.ok) return []

  const data: DistanceMatrixResponse = await res.json()
  const row = data.rows?.[0]
  if (!row) return []

  return row.elements.map((el) =>
    el.status === 'OK'
      ? { duration: el.duration?.text ?? '', distance: el.distance?.text ?? '' }
      : null,
  )
}

export const Route = createFileRoute('/api/distance/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const apiKey = getCfEnv().GOOGLE_PLACES_API_KEY
        if (!apiKey) {
          return new Response(
            JSON.stringify({ error: 'Google API not configured' }),
            { status: 503, headers: { 'Content-Type': 'application/json' } },
          )
        }

        const url = new URL(request.url)
        const origin = url.searchParams.get('origin') ?? ''
        const dests = url.searchParams.get('dests') ?? ''

        if (!origin || !dests) {
          return new Response(
            JSON.stringify({ error: 'origin and dests are required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          )
        }

        const [driving, walking, transit] = await Promise.all([
          fetchMode(origin, dests, 'driving', apiKey),
          fetchMode(origin, dests, 'walking', apiKey),
          fetchMode(origin, dests, 'transit', apiKey),
        ])

        return new Response(
          JSON.stringify({ driving, walking, transit }),
          { headers: { 'Content-Type': 'application/json' } },
        )
      },
    },
  },
})
