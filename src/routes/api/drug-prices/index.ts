import { createFileRoute } from '@tanstack/react-router'
import { getDrugPrices } from '@/lib/goodrx'
import { getCfEnv } from '@/lib/env'

export const Route = createFileRoute('/api/drug-prices/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const cfEnv = getCfEnv()
        const apiKey = cfEnv.GOODRX_API_KEY
        const clientId = cfEnv.GOODRX_CLIENT_ID

        if (!apiKey || !clientId) {
          return new Response(
            JSON.stringify({ error: 'GoodRx API not configured' }),
            { status: 503, headers: { 'Content-Type': 'application/json' } },
          )
        }

        const url = new URL(request.url)
        const drug = url.searchParams.get('drug') ?? ''
        const quantity = parseInt(url.searchParams.get('quantity') ?? '30', 10)

        if (!drug) {
          return new Response(
            JSON.stringify({ error: 'drug parameter is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          )
        }

        try {
          const prices = await getDrugPrices(drug, quantity, apiKey, clientId)
          return new Response(JSON.stringify({ prices }), {
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
