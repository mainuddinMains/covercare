import { Check } from 'lucide-react'

interface Step {
  label: string
}

interface Props {
  steps: Step[]
  current: number
  className?: string
}

export default function StepIndicator({
  steps,
  current,
  className = '',
}: Props) {
  return (
    <nav aria-label="Progress" className={`flex items-center ${className}`}>
      {steps.map((step, i) => {
        const done = i < current
        const active = i === current

        return (
          <div
            key={step.label}
            className="flex flex-1 items-center last:flex-none"
          >
            <div className="flex shrink-0 flex-col items-center gap-1">
              <div
                aria-current={active ? 'step' : undefined}
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors ${
                  done
                    ? 'border-green-500 bg-green-500 text-white'
                    : active
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-muted-foreground'
                }`}
              >
                {done ? <Check size={12} /> : i + 1}
              </div>
              <span
                className={`hidden text-[10px] whitespace-nowrap sm:block ${
                  done
                    ? 'text-green-600'
                    : active
                      ? 'font-medium text-primary'
                      : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </span>
            </div>

            {i < steps.length - 1 && (
              <div
                className={`mx-1 h-0.5 flex-1 rounded-full transition-colors ${
                  done ? 'bg-green-400' : 'bg-border'
                }`}
                aria-hidden
              />
            )}
          </div>
        )
      })}
    </nav>
  )
}
