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

interface GuideStep {
  number: number
  icon: typeof ClipboardList
  title: string
  body: string
  tip?: string
  items?: string[]
}

const STEPS: GuideStep[] = [
  {
    number: 1,
    icon: ClipboardList,
    title: 'Get Ready at Home',
    body: 'Before your appointment, gather a few things so check-in goes smoothly.',
    items: [
      'Your insurance card (front and back)',
      'A photo ID -- driver\'s license or passport',
      'A list of any medicines you take, including vitamins',
      'Any past medical records if you have them',
      'A list of questions you want to ask',
    ],
    tip: 'No insurance? Tell them when you call. Many clinics offer a sliding-scale fee based on what you can afford.',
  },
  {
    number: 2,
    icon: Building,
    title: 'Arrive and Check In',
    body: 'Get there 10 to 15 minutes early. The front desk will ask for your name, ID, and insurance card.',
    items: [
      'You may fill out a short health history form -- it is okay to leave things blank if you do not know',
      'You might wait 10 to 30 minutes -- this is normal',
      'Bring something to read or listen to',
    ],
    tip: 'You can ask the front desk what your visit will cost before you see the doctor.',
  },
  {
    number: 3,
    icon: Stethoscope,
    title: 'Meet the Nurse',
    body: 'A nurse or medical assistant will bring you to a room first. They will check a few basic things.',
    items: [
      'Your weight and height',
      'Your blood pressure and temperature',
      'They will ask why you came in today -- be honest, even if it feels embarrassing',
      'They will check your medicines list',
    ],
    tip: 'Write down your main concern before the visit so you do not forget to mention it.',
  },
  {
    number: 4,
    icon: HeartPulse,
    title: 'See Your Doctor',
    body: 'The doctor will listen to you, ask questions, and examine you. This is YOUR time -- speak up.',
    items: [
      'Describe your symptoms in plain language -- no need for medical words',
      'Ask them to explain anything you do not understand',
      '"What is this medication for?" or "When should I come back?"',
      'It is okay to say "Can you write that down for me?"',
    ],
    tip: 'You can bring a friend or family member to listen and help you remember what the doctor says.',
  },
  {
    number: 5,
    icon: Home,
    title: 'Before You Leave',
    body: 'After seeing the doctor, a few things might happen. Make sure you understand the next steps.',
    items: [
      'You might get a prescription -- ask the pharmacy about generic options (they cost less)',
      'You might get a referral to see a specialist',
      'Ask when your test results will be ready and how you will hear about them',
      'Pay any bills at the front desk, or ask about a payment plan',
    ],
    tip: 'If you get a bill later in the mail, it is okay to call the billing office and ask for a lower price or payment plan.',
  },
]

export default function AppointmentGuide() {
  const [expanded, setExpanded] = useState<number | null>(0)

  function toggle(i: number) {
    setExpanded((prev) => (prev === i ? null : i))
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <Calendar size={22} className="text-primary" />
          <h1 className="text-lg font-semibold">Your First Doctor Visit</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Not sure what to expect? Here is exactly what happens, step by step.
          Tap any step to see the details.
        </p>
      </div>

      <div className="relative">
        <div
          className="absolute bottom-0 left-6 top-0 w-0.5 bg-border"
          aria-hidden
        />

        <ol className="space-y-3" aria-label="Appointment steps">
          {STEPS.map((step, i) => {
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
                        Step {step.number} of {STEPS.length}
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
                        Previous
                      </button>
                      {i < STEPS.length - 1 ? (
                        <button
                          onClick={() => setExpanded(i + 1)}
                          aria-label={`Next step: ${STEPS[i + 1].title}`}
                          className="flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
                        >
                          Next: {STEPS[i + 1].title}
                          <ArrowRight size={12} />
                        </button>
                      ) : (
                        <span className="text-xs font-medium text-green-600">
                          You are all set!
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
          <p className="mb-1 text-sm font-medium">Ready to find a clinic?</p>
          <p className="mb-3 text-xs text-muted-foreground">
            Find a free or low-cost clinic near you using CareCompass.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" asChild>
              <Link to="/">Ask the assistant</Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link to="/hospitals">Find nearby hospitals</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
