import { createFileRoute } from '@tanstack/react-router'
import { estimateCost, type InsuranceType } from '@/lib/cost-estimator'

export const Route = createFileRoute('/api/cost-estimate/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const procedure = url.searchParams.get('procedure')
        const insurance = url.searchParams.get('insurance') as InsuranceType

        if (!procedure || !insurance) {
          return new Response(
            JSON.stringify({ error: 'procedure and insurance are required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          )
        }

        const estimate = await estimateCost(procedure, insurance)
        return new Response(JSON.stringify(estimate), {
          headers: { 'Content-Type': 'application/json' },
        })
      },
    },
  },
})
