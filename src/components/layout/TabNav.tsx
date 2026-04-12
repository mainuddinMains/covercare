import { Link, useMatchRoute } from '@tanstack/react-router'
import {
  MessageCircle,
  Building2,
  Calculator,
  Bell,
  User,
} from 'lucide-react'
import { usePreferencesStore } from '@/store/appStore'
import { translations } from '@/lib/i18n'

export default function TabNav() {
  const matchRoute = useMatchRoute()
  const locale = usePreferencesStore((s) => s.locale)
  const t = translations[locale]

  const TABS = [
    { to: '/' as const, label: t.nav_chat, icon: MessageCircle },
    { to: '/hospitals' as const, label: t.nav_hospitals, icon: Building2 },
    { to: '/estimate' as const, label: t.nav_cost, icon: Calculator },
    { to: '/reminders' as const, label: t.nav_reminders, icon: Bell },
    { to: '/profile' as const, label: t.nav_profile, icon: User },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-2xl">
        {TABS.map((tab) => {
          const active =
            matchRoute({ to: tab.to, fuzzy: tab.to !== '/' }) ||
            (tab.to === '/' && matchRoute({ to: '/' }))
          const Icon = tab.icon

          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] transition-colors ${
                active
                  ? 'font-semibold text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              <span>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
