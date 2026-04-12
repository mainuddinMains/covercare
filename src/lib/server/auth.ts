import { getRequest } from '@tanstack/react-start/server'
import { createAuth } from '@/lib/auth'
import { createDb } from '@/lib/db/client'
import { getCfEnv } from '@/lib/env'

export async function requireUser() {
  const env = getCfEnv()
  const request = getRequest()
  const auth = createAuth(env)
  const db = createDb(env.DB)
  const session = await auth.api.getSession({ headers: request.headers })

  if (!session || session.user.isAnonymous) {
    throw new Error('Authentication required')
  }

  return { userId: session.user.id, db }
}
