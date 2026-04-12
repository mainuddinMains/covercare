import { useState } from 'react'
import { Trophy, Star, ExternalLink, BookmarkCheck, BarChart3, ShoppingCart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useInsuranceStore } from '@/store/appStore'
import type { InsurancePlan } from '@/lib/types'

const METAL_COLORS: Record<string, string> = {
  bronze: 'bg-amber-700/10 text-amber-700',
  silver: 'bg-slate-400/10 text-slate-600',
  gold: 'bg-yellow-500/10 text-yellow-700',
  platinum: 'bg-cyan-500/10 text-cyan-700',
  catastrophic: 'bg-red-500/10 text-red-600',
}

interface Props {
  plan: InsurancePlan
  rank: number
  score: number
  reason: string
  benefits: string[]
  isBestMatch?: boolean
  isVisaCompatible?: boolean
  isDemoData?: boolean
  isSelected: boolean
  compareDisabled: boolean
  onToggleCompare: (id: string) => void
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={11}
          fill={i < Math.round(rating) ? 'currentColor' : 'none'}
          className={i >= Math.round(rating) ? 'opacity-30' : ''}
        />
      ))}
      <span className="ml-1 text-[10px] text-muted-foreground">{rating.toFixed(1)}</span>
    </div>
  )
}

export default function PlanCard({
  plan, rank, score, reason, benefits, isBestMatch, isVisaCompatible,
  isDemoData, isSelected, compareDisabled, onToggleCompare,
}: Props) {
  const { updateField } = useInsuranceStore()
  const [saved, setSaved] = useState(false)

  const metal = plan.metalLevel.toLowerCase()
  const colorClass = METAL_COLORS[metal] ?? 'bg-muted text-muted-foreground'
  const metalLabel = plan.metalLevel.charAt(0).toUpperCase() + plan.metalLevel.slice(1).toLowerCase()

  function handleSave() {
    updateField('issuerName', plan.issuer)
    updateField('planName', plan.name)
    updateField('planType', plan.type as 'HMO' | 'PPO' | 'EPO' | 'HDHP' | '')
    updateField('monthlyPremium', String(Math.round(plan.premium)))
    updateField('annualDeductible', String(plan.deductible))
    updateField('outOfPocketMax', String(plan.oopMax || ''))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <Card className={`transition-all ${isBestMatch ? 'ring-2 ring-primary' : ''} ${isSelected ? 'ring-1 ring-blue-400' : ''}`}>
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
              {isBestMatch && (
                <span className="inline-flex items-center gap-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                  <Trophy size={9} />
                  Best Match
                </span>
              )}
              {isVisaCompatible && (
                <span className="rounded bg-green-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-green-700">
                  Visa-compatible
                </span>
              )}
              {isDemoData && (
                <span className="rounded bg-orange-500/10 px-1.5 py-0.5 text-[10px] text-orange-700">
                  Demo data
                </span>
              )}
            </div>
            <h3 className="text-sm font-semibold leading-tight">{plan.name}</h3>
            <p className="text-xs text-muted-foreground">{plan.issuer}</p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <Badge className={`text-[10px] ${colorClass}`} variant="outline">
              {metalLabel}
            </Badge>
            {plan.type && (
              <span className="text-[10px] text-muted-foreground">{plan.type}</span>
            )}
          </div>
        </div>

        <div className={`mb-2 grid gap-2 rounded-lg bg-muted/50 p-2 text-center ${plan.oopMax ? 'grid-cols-3' : 'grid-cols-2'}`}>
          <div>
            <p className="text-[10px] text-muted-foreground">Premium/mo</p>
            <p className="text-sm font-semibold">${Math.round(plan.premium)}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Deductible</p>
            <p className="text-sm font-semibold">
              {plan.deductible ? `$${plan.deductible.toLocaleString()}` : 'N/A'}
            </p>
          </div>
          {plan.oopMax > 0 && (
            <div>
              <p className="text-[10px] text-muted-foreground">OOP Max</p>
              <p className="text-sm font-semibold">${plan.oopMax.toLocaleString()}</p>
            </div>
          )}
        </div>

        <p className="mb-2 text-xs leading-relaxed text-muted-foreground">{reason}</p>

        {benefits.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {benefits.map(b => (
              <span key={b} className="rounded-full bg-muted px-2 py-0.5 text-[10px]">{b}</span>
            ))}
          </div>
        )}

        {plan.rating && plan.rating > 0 && (
          <div className="mb-2">
            <StarRating rating={plan.rating} />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            size="sm"
            variant={saved ? 'default' : 'outline'}
            className="flex-1 text-xs"
            onClick={handleSave}
          >
            <BookmarkCheck size={12} className="mr-1" />
            {saved ? 'Saved to Profile!' : 'Save to Profile'}
          </Button>
          <Button
            size="sm"
            variant={isSelected ? 'default' : 'outline'}
            className="text-xs"
            onClick={() => onToggleCompare(plan.id)}
            disabled={!isSelected && compareDisabled}
            title={!isSelected && compareDisabled ? 'Max 3 plans for comparison' : undefined}
          >
            <BarChart3 size={12} className="mr-1" />
            {isSelected ? 'Comparing' : 'Compare'}
          </Button>
          {plan.url && (
            <a
              href={plan.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] text-primary hover:underline"
            >
              Details <ExternalLink size={10} />
            </a>
          )}
        </div>
        <a
          href="https://www.healthcare.gov/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 transition-colors"
        >
          <ShoppingCart size={12} />
          Enroll at healthcare.gov
          <ExternalLink size={10} />
        </a>
      </CardContent>
    </Card>
  )
}
