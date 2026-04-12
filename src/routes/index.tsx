import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  Compass,
  MessageCircle,
  Calculator,
  Building2,
  BookOpen,
  ArrowRight,
  Phone,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { usePreferencesStore } from '@/store/appStore'
import { translations } from '@/lib/i18n'

export const Route = createFileRoute('/')({ component: LandingPage })

const FEATURES = [
  {
    icon: MessageCircle,
    title: 'AI Chat Guidance',
    desc: 'Get personalized healthcare navigation advice powered by AI.',
  },
  {
    icon: Calculator,
    title: 'Cost Estimator',
    desc: 'Estimate out-of-pocket costs using real CMS Medicare rates.',
  },
  {
    icon: Building2,
    title: 'Find Hospitals',
    desc: 'Locate nearby hospitals and clinics with real-time data.',
  },
  {
    icon: BookOpen,
    title: 'Learn Insurance',
    desc: 'Understand your plan, costs, and how the US system works.',
  },
]

function LandingPage() {
  const locale = usePreferencesStore((s) => s.locale)
  const t = translations[locale]
  const navigate = useNavigate()
  const [guestLoading, setGuestLoading] = useState(false)
  const [guestError, setGuestError] = useState<string | null>(null)

  async function handleGuest() {
    setGuestLoading(true)
    setGuestError(null)
    const { error } = await authClient.signIn.anonymous()
    if (error) {
      setGuestError('Could not continue as guest. Please try again.')
      setGuestLoading(false)
      return
    }
    navigate({ to: '/chat' })
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-8 pt-16 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary shadow-lg shadow-primary/20">
          <Compass size={40} className="text-primary-foreground" />
        </div>
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground">
          {t.auth_title}
        </h1>
        <p className="mt-3 max-w-md text-lg text-muted-foreground">
          {t.auth_subtitle}
        </p>
        <div className="mt-8 flex gap-3">
          <Button asChild size="lg" className="rounded-xl px-6 text-[15px] font-semibold">
            <Link to="/login">
              Get Started
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-xl px-6 text-[15px] font-medium">
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </div>

      {/* Features */}
      <div className="mx-auto w-full max-w-2xl px-6 pb-12">
        <div className="grid grid-cols-2 gap-3">
          {FEATURES.map((f) => {
            const Icon = f.icon
            return (
              <div
                key={f.title}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Icon size={20} className="text-primary" />
                </div>
                <p className="font-heading text-sm font-semibold text-foreground">
                  {f.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {f.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Emergency callout */}
      <div className="mx-auto w-full max-w-2xl px-6 pb-12">
        <div className="rounded-2xl bg-destructive/10 p-5">
          <div className="flex items-start gap-3">
            <Phone size={18} className="mt-0.5 shrink-0 text-destructive" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Emergency? Call 911
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                For life-threatening emergencies, call 911 immediately. ERs
                cannot turn you away regardless of insurance or immigration
                status.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-border bg-card px-6 py-6 text-center">
        <div className="mx-auto flex max-w-sm flex-col gap-3">
          <Button asChild className="h-12 rounded-xl text-[15px] font-semibold">
            <Link to="/login">
              Sign Up Free
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="text-sm text-muted-foreground"
            onClick={handleGuest}
            disabled={guestLoading}
          >
            {guestLoading ? 'Loading...' : t.auth_guest_button}
          </Button>
          {guestError && (
            <p className="text-xs text-destructive">{guestError}</p>
          )}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">{t.auth_footer}</p>
      </div>
    </div>
  )
}
