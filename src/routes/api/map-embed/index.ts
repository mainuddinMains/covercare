import { createFileRoute } from '@tanstack/react-router'
import { getCfEnv } from '@/lib/env'

// Proxies Google Maps Embed API so the key never appears in client source
export const Route = createFileRoute('/api/map-embed/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const apiKey = getCfEnv().GOOGLE_PLACES_API_KEY
        if (!apiKey) {
          return new Response('API key not configured', { status: 503 })
        }

        const url = new URL(request.url)
        const lat = url.searchParams.get('lat')
        const lng = url.searchParams.get('lng')
        const zip = url.searchParams.get('zip') ?? ''
        const showHospitals = url.searchParams.get('hospitals') === '1'

        let embedUrl: string

        if (lat && lng) {
          const center = `${lat},${lng}`
          if (showHospitals) {
            embedUrl = `https://www.google.com/maps/embed/v1/search?key=${apiKey}&q=hospitals&center=${center}&zoom=13`
          } else {
            embedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${center}&zoom=14`
          }
        } else {
          const q = showHospitals ? `hospitals near ${zip}` : zip
          embedUrl = `https://www.google.com/maps/embed/v1/search?key=${apiKey}&q=${encodeURIComponent(q)}&zoom=13`
        }

        return Response.redirect(embedUrl, 302)
      },
    },
  },
})
