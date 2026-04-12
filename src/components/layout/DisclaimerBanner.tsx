import { useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { usePreferencesStore } from '@/store/appStore'
import { translations } from '@/lib/i18n'

export default function DisclaimerBanner() {
  const [dismissed, setDismissed] = useState(false)
  const locale = usePreferencesStore((s) => s.locale)
  const t = translations[locale]

  if (dismissed) return null

  return (
    <div
      className="border-b border-amber-200 bg-amber-50"
      role="alert"
      aria-live="polite"
    >
      <div className="mx-auto flex max-w-2xl items-start gap-3 px-4 py-2.5">
        <AlertTriangle
          size={16}
          className="mt-px shrink-0 text-amber-500"
          aria-hidden
        />
        <p className="flex-1 text-xs leading-relaxed text-amber-800">
          <span className="font-semibold">{t.disclaimer_label}</span>{' '}
          {t.disclaimer_body}{' '}
          <a
            href="tel:911"
            className="font-semibold underline hover:no-underline"
          >
            911
          </a>
          .
        </p>
        <button
          onClick={() => setDismissed(true)}
          aria-label={t.disclaimer_dismiss}
          className="mt-px shrink-0 text-lg leading-none text-amber-400 transition-colors hover:text-amber-700"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
