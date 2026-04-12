import { createFileRoute } from '@tanstack/react-router'
import { findPlans } from '@/lib/healthcare-gov'
import { getCfEnv } from '@/lib/env'

export const Route = createFileRoute('/api/plans')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const zip = url.searchParams.get('zip') ?? ''
        const year = parseInt(url.searchParams.get('year') ?? '2025', 10)

        if (!zip) {
          return new Response(
            JSON.stringify({ error: 'zip is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          )
        }

        const cfEnv = getCfEnv()
        const apiKey = cfEnv.CMS_MARKETPLACE_API_KEY

        try {
          const plans = await findPlans(zip, year, apiKey)
          return new Response(JSON.stringify({ plans }), {
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
