import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import CostEstimator from '@/components/CostEstimator'
import MrfRateLookup from '@/components/mrf/MrfRateLookup'

export const Route = createFileRoute('/estimate')({ component: EstimatePage })

type Tab = 'estimate' | 'mrf'

function EstimatePage() {
  const [tab, setTab] = useState<Tab>('estimate')
  return (
    <div className="space-y-4">
      <div className="flex rounded-lg border p-1 gap-1">
        <TabBtn active={tab === 'estimate'} onClick={() => setTab('estimate')}>Cost Estimate</TabBtn>
        <TabBtn active={tab === 'mrf'} onClick={() => setTab('mrf')}>Negotiated Rates</TabBtn>
      </div>
      {tab === 'estimate' ? <CostEstimator /> : <MrfRateLookup />}
    </div>
  )
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
        active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
      }`}
    >
      {children}
    </button>
  )
}
