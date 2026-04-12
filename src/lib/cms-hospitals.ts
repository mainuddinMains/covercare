const DISTRIBUTION_ID = 'ae3f2207-fca8-50d5-9fd5-d6a7d3426ee3'
const BASE_URL = `https://data.cms.gov/provider-data/api/1/datastore/query/${DISTRIBUTION_ID}`

export interface CMSHospital {
  facilityId: string
  name: string
  address: string
  city: string
  state: string
  zip: string
  phone: string
  type: string
  ownership: string
  emergencyServices: boolean
  overallRating: number | null
}

interface CMSRow {
  facility_id: string
  facility_name: string
  address: string
  citytown: string
  state: string
  zip_code: string
  telephone_number: string
  hospital_type: string
  hospital_ownership: string
  emergency_services: string
  hospital_overall_rating: string
}

function parseRating(raw: string): number | null {
  const n = parseInt(raw, 10)
  return Number.isNaN(n) ? null : n
}

function titleCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function parseRow(row: CMSRow): CMSHospital {
  return {
    facilityId: row.facility_id,
    name: titleCase(row.facility_name),
    address: titleCase(row.address),
    city: titleCase(row.citytown),
    state: row.state,
    zip: row.zip_code,
    phone: row.telephone_number,
    type: row.hospital_type,
    ownership: row.hospital_ownership,
    emergencyServices: row.emergency_services === 'Yes',
    overallRating: parseRating(row.hospital_overall_rating),
  }
}

async function queryHospitals(
  value: string,
  operator: '=' | 'LIKE',
  limit: number,
): Promise<CMSHospital[]> {
  const url = new URL(BASE_URL)
  url.searchParams.set('limit', String(limit))
  url.searchParams.set('offset', '0')
  url.searchParams.set('conditions[0][property]', 'zip_code')
  url.searchParams.set('conditions[0][value]', value)
  url.searchParams.set('conditions[0][operator]', operator)

  const res = await fetch(url.toString())
  if (!res.ok) return []

  const data = (await res.json()) as { results?: CMSRow[] }
  return (data.results ?? []).map(parseRow)
}

export interface HospitalSearchResult {
  hospitals: CMSHospital[]
  widened: boolean
}

export async function searchHospitalsByZip(
  zip: string,
): Promise<HospitalSearchResult> {
  // Try exact ZIP first
  const exact = await queryHospitals(zip, '=', 20)
  if (exact.length >= 3) {
    return { hospitals: exact, widened: false }
  }

  // Widen to 3-digit ZIP prefix (covers the regional area)
  const prefix = zip.slice(0, 3)
  const wide = await queryHospitals(`${prefix}%`, 'LIKE', 25)

  // Deduplicate: exact results first, then nearby, sorted by ZIP proximity
  const exactIds = new Set(exact.map((h) => h.facilityId))
  const nearby = wide.filter((h) => !exactIds.has(h.facilityId))

  // Sort nearby by how close their ZIP is numerically
  const zipNum = parseInt(zip, 10)
  nearby.sort(
    (a, b) =>
      Math.abs(parseInt(a.zip, 10) - zipNum) -
      Math.abs(parseInt(b.zip, 10) - zipNum),
  )

  return {
    hospitals: [...exact, ...nearby].slice(0, 20),
    widened: nearby.length > 0,
  }
}
