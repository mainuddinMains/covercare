import type { HospitalPrice } from './types'

// CMS Medicare Inpatient Hospitals by Provider and Service (2023 data, no key required)
const CMS_INPATIENT_DATASET = '690ddc6c-2767-4618-b277-420ffb2bf27c'
const CMS_BASE = `https://data.cms.gov/data-api/v1/dataset/${CMS_INPATIENT_DATASET}/data`

interface CmsInpatientRow {
  Rndrng_Prvdr_Org_Name?: string
  Rndrng_Prvdr_City?: string
  Rndrng_Prvdr_State_Abrvtn?: string
  DRG_Cd?: string
  DRG_Desc?: string
  Tot_Dschrgs?: string
  Avg_Tot_Pymt_Amt?: string
  Avg_Mdcr_Pymt_Amt?: string
}

export async function lookupHospitalPrices(
  drgKeyword: string,
  state?: string,
  limit = 20,
): Promise<HospitalPrice[]> {
  // The data-api filter requires exact DRG code matches, so we first try
  // treating the keyword as a DRG code. If it looks like a number, filter
  // by DRG_Cd directly. Otherwise we fetch a broader set and filter client-side
  // by description keyword.
  const params = new URLSearchParams({ size: String(limit) })

  const isNumeric = /^\d{1,3}$/.test(drgKeyword.trim())
  if (isNumeric) {
    params.set('filter[DRG_Cd]', drgKeyword.trim())
  }
  if (state) {
    params.set('filter[Rndrng_Prvdr_State_Abrvtn]', state.toUpperCase())
  }
  if (!isNumeric) {
    // Fetch more rows so we can filter by keyword client-side
    params.set('size', String(limit * 5))
  }

  const res = await fetch(`${CMS_BASE}?${params}`)
  if (!res.ok) throw new Error(`CMS Hospital Prices API error: ${res.status}`)

  let rows: CmsInpatientRow[] = await res.json()

  if (!isNumeric) {
    const upper = drgKeyword.toUpperCase()
    rows = rows.filter((r) =>
      (r.DRG_Desc ?? '').toUpperCase().includes(upper),
    )
    rows = rows.slice(0, limit)
  }

  return rows.map((r) => ({
    hospitalName: r.Rndrng_Prvdr_Org_Name ?? 'Unknown Hospital',
    city: r.Rndrng_Prvdr_City ?? '',
    state: r.Rndrng_Prvdr_State_Abrvtn ?? '',
    procedureCode: r.DRG_Cd ?? '',
    procedureDescription: r.DRG_Desc ?? '',
    averageTotalPayments: parseFloat(r.Avg_Tot_Pymt_Amt ?? '0') || 0,
    averageMedicarePayments: parseFloat(r.Avg_Mdcr_Pymt_Amt ?? '0') || 0,
    discharges: parseInt(r.Tot_Dschrgs ?? '0', 10) || 0,
  }))
}
