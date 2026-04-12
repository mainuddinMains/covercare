import { createFileRoute } from '@tanstack/react-router'
import { findClinics } from '@/lib/hrsa'

export const Route = createFileRoute('/api/clinics/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const zip = url.searchParams.get('zip')
        const radius = parseInt(url.searchParams.get('radius') ?? '25', 10)

        if (!zip) {
          return new Response(
            JSON.stringify({ error: 'zip is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          )
        }

        const clinics = await findClinics(zip, radius)
        return new Response(JSON.stringify(clinics), {
          headers: { 'Content-Type': 'application/json' },
        })
      },
    },
  },
})
