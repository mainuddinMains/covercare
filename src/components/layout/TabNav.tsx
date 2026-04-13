import { Link, useMatchRoute } from '@tanstack/react-router'
import {
  LayoutDashboard,
  MessageCircle,
  Building2,
  Calculator,
  User,
  Award,
  BookOpen,
} from 'lucide-react'
import { usePreferencesStore } from '@/store/appStore'
import { translations } from '@/lib/i18n'

export default function TabNav() {
  const matchRoute = useMatchRoute()
  const locale = usePreferencesStore((s) => s.locale)
  const t = translations[locale]

  const TABS = [
    { to: '/dashboard' as const, label: t.nav_home, icon: LayoutDashboard },
    { to: '/chat' as const, label: t.nav_chat, icon: MessageCircle },
    { to: '/hospitals' as const, label: t.nav_hospitals, icon: Building2 },
    { to: '/estimate' as const, label: t.nav_cost, icon: Calculator },
    { to: '/plans' as const, label: t.nav_plans, icon: Award },
    { to: '/learn' as const, label: t.nav_learn, icon: BookOpen },
    { to: '/profile' as const, label: t.nav_profile, icon: User },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card pb-[env(safe-area-inset-bottom)]"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-2xl">
        {TABS.map((tab) => {
          const active = !!matchRoute({ to: tab.to, fuzzy: true })
          const Icon = tab.icon

          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] transition-colors ${
                active
                  ? 'font-semibold text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={15} strokeWidth={active ? 2.5 : 1.5} />
              <span>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
