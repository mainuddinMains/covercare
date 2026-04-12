import type { HospitalPrice } from './types'

// CMS Medicare Provider Charge Data via Socrata Open Data API (no key required)
const SOCRATA_BASE =
  'https://data.cms.gov/resource/97k6-zzx3.json'

interface CmsRow {
  provider_name?: string
  provider_city?: string
  provider_state?: string
  drg_definition?: string
  total_discharges?: string
  average_total_payments?: string
  average_medicare_payments?: string
}

export async function lookupHospitalPrices(
  drgKeyword: string,
  state?: string,
  limit = 20,
): Promise<HospitalPrice[]> {
  const params = new URLSearchParams({
    $limit: String(limit),
    $where: `drg_definition like '%${drgKeyword.toUpperCase()}%'`,
    $order: 'total_discharges DESC',
  })

  if (state) {
    params.set(
      '$where',
      `drg_definition like '%${drgKeyword.toUpperCase()}%' AND provider_state='${state}'`,
    )
  }

  const res = await fetch(`${SOCRATA_BASE}?${params}`)
  if (!res.ok) throw new Error(`CMS Hospital Prices API error: ${res.status}`)

  const rows: CmsRow[] = await res.json()

  return rows.map((r) => {
    const def = r.drg_definition ?? ''
    const dashIdx = def.indexOf(' - ')
    return {
      hospitalName: r.provider_name ?? 'Unknown Hospital',
      city: r.provider_city ?? '',
      state: r.provider_state ?? '',
      procedureCode: dashIdx > -1 ? def.slice(0, dashIdx) : def,
      procedureDescription: dashIdx > -1 ? def.slice(dashIdx + 3) : def,
      averageTotalPayments:
        parseFloat(r.average_total_payments ?? '0') || 0,
      averageMedicarePayments:
        parseFloat(r.average_medicare_payments ?? '0') || 0,
      discharges: parseInt(r.total_discharges ?? '0', 10) || 0,
    }
  })
}
