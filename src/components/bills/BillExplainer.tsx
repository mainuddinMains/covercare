import { useState, useRef } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  ImagePlus,
  Loader2,
  RefreshCw,
  ShieldAlert,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LineItem {
  code: string
  description: string
  charged: string
  plainEnglish: string
}

interface PotentialError {
  type: string
  description: string
  severity: 'high' | 'medium' | 'low'
}

interface BillAnalysis {
  summary: string
  lineItems: LineItem[]
  potentialErrors: PotentialError[]
  disputeSteps: string[]
  rightsReminder: string
}

type Phase = 'idle' | 'loading' | 'done' | 'error'

const SEVERITY_STYLES: Record<PotentialError['severity'], string> = {
  high: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/30 dark:border-red-800 dark:text-red-300',
  medium: 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-300',
  low: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950/30 dark:border-yellow-800 dark:text-yellow-300',
}

const SEVERITY_LABEL: Record<PotentialError['severity'], string> = {
  high: 'High priority',
  medium: 'Review',
  low: 'Minor',
}

export default function BillExplainer() {
  const [billText, setBillText] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [analysis, setAnalysis] = useState<BillAnalysis | null>(null)
  const [rawFallback, setRawFallback] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setImagePreview(dataUrl)
      setImageBase64(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  function clearImage() {
    setImagePreview(null)
    setImageBase64(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!billText.trim() && !imageBase64) return

    setPhase('loading')
    setAnalysis(null)
    setRawFallback(null)
    setErrorMsg('')

    try {
      const res = await fetch('/api/bills/explain/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          billText: billText.trim() || undefined,
          imageBase64: imageBase64 || undefined,
        }),
      })
      const data = await res.json() as {
        analysis?: BillAnalysis
        raw?: string
        error?: string
      }
      if (!res.ok || data.error) {
        setErrorMsg(data.error ?? 'Analysis failed. Please try again.')
        setPhase('error')
        return
      }
      if (data.analysis) {
        setAnalysis(data.analysis)
      } else if (data.raw) {
        setRawFallback(data.raw)
      }
      setPhase('done')
    } catch {
      setErrorMsg('Network error. Please try again.')
      setPhase('error')
    }
  }

  function reset() {
    setPhase('idle')
    setAnalysis(null)
    setRawFallback(null)
    setErrorMsg('')
    setBillText('')
    clearImage()
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card p-4 space-y-3">
        <div className="flex items-start gap-2">
          <FileText size={16} className="mt-0.5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-semibold">Medical Bill Explainer</p>
            <p className="text-xs text-muted-foreground">
              Paste your bill text or upload a photo. The AI will break it down and flag common billing errors that you may be able to dispute.
            </p>
          </div>
        </div>

        {phase === 'idle' || phase === 'error' ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              className="w-full min-h-[140px] rounded-lg border bg-muted/40 px-3 py-2.5 text-sm leading-relaxed placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-y"
              placeholder={`Paste your bill text here. For example:\n\nPatient: Jane Doe\nDate of service: 03/15/2025\n99213 Office visit ... $250.00\n36415 Blood draw ... $85.00\nTotal due: $335.00`}
              value={billText}
              onChange={(e) => setBillText(e.target.value)}
            />

            <div className="flex items-center gap-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              {imagePreview ? (
                <div className="relative inline-flex">
                  <img
                    src={imagePreview}
                    alt="Bill preview"
                    className="h-16 w-auto rounded-lg border object-cover"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white"
                  >
                    <X size={10} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <ImagePlus size={14} />
                  Upload bill photo
                </button>
              )}
            </div>

            {phase === 'error' && (
              <p className="text-xs text-destructive">{errorMsg}</p>
            )}

            <Button
              type="submit"
              disabled={!billText.trim() && !imageBase64}
              className="w-full"
            >
              Analyze My Bill
            </Button>
          </form>
        ) : phase === 'loading' ? (
          <div className="flex flex-col items-center gap-3 py-8 text-muted-foreground">
            <Loader2 size={24} className="animate-spin" />
            <p className="text-sm">Analyzing your bill for errors...</p>
          </div>
        ) : null}
      </div>

      {phase === 'done' && analysis && (
        <>
          <div className="rounded-xl border bg-card p-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Summary</p>
            <p className="text-sm leading-relaxed">{analysis.summary}</p>
          </div>

          {analysis.lineItems.length > 0 && (
            <div className="rounded-xl border bg-card overflow-hidden">
              <div className="px-4 py-3 border-b">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Line Items</p>
              </div>
              <div className="divide-y">
                {analysis.lineItems.map((item, i) => (
                  <div key={i} className="px-4 py-3 space-y-0.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm font-medium">{item.description}</span>
                      <span className="shrink-0 text-sm font-semibold tabular-nums">{item.charged}</span>
                    </div>
                    {item.code && (
                      <span className="inline-block rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                        {item.code}
                      </span>
                    )}
                    <p className="text-xs text-muted-foreground">{item.plainEnglish}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis.potentialErrors.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ShieldAlert size={15} className="text-destructive" />
                <p className="text-sm font-semibold">
                  {analysis.potentialErrors.length} Potential Billing {analysis.potentialErrors.length === 1 ? 'Error' : 'Errors'} Found
                </p>
              </div>
              {analysis.potentialErrors.map((err, i) => (
                <div
                  key={i}
                  className={`rounded-xl border p-3 space-y-1 ${SEVERITY_STYLES[err.severity]}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold">{err.type}</p>
                    <span className="rounded-full border px-2 py-0.5 text-[10px] font-medium">
                      {SEVERITY_LABEL[err.severity]}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed">{err.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950/30">
              <CheckCircle2 size={15} className="shrink-0 text-green-600 dark:text-green-400" />
              <p className="text-xs text-green-800 dark:text-green-300">No obvious billing errors detected.</p>
            </div>
          )}

          {analysis.disputeSteps.length > 0 && (
            <div className="rounded-xl border bg-card p-4 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-500" />
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">How to Dispute</p>
              </div>
              <ol className="space-y-2">
                {analysis.disputeSteps.map((step, i) => (
                  <li key={i} className="flex gap-2.5 text-sm">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {analysis.rightsReminder && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
              <p className="text-xs leading-relaxed text-foreground/80">
                <span className="font-semibold">Know your rights: </span>
                {analysis.rightsReminder}
              </p>
            </div>
          )}

          <Button variant="outline" size="sm" onClick={reset} className="w-full gap-2">
            <RefreshCw size={13} />
            Analyze another bill
          </Button>
        </>
      )}

      {phase === 'done' && rawFallback && (
        <div className="rounded-xl border bg-card p-4 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">Analysis</p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{rawFallback}</p>
          <Button variant="outline" size="sm" onClick={reset} className="gap-2">
            <RefreshCw size={13} />
            Start over
          </Button>
        </div>
      )}
    </div>
  )
}
