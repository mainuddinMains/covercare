import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useInsuranceStore } from '@/store/appStore'
import { estimateCopay, bestForLabel } from '@/lib/plan-finder'
import type { InsurancePlan } from '@/lib/types'
import { Trophy } from 'lucide-react'

interface Props {
  plans: InsurancePlan[]
  open: boolean
  onClose: () => void
}

function Row({ label, values, highlight }: { label: string; values: string[]; highlight?: number }) {
  return (
    <tr className="border-t border-border">
      <td className="py-2 pr-3 text-[11px] font-medium text-muted-foreground whitespace-nowrap">{label}</td>
      {values.map((v, i) => (
        <td
          key={i}
          className={`py-2 px-2 text-center text-[11px] ${i === highlight ? 'font-semibold text-primary' : ''}`}
        >
          {v}
        </td>
      ))}
    </tr>
  )
}

export default function CompareModal({ plans, open, onClose }: Props) {
  const { updateField } = useInsuranceStore()

  function saveToProfile(plan: InsurancePlan) {
    updateField('issuerName', plan.issuer)
    updateField('planName', plan.name)
    updateField('planType', plan.type as 'HMO' | 'PPO' | 'EPO' | 'HDHP' | '')
    updateField('monthlyPremium', String(Math.round(plan.premium)))
    updateField('annualDeductible', String(plan.deductible))
    updateField('outOfPocketMax', String(plan.oopMax || ''))
    onClose()
  }

  if (plans.length === 0) return null

  const bestPremiumIdx = plans.reduce(
    (best, p, i) => (p.premium < plans[best].premium ? i : best), 0,
  )
  const bestDeductibleIdx = plans.reduce(
    (best, p, i) => (p.deductible < plans[best].deductible ? i : best), 0,
  )

  const copays = plans.map(estimateCopay)

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Compare Plans</DialogTitle>
        </DialogHeader>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="pb-2 text-left text-[11px] text-muted-foreground w-28">Feature</th>
                {plans.map((p, i) => (
                  <th key={p.id} className="pb-2 px-2 text-center">
                    <div className="flex flex-col items-center gap-0.5">
                      {i === 0 && <Trophy size={10} className="text-primary" />}
                      <span className="text-xs font-semibold">{p.issuer}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {p.metalLevel.charAt(0).toUpperCase() + p.metalLevel.slice(1).toLowerCase()} {p.type}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <Row
                label="Monthly Premium"
                values={plans.map(p => `$${Math.round(p.premium)}/mo`)}
                highlight={bestPremiumIdx}
              />
              <Row
                label="Annual Deductible"
                values={plans.map(p => p.deductible ? `$${p.deductible.toLocaleString()}` : 'N/A')}
                highlight={bestDeductibleIdx}
              />
              <Row
                label="OOP Maximum"
                values={plans.map(p => p.oopMax ? `$${p.oopMax.toLocaleString()}` : 'N/A')}
              />
              <Row
                label="PCP Copay*"
                values={copays.map(c => c.pcp)}
              />
              <Row
                label="Specialist*"
                values={copays.map(c => c.specialist)}
              />
              <Row
                label="ER Copay*"
                values={copays.map(c => c.er)}
              />
              <Row
                label="Mental Health"
                values={plans.map(p => p.type === 'HMO' ? 'In-network' : 'Out-of-network ok')}
              />
              <Row
                label="Prescription Rx"
                values={plans.map(p => {
                  const m = p.metalLevel.toLowerCase()
                  return m === 'platinum' || m === 'gold' ? 'Covered (low copay)' : 'Covered (higher copay)'
                })}
              />
              <Row
                label="Dental / Vision"
                values={plans.map(p => {
                  const m = p.metalLevel.toLowerCase()
                  return m === 'platinum' ? 'Often included' : 'Usually separate'
                })}
              />
              <Row
                label="Rating"
                values={plans.map(p => p.rating ? `${p.rating.toFixed(1)} / 5` : 'N/A')}
              />
              <Row
                label="Best For"
                values={plans.map(bestForLabel)}
              />
            </tbody>
          </table>
          <p className="mt-2 text-[10px] text-muted-foreground">
            * Copay values are typical estimates based on metal tier. Verify actual copays with your insurer before enrolling.
          </p>
        </div>

        <DialogFooter>
          <div className="flex flex-wrap gap-2">
            {plans.map(p => (
              <Button key={p.id} size="sm" className="text-xs flex-1" onClick={() => saveToProfile(p)}>
                Select {p.issuer.split(' ')[0]}
              </Button>
            ))}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
