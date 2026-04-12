import { env } from 'cloudflare:workers'

export function getCfEnv(): CloudflareEnv {
  return env as unknown as CloudflareEnv
}
