import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { LogOut } from 'lucide-react'
import InsuranceProfileForm from '@/components/InsuranceProfileForm'
import AccessibilityPanel from '@/components/AccessibilityPanel'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { signOut, useSession } from '@/lib/auth-client'
import { usePreferencesStore } from '@/store/appStore'
import { translations } from '@/lib/i18n'

export const Route = createFileRoute('/profile')({ component: ProfilePage })

function ProfilePage() {
  const navigate = useNavigate()
  const locale = usePreferencesStore((s) => s.locale)
  const t = translations[locale]
  const { data: session } = useSession()

  async function handleLogout() {
    await signOut()
    navigate({ to: '/login' })
  }

  return (
    <div className="space-y-6">
      {session && (
        <div className="flex items-center gap-4 rounded-xl bg-primary p-5 text-primary-foreground">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 font-heading text-lg font-semibold">
            {session.user.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-heading text-lg font-semibold">
              {session.user.name}
            </p>
            <p className="text-sm opacity-80">{session.user.email}</p>
          </div>
        </div>
      )}

      <InsuranceProfileForm />
      <Separator />
      <AccessibilityPanel />
      <Separator />

      <Button
        variant="outline"
        onClick={handleLogout}
        className="w-full border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        <LogOut size={16} className="mr-2" />
        {t.auth_logout}
      </Button>
    </div>
  )
}
