import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  ClipboardList,
  Building,
  Stethoscope,
  HeartPulse,
  Home,
  ChevronDown,
  Check,
  Lightbulb,
  ArrowLeft,
  ArrowRight,
  Calendar,
} from 'lucide-react'
import { usePreferencesStore } from '@/store/appStore'
import { translations } from '@/lib/i18n'

interface GuideStep {
  number: number
  icon: typeof ClipboardList
  title: string
  body: string
  tip?: string
  items?: string[]
}

function useSteps(): GuideStep[] {
  const locale = usePreferencesStore((s) => s.locale)
  const t = translations[locale]

  return [
    {
      number: 1,
      icon: ClipboardList,
      title: t.guide_step1_title,
      body: t.guide_step1_body,
      items: [...t.guide_step1_items],
      tip: t.guide_step1_tip,
    },
    {
      number: 2,
      icon: Building,
      title: t.guide_step2_title,
      body: t.guide_step2_body,
      items: [...t.guide_step2_items],
      tip: t.guide_step2_tip,
    },
    {
      number: 3,
      icon: Stethoscope,
      title: t.guide_step3_title,
      body: t.guide_step3_body,
      items: [...t.guide_step3_items],
      tip: t.guide_step3_tip,
    },
    {
      number: 4,
      icon: HeartPulse,
      title: t.guide_step4_title,
      body: t.guide_step4_body,
      items: [...t.guide_step4_items],
      tip: t.guide_step4_tip,
    },
    {
      number: 5,
      icon: Home,
      title: t.guide_step5_title,
      body: t.guide_step5_body,
      items: [...t.guide_step5_items],
      tip: t.guide_step5_tip,
    },
  ]
}

export default function AppointmentGuide() {
  const [expanded, setExpanded] = useState<number | null>(0)
  const locale = usePreferencesStore((s) => s.locale)
  const t = translations[locale]
  const steps = useSteps()

  function toggle(i: number) {
    setExpanded((prev) => (prev === i ? null : i))
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <Calendar size={22} className="text-primary" />
          <h1 className="font-heading text-xl font-semibold">{t.guide_title}</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {t.guide_description}
        </p>
      </div>

      <div className="relative">
        <div
          className="absolute bottom-0 left-6 top-0 w-0.5 bg-border"
          aria-hidden
        />

        <ol className="space-y-3" aria-label="Appointment steps">
          {steps.map((step, i) => {
            const isOpen = expanded === i
            const isDone = expanded !== null && i < expanded
            const Icon = step.icon

            return (
              <li key={step.number} className="relative pl-16">
                <div
                  className={`absolute left-0 top-3 flex h-12 w-12 flex-col items-center justify-center rounded-full border-2 transition-colors ${
                    isOpen
                      ? 'border-primary bg-primary text-primary-foreground shadow-lg'
                      : isDone
                        ? 'border-green-300 bg-green-50 text-green-600'
                        : 'border-border bg-card text-muted-foreground'
                  }`}
                  aria-hidden
                >
                  <Icon size={20} />
                </div>

                <button
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={`step-body-${i}`}
                  className={`w-full rounded-2xl border p-4 text-left transition-all ${
                    isOpen
                      ? 'border-primary/20 bg-primary/5 shadow-sm'
                      : 'border-border bg-card hover:border-primary/20 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                        {t.guide_step_counter(step.number, steps.length)}
                      </span>
                      <h2 className="mt-0.5 text-sm font-semibold">
                        {step.title}
                      </h2>
                      {!isOpen && (
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                          {step.body}
                        </p>
                      )}
                    </div>
                    <ChevronDown
                      size={16}
                      className={`ml-2 shrink-0 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      aria-hidden
                    />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`step-body-${i}`}
                    role="region"
                    aria-label={step.title}
                    className="mt-2 rounded-2xl border border-border bg-card p-4 shadow-sm"
                  >
                    <p className="mb-3 text-sm">{step.body}</p>

                    {step.items && (
                      <ul className="mb-3 space-y-2" aria-label="Checklist">
                        {step.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2 text-sm"
                          >
                            <Check
                              size={14}
                              className="mt-0.5 shrink-0 text-green-500"
                              aria-hidden
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}

                    {step.tip && (
                      <div className="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2.5">
                        <Lightbulb
                          size={14}
                          className="mt-0.5 shrink-0 text-amber-500"
                          aria-hidden
                        />
                        <p className="text-xs leading-relaxed text-amber-800">
                          {step.tip}
                        </p>
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <button
                        onClick={() => setExpanded(i > 0 ? i - 1 : null)}
                        disabled={i === 0}
                        aria-label="Previous step"
                        className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-0"
                      >
                        <ArrowLeft size={12} />
                        {t.guide_previous}
                      </button>
                      {i < steps.length - 1 ? (
                        <button
                          onClick={() => setExpanded(i + 1)}
                          aria-label={`Next step: ${steps[i + 1].title}`}
                          className="flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
                        >
                          {t.guide_next(steps[i + 1].title)}
                          <ArrowRight size={12} />
                        </button>
                      ) : (
                        <span className="text-xs font-medium text-green-600">
                          {t.guide_complete}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <p className="mb-1 text-sm font-medium">{t.guide_cta_title}</p>
          <p className="mb-3 text-xs text-muted-foreground">
            {t.guide_cta_body}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" asChild>
              <Link to="/">{t.guide_cta_assistant}</Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link to="/hospitals">{t.guide_cta_hospitals}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
