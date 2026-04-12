import { usePreferencesStore, type FontSize } from '@/store/appStore'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Eye, Type, Languages, BookOpen } from 'lucide-react'
import type { Locale } from '@/lib/i18n'

const FONT_OPTIONS: { value: FontSize; label: string }[] = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
]

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

  return (
    <Card>
      <CardContent className="space-y-5 p-4">
        <h2 className="text-sm font-semibold">Accessibility and Language</h2>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Eye size={14} />
            High Contrast
          </Label>
          <Button
            variant={highContrast ? 'default' : 'outline'}
            size="sm"
            onClick={toggleHighContrast}
            className="w-full"
          >
            {highContrast ? 'On' : 'Off'}
          </Button>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Type size={14} />
            Font Size
          </Label>
          <div className="flex gap-2">
            {FONT_OPTIONS.map((opt) => (
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
            Language
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
            Simple Language
          </Label>
          <Button
            variant={simpleMode ? 'default' : 'outline'}
            size="sm"
            onClick={toggleSimpleMode}
            className="w-full"
          >
            {simpleMode ? 'On -- Using simpler words' : 'Off'}
          </Button>
          <p className="text-[11px] text-muted-foreground">
            When on, the AI assistant uses shorter sentences and avoids jargon.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
