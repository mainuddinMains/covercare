import { createFileRoute } from '@tanstack/react-router'
import { searchDrug, getDrugAlternatives } from '@/lib/fda-drugs'

export const Route = createFileRoute('/api/drug-prices/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const drug = url.searchParams.get('drug') ?? ''
        const mode = url.searchParams.get('mode') ?? 'search'

        if (!drug) {
          return new Response(
            JSON.stringify({ error: 'drug parameter is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          )
        }

        try {
          if (mode === 'alternatives') {
            const alternatives = await getDrugAlternatives(drug)
            return new Response(JSON.stringify({ alternatives }), {
              headers: { 'Content-Type': 'application/json' },
            })
          }

          const results = await searchDrug(drug)
          return new Response(JSON.stringify({ results }), {
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
