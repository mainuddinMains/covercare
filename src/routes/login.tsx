import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Compass, ArrowRight, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { authClient, signIn, signUp } from '@/lib/auth-client'
import { usePreferencesStore } from '@/store/appStore'
import { translations } from '@/lib/i18n'

export const Route = createFileRoute('/login')({ component: LoginPage })

function LoginPage() {
  const navigate = useNavigate()
  const locale = usePreferencesStore((s) => s.locale)
  const t = translations[locale]

  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (mode === 'signup') {
      const { error: err } = await signUp.email({
        name: name || email.split('@')[0],
        email,
        password,
      })
      if (err) {
        setError(err.message || t.auth_error_generic)
        setLoading(false)
        return
      }
    } else {
      const { error: err } = await signIn.email({ email, password })
      if (err) {
        setError(err.message || t.auth_error_generic)
        setLoading(false)
        return
      }
    }

    navigate({ to: '/chat' })
  }

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-[420px]">
        {/* Branding */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Compass size={32} className="text-primary-foreground" />
          </div>
          <h1 className="font-heading text-3xl font-semibold text-foreground">
            {t.auth_title}
          </h1>
          <p className="mt-2 text-[15px] text-muted-foreground">
            {t.auth_subtitle}
          </p>
        </div>

        {/* Auth card */}
        <Card className="border-0 ring-1 ring-border">
          <CardContent className="px-7 py-8">
            {/* Login / Signup toggle */}
            <div className="mb-6 flex gap-1 rounded-lg bg-muted p-1">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${
                  mode === 'login'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t.auth_login}
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${
                  mode === 'signup'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t.auth_signup}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t.auth_name_label}
                  </Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.auth_name_placeholder}
                    className="h-11 rounded-xl bg-muted/50 px-3.5"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t.auth_email_label}
                </Label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.auth_email_placeholder}
                  className="h-11 rounded-xl bg-muted/50 px-3.5"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t.auth_password_label}
                </Label>
                <Input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.auth_password_placeholder}
                  className="h-11 rounded-xl bg-muted/50 px-3.5"
                />
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl text-[15px] font-semibold"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    {mode === 'login'
                      ? t.auth_login_button
                      : t.auth_signup_button}
                    <ArrowRight size={16} className="ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-3 text-muted-foreground">or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={async () => {
                setLoading(true)
                await authClient.signIn.anonymous()
                navigate({ to: '/chat' })
              }}
              className="h-11 w-full rounded-xl text-sm font-medium"
            >
              {t.auth_guest_button}
            </Button>
          </CardContent>
        </Card>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          {t.auth_footer}
        </p>
      </div>
    </div>
  )
}
