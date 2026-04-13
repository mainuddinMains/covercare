import { createFileRoute } from '@tanstack/react-router'
import { getCfEnv } from '@/lib/env'

// POST /api/bills/explain/
// Accepts { billText?: string, imageBase64?: string }
// Returns structured bill analysis as JSON

export const Route = createFileRoute('/api/bills/explain/')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const env = getCfEnv()
        const apiKey = env.OPENROUTER_API_KEY
        if (!apiKey) {
          return json({ error: 'OPENROUTER_API_KEY not configured' }, 500)
        }

        const body = await request.json() as {
          billText?: string
          imageBase64?: string
        }

        if (!body.billText && !body.imageBase64) {
          return json({ error: 'Provide billText or imageBase64' }, 400)
        }

        const model = env.OPENROUTER_MODELS
          ? env.OPENROUTER_MODELS.split(',')[0].trim()
          : 'openai/gpt-4o-mini'

        const systemPrompt = `You are a US medical billing expert helping patients understand and challenge their bills.
Analyze the provided medical bill and respond ONLY with a valid JSON object in this exact shape:
{
  "summary": "2-3 sentence plain-language explanation of what this bill covers and the total owed",
  "lineItems": [
    { "code": "CPT or billing code if visible", "description": "official name", "charged": "dollar amount", "plainEnglish": "what this actually means in plain language" }
  ],
  "potentialErrors": [
    { "type": "error category", "description": "specific explanation of the suspected problem", "severity": "high|medium|low" }
  ],
  "disputeSteps": ["step 1", "step 2", "step 3"],
  "rightsReminder": "one sentence citing a relevant patient right or law (No Surprises Act, state balance billing laws, ERISA, etc.)"
}

Common billing errors to look for: duplicate charges, upcoding (higher-complexity code than warranted), unbundling (splitting bundled services to charge more), charges for items not rendered, incorrect diagnosis codes, wrong insurance applied, balance billing from in-network providers, facility fees not disclosed, observation vs. inpatient status issues.
If no errors are found, return an empty array for potentialErrors.
Return ONLY the JSON object, no markdown, no explanation.`

        let messages: unknown[]

        if (body.imageBase64) {
          messages = [
            { role: 'system', content: systemPrompt },
            {
              role: 'user',
              content: [
                {
                  type: 'image_url',
                  image_url: { url: body.imageBase64 },
                },
                {
                  type: 'text',
                  text: body.billText
                    ? `Additional context from the patient: ${body.billText}`
                    : 'Please analyze this medical bill.',
                },
              ],
            },
          ]
        } else {
          messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: body.billText! },
          ]
        }

        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            max_tokens: 1400,
            messages,
          }),
        })

        if (!res.ok) {
          return json({ error: `OpenRouter error: ${res.status}` }, 502)
        }

        const data = await res.json() as {
          choices?: Array<{ message?: { content?: string } }>
        }
        const raw = data.choices?.[0]?.message?.content?.trim() ?? ''

        try {
          const analysis = JSON.parse(raw)
          return json({ analysis })
        } catch {
          return json({ analysis: null, raw })
        }
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
