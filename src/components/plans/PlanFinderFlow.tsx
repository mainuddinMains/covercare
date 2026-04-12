import { useState } from 'react'
import { Flag, Globe } from 'lucide-react'
import CitizenFlow from './CitizenFlow'
import ImmigrantFlow from './ImmigrantFlow'

type Path = 'citizen' | 'immigrant' | null

export default function PlanFinderFlow() {
  const [path, setPath] = useState<Path>(null)

  if (path === 'citizen') return <CitizenFlow onBack={() => setPath(null)} />
  if (path === 'immigrant') return <ImmigrantFlow onBack={() => setPath(null)} />

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading text-xl font-semibold">Find Best Plans</h1>
        <p className="text-sm text-muted-foreground">
          Get personalized ACA marketplace plan recommendations based on your situation.
        </p>
      </div>

      <div className="space-y-3 pt-2">
        <button
          onClick={() => setPath('citizen')}
          className="flex w-full items-center gap-4 rounded-xl border border-border p-4 text-left transition-colors hover:bg-muted/50"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Flag size={20} className="text-primary" />
          </div>
          <div>
            <p className="font-semibold">US Citizen or Green Card Holder</p>
            <p className="text-xs text-muted-foreground">
              Eligible for ACA marketplace plans with potential subsidies
            </p>
          </div>
        </button>

        <button
          onClick={() => setPath('immigrant')}
          className="flex w-full items-center gap-4 rounded-xl border border-border p-4 text-left transition-colors hover:bg-muted/50"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Globe size={20} className="text-primary" />
          </div>
          <div>
            <p className="font-semibold">Non-Citizen / Visa Holder</p>
            <p className="text-xs text-muted-foreground">
              F-1, J-1, H-1B, H-4, undocumented, or other immigration status
            </p>
          </div>
        </button>
      </div>

      <p className="text-center text-[10px] text-muted-foreground pt-2">
        Recommendations are based on publicly available CMS marketplace data. Always verify plan details before enrolling.
      </p>
    </div>
  )
}
