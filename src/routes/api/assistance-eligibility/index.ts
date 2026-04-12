import { createFileRoute } from '@tanstack/react-router'
import { assessEligibility } from '@/lib/assistance-eligibility'

export const Route = createFileRoute('/api/assistance-eligibility/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const income = parseFloat(url.searchParams.get('income') ?? '')
        const householdSize = parseInt(url.searchParams.get('householdSize') ?? '', 10)
        const state = url.searchParams.get('state') ?? ''

        if (!income || !householdSize || !state) {
          return new Response(
            JSON.stringify({
              error: 'income, householdSize, and state are required',
            }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          )
        }

        const result = assessEligibility(income, householdSize, state)
        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json' },
        })
      },
    },
  },
})
