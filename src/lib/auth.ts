import { betterAuth } from 'better-auth'
import { anonymous } from 'better-auth/plugins'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { createDb } from '@/lib/db/client'
import * as schema from '@/lib/db/schema'

export function createAuth(env: CloudflareEnv) {
  const db = createDb(env.DB)

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'sqlite',
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
      },
    }),

    plugins: [
      anonymous({
        emailDomainName: 'guest.carecompass.app',
      }),
    ],

    emailAndPassword: {
      enabled: true,
    },

    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5, // 5 minutes
      },
    },

    baseURL: env.AUTH_BASE_URL,
    trustedOrigins: (request) => {
      if (env.DEV_MODE === 'true') {
        const origin = request?.headers.get('origin')
        if (origin) {
          const url = new URL(origin)
          if (url.hostname === 'localhost' || url.hostname.endsWith('.localhost')) {
            return [origin]
          }
        }
      }
      return env.AUTH_TRUSTED_ORIGINS ? env.AUTH_TRUSTED_ORIGINS.split(',') : []
    },
    secret: env.AUTH_SECRET,
  })
}
