import { useState } from 'react'
import {
  PROCEDURES,
  INSURANCE_LABELS,
  type InsuranceType,
  type CostEstimate,
} from '@/lib/cost-estimator'
import StepIndicator from './StepIndicator'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, ArrowLeft, DollarSign } from 'lucide-react'
import { usePreferencesStore } from '@/store/appStore'
import { translations } from '@/lib/i18n'

const CATEGORIES = [
  ...new Set(Object.values(PROCEDURES).map((p) => p.category)),
]

const INSURANCE_OPTIONS = Object.entries(INSURANCE_LABELS) as [
  InsuranceType,
  string,
][]

export default function CostEstimator() {
  const locale = usePreferencesStore((s) => s.locale)
  const t = translations[locale]

  const STEPS = [
    { label: t.cost_step_category },
    { label: t.cost_step_procedure },
    { label: t.cost_step_insurance },
    { label: t.cost_step_result },
  ]

  const [step, setStep] = useState(0)
  const [category, setCategory] = useState('')
  const [procedureKey, setProcedureKey] = useState('')
  const [insurance, setInsurance] = useState<InsuranceType | ''>('')
  const [result, setResult] = useState<CostEstimate | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const filteredProcedures = Object.entries(PROCEDURES).filter(
    ([, p]) => p.category === category,
  )

  async function fetchEstimate() {
    if (!procedureKey || !insurance) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch(
        `/api/cost-estimate?procedure=${procedureKey}&insurance=${insurance}`,
      )
      if (!res.ok) throw new Error('Failed to estimate')
      const data: CostEstimate = await res.json()
      setResult(data)
      setStep(3)
    } catch {
      setError(t.cost_error)
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setStep(0)
    setCategory('')
    setProcedureKey('')
    setInsurance('')
    setResult(null)
    setError('')
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading text-xl font-semibold">{t.cost_heading}</h1>
        <p className="text-sm text-muted-foreground">
          {t.cost_subtitle}
        </p>
      </div>

      <StepIndicator steps={STEPS} current={step} />

      {step > 0 && step < 3 && (
        <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
          <ArrowLeft size={14} className="mr-1" />
          {t.cost_back}
        </Button>
      )}

      {step === 0 && (
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat)
                setStep(1)
              }}
              className="rounded-lg border border-border p-3 text-left text-sm font-medium transition-colors hover:border-primary hover:bg-primary/5"
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-2">
          {filteredProcedures.map(([key, proc]) => (
            <button
              key={key}
              onClick={() => {
                setProcedureKey(key)
                setStep(2)
              }}
              className="block w-full rounded-lg border border-border p-3 text-left text-sm transition-colors hover:border-primary hover:bg-primary/5"
            >
              <span className="font-medium">{proc.name}</span>
              <span className="ml-2 text-xs text-muted-foreground">
                CPT {proc.cpt}
              </span>
            </button>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-2">
          {INSURANCE_OPTIONS.map(([key, label]) => (
            <button
              key={key}
              onClick={() => {
                setInsurance(key)
                fetchEstimate()
              }}
              className="block w-full rounded-lg border border-border p-3 text-left text-sm transition-colors hover:border-primary hover:bg-primary/5"
            >
              {label}
            </button>
          ))}
          {loading && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="animate-spin text-muted-foreground" size={20} />
              <span className="ml-2 text-sm text-muted-foreground">
                {t.cost_loading}
              </span>
            </div>
          )}
        </div>
      )}

      {step === 3 && result && (
        <Card>
          <CardContent className="space-y-4 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <DollarSign size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{result.procedure}</h3>
                <p className="text-xs text-muted-foreground">
                  CPT {result.cpt} | {result.insuranceLabel}
                </p>
              </div>
            </div>

            {result.medicareRate != null ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-[10px] font-medium uppercase text-muted-foreground">
                    {t.cost_your_estimated}
                  </p>
                  <p className="text-lg font-bold text-primary">
                    ${result.outOfPocketLow} - ${result.outOfPocketHigh}
                  </p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-[10px] font-medium uppercase text-muted-foreground">
                    {t.cost_total_billed}
                  </p>
                  <p className="text-lg font-bold">
                    ${result.totalEstimatedCost?.toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-muted/50 p-4 text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  {t.cost_not_available}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t.cost_not_available_detail}
                </p>
              </div>
            )}

            <p className="text-xs text-muted-foreground">{result.note}</p>
            <p className="text-[10px] text-muted-foreground">
              {t.cost_source} {result.source}
            </p>

            <Button onClick={reset} variant="outline" className="w-full">
              {t.cost_estimate_another}
            </Button>
          </CardContent>
        </Card>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
