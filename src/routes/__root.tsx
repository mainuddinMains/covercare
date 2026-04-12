import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'
import appCss from '../styles.css?url'
import TabNav from '@/components/layout/TabNav'
import DisclaimerBanner from '@/components/layout/DisclaimerBanner'
import PreferencesProvider from '@/components/PreferencesProvider'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'CareCompass' },
      {
        name: 'description',
        content:
          'Navigate US healthcare with confidence. AI-powered guidance for finding affordable care.',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  component: RootLayout,
  shellComponent: RootDocument,
  errorComponent: RootError,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootError({ error, reset }: ErrorComponentProps) {
  const message = import.meta.env.DEV
    ? error.message
    : 'An unexpected error occurred. Please try refreshing.'

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
      <h1 className="text-4xl font-bold">Something went wrong</h1>
      <p className="max-w-md text-muted-foreground">{message}</p>
      <button
        onClick={reset}
        className="text-sm text-primary underline underline-offset-4 hover:text-primary/80"
      >
        Try again
      </button>
    </div>
  )
}

function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <PreferencesProvider />
      <DisclaimerBanner />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-20 pt-4">
        <Outlet />
      </main>
      <TabNav />
    </div>
  )
}
