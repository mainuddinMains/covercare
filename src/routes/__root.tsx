import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
  redirect,
  useLocation,
} from '@tanstack/react-router'
import { Compass } from 'lucide-react'
import type { ErrorComponentProps } from '@tanstack/react-router'
import appCss from '../styles.css?url'
import TabNav from '@/components/layout/TabNav'
import DisclaimerBanner from '@/components/layout/DisclaimerBanner'
import PreferencesProvider from '@/components/PreferencesProvider'
import DataSync from '@/components/DataSync'
import { getSession } from '@/lib/auth-server'

const PUBLIC_PATHS = ['/', '/login']

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
  beforeLoad: async ({ location }) => {
    const isPublicPage = PUBLIC_PATHS.includes(location.pathname)
    if (isPublicPage) return

    const session = await getSession()
    if (!session) {
      throw redirect({ to: '/' })
    }
  },
  component: RootLayout,
  shellComponent: RootDocument,
  errorComponent: RootError,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <HeadContent />
      </head>
      <body className="h-full bg-background font-sans text-foreground antialiased">
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
      <h1 className="font-heading text-4xl font-bold">Something went wrong</h1>
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
  const location = useLocation()
  const isPublicPage = PUBLIC_PATHS.includes(location.pathname)

  if (isPublicPage) {
    return (
      <>
        <PreferencesProvider />
        <Outlet />
      </>
    )
  }

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <PreferencesProvider />
      <DataSync />
      <DisclaimerBanner />
      <header className="shrink-0 border-b border-border bg-card">
        <div className="mx-auto flex h-11 max-w-2xl items-center px-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-foreground transition-colors hover:text-primary"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
              <Compass size={13} className="text-primary-foreground" />
            </div>
            <span className="font-heading text-sm font-semibold">CareCompass</span>
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-2xl min-h-0 flex-1 overflow-y-auto px-4 pb-20 pt-4">
        <Outlet />
      </main>
      <TabNav />
    </div>
  )
}
