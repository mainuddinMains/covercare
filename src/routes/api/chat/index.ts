import { createFileRoute } from '@tanstack/react-router'
import {
  chat,
  convertMessagesToModelMessages,
  maxIterations,
  toServerSentEventsResponse,
} from '@tanstack/ai'
import { createCodeMode } from '@tanstack/ai-code-mode'
import { createCloudflareIsolateDriver } from '@tanstack/ai-isolate-cloudflare'
import { createOpenRouterText } from '@tanstack/ai-openrouter'
import { getCfEnv } from '@/lib/env'
import { TOOL_DEFS } from '@/lib/ai/tools'
import { codeModeTools } from '@/lib/ai/codemode-tools'

let codeModeCache: {
  tool: ReturnType<typeof createCodeMode>['tool']
  systemPrompt: string
} | null = null

function getCodeMode(workerUrl: string) {
  if (codeModeCache) return codeModeCache

  const driver = createCloudflareIsolateDriver({
    workerUrl,
    timeout: 60_000,
  })

  const { tool, systemPrompt } = createCodeMode({
    driver,
    tools: codeModeTools,
    timeout: 60_000,
    memoryLimit: 128,
  })

  codeModeCache = { tool, systemPrompt }
  return codeModeCache
}

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

        const workerUrl = env.CODE_EXECUTOR_URL || 'http://localhost:8788'
        const { tool: codeModeTool, systemPrompt: codeModePrompt } =
          getCodeMode(workerUrl)

        const stream = chat({
          adapter,
          messages: convertMessagesToModelMessages(messages) as any,
          systemPrompts: [systemPrompt, codeModePrompt],
          tools: [codeModeTool, ...TOOL_DEFS],
          agentLoopStrategy: maxIterations(10),
        })

        return toServerSentEventsResponse(stream)
      },
    },
  },
})
