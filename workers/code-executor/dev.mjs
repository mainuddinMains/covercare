/**
 * Local dev server for the code executor Worker.
 * Uses miniflare directly so we can set unsafeEvalBinding,
 * which wrangler dev does not support from config.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const { Miniflare } = await import('../../node_modules/.pnpm/miniflare@4.20260409.0/node_modules/miniflare/dist/src/index.js')

const __dirname = dirname(fileURLToPath(import.meta.url))
const port = parseInt(process.argv[2] || '8788', 10)

// Compile TS to JS via sucrase (already a project dependency)
const { transform } = await import('sucrase')
const tsSource = readFileSync(resolve(__dirname, 'index.ts'), 'utf-8')
const { code: jsSource } = transform(tsSource, {
  transforms: ['typescript'],
  disableESTransforms: true,
})

const mf = new Miniflare({
  modules: [{ type: 'ESModule', path: 'index.js', contents: jsSource }],
  compatibilityDate: '2025-09-02',
  compatibilityFlags: ['nodejs_compat'],
  unsafeEvalBinding: 'UNSAFE_EVAL',
  port,
})

const url = await mf.ready
console.log(`Code executor ready on ${url}`)
