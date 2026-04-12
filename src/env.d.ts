/// <reference types="vite/client" />

interface CloudflareEnv {
  DB: D1Database
  AUTH_SECRET: string
  AUTH_BASE_URL: string
  OPENROUTER_API_KEY: string
  GOOGLE_PLACES_API_KEY: string
}
