import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl text-primary-foreground">
          +
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">CareCompass</h1>
        <p className="text-muted-foreground">
          Navigate US healthcare with confidence.
        </p>
      </div>
    </div>
  )
}
