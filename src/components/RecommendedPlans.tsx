import { useState } from 'react'
import { Loader2, ShieldCheck, ExternalLink, Trophy } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import type { PlanRecommendation } from '@/lib/types'
import { useInsuranceStore } from '@/store/appStore'

const METAL_COLORS: Record<string, string> = {
  bronze: 'bg-amber-700/10 text-amber-700',
  silver: 'bg-slate-400/10 text-slate-600',
  gold: 'bg-yellow-500/10 text-yellow-700',
  platinum: 'bg-cyan-500/10 text-cyan-700',
  catastrophic: 'bg-red-500/10 text-red-600',
}

const RANK_ICON = ['', '1st', '2nd', '3rd']

export default function RecommendedPlans() {
  const { zip, stateCode } = useInsuranceStore()

  const [form, setForm] = useState({
    zip: zip ?? '',
    income: '',
    householdSize: '1',
  })
  const [results, setResults] = useState<PlanRecommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    setSearched(true)

    const params = new URLSearchParams({
      zip: form.zip,
      income: form.income,
      household_size: form.householdSize,
    })

    try {
      const res = await fetch(`/api/plans/recommend?${params}`)
      const data = await res.json() as { recommendations?: PlanRecommendation[]; error?: string }
      if (!res.ok || data.error) {
        setError(data.error ?? 'Could not load recommendations.')
        setResults([])
      } else {
        setResults(data.recommendations ?? [])
      }
    } catch {
      setError('Could not load recommendations. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-heading text-base font-semibold">Find Best Insurance Plan</h2>
        <p className="text-xs text-muted-foreground">
          Enter your details to get personalized ACA marketplace plan recommendations.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">ZIP Code</Label>
            <Input
              value={form.zip}
              onChange={(e) => set('zip', e.target.value.replace(/\D/g, '').slice(0, 5))}
              placeholder="10001"
              inputMode="numeric"
              maxLength={5}
              required
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Household Size</Label>
            <Input
              type="number"
              min={1}
              max={10}
              value={form.householdSize}
              onChange={(e) => set('householdSize', e.target.value)}
              placeholder="1"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Annual Household Income (USD)</Label>
          <Input
            type="number"
            min={0}
            value={form.income}
            onChange={(e) => set('income', e.target.value)}
            placeholder="45000"
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading || form.zip.length !== 5 || !form.income}
        >
          {loading ? (
            <Loader2 size={15} className="mr-2 animate-spin" />
          ) : (
            <ShieldCheck size={15} className="mr-2" />
          )}
          {loading ? 'Finding plans...' : 'Find Best Plans'}
        </Button>
      </form>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {searched && !loading && results.length === 0 && !error && (
        <p className="py-4 text-center text-sm text-muted-foreground">
          No plans found for this ZIP code and year.
        </p>
      )}

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((rec) => {
            const metal = rec.plan.metalLevel.toLowerCase()
            const colorClass = METAL_COLORS[metal] ?? 'bg-muted text-muted-foreground'

            return (
              <Card key={rec.plan.id} className={rec.rank === 1 ? 'ring-2 ring-primary' : ''}>
                <CardContent className="p-4">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        {rec.rank === 1 && (
                          <Trophy size={13} className="shrink-0 text-primary" />
                        )}
                        <h3 className="text-sm font-semibold leading-tight">
                          {rec.plan.name}
                        </h3>
                      </div>
                      <p className="text-xs text-muted-foreground">{rec.plan.issuer}</p>
                    </div>
                    <Badge className={`shrink-0 text-[10px] ${colorClass}`} variant="outline">
                      {metalLabel(rec.plan.metalLevel)}
                    </Badge>
                  </div>

                  <div className={`mb-2 grid gap-2 rounded-lg bg-muted/50 p-2 text-center ${rec.plan.oopMax ? 'grid-cols-3' : 'grid-cols-2'}`}>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Premium/mo</p>
                      <p className="text-sm font-semibold">${rec.plan.premium.toFixed(0)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Deductible</p>
                      <p className="text-sm font-semibold">
                        {rec.plan.deductible ? `$${rec.plan.deductible.toLocaleString()}` : 'N/A'}
                      </p>
                    </div>
                    {rec.plan.oopMax > 0 && (
                      <div>
                        <p className="text-[10px] text-muted-foreground">OOP Max</p>
                        <p className="text-sm font-semibold">
                          ${rec.plan.oopMax.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>

                  <p className="mb-2 text-xs leading-relaxed text-muted-foreground">
                    {rec.reason}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">
                      {RANK_ICON[rec.rank]} recommendation
                    </span>
                    {rec.plan.url && (
                      <a
                        href={rec.plan.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[11px] text-primary hover:underline"
                      >
                        View plan details
                        <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
          <p className="text-center text-[10px] text-muted-foreground">
            Source: CMS Health Insurance Marketplace. Plans ranked by premium, deductible, OOP max, and income fit.
          </p>
        </div>
      )}
    </div>
  )
}

function metalLabel(level: string): string {
  return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase()
}
