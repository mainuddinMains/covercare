import { Languages } from 'lucide-react'
import { usePreferencesStore } from '@/store/appStore'
import type { Locale } from '@/lib/i18n'

const OPTIONS: { value: Locale; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'es', label: 'ES' },
]

export default function LanguageToggle() {
  const locale = usePreferencesStore((s) => s.locale)
  const setLocale = usePreferencesStore((s) => s.setLocale)

  return (
    <button
      type="button"
      onClick={() => setLocale(locale === 'en' ? 'es' : 'en')}
      className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      aria-label="Switch language"
    >
      <Languages size={14} />
      {OPTIONS.find((o) => o.value === locale)?.label}
    </button>
  )
}
