import { usePreferencesStore, type FontSize } from '@/store/appStore'
import { translations } from '@/lib/i18n'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Eye, Type, Languages, BookOpen } from 'lucide-react'
import type { Locale } from '@/lib/i18n'

const LOCALE_OPTIONS: { value: Locale; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Espanol' },
]

export default function AccessibilityPanel() {
  const {
    highContrast,
    toggleHighContrast,
    fontSize,
    setFontSize,
    locale,
    setLocale,
    simpleMode,
    toggleSimpleMode,
  } = usePreferencesStore()
  const t = translations[locale]

  const fontOptions: { value: FontSize; label: string }[] = [
    { value: 'sm', label: t.a11y_font_small },
    { value: 'md', label: t.a11y_font_medium },
    { value: 'lg', label: t.a11y_font_large },
  ]

  return (
    <Card>
      <CardContent className="space-y-5 p-4">
        <h2 className="text-sm font-semibold">{t.a11y_heading}</h2>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Eye size={14} />
            {t.a11y_high_contrast}
          </Label>
          <Button
            variant={highContrast ? 'default' : 'outline'}
            size="sm"
            onClick={toggleHighContrast}
            className="w-full"
          >
            {highContrast ? t.a11y_on : t.a11y_off}
          </Button>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Type size={14} />
            {t.a11y_font_size}
          </Label>
          <div className="flex gap-2">
            {fontOptions.map((opt) => (
              <Button
                key={opt.value}
                variant={fontSize === opt.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFontSize(opt.value)}
                className="flex-1"
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Languages size={14} />
            {t.a11y_language}
          </Label>
          <div className="flex gap-2">
            {LOCALE_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                variant={locale === opt.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLocale(opt.value)}
                className="flex-1"
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <BookOpen size={14} />
            {t.a11y_simple_language}
          </Label>
          <Button
            variant={simpleMode ? 'default' : 'outline'}
            size="sm"
            onClick={toggleSimpleMode}
            className="w-full"
          >
            {simpleMode ? t.a11y_simple_on : t.a11y_off}
          </Button>
          <p className="text-[11px] text-muted-foreground">
            {t.a11y_simple_help}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
