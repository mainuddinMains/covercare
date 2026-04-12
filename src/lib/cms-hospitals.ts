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

export async function searchHospitalsByZip(
  zip: string,
): Promise<CMSHospital[]> {
  const url = new URL(BASE_URL)
  url.searchParams.set('limit', '20')
  url.searchParams.set('offset', '0')
  url.searchParams.set('conditions[0][property]', 'zip_code')
  url.searchParams.set('conditions[0][value]', zip)
  url.searchParams.set('conditions[0][operator]', '=')

  const res = await fetch(url.toString())
  if (!res.ok) return []

  const data = (await res.json()) as { results?: CMSRow[] }
  return (data.results ?? []).map(parseRow)
}
