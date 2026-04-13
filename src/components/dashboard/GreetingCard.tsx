import { Link } from '@tanstack/react-router'
import { MessageCircle, Building2, Award, ShieldAlert, ShieldCheck } from 'lucide-react'
import { useSession } from '@/lib/auth-client'
import { useInsuranceStore } from '@/store/appStore'

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

const INSURANCE_TYPE_LABELS: Record<string, string> = {
  'aca-bronze': 'ACA Bronze',
  'aca-silver': 'ACA Silver',
  'aca-gold': 'ACA Gold',
  medicare: 'Medicare',
  medicaid: 'Medicaid',
  employer: 'Employer plan',
  uninsured: 'Uninsured',
}

const QUICK_ACTIONS = [
  { label: 'Find Care', to: '/chat', icon: MessageCircle },
  { label: 'Clinics', to: '/hospitals', icon: Building2 },
  { label: 'Compare Plans', to: '/plans', icon: Award },
] as const

export default function GreetingCard() {
  const { data: session } = useSession()
  const { profile } = useInsuranceStore()
  const firstName = session?.user?.name?.split(' ')[0] ?? ''
  const hasInsurance = !!profile.issuerName

  return (
    <div className="rounded-2xl bg-[#0A5C5C] p-4 text-white space-y-3">
      <div>
        <p className="text-sm text-white/70">{greeting()}</p>
        <h1 className="font-heading text-xl font-semibold">
          {firstName ? `${firstName}` : 'Welcome back'}
        </h1>
      </div>

      {hasInsurance ? (
        <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
          <ShieldCheck size={16} className="shrink-0 text-green-300" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{profile.issuerName}</p>
            <p className="text-xs text-white/60">
              {[INSURANCE_TYPE_LABELS[profile.insuranceType] ?? '', profile.planType].filter(Boolean).join(' · ')}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-xl bg-[#E8924A]/20 px-3 py-2">
          <ShieldAlert size={16} className="shrink-0 text-[#E8924A]" />
          <p className="text-sm text-[#E8924A]">No insurance added yet</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        {QUICK_ACTIONS.map(({ label, to, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center gap-1 rounded-xl bg-white/10 py-2.5 text-center text-xs font-medium hover:bg-white/20 transition-colors"
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </div>
    </div>
  )
}
