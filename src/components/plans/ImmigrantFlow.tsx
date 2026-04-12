import { useState } from 'react'
import { ArrowLeft, Loader2, AlertTriangle, GraduationCap, Briefcase, CreditCard, ShieldOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import PlanCard from './PlanCard'
import CompareModal from './CompareModal'
import EnrollmentGuide from './EnrollmentGuide'
import {
  HEALTH_CONDITIONS, DEMO_PLANS_MO, TOP_UNIVERSITIES, STATE_PROGRAMS,
  rerankPlans, inferBenefits, isSubsidyEligible,
  calcEstimatedSubsidy, applySubsidy,
} from '@/lib/plan-finder'
import type { PlanRecommendation } from '@/lib/types'

interface Props {
  onBack: () => void
}

type VisaStatus = 'f1' | 'j1' | 'h1b' | 'h4' | 'greencard' | 'undocumented' | 'other'
type Step = 1 | 2 | 3 | 4

const VISA_OPTIONS: { id: VisaStatus; label: string; sub: string; icon: typeof GraduationCap }[] = [
  { id: 'f1', label: 'F-1 Student', sub: 'International student visa', icon: GraduationCap },
  { id: 'j1', label: 'J-1 Exchange', sub: 'Exchange visitor visa', icon: GraduationCap },
  { id: 'h1b', label: 'H-1B Work', sub: 'Specialty occupation visa', icon: Briefcase },
  { id: 'h4', label: 'H-4 Dependent', sub: 'Dependent of H-1B holder', icon: CreditCard },
  { id: 'greencard', label: 'Green Card', sub: 'Less than 5 years in US', icon: CreditCard },
  { id: 'undocumented', label: 'No Status / Undocumented', sub: 'No current immigration status', icon: ShieldOff },
  { id: 'other', label: 'Other Visa', sub: 'TN, O-1, L-1, etc.', icon: CreditCard },
]

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-colors ${i < step ? 'bg-primary' : 'bg-muted'}`}
        />
      ))}
    </div>
  )
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-muted/40 p-3">
      <p className="mb-1.5 text-xs font-semibold">{title}</p>
      <div className="text-xs text-muted-foreground space-y-1">{children}</div>
    </div>
  )
}

export default function ImmigrantFlow({ onBack }: Props) {
  const [step, setStep] = useState<Step>(1)
  const [visa, setVisa] = useState<VisaStatus | null>(null)
  const [university, setUniversity] = useState('')
  const [universityQuery, setUniversityQuery] = useState('')
  const [requiresInsurance, setRequiresInsurance] = useState(true)
  const [employerOffersInsurance, setEmployerOffersInsurance] = useState<boolean | null>(null)
  const [zip, setZip] = useState('')
  const [age, setAge] = useState('')
  const [income, setIncome] = useState(35000)
  const [conditions, setConditions] = useState<string[]>([])
  const [recs, setRecs] = useState<PlanRecommendation[]>([])
  const [isDemoData, setIsDemoData] = useState(false)
  const [loading, setLoading] = useState(false)
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [showCompare, setShowCompare] = useState(false)
  const [sortBy, setSortBy] = useState<'score' | 'premium' | 'deductible'>('premium')

  const filteredUniversities = TOP_UNIVERSITIES.filter(u =>
    universityQuery.length > 1 && u.toLowerCase().includes(universityQuery.toLowerCase()),
  ).slice(0, 6)

  function toggleCondition(id: string) {
    setConditions(prev => {
      if (id === 'none') return ['none']
      const without = prev.filter(c => c !== 'none')
      return without.includes(id) ? without.filter(c => c !== id) : [...without, id]
    })
  }

  function toggleCompare(id: string) {
    setCompareIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : prev.length < 3 ? [...prev, id] : prev,
    )
  }

  async function fetchPlans() {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        zip, income: String(income), household_size: '1', limit: '12',
      })
      if (age) params.set('age', age)
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
        plan, score: 90 - i * 8,
        reason: `${plan.metalLevel} ${plan.type} plan available to legal visa holders`,
        rank: i + 1,
      }))
      setRecs(demoRecs)
      setIsDemoData(true)
    } finally {
      setLoading(false)
      setStep(4)
    }
  }

  if (step === 4) {
    const scored = rerankPlans(recs, conditions, [])

    const silverPlans = recs.filter(r => r.plan.metalLevel.toLowerCase() === 'silver')
    const benchmarkSilver = silverPlans.length > 0
      ? [...silverPlans].sort((a, b) => a.plan.premium - b.plan.premium)[1]?.plan.premium
        ?? silverPlans[0].plan.premium
      : (recs[0]?.plan.premium ?? 0)
    const monthlyCredit = calcEstimatedSubsidy(income, 1, benchmarkSilver)

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

    return (
      <div className="space-y-4">
        <ProgressBar step={4} total={4} />
        <div className="flex items-center gap-2">
          <button onClick={() => setStep(3)} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft size={18} />
          </button>
          <h2 className="font-heading text-base font-semibold">Available Plans</h2>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          <AlertTriangle size={12} className="inline mr-1" />
          Verify your visa type is eligible before enrolling. ACA marketplace plans are available to legal immigrants. Check with your HR or DSO for employer/university options.
        </div>

        {isDemoData && (
          <div className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-xs text-orange-800">
            Live plan data unavailable. Showing representative Missouri demo plans. Verify at healthcare.gov.
          </div>
        )}

        {isSubsidyEligible(income, 1) && monthlyCredit > 0 && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-800">
            <span className="font-semibold">Tax credit applied:</span> Estimated <span className="font-semibold">${Math.round(monthlyCredit)}/mo</span> premium tax credit based on your income. Premiums below already reflect this discount.
          </div>
        )}

        {(visa === 'f1' || visa === 'j1') && (
          <InfoCard title="University SHIP Plan">
            <p>Most universities require international students to carry the Student Health Insurance Plan (SHIP). Contact your university health center to enroll or apply for a waiver.</p>
          </InfoCard>
        )}

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Sort by:</span>
          {(['premium', 'score', 'deductible'] as const).map(k => (
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
              isBestMatch={sortBy === 'score' && s.rank === 1}
              isVisaCompatible
              isDemoData={isDemoData}
              isSelected={compareIds.includes(s.plan.id)}
              compareDisabled={compareIds.length >= 3}
              onToggleCompare={toggleCompare}
            />
          ))}
        </div>

        <EnrollmentGuide isStudent={visa === 'f1' || visa === 'j1'} />

        <p className="text-center text-[10px] text-muted-foreground">
          Premiums are estimates after tax credits. Verify at healthcare.gov before enrolling.
        </p>

        <CompareModal plans={comparePlans} open={showCompare} onClose={() => setShowCompare(false)} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <ProgressBar step={step} total={4} />

      <div className="flex items-center gap-2">
        <button
          onClick={step === 1 ? onBack : () => setStep((step - 1) as Step)}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="text-[10px] text-muted-foreground">Step {step} of 4</p>
          <h2 className="font-heading text-base font-semibold">
            {step === 1 ? 'Immigration Status' : step === 2 ? 'Your Situation' : 'Health Info'}
          </h2>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Select your current immigration status.</p>
          {VISA_OPTIONS.map(opt => {
            const Icon = opt.icon
            return (
              <button
                key={opt.id}
                onClick={() => setVisa(opt.id)}
                className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                  visa === opt.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                }`}
              >
                <Icon size={18} className={visa === opt.id ? 'text-primary' : 'text-muted-foreground'} />
                <div>
                  <p className="text-sm font-medium">{opt.label}</p>
                  <p className="text-xs text-muted-foreground">{opt.sub}</p>
                </div>
              </button>
            )
          })}
          <Button className="w-full" disabled={!visa} onClick={() => setStep(2)}>
            Continue
          </Button>
        </div>
      )}

      {step === 2 && visa === 'undocumented' && (
        <div className="space-y-3">
          <InfoCard title="Emergency Medicaid">
            <p>Covers emergency medical treatment regardless of immigration status. Visit any emergency room; care cannot be denied.</p>
          </InfoCard>
          <InfoCard title="Federally Qualified Health Centers (FQHC)">
            <p>Free or low-cost sliding-scale clinics available in most areas. Find locations near you at findahealthcenter.hrsa.gov. No insurance or documentation required.</p>
          </InfoCard>
          <div className="rounded-lg border bg-muted/40 p-3">
            <p className="mb-2 text-xs font-semibold">State-Specific Programs</p>
            <div className="space-y-2">
              {Object.entries(STATE_PROGRAMS).map(([code, prog]) => (
                <div key={code} className="text-xs">
                  <span className="font-semibold text-primary">{code}</span>
                  <span className="mx-1 text-muted-foreground">-</span>
                  <span className="font-medium">{prog.name}:</span>
                  <span className="ml-1 text-muted-foreground">{prog.coverage}</span>
                </div>
              ))}
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={onBack}>
            Back to Start
          </Button>
        </div>
      )}

      {step === 2 && visa === 'h1b' && (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Does your employer offer health insurance?</Label>
            <div className="flex gap-2">
              {[true, false].map(v => (
                <button
                  key={String(v)}
                  onClick={() => setEmployerOffersInsurance(v)}
                  className={`flex-1 rounded-lg border py-2.5 text-sm transition-colors ${
                    employerOffersInsurance === v ? 'border-primary bg-primary/5 font-semibold text-primary' : 'border-border hover:bg-muted'
                  }`}
                >
                  {v ? 'Yes' : 'No'}
                </button>
              ))}
            </div>
          </div>
          {employerOffersInsurance === true && (
            <InfoCard title="Employer-Sponsored Insurance">
              <p>H-1B visa holders are eligible for employer-sponsored insurance. Enroll during open enrollment (usually 30 days after hire or each fall). Contact your HR department for enrollment details and your plan options.</p>
            </InfoCard>
          )}
          {employerOffersInsurance === false && (
            <p className="text-sm text-muted-foreground">You can enroll in ACA marketplace plans. Continue to find options.</p>
          )}
          <Button
            className="w-full"
            disabled={employerOffersInsurance === null}
            onClick={() => setStep(3)}
            style={employerOffersInsurance === true ? { display: 'none' } : undefined}
          >
            Find Marketplace Plans
          </Button>
          {employerOffersInsurance === true && (
            <Button variant="outline" className="w-full" onClick={onBack}>
              Back to Start
            </Button>
          )}
        </div>
      )}

      {step === 2 && (visa === 'f1' || visa === 'j1') && (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">University Name</Label>
            <Input
              value={universityQuery}
              onChange={e => { setUniversityQuery(e.target.value); setUniversity('') }}
              placeholder="Start typing your university..."
            />
            {filteredUniversities.length > 0 && !university && (
              <div className="rounded-lg border bg-popover shadow-sm">
                {filteredUniversities.map(u => (
                  <button
                    key={u}
                    onClick={() => { setUniversity(u); setUniversityQuery(u) }}
                    className="flex w-full px-3 py-2 text-sm hover:bg-muted text-left"
                  >
                    {u}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <p className="text-sm">Does your university require insurance?</p>
            <button
              type="button"
              onClick={() => setRequiresInsurance(r => !r)}
              className={`relative h-6 w-11 rounded-full transition-colors ${requiresInsurance ? 'bg-primary' : 'bg-muted'}`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${requiresInsurance ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
          </div>
          {requiresInsurance && (
            <InfoCard title="Student Health Insurance Plan (SHIP)">
              <p>Most universities require F-1 and J-1 students to carry their Student Health Insurance Plan. Your university health center can enroll you. SHIP premiums are typically $1,500-$3,500/year and provide comprehensive coverage on campus.</p>
            </InfoCard>
          )}
          <Button className="w-full" onClick={() => setStep(3)}>
            Find Marketplace Plans
          </Button>
          <button
            type="button"
            onClick={onBack}
            className="w-full text-center text-xs text-muted-foreground hover:text-foreground"
          >
            Back to Start
          </button>
        </div>
      )}

      {step === 2 && visa === 'greencard' && (
        <div className="space-y-3">
          <InfoCard title="5-Year Medicaid Bar">
            <p>Green card holders who have been in the US fewer than 5 years are not eligible for federal Medicaid (with some exceptions for children and pregnant women). You can enroll in ACA marketplace plans and may qualify for premium subsidies.</p>
          </InfoCard>
          <Button className="w-full" onClick={() => setStep(3)}>
            Find Marketplace Plans
          </Button>
        </div>
      )}

      {step === 2 && (visa === 'h4' || visa === 'other') && (
        <div className="space-y-3">
          <InfoCard title="ACA Marketplace Eligibility">
            <p>H-4 and other visa holders with valid legal status can enroll in ACA marketplace plans. You may qualify for premium tax credits based on income. Undocumented individuals are not eligible for marketplace plans.</p>
          </InfoCard>
          <Button className="w-full" onClick={() => setStep(3)}>
            Find Marketplace Plans
          </Button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">ZIP Code</Label>
              <Input
                value={zip}
                onChange={e => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
                placeholder="63103"
                inputMode="numeric"
                maxLength={5}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Age</Label>
              <Input
                type="number"
                min={0}
                max={120}
                value={age}
                onChange={e => setAge(e.target.value)}
                placeholder="22"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs">Annual Income</Label>
              <span className="text-sm font-semibold">${income.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={0}
              max={150000}
              step={1000}
              value={income}
              onChange={e => setIncome(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
          <div>
            <p className="mb-2 text-xs font-medium">Health Conditions (optional)</p>
            <div className="flex flex-wrap gap-2">
              {HEALTH_CONDITIONS.map(c => {
                const active = conditions.includes(c.id)
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCondition(c.id)}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      active ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:bg-muted'
                    }`}
                  >
                    {c.label}
                  </button>
                )
              })}
            </div>
          </div>
          <Button
            className="w-full"
            disabled={loading || !zip || zip.length !== 5}
            onClick={fetchPlans}
          >
            {loading ? (
              <><Loader2 size={14} className="mr-2 animate-spin" /> Finding plans...</>
            ) : (
              'Find Plans'
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
