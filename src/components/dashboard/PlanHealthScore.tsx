import { Link } from '@tanstack/react-router'
import { useInsuranceStore } from '@/store/appStore'

interface ScoreItem {
  label: string
  points: number
  earned: boolean
}

function calcScore(profile: ReturnType<typeof useInsuranceStore>['profile']): {
  total: number
  items: ScoreItem[]
} {
  const items: ScoreItem[] = [
    {
      label: 'Insurance plan added',
      points: 30,
      earned: !!profile.issuerName,
    },
    {
      label: 'Plan type is PPO or EPO',
      points: 20,
      earned: profile.planType === 'PPO' || profile.planType === 'EPO',
    },
    {
      label: 'Deductible amount on file',
      points: 15,
      earned: !!profile.annualDeductible,
    },
    {
      label: 'Copay amount on file',
      points: 15,
      earned: !!profile.copayPerVisit,
    },
    {
      label: 'Coverage dates set',
      points: 20,
      earned: !!profile.effectiveDate && !!profile.coverageEndDate,
    },
  ]
  return { total: items.filter(i => i.earned).reduce((s, i) => s + i.points, 0), items }
}

function scoreColor(score: number) {
  if (score >= 75) return '#16a34a'
  if (score >= 50) return '#E8924A'
  return '#dc2626'
}

function scoreLabel(score: number) {
  if (score >= 75) return 'Strong'
  if (score >= 50) return 'Fair'
  return 'Needs attention'
}

export default function PlanHealthScore() {
  const { profile } = useInsuranceStore()
  const { total, items } = calcScore(profile)
  const color = scoreColor(total)
  const missing = items.filter(i => !i.earned)

  return (
    <div className="rounded-xl border bg-card p-4 space-y-4">
      <h2 className="font-heading text-sm font-semibold">Plan Health Score</h2>

      <div className="flex items-center gap-4">
        <div
          className="relative shrink-0"
          style={{
            width: 88,
            height: 88,
            borderRadius: '50%',
            background: `conic-gradient(${color} ${total * 3.6}deg, hsl(var(--muted)) 0deg)`,
          }}
        >
          <div className="absolute inset-2 flex flex-col items-center justify-center rounded-full bg-card">
            <span className="text-xl font-bold leading-none" style={{ color }}>{total}</span>
            <span className="text-[9px] text-muted-foreground">/ 100</span>
          </div>
        </div>

        <div className="flex-1 space-y-1">
          <p className="text-sm font-semibold" style={{ color }}>{scoreLabel(total)}</p>
          {missing.slice(0, 3).map(item => (
            <p key={item.label} className="text-[11px] text-muted-foreground">
              + {item.points} pts: {item.label}
            </p>
          ))}
        </div>
      </div>

      <Link
        to="/plans"
        className="flex w-full items-center justify-center rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Find better plans
      </Link>
    </div>
  )
}
