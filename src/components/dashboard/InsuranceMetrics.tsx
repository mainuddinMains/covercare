import { useInsuranceStore } from '@/store/appStore'

function daysUntil(dateStr: string): number | null {
  if (!dateStr) return null
  const end = new Date(dateStr)
  if (isNaN(end.getTime())) return null
  return Math.ceil((end.getTime() - Date.now()) / 86400000)
}

function MetricCard({
  label,
  value,
  sub,
  bar,
  barColor,
}: {
  label: string
  value: string
  sub?: string
  bar?: number
  barColor?: string
}) {
  return (
    <div className="rounded-xl border bg-card p-3 space-y-1.5">
      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-lg font-bold leading-tight">{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
      {bar !== undefined && (
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${Math.min(100, Math.max(0, bar))}%`, background: barColor ?? 'hsl(var(--primary))' }}
          />
        </div>
      )}
    </div>
  )
}

export default function InsuranceMetrics() {
  const { profile } = useInsuranceStore()

  const days = daysUntil(profile.coverageEndDate)
  const renewalValue = days === null ? 'Not set' : days < 0 ? 'Expired' : `${days} days`
  const renewalBar = days !== null && days >= 0 ? (days / 365) * 100 : undefined
  const renewalColor = days !== null && days < 30 ? '#E8924A' : '#0A5C5C'

  const premium = profile.monthlyPremium ? `$${profile.monthlyPremium}/mo` : 'Not set'
  const deductible = profile.annualDeductible ? `$${profile.annualDeductible}` : 'Not set'
  const copay = profile.copayPerVisit ? `$${profile.copayPerVisit}` : 'Not set'

  return (
    <div className="space-y-2">
      <h2 className="font-heading text-sm font-semibold">Insurance Overview</h2>
      <div className="grid grid-cols-2 gap-2">
        <MetricCard label="Monthly Premium" value={premium} />
        <MetricCard
          label="Days to Renewal"
          value={renewalValue}
          sub={profile.coverageEndDate || undefined}
          bar={renewalBar}
          barColor={renewalColor}
        />
        <MetricCard label="Annual Deductible" value={deductible} sub="Total, not amount used" />
        <MetricCard label="Copay per Visit" value={copay} />
      </div>
    </div>
  )
}
