import { Link } from '@tanstack/react-router'
import { AlertTriangle, Info } from 'lucide-react'
import { useInsuranceStore } from '@/store/appStore'

function daysUntil(dateStr: string): number | null {
  if (!dateStr) return null
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return null
  return Math.ceil((d.getTime() - Date.now()) / 86400000)
}

export default function AlertBanners() {
  const { profile } = useInsuranceStore()
  const days = daysUntil(profile.coverageEndDate)

  const alerts: React.ReactNode[] = []

  if (!profile.issuerName) {
    alerts.push(
      <div key="no-ins" className="flex items-start gap-2 rounded-xl border border-[#E8924A]/40 bg-[#E8924A]/10 px-3 py-2.5 text-xs">
        <AlertTriangle size={14} className="mt-0.5 shrink-0 text-[#E8924A]" />
        <div>
          <p className="font-semibold text-[#E8924A]">No insurance on file</p>
          <p className="mt-0.5 text-muted-foreground">
            Add your insurance to get personalized guidance and cost estimates.{' '}
            <Link to="/profile" className="underline text-[#E8924A]">Go to Profile</Link>
          </p>
        </div>
      </div>,
    )
  }

  if (days !== null && days >= 0 && days <= 30) {
    alerts.push(
      <div key="renew" className="flex items-start gap-2 rounded-xl border border-[#E8924A]/40 bg-[#E8924A]/10 px-3 py-2.5 text-xs">
        <AlertTriangle size={14} className="mt-0.5 shrink-0 text-[#E8924A]" />
        <div>
          <p className="font-semibold text-[#E8924A]">Coverage ending in {days} days</p>
          <p className="mt-0.5 text-muted-foreground">
            Open enrollment or a new plan may be needed.{' '}
            <Link to="/plans" className="underline text-[#E8924A]">Find plans</Link>
          </p>
        </div>
      </div>,
    )
  }

  if (!profile.zip) {
    alerts.push(
      <div key="no-zip" className="flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50/60 px-3 py-2.5 text-xs">
        <Info size={14} className="mt-0.5 shrink-0 text-blue-600" />
        <p className="text-muted-foreground">
          Add your ZIP code in{' '}
          <Link to="/profile" className="underline text-blue-600">Profile</Link>
          {' '}to see nearby providers on the dashboard.
        </p>
      </div>,
    )
  }

  if (alerts.length === 0) return null

  return <div className="space-y-2">{alerts}</div>
}
