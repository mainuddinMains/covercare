import { createFileRoute } from '@tanstack/react-router'
import { streamChat } from '@/lib/openrouter'
import { getCfEnv } from '@/lib/env'
import type { Message } from '@/lib/types'

export const Route = createFileRoute('/api/chat/')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const env = getCfEnv()
        const body = (await request.json()) as {
          messages: Message[]
          profileContext?: string
          simpleMode?: boolean
        }

        const stream = await streamChat(
          env.OPENROUTER_API_KEY,
          body.messages,
          body.profileContext,
          body.simpleMode,
        )

        return new Response(stream, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
          },
        })
      },
    },
  },
})
