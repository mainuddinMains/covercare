import { useEffect, useState } from 'react'
import { Sparkles, RefreshCw, Loader2 } from 'lucide-react'
import { useInsuranceStore } from '@/store/appStore'

export default function AiInsight() {
  const { profile } = useInsuranceStore()
  const [tip, setTip] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function fetchTip() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/dashboard/insight/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issuerName: profile.issuerName || undefined,
          planType: profile.planType || undefined,
          insuranceType: profile.insuranceType || undefined,
          state: profile.state || undefined,
          coverageEndDate: profile.coverageEndDate || undefined,
          month: new Date().toLocaleString('default', { month: 'long' }),
        }),
      })
      const data = await res.json() as { tip?: string; error?: string }
      if (data.error) { setError(data.error); return }
      setTip(data.tip ?? '')
    } catch {
      setError('Could not load tip. Check your connection.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTip() }, [])

  return (
    <div className="rounded-2xl bg-[#0A5C5C] p-4 text-white space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={16} />
          <span className="text-sm font-semibold">AI Health Tip</span>
        </div>
        <button
          type="button"
          onClick={fetchTip}
          disabled={loading}
          className="rounded-full p-1.5 hover:bg-white/10 transition-colors disabled:opacity-40"
          aria-label="Refresh tip"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-white/70">
          <Loader2 size={14} className="animate-spin" />
          Getting personalized tip...
        </div>
      )}

      {!loading && error && (
        <p className="text-sm text-red-300">{error}</p>
      )}

      {!loading && tip && (
        <p className="text-sm leading-relaxed text-white/90">{tip}</p>
      )}
    </div>
  )
}
