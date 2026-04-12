import { useInsuranceStore, usePreferencesStore, type InsuranceProfile } from '@/store/appStore'
import { INSURANCE_LABELS, type InsuranceType } from '@/lib/cost-estimator'
import { translations } from '@/lib/i18n'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import InsuranceCardScanner from './InsuranceCardScanner'
import LocationDetector from './LocationDetector'
import type { ScannedCard } from '@/lib/card-scanner'
import type { DetectedLocation } from '@/lib/types'
import { Trash2 } from 'lucide-react'

const INSURANCE_OPTIONS = Object.entries(INSURANCE_LABELS) as [
  InsuranceType,
  string,
][]

export default function InsuranceProfileForm() {
  const { profile, updateField, applyScannedCard, clearProfile } =
    useInsuranceStore()
  const locale = usePreferencesStore((s) => s.locale)
  const t = translations[locale]

  const hasProfile = Boolean(profile.insuranceType || profile.planName)
  const locationDisplay = profile.city
    ? [profile.city, profile.stateCode, profile.zip].filter(Boolean).join(', ')
    : profile.zip || ''

  function handleScan(card: ScannedCard) {
    applyScannedCard(card)
  }

  function handleLocation(loc: DetectedLocation) {
    updateField('city', loc.city)
    updateField('state', loc.state)
    updateField('stateCode', loc.stateCode)
    updateField('zip', loc.zip)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-xl font-semibold">{t.profile_title}</h1>
        <p className="text-sm text-muted-foreground">
          {t.profile_subtitle}
        </p>
      </div>

      <Card>
        <CardContent className="space-y-4 p-4">
          <h2 className="text-sm font-semibold">{t.profile_scan_heading}</h2>
          <InsuranceCardScanner onScan={handleScan} />
        </CardContent>
      </Card>

      <Separator />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="insuranceType">{t.profile_insurance_type_label}</Label>
          <select
            id="insuranceType"
            value={profile.insuranceType}
            onChange={(e) =>
              updateField('insuranceType', e.target.value as InsuranceType)
            }
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">{t.profile_insurance_type_placeholder}</option>
            {INSURANCE_OPTIONS.map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {(
          [
            ['planName', t.profile_plan_name_label, t.profile_plan_name_placeholder],
            ['memberId', t.profile_member_id_label, t.profile_member_id_placeholder],
            ['groupNumber', t.profile_group_number_label, t.profile_group_number_placeholder],
            ['insurerPhone', t.profile_insurer_phone_label, t.profile_insurer_phone_placeholder],
            ['effectiveDate', t.profile_effective_date_label, t.profile_effective_date_placeholder],
          ] as [keyof InsuranceProfile, string, string][]
        ).map(([field, label, placeholder]) => (
          <div key={field} className="space-y-2">
            <Label htmlFor={field}>{label}</Label>
            <Input
              id={field}
              value={profile[field]}
              onChange={(e) => updateField(field, e.target.value)}
              placeholder={placeholder}
            />
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-3">
        <h2 className="text-sm font-semibold">{t.profile_location_heading}</h2>
        {locationDisplay ? (
          <p className="text-sm text-muted-foreground">{locationDisplay}</p>
        ) : (
          <LocationDetector onDetect={handleLocation} />
        )}
      </div>

      {hasProfile && (
        <Button
          variant="destructive"
          onClick={clearProfile}
          className="w-full"
        >
          <Trash2 size={14} className="mr-2" />
          {t.profile_clear}
        </Button>
      )}
    </div>
  )
}
