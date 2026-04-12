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
  ShieldCheck,
  ShieldX,
  CircleDollarSign,
  HeartHandshake,
  Pill,
  Globe,
  Check,
  X,
} from 'lucide-react'
import type { CMSHospital, HospitalSearchResult } from '@/lib/cms-hospitals'
import type { CMSPhysician, PhysicianSearchResult } from '@/lib/cms-physicians'
import type { CostEstimate } from '@/lib/cost-estimator'
import type { HospitalPrice, Clinic } from '@/lib/types'
import type { EligibilityResult } from '@/lib/assistance-eligibility'
import type { DrugInfo, DrugAlternative } from '@/lib/fda-drugs'
import { usePreferencesStore } from '@/store/appStore'
import { translations } from '@/lib/i18n'

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
    case 'compare_hospital_prices':
      return (
        <HospitalPriceResults
          data={output as { prices: HospitalPrice[] } | { error: string }}
        />
      )
    case 'check_assistance_eligibility':
      return (
        <EligibilityResultCard
          data={output as EligibilityResult | { error: string }}
        />
      )
    case 'find_community_health_centers':
      return (
        <HealthCenterResults
          data={output as { clinics: Clinic[] } | { error: string }}
        />
      )
    case 'search_drug_info':
      return (
        <DrugInfoResults
          data={
            output as
              | { results: DrugInfo[] }
              | { alternatives: DrugAlternative[] }
              | { error: string }
          }
        />
      )
    case 'detect_location':
      return <LocationPill data={output as LocationOutput} />
    default:
      return null
  }
}

// Hospital Results

function HospitalResults({ data }: { data: HospitalSearchResult }) {
  const [expanded, setExpanded] = useState(false)
  const locale = usePreferencesStore((s) => s.locale)
  const t = translations[locale]

  if ('error' in data) return null
  const { hospitals, widened } = data
  if (!hospitals?.length) return null

  const visible = expanded ? hospitals : hospitals.slice(0, 3)
  const hasMore = hospitals.length > 3

  return (
    <div className="space-y-2">
      {widened && (
        <p className="text-[11px] text-muted-foreground">
          {t.tool_wider_area_hospitals}
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
              {t.tool_show_less}
              <ChevronUp size={12} />
            </>
          ) : (
            <>
              {t.tool_show_more(hospitals.length - 3)}
              <ChevronDown size={12} />
            </>
          )}
        </button>
      )}
    </div>
  )
}

function HospitalCard({ hospital: h }: { hospital: CMSHospital }) {
  const locale = usePreferencesStore((s) => s.locale)
  const t = translations[locale]

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
            {t.tool_er}
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

// Provider Results

function ProviderResults({ data }: { data: PhysicianSearchResult }) {
  const [expanded, setExpanded] = useState(false)
  const locale = usePreferencesStore((s) => s.locale)
  const t = translations[locale]

  if ('error' in data) return null
  const { physicians, widened } = data
  if (!physicians?.length) return null

  const visible = expanded ? physicians : physicians.slice(0, 3)
  const hasMore = physicians.length > 3

  return (
    <div className="space-y-2">
      {widened && (
        <p className="text-[11px] text-muted-foreground">
          {t.tool_wider_area_providers}
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
              {t.tool_show_less}
              <ChevronUp size={12} />
            </>
          ) : (
            <>
              {t.tool_show_more(physicians.length - 3)}
              <ChevronDown size={12} />
            </>
          )}
        </button>
      )}
    </div>
  )
}

function ProviderCard({ provider: p }: { provider: CMSPhysician }) {
  const locale = usePreferencesStore((s) => s.locale)
  const t = translations[locale]

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
            {t.tool_telehealth}
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

// Cost Result

function CostResult({ data }: { data: CostEstimate }) {
  const locale = usePreferencesStore((s) => s.locale)
  const t = translations[locale]

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
              {t.tool_estimated_cost}
            </p>
            <p className="text-sm font-bold text-primary">
              ${data.outOfPocketLow} - ${data.outOfPocketHigh}
            </p>
          </div>
          <div className="rounded-lg bg-muted/60 p-2">
            <p className="text-[9px] font-medium uppercase text-muted-foreground">
              {t.tool_total_billed}
            </p>
            <p className="text-sm font-bold">
              ${data.totalEstimatedCost?.toLocaleString()}
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-2 rounded-lg bg-muted/60 p-2 text-center">
          <p className="text-xs text-muted-foreground">
            {t.tool_cost_unavailable}
          </p>
        </div>
      )}

      <p className="text-[10px] text-muted-foreground">{data.note}</p>
    </div>
  )
}

