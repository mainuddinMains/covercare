import { createFileRoute } from '@tanstack/react-router'
import { SCAN_PROMPT, parseScannedCard } from '@/lib/card-scanner'
import { getCfEnv } from '@/lib/env'

export const Route = createFileRoute('/api/scan-card/')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const env = getCfEnv()
        const body = (await request.json()) as { image: string }

        if (!body.image) {
          return new Response(
            JSON.stringify({ error: 'image (base64) is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          )
        }

        const res = await fetch(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
              'Content-Type': 'application/json',
              'X-Title': 'CareCompass',
            },
            body: JSON.stringify({
              model: 'openai/gpt-4o-mini',
              messages: [
                {
                  role: 'user',
                  content: [
                    { type: 'text', text: SCAN_PROMPT },
                    {
                      type: 'image_url',
                      image_url: { url: body.image },
                    },
                  ],
                },
              ],
            }),
          },
        )

        if (!res.ok) {
          const err = await res.text()
          return new Response(
            JSON.stringify({ error: `Vision API error: ${err}` }),
            { status: 502, headers: { 'Content-Type': 'application/json' } },
          )
        }

        const data = (await res.json()) as {
          choices?: { message?: { content?: string } }[]
        }
        const raw = data?.choices?.[0]?.message?.content ?? ''
        const card = await parseScannedCard(raw)
        return new Response(JSON.stringify(card), {
          headers: { 'Content-Type': 'application/json' },
        })
      },
    },
  },
})
