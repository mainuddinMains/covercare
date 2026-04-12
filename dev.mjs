import { spawn, execSync } from 'node:child_process'
import process from 'node:process'

const isWindows = process.platform === 'win32'

function killPort(port) {
  try {
    if (isWindows) {
      execSync(`for /f "tokens=5" %a in ('netstat -ano ^| findstr :${port} ^| findstr LISTENING') do taskkill /F /PID %a`, { stdio: 'ignore', shell: true })
    } else {
      execSync(`lsof -ti:${port} | xargs kill 2>/dev/null`, { stdio: 'ignore', shell: true })
    }
  } catch {}
}

function run(cmd, args) {
  return spawn(cmd, args, { stdio: 'inherit', shell: true })
}

// Run migrations
try {
  execSync('drizzle-kit generate', { stdio: 'inherit' })
  execSync('wrangler d1 migrations apply care-compass-db --local', { stdio: 'inherit' })
} catch {}

// Kill stale executor on port 8788
killPort(8788)

// Start code executor worker via miniflare (supports unsafeEvalBinding)
const executor = run('node', [
  'workers/code-executor/dev.mjs',
  '8788',
])

// Clean up on exit
function cleanup() {
  executor.kill()
  process.exit()
}
process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)
process.on('exit', () => executor.kill())

// Wait for executor to be ready (poll until it responds)
async function waitForExecutor(url, maxWait = 30000) {
  const start = Date.now()
  while (Date.now() - start < maxWait) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: 'return true', tools: [] }),
      })
      if (res.ok) {
        console.log('Code executor ready')
        return
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 500))
  }
  console.warn('Warning: code executor did not start in time')
}
await waitForExecutor('http://localhost:8788')

// Start main app (portless for stable local URL unless --no-portless)
const usePortless = !process.argv.includes('--no-portless')
const app = usePortless
  ? run('portless', ['care-compass', 'vite', 'dev'])
  : run('vite', ['dev'])
app.on('exit', cleanup)
