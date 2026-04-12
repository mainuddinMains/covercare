import { useInsuranceStore, type InsuranceProfile } from '@/store/appStore'
import { INSURANCE_LABELS, type InsuranceType } from '@/lib/cost-estimator'
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
        <h1 className="text-lg font-semibold">Insurance Profile</h1>
        <p className="text-sm text-muted-foreground">
          Save your info to get personalized cost estimates and provider matches.
        </p>
      </div>

      <Card>
        <CardContent className="space-y-4 p-4">
          <h2 className="text-sm font-semibold">Scan Your Card</h2>
          <InsuranceCardScanner onScan={handleScan} />
        </CardContent>
      </Card>

      <Separator />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="insuranceType">Insurance Type</Label>
          <select
            id="insuranceType"
            value={profile.insuranceType}
            onChange={(e) =>
              updateField('insuranceType', e.target.value as InsuranceType)
            }
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Select insurance type...</option>
            {INSURANCE_OPTIONS.map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {(
          [
            ['planName', 'Plan Name', 'e.g. Blue Cross PPO'],
            ['memberId', 'Member ID', 'From your insurance card'],
            ['groupNumber', 'Group Number', 'From your insurance card'],
            ['insurerPhone', 'Insurer Phone', 'Customer service number'],
            ['effectiveDate', 'Effective Date', 'MM/DD/YYYY'],
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
        <h2 className="text-sm font-semibold">Your Location</h2>
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
          Clear Profile
        </Button>
      )}
    </div>
  )
}
