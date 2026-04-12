# CareCompass

AI-powered healthcare navigation for people who need help understanding and accessing the US healthcare system.

## Features

- **AI Chat Assistant** - Plain-language healthcare guidance via OpenRouter (streaming)
- **Cost Estimator** - Out-of-pocket estimates using real CMS Medicare Fee Schedule rates
- **Hospital Finder** - Nearby hospitals via Google Places API
- **Clinic Finder** - HRSA community health centers by ZIP code
- **Provider Search** - NPI registry doctor/specialist lookup
- **Insurance Plan Search** - ACA Marketplace plans via Healthcare.gov
- **Insurance Card Scanner** - Vision API extracts card details from a photo
- **Glossary** - 40+ insurance/medical terms explained in plain English
- **Bilingual** - English and Spanish
- **Accessibility** - High contrast mode, adjustable font sizes, simple language mode

## Tech Stack

- **Frontend**: React 19, TanStack Router, Tailwind CSS v4, shadcn/ui
- **Backend**: TanStack Start on Cloudflare Workers
- **Database**: Drizzle ORM + Cloudflare D1 (SQLite)
- **Auth**: better-auth (email/password)
- **State**: Zustand (persisted to localStorage)
- **AI**: OpenRouter API

## Getting Started

```bash
pnpm install
cp .env.example .env
# Fill in AUTH_SECRET, OPENROUTER_API_KEY, GOOGLE_PLACES_API_KEY
pnpm dev
```

The dev server runs at `http://care-compass.localhost:1355`.

`pnpm dev` automatically generates Drizzle migrations and applies them to the local D1 database before starting.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Generate migrations, apply locally, start dev server |
| `pnpm build` | Production build |
| `pnpm deploy` | Build and deploy to Cloudflare Workers |
| `pnpm db:generate` | Generate Drizzle migrations from schema |
| `pnpm db:migrate:local` | Apply migrations to local D1 |
| `pnpm db:migrate:remote` | Apply migrations to remote D1 |
| `pnpm check` | Format and lint |

## Project Structure

```
src/
  components/     UI components (shadcn/ui in ui/)
  lib/
    auth.ts       better-auth server config
    auth-client.ts  Client-side auth hooks
    auth-server.ts  Session server function
    card-scanner.ts Vision API insurance card parsing
    cost-estimator.ts CMS Medicare rate lookups
    db/           Drizzle schema and client
    geocoding.ts  Reverse geocoding
    glossary.ts   Insurance term definitions
    google-places.ts Hospital finder
    healthcare-gov.ts ACA plan search
    hrsa.ts       Community health center finder
    i18n.ts       English/Spanish translations
    npi.ts        Provider registry search
    openrouter.ts LLM streaming chat
    types.ts      Shared type definitions
  routes/         TanStack Router file-based routes
  store/          Zustand stores (insurance, reminders, preferences)
```
