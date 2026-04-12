import { useState } from 'react'
import { Pencil, X, Check, Trash2 } from 'lucide-react'
import { useInsuranceStore, type InsuranceProfile } from '@/store/appStore'
import { INSURANCE_LABELS, type InsuranceType } from '@/lib/cost-estimator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import InsuranceCard from './InsuranceCard'
import InsuranceCardScanner from './InsuranceCardScanner'
import LocationDetector from './LocationDetector'
import type { ScannedCard } from '@/lib/card-scanner'
import type { DetectedLocation } from '@/lib/types'
import { useSession } from '@/lib/auth-client'

const INSURANCE_OPTIONS = Object.entries(INSURANCE_LABELS) as [InsuranceType, string][]
const PLAN_TYPES = ['HMO', 'PPO', 'EPO', 'HDHP'] as const

type TextField = Extract<
  keyof InsuranceProfile,
  | 'issuerName' | 'planName' | 'memberId' | 'groupNumber' | 'insurerPhone'
  | 'effectiveDate' | 'coverageEndDate' | 'annualDeductible' | 'copayPerVisit'
  | 'outOfPocketMax' | 'monthlyPremium' | 'pcpName'
>

const TEXT_FIELDS: [TextField, string, string][] = [
  ['issuerName', 'Insurance Company Name', 'e.g. Blue Cross Blue Shield'],
  ['planName', 'Plan Name', 'e.g. BlueCare Silver PPO'],
  ['memberId', 'Member ID', 'From your insurance card'],
  ['groupNumber', 'Group Number', 'From your insurance card'],
  ['insurerPhone', 'Customer Service Phone', '1-800-XXX-XXXX'],
  ['effectiveDate', 'Coverage Start Date', 'MM/DD/YYYY'],
  ['coverageEndDate', 'Coverage End Date', 'MM/DD/YYYY'],
  ['annualDeductible', 'Annual Deductible ($)', 'e.g. 3000'],
  ['copayPerVisit', 'Copay Per Visit ($)', 'e.g. 25'],
  ['outOfPocketMax', 'Out-of-Pocket Maximum ($)', 'e.g. 7000'],
  ['monthlyPremium', 'Monthly Premium ($)', 'e.g. 285'],
  ['pcpName', 'Primary Care Physician (optional)', 'Dr. Name'],
]

export default function InsuranceProfileForm() {
  const { profile, updateField, applyScannedCard, clearProfile } = useInsuranceStore()
  const { data: session } = useSession()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<InsuranceProfile>(profile)

  const hasProfile = Boolean(
    profile.insuranceType || profile.planName || profile.memberId || profile.issuerName,
  )
  const locationDisplay = profile.city
    ? [profile.city, profile.stateCode, profile.zip].filter(Boolean).join(', ')
    : profile.zip || ''

  function startEdit() {
    setDraft({ ...profile })
    setEditing(true)
  }

  function saveEdit() {
    ;(Object.keys(draft) as (keyof InsuranceProfile)[]).forEach(key => {
      updateField(key, draft[key] as never)
    })
    setEditing(false)
  }

  function cancelEdit() {
    setDraft({ ...profile })
    setEditing(false)
  }

  function setDraftField<K extends keyof InsuranceProfile>(field: K, value: InsuranceProfile[K]) {
    setDraft(d => ({ ...d, [field]: value }))
  }

  function handleScan(card: ScannedCard) {
    applyScannedCard(card)
  }

  function handleLocation(loc: DetectedLocation) {
    updateField('city', loc.city)
    updateField('state', loc.state)
    updateField('stateCode', loc.stateCode)
    updateField('zip', loc.zip)
  }

  if (!editing && hasProfile) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-xl font-semibold">Insurance Profile</h1>
            {locationDisplay && (
              <p className="text-xs text-muted-foreground">{locationDisplay}</p>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={startEdit}>
            <Pencil size={13} className="mr-1.5" />
            Edit
          </Button>
        </div>

        <InsuranceCard
          profile={profile}
          memberName={session?.user?.name ?? undefined}
        />

        {profile.insuranceType && (
          <div className="rounded-lg border bg-muted/30 px-3 py-2 text-xs">
            <span className="text-muted-foreground">Insurance type:</span>
            <span className="ml-1.5 font-medium">
              {INSURANCE_LABELS[profile.insuranceType as InsuranceType]}
            </span>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          className="w-full border-destructive/40 text-destructive hover:bg-destructive/5"
          onClick={clearProfile}
        >
          <Trash2 size={13} className="mr-1.5" />
          Clear Profile
        </Button>
      </div>
    )
  }

  const val = (field: TextField) =>
    editing ? String(draft[field] ?? '') : String(profile[field] ?? '')

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h1 className="font-heading text-xl font-semibold">Insurance Profile</h1>
          <p className="text-sm text-muted-foreground">
            Save your info to get personalized cost estimates.
          </p>
        </div>
        {editing && (
          <div className="flex shrink-0 gap-1.5">
            <Button size="sm" variant="outline" onClick={cancelEdit}>
              <X size={13} />
            </Button>
            <Button size="sm" onClick={saveEdit}>
              <Check size={13} className="mr-1" />
              Save
            </Button>
          </div>
        )}
      </div>

      {!editing && (
        <>
          <div className="rounded-lg border bg-card p-4">
            <h2 className="mb-3 text-sm font-semibold">Scan Your Card</h2>
            <InsuranceCardScanner onScan={handleScan} />
          </div>
          <Separator />
        </>
      )}

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="insuranceType">Insurance Type</Label>
          <select
            id="insuranceType"
            value={editing ? draft.insuranceType : profile.insuranceType}
            onChange={e => {
              const v = e.target.value as InsuranceType
              editing ? setDraftField('insuranceType', v) : updateField('insuranceType', v)
            }}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Select insurance type...</option>
            {INSURANCE_OPTIONS.map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label>Plan Type</Label>
          <div className="flex flex-wrap gap-2">
            {PLAN_TYPES.map(pt => {
              const current = editing ? draft.planType : profile.planType
              return (
                <button
                  key={pt}
                  type="button"
                  onClick={() =>
                    editing ? setDraftField('planType', pt) : updateField('planType', pt)
                  }
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    current === pt
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  {pt}
                </button>
              )
            })}
          </div>
        </div>

        {TEXT_FIELDS.map(([field, label, placeholder]) => (
          <div key={field} className="space-y-1.5">
            <Label htmlFor={field}>{label}</Label>
            <Input
              id={field}
              value={val(field)}
              onChange={e =>
                editing
                  ? setDraftField(field, e.target.value as never)
                  : updateField(field, e.target.value as never)
              }
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

      {!editing && hasProfile && (
        <Button
          variant="outline"
          size="sm"
          className="w-full border-destructive/40 text-destructive hover:bg-destructive/5"
          onClick={clearProfile}
        >
          <Trash2 size={13} className="mr-1.5" />
          Clear Profile
        </Button>
      )}

      {editing && (
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={cancelEdit}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={saveEdit}>
            Save Changes
          </Button>
        </div>
      )}
    </div>
  )
}
