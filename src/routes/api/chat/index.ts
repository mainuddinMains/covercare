import { createFileRoute } from '@tanstack/react-router'
import {
  chat,
  convertMessagesToModelMessages,
  toServerSentEventsResponse,
} from '@tanstack/ai'
import { createOpenRouterText } from '@tanstack/ai-openrouter'
import { getCfEnv } from '@/lib/env'
import { TOOL_DEFS } from '@/lib/ai/tools'

export const Route = createFileRoute('/api/chat/')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const env = getCfEnv()
        const apiKey = env.OPENROUTER_API_KEY
        if (!apiKey) {
          return new Response(
            JSON.stringify({ error: 'OPENROUTER_API_KEY not configured' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } },
          )
        }

        const body = (await request.json()) as {
          messages: Array<any>
          data?: { context?: string }
        }

        const { messages, data } = body
        const systemPrompt = data?.context ?? ''
        const model = env.OPENROUTER_MODELS
          ? env.OPENROUTER_MODELS.split(',')[0].trim()
          : 'openai/gpt-4o-mini'
        const adapter = createOpenRouterText(model as any, apiKey)

        const stream = chat({
          adapter,
          messages: convertMessagesToModelMessages(messages) as any,
          systemPrompts: [systemPrompt],
          tools: TOOL_DEFS,
        })

        return toServerSentEventsResponse(stream)
      },
    },
  },
})
