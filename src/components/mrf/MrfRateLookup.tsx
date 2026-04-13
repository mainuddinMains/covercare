import { useState } from 'react'
import { Search, FileSearch, AlertTriangle, ExternalLink, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useInsuranceStore } from '@/store/appStore'
import { CPT_CODES, normalizeInsurer, getMrfPortalUrl } from '@/lib/mrf'
import type { PlanFileEntry, RateSummary } from '@/lib/mrf'

type Phase = 'idle' | 'discovering' | 'selecting' | 'fetching' | 'done' | 'error'

// Group CPT codes by category for the selector
const CPT_BY_CATEGORY = CPT_CODES.reduce<Record<string, typeof CPT_CODES>>((acc, c) => {
  acc[c.category] = [...(acc[c.category] ?? []), c]
  return acc
}, {})

export default function MrfRateLookup() {
  const { profile } = useInsuranceStore()
  const [cpt, setCpt] = useState(CPT_CODES[0].code)
  const [phase, setPhase] = useState<Phase>('idle')
  const [files, setFiles] = useState<PlanFileEntry[]>([])
  const [selectedFile, setSelectedFile] = useState<PlanFileEntry | null>(null)
  const [result, setResult] = useState<RateSummary | null>(null)
  const [error, setError] = useState('')

  const insurer = normalizeInsurer(profile.issuerName)
  const hasProfile = !!profile.issuerName

  async function handleFind() {
    if (!insurer) return
    setPhase('discovering')
    setResult(null)
    setError('')

    try {
      // Build query from profile plan name for better file matching
      const query = buildQuery(profile.planName, profile.planType, profile.state)
      const discoverRes = await fetch(
        `/api/mrf/discover/?insurer=${insurer}&query=${encodeURIComponent(query)}`,
      )
      const discoverData = await discoverRes.json() as {
        files?: PlanFileEntry[]
        error?: string
      }

      const found = discoverData.files ?? []
      if (found.length === 0) {
        setError('No plan files found for your insurer. Try the portal link below.')
        setPhase('error')
        return
      }

      // Auto-select if only one file, otherwise let user pick
      if (found.length === 1) {
        setSelectedFile(found[0])
        await fetchRates(found[0])
      } else {
        setFiles(found)
        setPhase('selecting')
      }
    } catch {
      setError('Discovery failed. Check your connection and try again.')
      setPhase('error')
    }
  }

  async function fetchRates(file: PlanFileEntry) {
    setPhase('fetching')
    try {
      const params = new URLSearchParams({
        insurer: insurer ?? '',
        cpt,
        file_url: file.url,
      })
      const res = await fetch(`/api/mrf/rates/?${params}`)
      const data = await res.json() as RateSummary & { cached?: boolean; error?: string }

      if (!res.ok || data.error) {
        setError(data.error ?? 'Rate lookup failed.')
        setPhase('error')
        return
      }

      setResult(data)
      setSelectedFile(file)
      setPhase('done')
    } catch {
      setError('Rate lookup timed out. The file may be too large.')
      setPhase('error')
    }
  }

  const cptLabel = CPT_CODES.find(c => c.code === cpt)?.label ?? cpt

  if (!hasProfile) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        <FileSearch size={24} className="mx-auto mb-2 opacity-40" />
        <p className="font-medium">No plan saved yet</p>
        <p className="mt-1 text-xs">Save a plan from the Best Plans tab to look up actual negotiated rates.</p>
      </div>
    )
  }

  if (!insurer) {
    return (
      <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
        <p>Insurer <span className="font-medium">{profile.issuerName}</span> is not currently supported for direct MRF lookup. Supported: Aetna, UnitedHealthcare, Cigna, Anthem / Elevance.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
        <Info size={11} className="inline mr-1" />
        Negotiated rates come directly from your insurer's federally required Machine Readable Files (MRF). No API key needed.
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Your Plan</Label>
        <div className="rounded-md border bg-muted/40 px-3 py-2">
          <p className="text-sm font-medium">{profile.issuerName}</p>
          {profile.planName && <p className="text-xs text-muted-foreground">{profile.planName}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Procedure</Label>
        <select
          value={cpt}
          onChange={e => { setCpt(e.target.value); setPhase('idle'); setResult(null) }}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {Object.entries(CPT_BY_CATEGORY).map(([cat, codes]) => (
            <optgroup key={cat} label={cat}>
              {codes.map(c => (
                <option key={c.code} value={c.code}>{c.label} (CPT {c.code})</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {phase === 'idle' && (
        <Button className="w-full" onClick={handleFind}>
          <Search size={14} className="mr-2" />
          Find Negotiated Rates
        </Button>
      )}

      {phase === 'discovering' && (
        <div className="rounded-lg border p-4 text-center text-sm text-muted-foreground animate-pulse">
          Searching {profile.issuerName} plan files...
        </div>
      )}

      {phase === 'fetching' && (
        <div className="space-y-1 rounded-lg border p-4 text-center text-sm text-muted-foreground">
          <p className="animate-pulse">Scanning negotiated rates file...</p>
          <p className="text-xs">This may take 15 to 60 seconds for large files.</p>
        </div>
      )}

      {phase === 'selecting' && files.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Multiple plan files found. Select the one that matches your plan:</p>
          <div className="max-h-60 overflow-y-auto space-y-1.5">
            {files.map(f => (
              <button
                key={f.url}
                type="button"
                onClick={() => fetchRates(f)}
                className="w-full rounded-lg border bg-card px-3 py-2 text-left hover:bg-muted transition-colors"
              >
                <p className="text-sm font-medium leading-tight">{f.planName || f.description}</p>
                {f.planName && f.description && (
                  <p className="text-xs text-muted-foreground">{f.description}</p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === 'error' && (
        <div className="space-y-3">
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
            <AlertTriangle size={11} className="inline mr-1" />
            {error}
          </div>
          <a
            href={getMrfPortalUrl(insurer)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            Open {profile.issuerName} MRF portal directly <ExternalLink size={10} />
          </a>
          <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => { setPhase('idle'); setError('') }}>
            Try again
          </Button>
        </div>
      )}

      {phase === 'done' && result && (
        <div className="space-y-3">
          <div className="rounded-lg border bg-card p-4 space-y-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                CPT {result.billingCode}
              </p>
              <p className="text-sm font-medium leading-snug">
                {result.description || cptLabel}
              </p>
              {selectedFile && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedFile.planName || profile.issuerName}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <RateCell label="Minimum" value={result.min} highlight />
              <RateCell label="Maximum" value={result.max} />
              <RateCell label="Typical (median)" value={result.median} highlight />
              <RateCell label="Average" value={result.avg} />
            </div>

            <p className="text-[10px] text-muted-foreground">
              Based on {result.sampleSize.toLocaleString()} negotiated rates from your insurer's MRF file. Actual amount billed to your plan may differ based on your deductible and cost-sharing.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={() => { setPhase('idle'); setResult(null) }}
          >
            Look up another procedure
          </Button>
        </div>
      )}

      {phase === 'idle' && (
        <p className="text-center text-[10px] text-muted-foreground">
          Data sourced from federally mandated MRF files. Updated monthly by your insurer.
        </p>
      )}
    </div>
  )
}

function RateCell({ label, value, highlight }: { label: string; value: number | null; highlight?: boolean }) {
  return (
    <div className={`rounded-md p-2 text-center ${highlight ? 'bg-primary/5' : 'bg-muted/50'}`}>
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className={`text-base font-semibold ${highlight ? 'text-primary' : ''}`}>
        {value != null ? `$${value.toFixed(2)}` : 'N/A'}
      </p>
    </div>
  )
}

function buildQuery(planName: string, planType: string, state: string): string {
  const parts: string[] = []
  if (planType) parts.push(planType)
  // Extract metal tier from plan name
  const metalMatch = planName.match(/\b(bronze|silver|gold|platinum)\b/i)
  if (metalMatch) parts.push(metalMatch[1])
  if (state) parts.push(state)
  return parts.join(' ')
}
