import { createFileRoute } from '@tanstack/react-router'
import { createAuth } from '@/lib/auth'
import { getCfEnv } from '@/lib/env'

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = createAuth(getCfEnv())
        return auth.handler(request)
      },
      POST: async ({ request }) => {
        const auth = createAuth(getCfEnv())
        return auth.handler(request)
      },
    },
  },
})
