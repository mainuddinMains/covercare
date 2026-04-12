import { createFileRoute } from '@tanstack/react-router'
import { findPlans } from '@/lib/healthcare-gov'

export const Route = createFileRoute('/api/plans/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const zip = url.searchParams.get('zip')
        const year = parseInt(
          url.searchParams.get('year') ?? String(new Date().getFullYear()),
          10,
        )

        if (!zip) {
          return new Response(
            JSON.stringify({ error: 'zip is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          )
        }

        const plans = await findPlans(zip, year)
        return new Response(JSON.stringify(plans), {
          headers: { 'Content-Type': 'application/json' },
        })
      },
    },
  },
})
