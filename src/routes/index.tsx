import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  Compass,
  MessageCircle,
  Calculator,
  Building2,
  BookOpen,
  ArrowRight,
  Phone,
  Shield,
  Sparkles,
  Users,
  Loader2,
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
    desc: 'Cut through the jargon. Get clear, actionable answers to your healthcare questions in plain language.',
    to: '/chat',
  },
  {
    icon: Calculator,
    title: 'Cost Estimator',
    desc: "Know what you'll owe before you go. Estimate out-of-pocket expenses using verified CMS Medicare data.",
    to: '/cost-estimator',
  },
  {
    icon: Building2,
    title: 'Find Facilities',
    desc: 'Locate the right care, fast. Search nearby hospitals filtered by specialty, quality, and network acceptance.',
    to: '/hospitals',
  },
  {
    icon: BookOpen,
    title: 'Insurance Literacy',
    desc: 'Demystify the fine print. Learn exactly how copays, deductibles, and networks impact your wallet.',
    to: '/learn',
  },
]

const TRUST_PILLS = [
  { icon: Shield, label: 'HIPAA Compliant' },
  { icon: Users, label: '100% Free' },
  { icon: Sparkles, label: 'AI Powered' },
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
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[800px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/[0.06] via-transparent to-transparent" />

      <div className="sticky top-0 z-50 border-b border-destructive/20 bg-destructive/5 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <div className="flex items-start gap-3 sm:items-center">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-destructive/15">
              <Phone size={18} className="text-destructive" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                In an emergency? Call <span className="text-destructive">911</span>
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                ERs are federally required to treat you regardless of insurance or immigration status.
              </p>
            </div>
          </div>
          <a
            href="tel:911"
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-destructive px-5 text-sm font-semibold text-white shadow-md shadow-destructive/20 transition-colors hover:bg-destructive/90"
          >
            <Phone size={15} className="mr-2" />
            Call 911
          </a>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-16 lg:pt-24">
        <div className="mx-auto w-full max-w-3xl text-center">
          <div className="flex flex-col items-center gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-xl shadow-primary/25 sm:h-20 sm:w-20">
              <Compass size={32} className="text-primary-foreground sm:size-9" />
            </div>
            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {t.auth_title}
            </h1>
          </div>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground/90 sm:text-lg lg:text-xl">
            {t.auth_subtitle}
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="h-12 w-full rounded-xl px-8 text-sm font-semibold shadow-lg shadow-primary/20 transition-shadow hover:shadow-xl hover:shadow-primary/25 sm:w-auto"
            >
              <Link to="/login">
                Get Started Free
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="default"
              className="h-10 w-full rounded-xl px-6 text-sm font-medium text-muted-foreground hover:text-foreground sm:w-auto"
              onClick={handleGuest}
              disabled={guestLoading}
            >
              {guestLoading && <Loader2 size={16} className="mr-2 animate-spin" />}
              {t.auth_guest_button}
            </Button>
          </div>

          {guestError && (
            <p className="mt-4 text-sm text-destructive">{guestError}</p>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {TRUST_PILLS.map((pill) => {
              const Icon = pill.icon
              return (
                <div
                  key={pill.label}
                  className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground/70"
                >
                  <Icon size={14} className="text-primary/50" />
                  {pill.label}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 px-6 lg:px-10">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-4">
          <div className="h-px flex-1 bg-border/60" />
          <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground/50">
            Explore
          </span>
          <div className="h-px flex-1 bg-border/60" />
        </div>
      </div>

      <div className="w-full px-6 pb-20 pt-10 lg:px-10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {FEATURES.map((f) => {
            const Icon = f.icon
            return (
              <Link
                key={f.title}
                to={f.to}
                className="group relative block h-full cursor-pointer overflow-hidden rounded-2xl bg-card p-6 text-center shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-black/10 dark:ring-white/5 dark:hover:ring-white/10"
              >
                <ArrowRight size={16} className="absolute right-5 top-6 text-muted-foreground/0 transition-all duration-300 group-hover:text-foreground/40" />

                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5">
                  <Icon size={22} className="text-primary" />
                </div>
                <p className="font-heading text-sm font-semibold tracking-tight text-foreground">
                  {f.title}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  {f.desc}
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}