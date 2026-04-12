import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { LogOut, UserPlus } from 'lucide-react'
import InsuranceProfileForm from '@/components/InsuranceProfileForm'
import AccessibilityPanel from '@/components/AccessibilityPanel'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { authClient, signOut, useSession } from '@/lib/auth-client'
import { usePreferencesStore } from '@/store/appStore'
import { translations } from '@/lib/i18n'

export const Route = createFileRoute('/profile')({ component: ProfilePage })

function ProfilePage() {
  const navigate = useNavigate()
  const locale = usePreferencesStore((s) => s.locale)
  const t = translations[locale]
  const { data: session } = useSession()

  const isAnonymous = session?.user?.isAnonymous === true

  async function handleLogout() {
    await signOut()
    navigate({ to: '/login' })
  }

  async function handleGuestExit() {
    await authClient.deleteAnonymousUser()
    await signOut()
    navigate({ to: '/' })
  }

  return (
    <div className="space-y-6">
      {session && isAnonymous && (
        <div className="rounded-xl bg-muted p-5">
          <p className="font-heading text-lg font-semibold">
            {t.guest_profile_heading}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.guest_profile_body}
          </p>
          <Button asChild className="mt-4">
            <Link to="/login">
              <UserPlus size={16} className="mr-2" />
              {t.guest_create_account}
            </Link>
          </Button>
        </div>
      )}

      {session && !isAnonymous && (
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

      {isAnonymous ? (
        <Button
          variant="outline"
          onClick={handleGuestExit}
          className="w-full"
        >
          <LogOut size={16} className="mr-2" />
          {t.guest_exit}
        </Button>
      ) : (
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut size={16} className="mr-2" />
          {t.auth_logout}
        </Button>
      )}
    </div>
  )
}
