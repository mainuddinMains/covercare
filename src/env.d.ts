/// <reference types="vite/client" />

interface CloudflareEnv {
  DB: D1Database
  AUTH_SECRET: string
  AUTH_BASE_URL: string
  OPENROUTER_API_KEY: string
  GOOGLE_PLACES_API_KEY: string
  CMS_MARKETPLACE_API_KEY?: string
  GOODRX_CLIENT_ID?: string
  GOODRX_API_KEY?: string
  OPEN211_API_KEY?: string
  ZOCDOC_API_KEY?: string
}
