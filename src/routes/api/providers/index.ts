import { createFileRoute } from '@tanstack/react-router'
import { searchPhysicians } from '@/lib/cms-physicians'

export const Route = createFileRoute('/api/providers/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const zip = url.searchParams.get('zip')
        const specialty = url.searchParams.get('specialty') || undefined

        if (!zip || zip.length !== 5) {
          return new Response(
            JSON.stringify({ error: 'A 5-digit ZIP code is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          )
        }

        const result = await searchPhysicians(zip, specialty)
        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json' },
        })
      },
    },
  },
})
