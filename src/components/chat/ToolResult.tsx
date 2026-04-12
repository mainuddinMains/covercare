import { useState } from 'react'
import {
  Star,
  Phone,
  Siren,
  Building2,
  DollarSign,
  MapPin,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  Video,
} from 'lucide-react'
import type { CMSHospital, HospitalSearchResult } from '@/lib/cms-hospitals'
import type { CMSPhysician, PhysicianSearchResult } from '@/lib/cms-physicians'
import type { CostEstimate } from '@/lib/cost-estimator'

interface Props {
  name: string
  output: unknown
}

export default function ToolResult({ name, output }: Props) {
  if (!output || typeof output !== 'object') return null

  switch (name) {
    case 'search_hospitals':
      return <HospitalResults data={output as HospitalSearchResult} />
    case 'search_providers':
      return <ProviderResults data={output as PhysicianSearchResult} />
    case 'estimate_cost':
      return <CostResult data={output as CostEstimate} />
    case 'detect_location':
      return <LocationPill data={output as LocationOutput} />
    default:
      return null
  }
}

// ── Hospital Results ──

function HospitalResults({ data }: { data: HospitalSearchResult }) {
  const [expanded, setExpanded] = useState(false)
  if ('error' in data) return null
  const { hospitals, widened } = data
  if (!hospitals?.length) return null

  const visible = expanded ? hospitals : hospitals.slice(0, 3)
  const hasMore = hospitals.length > 3

  return (
    <div className="space-y-2">
      {widened && (
        <p className="text-[11px] text-muted-foreground">
          Showing hospitals in the wider area
        </p>
      )}
      <div className="grid gap-2">
        {visible.map((h) => (
          <HospitalCard key={h.facilityId} hospital={h} />
        ))}
      </div>
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-center gap-1 rounded-lg border border-border py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          {expanded ? (
            <>
              Show less
              <ChevronUp size={12} />
            </>
          ) : (
            <>
              Show {hospitals.length - 3} more
              <ChevronDown size={12} />
            </>
          )}
        </button>
      )}
    </div>
  )
}

function HospitalCard({ hospital: h }: { hospital: CMSHospital }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="mb-1.5 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[13px] font-semibold leading-tight">{h.name}</p>
          <p className="text-[11px] text-muted-foreground">
            {h.address}, {h.city}, {h.state} {h.zip}
          </p>
        </div>
        {h.emergencyServices && (
          <span className="flex shrink-0 items-center gap-0.5 rounded-full bg-destructive px-1.5 py-0.5 text-[10px] font-medium text-destructive-foreground">
            <Siren size={9} />
            ER
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-muted-foreground">
        {h.overallRating != null && (
          <span className="flex items-center gap-0.5">
            <Star size={10} className="fill-amber-400 text-amber-400" />
            {h.overallRating}/5
          </span>
        )}
        <span className="flex items-center gap-0.5">
          <Building2 size={10} />
          {h.type}
        </span>
        {h.phone && (
          <a
            href={`tel:${h.phone}`}
            className="flex items-center gap-0.5 text-primary hover:underline"
          >
            <Phone size={10} />
            {h.phone}
          </a>
        )}
      </div>
    </div>
  )
}

// ── Provider Results ──

function ProviderResults({ data }: { data: PhysicianSearchResult }) {
  const [expanded, setExpanded] = useState(false)
  if ('error' in data) return null
  const { physicians, widened } = data
  if (!physicians?.length) return null

  const visible = expanded ? physicians : physicians.slice(0, 3)
  const hasMore = physicians.length > 3

  return (
    <div className="space-y-2">
      {widened && (
        <p className="text-[11px] text-muted-foreground">
          Showing providers in the wider area
        </p>
      )}
      <div className="grid gap-2">
        {visible.map((p) => (
          <ProviderCard key={p.npi} provider={p} />
        ))}
      </div>
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-center gap-1 rounded-lg border border-border py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          {expanded ? (
            <>
              Show less
              <ChevronUp size={12} />
            </>
          ) : (
            <>
              Show {physicians.length - 3} more
              <ChevronDown size={12} />
            </>
          )}
        </button>
      )}
    </div>
  )
}

function ProviderCard({ provider: p }: { provider: CMSPhysician }) {
  const name = `${p.firstName} ${p.lastName}`
  const location = [p.address, p.city, `${p.state} ${p.zip}`]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="mb-1.5 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[13px] font-semibold leading-tight">
            {name}
            {p.credential && (
              <span className="ml-1 font-normal text-muted-foreground">
                {p.credential}
              </span>
            )}
          </p>
          <p className="text-[11px] text-muted-foreground">{location}</p>
        </div>
        {p.telehealth && (
          <span className="flex shrink-0 items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
            <Video size={9} />
            Telehealth
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-0.5">
          <Stethoscope size={10} />
          {p.specialty}
        </span>
        {p.facilityName && (
          <span className="flex items-center gap-0.5">
            <Building2 size={10} />
            {p.facilityName}
          </span>
        )}
        {p.phone && (
          <a
            href={`tel:${p.phone}`}
            className="flex items-center gap-0.5 text-primary hover:underline"
          >
            <Phone size={10} />
            {p.phone}
          </a>
        )}
      </div>
    </div>
  )
}

// ── Cost Result ──

function CostResult({ data }: { data: CostEstimate }) {
  if ('error' in data) return null

  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
          <DollarSign size={14} className="text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold">{data.procedure}</p>
          <p className="text-[10px] text-muted-foreground">
            CPT {data.cpt} | {data.insuranceLabel}
          </p>
        </div>
      </div>

      {data.medicareRate != null ? (
        <div className="mb-2 grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-muted/60 p-2">
            <p className="text-[9px] font-medium uppercase text-muted-foreground">
              Your estimated cost
            </p>
            <p className="text-sm font-bold text-primary">
              ${data.outOfPocketLow} - ${data.outOfPocketHigh}
            </p>
          </div>
          <div className="rounded-lg bg-muted/60 p-2">
            <p className="text-[9px] font-medium uppercase text-muted-foreground">
              Total billed
            </p>
            <p className="text-sm font-bold">
              ${data.totalEstimatedCost?.toLocaleString()}
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-2 rounded-lg bg-muted/60 p-2 text-center">
          <p className="text-xs text-muted-foreground">
            Cost data not available for this procedure
          </p>
        </div>
      )}

      <p className="text-[10px] text-muted-foreground">{data.note}</p>
    </div>
  )
}

// ── Location Pill ──

interface LocationOutput {
  zip?: string
  city?: string
  state?: string
  stateCode?: string
  error?: string
}

function LocationPill({ data }: { data: LocationOutput }) {
  if (data.error || !data.zip) return null

  const label = [data.city, data.stateCode, data.zip]
    .filter(Boolean)
    .join(', ')

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
      <MapPin size={10} />
      {label}
    </span>
  )
}
