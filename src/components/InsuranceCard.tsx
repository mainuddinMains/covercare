import { useState } from 'react'
import { RotateCcw, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { InsuranceProfile } from '@/store/appStore'

interface Props {
  profile: InsuranceProfile
  memberName?: string
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] opacity-60">{label}</p>
      <p className="text-xs font-semibold">{value}</p>
    </div>
  )
}

export default function InsuranceCard({ profile, memberName }: Props) {
  const [showBack, setShowBack] = useState(false)

  const companyName = profile.issuerName || profile.planName || 'Your Insurance Plan'
  const hasBackData =
    profile.annualDeductible ||
    profile.outOfPocketMax ||
    profile.monthlyPremium ||
    profile.insurerPhone ||
    profile.pcpName

  return (
    <div className="space-y-2">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-primary/60 p-4 text-primary-foreground shadow-md">
        {!showBack ? (
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] opacity-60">Insurance Company</p>
                <p className="font-heading text-sm font-semibold leading-tight">{companyName}</p>
                {profile.planName && profile.issuerName && (
                  <p className="text-[10px] opacity-70">{profile.planName}</p>
                )}
              </div>
              <Shield size={18} className="mt-0.5 shrink-0 opacity-50" />
            </div>

            {profile.planType && (
              <span className="inline-block rounded bg-white/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide">
                {profile.planType}
              </span>
            )}

            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              <Field label="Member ID" value={profile.memberId || 'XXXX-XXXX'} />
              <Field label="Group Number" value={profile.groupNumber || 'XXXXXXX'} />
              {memberName && <Field label="Member" value={memberName} />}
              {profile.effectiveDate && <Field label="Effective" value={profile.effectiveDate} />}
            </div>

            {profile.copayPerVisit && (
              <div className="rounded-lg bg-white/15 px-3 py-1.5 text-xs">
                <span className="opacity-70">PCP Copay:</span>
                <span className="ml-1.5 font-semibold">${profile.copayPerVisit}/visit</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest opacity-70">
              Benefits Summary
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {profile.annualDeductible && (
                <Field label="Annual Deductible" value={`$${profile.annualDeductible}`} />
              )}
              {profile.outOfPocketMax && (
                <Field label="OOP Maximum" value={`$${profile.outOfPocketMax}`} />
              )}
              {profile.monthlyPremium && (
                <Field label="Monthly Premium" value={`$${profile.monthlyPremium}/mo`} />
              )}
              {profile.insurerPhone && (
                <Field label="Customer Service" value={profile.insurerPhone} />
              )}
              {profile.coverageEndDate && (
                <Field label="Coverage Ends" value={profile.coverageEndDate} />
              )}
            </div>
            {profile.pcpName && (
              <div className="rounded-lg bg-white/15 px-3 py-1.5 text-xs">
                <span className="opacity-70">Primary Care Physician:</span>
                <span className="ml-1.5 font-semibold">{profile.pcpName}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {hasBackData && (
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs"
          onClick={() => setShowBack(b => !b)}
        >
          <RotateCcw size={11} className="mr-1.5" />
          {showBack ? 'Show front' : 'Show back'}
        </Button>
      )}
    </div>
  )
}
