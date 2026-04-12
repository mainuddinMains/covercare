import { createFileRoute } from '@tanstack/react-router'
import { findProviders } from '@/lib/npi'

export const Route = createFileRoute('/api/providers/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const query = url.searchParams.get('query')
        const state = url.searchParams.get('state') ?? undefined
        const limit = parseInt(url.searchParams.get('limit') ?? '10', 10)

        if (!query) {
          return new Response(
            JSON.stringify({ error: 'query is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          )
        }

        const providers = await findProviders(query, state, limit)
        return new Response(JSON.stringify(providers), {
          headers: { 'Content-Type': 'application/json' },
        })
      },
    },
  },
})
