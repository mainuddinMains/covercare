import { useState } from 'react'
import { ArrowLeft, ChevronUp, ChevronDown, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import PlanCard from './PlanCard'
import CompareModal from './CompareModal'
import EnrollmentGuide from './EnrollmentGuide'
import {
  US_STATES, HEALTH_CONDITIONS, PRIORITIES,
  DEMO_PLANS_MO, rerankPlans, inferBenefits, isSubsidyEligible,
  calcEstimatedSubsidy, applySubsidy,
} from '@/lib/plan-finder'
import type { PlanRecommendation } from '@/lib/types'

interface Props {
  onBack: () => void
}

type Step = 1 | 2 | 3 | 4
type SortKey = 'score' | 'premium' | 'deductible'

interface PersonalInfo {
  age: string
  state: string
  zip: string
  householdSize: number
  income: number
  tobaccoUser: boolean
}

function ProgressBar({ step }: { step: Step }) {
  return (
    <div className="flex gap-1.5">
      {([1, 2, 3, 4] as Step[]).map(s => (
        <div
          key={s}
          className={`h-1 flex-1 rounded-full transition-colors ${
            s <= step ? 'bg-primary' : 'bg-muted'
          }`}
        />
      ))}
    </div>
  )
}

const STEP_LABELS = ['Personal Info', 'Health Conditions', 'Priorities', 'Results']

export default function CitizenFlow({ onBack }: Props) {
  const [step, setStep] = useState<Step>(1)
  const [info, setInfo] = useState<PersonalInfo>({
    age: '', state: '', zip: '', householdSize: 1, income: 45000, tobaccoUser: false,
  })
  const [conditions, setConditions] = useState<string[]>([])
  const [priorities, setPriorities] = useState(PRIORITIES.map(p => p.id))
  const [recs, setRecs] = useState<PlanRecommendation[]>([])
  const [isDemoData, setIsDemoData] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState<SortKey>('score')
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [showCompare, setShowCompare] = useState(false)

  function toggleCondition(id: string) {
    setConditions(prev => {
      if (id === 'none') return ['none']
      const without = prev.filter(c => c !== 'none')
      return without.includes(id) ? without.filter(c => c !== id) : [...without, id]
    })
  }

  function movePriority(idx: number, dir: -1 | 1) {
    const next = [...priorities]
    const target = idx + dir
    if (target < 0 || target >= next.length) return
    ;[next[idx], next[target]] = [next[target], next[idx]]
    setPriorities(next)
  }

  async function fetchAndScore() {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        zip: info.zip,
        income: String(info.income),
        household_size: String(info.householdSize),
        limit: '12',
      })
      if (info.age) params.set('age', info.age)
      const res = await fetch(`/api/plans/recommend?${params}`)
      const data = await res.json() as { recommendations?: PlanRecommendation[]; error?: string }
      if (data.recommendations && data.recommendations.length > 0) {
        setRecs(data.recommendations)
        setIsDemoData(false)
      } else {
        throw new Error(data.error || 'No plans found')
      }
    } catch {
      const demoRecs: PlanRecommendation[] = DEMO_PLANS_MO.map((plan, i) => ({
        plan,
        score: 90 - i * 8,
        reason: `${plan.metalLevel} ${plan.type} plan with competitive rates for Missouri`,
        rank: i + 1,
      }))
      setRecs(demoRecs)
      setIsDemoData(true)
    } finally {
      setLoading(false)
      setStep(4)
    }
  }

  function toggleCompare(id: string) {
    setCompareIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : prev.length < 3 ? [...prev, id] : prev,
    )
  }

  const scored = rerankPlans(recs, conditions, priorities)

  // Calculate subsidy and apply to plan premiums for display
  const silverPlans = recs.filter(r => r.plan.metalLevel.toLowerCase() === 'silver')
  const benchmarkSilver = silverPlans.length > 0
    ? [...silverPlans].sort((a, b) => a.plan.premium - b.plan.premium)[1]?.plan.premium
      ?? silverPlans[0].plan.premium
    : (recs[0]?.plan.premium ?? 0)
  const monthlyCredit = calcEstimatedSubsidy(info.income, info.householdSize, benchmarkSilver)

  const scoredWithSubsidy = scored.map(s => ({
    ...s,
    displayPremium: applySubsidy(s.plan.premium, monthlyCredit),
  }))

  const sorted = [...scoredWithSubsidy].sort((a, b) => {
    if (sortBy === 'premium') return a.displayPremium - b.displayPremium
    if (sortBy === 'deductible') return a.plan.deductible - b.plan.deductible
    return b.score - a.score
  })

  const comparePlans = sorted.filter(s => compareIds.includes(s.plan.id)).map(s => s.plan)
  const subsidyEligible = isSubsidyEligible(info.income, info.householdSize)

  if (step === 4) {
    return (
      <div className="space-y-4">
        <ProgressBar step={4} />
        <div className="flex items-center gap-2">
          <button onClick={() => setStep(3)} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft size={18} />
          </button>
          <h2 className="font-heading text-base font-semibold">Results</h2>
        </div>

        {isDemoData && (
          <div className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-xs text-orange-800">
            Live plan data unavailable for this ZIP. Showing representative Missouri demo plans. Verify current plans at healthcare.gov before enrolling.
          </div>
        )}

        {subsidyEligible && monthlyCredit > 0 && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-800">
            <span className="font-semibold">Tax credit applied:</span> Based on your income, you qualify for an estimated <span className="font-semibold">${Math.round(monthlyCredit)}/mo</span> premium tax credit. Premiums below already reflect this discount.
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Sort by:</span>
          {(['score', 'premium', 'deductible'] as SortKey[]).map(k => (
            <button
              key={k}
              onClick={() => setSortBy(k)}
              className={`rounded-full border px-2.5 py-0.5 text-[11px] transition-colors ${
                sortBy === k ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:bg-muted'
              }`}
            >
              {k === 'score' ? 'Best Match' : k === 'premium' ? 'Lowest Premium' : 'Lowest Deductible'}
            </button>
          ))}
        </div>

        {compareIds.length >= 2 && (
          <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => setShowCompare(true)}>
            Compare {compareIds.length} selected plans
          </Button>
        )}

        <div className="space-y-3">
          {sorted.map(s => (
            <PlanCard
              key={s.plan.id}
              plan={{ ...s.plan, premium: s.displayPremium }}
              rank={s.rank}
              score={s.score}
              reason={s.reason}
              benefits={inferBenefits(s.plan, conditions)}
              isBestMatch={s.rank === 1}
              isDemoData={isDemoData}
              isSelected={compareIds.includes(s.plan.id)}
              compareDisabled={compareIds.length >= 3}
              onToggleCompare={toggleCompare}
            />
          ))}
        </div>

        <EnrollmentGuide isStudent={false} />

        <p className="text-center text-[10px] text-muted-foreground">
          Source: CMS Health Insurance Marketplace. Premiums are estimates after tax credits. Verify at healthcare.gov before enrolling.
        </p>

        <CompareModal
          plans={comparePlans}
          open={showCompare}
          onClose={() => setShowCompare(false)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <ProgressBar step={step} />

      <div className="flex items-center gap-2">
        <button onClick={step === 1 ? onBack : () => setStep((step - 1) as Step)} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="text-[10px] text-muted-foreground">Step {step} of 4</p>
          <h2 className="font-heading text-base font-semibold">{STEP_LABELS[step - 1]}</h2>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Age</Label>
              <Input
                type="number"
                min={0}
                max={120}
                value={info.age}
                onChange={e => setInfo(i => ({ ...i, age: e.target.value }))}
                placeholder="30"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">ZIP Code</Label>
              <Input
                value={info.zip}
                onChange={e => setInfo(i => ({ ...i, zip: e.target.value.replace(/\D/g, '').slice(0, 5) }))}
                placeholder="63103"
                inputMode="numeric"
                maxLength={5}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">State</Label>
            <select
              value={info.state}
              onChange={e => setInfo(i => ({ ...i, state: e.target.value }))}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Select state...</option>
              {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Household Size</Label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setInfo(i => ({ ...i, householdSize: Math.max(1, i.householdSize - 1) }))}
                className="flex h-8 w-8 items-center justify-center rounded-full border hover:bg-muted"
              >
                -
              </button>
              <span className="w-6 text-center font-semibold">{info.householdSize}</span>
              <button
                type="button"
                onClick={() => setInfo(i => ({ ...i, householdSize: Math.min(8, i.householdSize + 1) }))}
                className="flex h-8 w-8 items-center justify-center rounded-full border hover:bg-muted"
              >
                +
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Annual Household Income</Label>
              <span className="text-sm font-semibold">${info.income.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={0}
              max={150000}
              step={1000}
              value={info.income}
              onChange={e => setInfo(i => ({ ...i, income: Number(e.target.value) }))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>$0</span>
              <span>$75,000</span>
              <span>$150,000</span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Tobacco user</p>
              <p className="text-xs text-muted-foreground">Used tobacco in the past 6 months</p>
            </div>
            <button
              type="button"
              onClick={() => setInfo(i => ({ ...i, tobaccoUser: !i.tobaccoUser }))}
              className={`relative h-6 w-11 rounded-full transition-colors ${info.tobaccoUser ? 'bg-primary' : 'bg-muted'}`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${info.tobaccoUser ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
          </div>

          <Button
            className="w-full"
            disabled={!info.zip || info.zip.length !== 5}
            onClick={() => setStep(2)}
          >
            Next: Health Conditions
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select all that apply. This helps rank plans that cover your needs.
          </p>
          <div className="flex flex-wrap gap-2">
            {HEALTH_CONDITIONS.map(c => {
              const active = conditions.includes(c.id)
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleCondition(c.id)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    active
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  {c.label}
                </button>
              )
            })}
          </div>
          <Button
            className="w-full"
            disabled={conditions.length === 0}
            onClick={() => setStep(3)}
          >
            Next: Set Priorities
          </Button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Drag to rank what matters most. Use the arrows to reorder.
          </p>
          <div className="space-y-2">
            {priorities.map((id, i) => {
              const label = PRIORITIES.find(p => p.id === id)?.label ?? id
              return (
                <div key={id} className="flex items-center gap-2 rounded-lg border bg-card p-2.5">
                  <span className="w-5 shrink-0 text-center text-xs font-bold text-primary">{i + 1}</span>
                  <span className="flex-1 text-sm">{label}</span>
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => movePriority(i, -1)}
                      disabled={i === 0}
                      className="rounded p-0.5 hover:bg-muted disabled:opacity-30"
                    >
                      <ChevronUp size={13} />
                    </button>
                    <button
                      onClick={() => movePriority(i, 1)}
                      disabled={i === priorities.length - 1}
                      className="rounded p-0.5 hover:bg-muted disabled:opacity-30"
                    >
                      <ChevronDown size={13} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
          <Button
            className="w-full"
            disabled={loading}
            onClick={fetchAndScore}
          >
            {loading ? (
              <><Loader2 size={14} className="mr-2 animate-spin" /> Finding plans...</>
            ) : (
              'Find My Best Plans'
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
