# CareCompass 🏥

> AI-powered US healthcare navigator for immigrants, international students, and underserved Americans.

Built for hackathon — helps users find the right insurance, locate in-network hospitals, and discover free community clinics near them.

## Features

- **Insurance Guide** — personalized coverage options by immigration/citizenship status
- **Find Care** — AI-powered symptom guidance + in-network provider search (St. Louis)
- **Community Clinics** — FQHC and free clinic locator, accepts all regardless of status
- **Learn** — plain-language explainers on how US healthcare actually works

## Tech Stack

- React 18 + Vite
- Anthropic Claude API (`claude-sonnet-4-20250514`) for AI guidance
- No backend — runs entirely in the browser

## Getting Started

```bash
npm install
npm run dev
```

## API Setup

The app calls the Anthropic API directly from the frontend. For production, proxy requests through a backend to protect your API key.

```js
// src/App.jsx — FindCare component
const res = await fetch("https://api.anthropic.com/v1/messages", { ... })
```

For the hackathon demo, you can use Anthropic's [client-side API key](https://console.anthropic.com) with appropriate usage limits.

## Project Structure

```
carecompass/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx
    └── App.jsx        # Full app — all components in one file
```

## Screens

| Screen | Description |
|--------|-------------|
| Login / Signup | Entry point |
| Status selector | Immigration/citizenship status for personalized guidance |
| Insurance onboarding | 3-step plan setup (company, type, costs) |
| Find Care | AI symptom triage + provider cards sorted by network |
| Community Clinics | FQHCs and free clinics with filter |
| Learn | Accordion cards explaining US healthcare |
| Profile | Insurance summary + quick reference numbers |

## Credits

Built by Mainuddin — SLU MS Computer Science, HackSLU 2026
