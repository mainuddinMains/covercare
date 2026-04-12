import { createFileRoute } from '@tanstack/react-router'
import { searchHospitalsByZip } from '@/lib/cms-hospitals'

export const Route = createFileRoute('/api/hospitals/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const zip = url.searchParams.get('zip')

        if (!zip || zip.length !== 5) {
          return new Response(
            JSON.stringify({ error: 'A 5-digit ZIP code is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          )
        }

        const hospitals = await searchHospitalsByZip(zip)
        return new Response(JSON.stringify(hospitals), {
          headers: { 'Content-Type': 'application/json' },
        })
      },
    },
  },
})
