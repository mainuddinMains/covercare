/// <reference types="vite/client" />

interface CloudflareEnv {
  DB: D1Database
  AUTH_SECRET: string
  AUTH_BASE_URL: string
  AUTH_TRUSTED_ORIGINS?: string
  DEV_MODE?: string
  OPENROUTER_API_KEY: string
  OPENROUTER_MODELS?: string
  GOOGLE_PLACES_API_KEY: string
  CMS_MARKETPLACE_API_KEY?: string
  GOODRX_CLIENT_ID?: string
  GOODRX_API_KEY?: string
  OPEN211_API_KEY?: string
  ZOCDOC_API_KEY?: string

}
