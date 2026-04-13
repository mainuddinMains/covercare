import { createFileRoute } from '@tanstack/react-router'
import { getCfEnv } from '@/lib/env'

// POST /api/dashboard/insight/
// Returns a single AI-generated health insurance tip based on the user's profile.

export const Route = createFileRoute('/api/dashboard/insight/')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const env = getCfEnv()
        const apiKey = env.OPENROUTER_API_KEY
        if (!apiKey) {
          return json({ error: 'OPENROUTER_API_KEY not configured' }, 500)
        }

        const body = await request.json() as {
          issuerName?: string
          planType?: string
          insuranceType?: string
          state?: string
          coverageEndDate?: string
          month?: string
        }

        const context = [
          body.issuerName && `Insurance: ${body.issuerName}`,
          body.planType && `Plan type: ${body.planType}`,
          body.insuranceType && `Coverage category: ${body.insuranceType}`,
          body.state && `State: ${body.state}`,
          body.coverageEndDate && `Coverage ends: ${body.coverageEndDate}`,
          body.month && `Current month: ${body.month}`,
        ].filter(Boolean).join(', ')

        const model = env.OPENROUTER_MODELS
          ? env.OPENROUTER_MODELS.split(',')[0].trim()
          : 'openai/gpt-4o-mini'

        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            max_tokens: 80,
            messages: [
              {
                role: 'system',
                content:
                  'You are a healthcare advisor. Given the user profile, give ONE short, specific, actionable tip (2 sentences max). Be warm and practical. No generic advice. No bullet points.',
              },
              {
                role: 'user',
                content: context || 'No profile info available yet.',
              },
            ],
          }),
        })

        if (!res.ok) {
          return json({ error: `OpenRouter error: ${res.status}` }, 502)
        }

        const data = await res.json() as {
          choices?: Array<{ message?: { content?: string } }>
        }
        const tip = data.choices?.[0]?.message?.content?.trim() ?? ''
        return json({ tip })
      },
    },
  },
})

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
