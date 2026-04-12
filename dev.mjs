import { spawn, execSync } from 'node:child_process'
import process from 'node:process'

// Run migrations
try {
  execSync('drizzle-kit generate', { stdio: 'inherit' })
  execSync('wrangler d1 migrations apply care-compass-db --local', { stdio: 'inherit' })
} catch {}

// Start main app (portless for stable local URL unless --no-portless)
const usePortless = !process.argv.includes('--no-portless')
const app = usePortless
  ? spawn('portless', ['care-compass', 'vite', 'dev'], { stdio: 'inherit', shell: true })
  : spawn('vite', ['dev'], { stdio: 'inherit', shell: true })

function cleanup() {
  app.kill()
  process.exit()
}
process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)
app.on('exit', cleanup)