// Hospital Price Results

function HospitalPriceResults({
  data,
}: {
  data: { prices: HospitalPrice[] } | { error: string }
}) {
  const [expanded, setExpanded] = useState(false)
  const locale = usePreferencesStore((s) => s.locale)
  const t = translations[locale]

  if ('error' in data) return null
  const { prices } = data
  if (!prices?.length) return null

  const visible = expanded ? prices : prices.slice(0, 3)
  const hasMore = prices.length > 3

  return (
    <div className="space-y-2">
      <div className="grid gap-2">
        {visible.map((p, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-3">
            <div className="mb-1.5">
              <p className="text-[13px] font-semibold leading-tight">
                {p.hospitalName}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {p.city}, {p.state}
                {p.procedureDescription && (
                  <span className="ml-1">
                    | {p.procedureDescription}
                  </span>
                )}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[11px]">
              <span className="flex items-center gap-0.5">
                <DollarSign size={10} className="text-primary" />
                <span className="text-muted-foreground">{t.tool_avg_total}</span>{' '}
                <span className="font-semibold">
                  ${p.averageTotalPayments.toLocaleString()}
                </span>
              </span>
              <span className="flex items-center gap-0.5">
                <DollarSign size={10} className="text-muted-foreground" />
                <span className="text-muted-foreground">{t.tool_medicare_pays}</span>{' '}
                <span className="font-semibold">
                  ${p.averageMedicarePayments.toLocaleString()}
                </span>
              </span>
              {p.discharges > 0 && (
                <span className="text-muted-foreground">
                  {t.tool_cases(p.discharges.toLocaleString())}
                </span>
              )}
            </div>
          </div>
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
              {t.tool_show_less}
              <ChevronUp size={12} />
            </>
          ) : (
            <>
              {t.tool_show_more(prices.length - 3)}
              <ChevronDown size={12} />
            </>
          )}
        </button>
      )}
    </div>
  )
}

// ── Eligibility Result ──

function EligibilityResultCard({
  data,
}: {
  data: EligibilityResult | { error: string }
}) {
  if ('error' in data) return null

  return (
    <div className="rounded-xl border border-border bg-card p-3 space-y-2.5">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
          <HeartHandshake size={14} className="text-primary" />
        </div>
        <div>
          <p className="text-[13px] font-semibold">Financial Assistance Check</p>
          <p className="text-[10px] text-muted-foreground">
            {data.fplPercentage}% of Federal Poverty Level
          </p>
        </div>
      </div>

      <div className="grid gap-1.5">
        <EligibilityRow
          icon={data.medicaid.likelyEligible ? ShieldCheck : ShieldX}
          label="Medicaid"
          eligible={data.medicaid.likelyEligible}
          note={data.medicaid.note}
        />
        <EligibilityRow
          icon={CircleDollarSign}
          label="Sliding-scale fees"
          eligible={data.slidingScale.eligible}
          note={data.slidingScale.note}
          highlight={data.slidingScale.bracket?.label}
        />
        <EligibilityRow
          icon={ShieldCheck}
          label="ACA subsidies"
          eligible={data.acaSubsidy.eligible}
          note={data.acaSubsidy.note}
        />
      </div>

      {data.coverageGap && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-2 dark:border-amber-700 dark:bg-amber-950/30">
          <p className="text-[11px] font-medium text-amber-800 dark:text-amber-200">
            You may be in the coverage gap. Community health centers can still help.
          </p>
        </div>
      )}

      <div className="rounded-lg bg-primary/5 p-2">
        <p className="text-[11px] font-medium text-primary">
          {data.topRecommendation}
        </p>
      </div>
    </div>
  )
}

