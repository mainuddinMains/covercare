import { createFileRoute } from '@tanstack/react-router'
import { findPlans } from '@/lib/healthcare-gov'
import { recommendPlans } from '@/lib/plan-recommender'
import { getCfEnv } from '@/lib/env'

export const Route = createFileRoute('/api/plans/recommend/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const zip = url.searchParams.get('zip') ?? ''
        const income = parseInt(url.searchParams.get('income') ?? '0', 10)
        const householdSize = parseInt(url.searchParams.get('household_size') ?? '1', 10)
        const year = parseInt(
          url.searchParams.get('year') ?? '2024',
          10,
        )

        if (!zip || !income) {
          return new Response(
            JSON.stringify({ error: 'zip and income are required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          )
        }

        const limit = parseInt(url.searchParams.get('limit') ?? '3', 10)
        const apiKey = getCfEnv().CMS_MARKETPLACE_API_KEY

        try {
          const plans = await findPlans(zip, year, apiKey, householdSize, income)
          const recommendations = recommendPlans(plans, income, householdSize, limit)
          return new Response(JSON.stringify({ recommendations }), {
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
