import { useState } from 'react'
import { ExternalLink, Check, ChevronDown, AlertTriangle, ShieldCheck, BookmarkCheck } from 'lucide-react'
import { STUDENT_INSURANCE_PROVIDERS } from '@/lib/plan-finder'
import { useInsuranceStore } from '@/store/appStore'

export default function StudentInsuranceOptions() {
  const [open, setOpen] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [savedName, setSavedName] = useState<string | null>(null)
  const { updateField } = useInsuranceStore()

  function handleSave(name: string) {
    updateField('issuerName', name)
    updateField('planName', name)
    updateField('planType', '')
    setSavedName(name)
    setTimeout(() => setSavedName(null), 3000)
  }

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50/50">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between px-3 py-2.5 text-left"
      >
        <div>
          <span className="text-sm font-semibold text-blue-900">International Student Insurance Plans</span>
          <span className="ml-2 rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700">
            Legal and widely used
          </span>
        </div>
        <ChevronDown
          size={14}
          className={`text-blue-700 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="border-t border-blue-200 px-3 pb-3 pt-2 space-y-2">
          <p className="text-xs text-blue-800">
            These plans are fully legal for F-1 and J-1 visa holders and are used by hundreds of thousands of international students every year. They are sold directly by the insurer, not through healthcare.gov, which is why they do not appear in the marketplace results above. They are typically much cheaper than ACA plans.
          </p>

          <div className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs text-amber-800">
            <AlertTriangle size={10} className="inline mr-1" />
            Some universities require the campus SHIP plan specifically. Check with your DSO or international student office before purchasing a non-university plan.
          </div>

          <div className="space-y-2 pt-1">
            {STUDENT_INSURANCE_PROVIDERS.map(p => (
              <div key={p.name} className="rounded-lg border bg-white">
                <button
                  type="button"
                  onClick={() => setExpanded(e => e === p.name ? null : p.name)}
                  className="flex w-full items-start justify-between px-3 py-2.5 text-left"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                      <span className="text-sm font-semibold">{p.name}</span>
                      <span className="inline-flex items-center gap-0.5 rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700">
                        <ShieldCheck size={9} />
                        Legal for F-1 / J-1
                      </span>
                      {p.j1Compliant && (
                        <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
                          J-1 visa compliant
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{p.tagline}</p>
                  </div>
                  <ChevronDown
                    size={13}
                    className={`mt-0.5 shrink-0 text-muted-foreground transition-transform ${expanded === p.name ? 'rotate-180' : ''}`}
                  />
                </button>

                {expanded === p.name && (
                  <div className="border-t px-3 pb-3 pt-2 space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {p.features.map(f => (
                        <span key={f} className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px]">
                          <Check size={9} className="text-green-600" />
                          {f}
                        </span>
                      ))}
                    </div>

                    {p.note && (
                      <p className="text-[11px] text-muted-foreground">{p.note}</p>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleSave(p.name)}
                        className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                          savedName === p.name
                            ? 'bg-green-600 text-white'
                            : 'bg-primary text-primary-foreground hover:bg-primary/90'
                        }`}
                      >
                        <BookmarkCheck size={11} />
                        {savedName === p.name ? 'Saved to Profile!' : 'Save to Profile'}
                      </button>
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(p.searchQuery)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
                      >
                        Find {p.name}
                        <ExternalLink size={10} />
                      </a>
                    </div>
                    {savedName === p.name && (
                      <p className="text-[11px] text-green-700">
                        Go to your Profile tab to add your monthly premium, member ID, and other details.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <p className="text-[10px] text-muted-foreground pt-1">
            Prices are not shown here as they change frequently. Rates typically range from $30 to $150/mo depending on coverage level and age. Search each provider directly for a current quote.
          </p>
        </div>
      )}
    </div>
  )
}