function EligibilityRow({
  icon: Icon,
  label,
  eligible,
  note,
  highlight,
}: {
  icon: typeof ShieldCheck
  label: string
  eligible: boolean
  note: string
  highlight?: string
}) {
  return (
    <div className="rounded-lg bg-muted/60 p-2">
      <div className="mb-0.5 flex items-center gap-1.5">
        <Icon
          size={12}
          className={eligible ? 'text-emerald-600' : 'text-muted-foreground'}
        />
        <span className="text-[12px] font-medium">{label}</span>
        {eligible ? (
          <span className="flex items-center gap-0.5 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            <Check size={8} />
            {highlight ?? 'Likely eligible'}
          </span>
        ) : (
          <span className="flex items-center gap-0.5 rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
            <X size={8} />
            Unlikely
          </span>
        )}
      </div>
      <p className="text-[10px] text-muted-foreground">{note}</p>
    </div>
  )
}

// ── Health Center Results ──

function HealthCenterResults({
  data,
}: {
  data: { clinics: Clinic[] } | { error: string }
}) {
  const [expanded, setExpanded] = useState(false)
  if ('error' in data) return null
  const { clinics } = data
  if (!clinics?.length) return null

  const visible = expanded ? clinics : clinics.slice(0, 3)
  const hasMore = clinics.length > 3

  return (
    <div className="space-y-2">
      <div className="grid gap-2">
        {visible.map((c) => (
          <div
            key={c.id}
            className="rounded-xl border border-border bg-card p-3"
          >
            <div className="mb-1.5 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[13px] font-semibold leading-tight">
                  {c.name}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {c.address}, {c.city}, {c.state} {c.zip}
                </p>
              </div>
              <span className="flex shrink-0 items-center gap-0.5 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <CircleDollarSign size={9} />
                Sliding scale
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-muted-foreground">
              {c.phone && (
                <a
                  href={`tel:${c.phone}`}
                  className="flex items-center gap-0.5 text-primary hover:underline"
                >
                  <Phone size={10} />
                  {c.phone}
                </a>
              )}
              {c.url && (
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-0.5 text-primary hover:underline"
                >
                  <Globe size={10} />
                  Website
                </a>
              )}
            </div>
          </div>
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
              Show {clinics.length - 3} more
              <ChevronDown size={12} />
            </>
          )}
        </button>
      )}
    </div>
  )
}

// ── Drug Info Results ──

function DrugInfoResults({
  data,
}: {
  data:
    | { results: DrugInfo[] }
    | { alternatives: DrugAlternative[] }
    | { error: string }
}) {
  const [expanded, setExpanded] = useState(false)
  if ('error' in data) return null

  if ('alternatives' in data) {
    const { alternatives } = data
    if (!alternatives?.length) return null

    return (
      <div className="space-y-2">
        <div className="grid gap-2">
          {alternatives.map((a, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-3"
            >
              <p className="text-[13px] font-semibold">{a.brandName}</p>
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                {a.genericName && (
                  <span>Generic: {a.genericName}</span>
                )}
                {a.form && <span>{a.form}</span>}
                {a.route && <span>{a.route}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const { results } = data
  if (!results?.length) return null

  const visible = expanded ? results : results.slice(0, 3)
  const hasMore = results.length > 3

  return (
    <div className="space-y-2">
      <div className="grid gap-2">
        {visible.map((d, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-3"
          >
            <div className="mb-1.5 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[13px] font-semibold leading-tight">
                  {d.brandName}
                </p>
                {d.genericName && (
                  <p className="text-[11px] text-muted-foreground">
                    Generic: {d.genericName}
                  </p>
                )}
              </div>
              {d.isGenericAvailable && (
                <span className="flex shrink-0 items-center gap-0.5 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <Pill size={9} />
                  Generic available
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
              {d.dosageForms.length > 0 && (
                <span>{d.dosageForms.join(', ')}</span>
              )}
              {d.routes.length > 0 && (
                <span>{d.routes.join(', ')}</span>
              )}
            </div>
            {d.purpose && (
              <p className="mt-1.5 text-[11px] text-muted-foreground line-clamp-2">
                {d.purpose}
              </p>
            )}
          </div>
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
              Show {results.length - 3} more
              <ChevronDown size={12} />
            </>
          )}
        </button>
      )}
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
