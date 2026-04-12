const DISTRIBUTION_ID = '101696ea-3f2a-5fbc-9789-8180a18d3080'
const BASE_URL = `https://data.cms.gov/provider-data/api/1/datastore/query/${DISTRIBUTION_ID}`

export interface CMSPhysician {
  npi: string
  firstName: string
  lastName: string
  credential: string
  specialty: string
  facilityName: string
  address: string
  city: string
  state: string
  zip: string
  phone: string
  telehealth: boolean
}

interface CMSRow {
  npi: string
  provider_first_name: string
  provider_last_name: string
  cred: string
  pri_spec: string
  facility_name: string
  adr_ln_1: string
  citytown: string
  state: string
  zip_code: string
  telephone_number: string
  telehlth: string
}

function titleCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function parseRow(row: CMSRow): CMSPhysician {
  return {
    npi: row.npi,
    firstName: titleCase(row.provider_first_name),
    lastName: titleCase(row.provider_last_name),
    credential: row.cred,
    specialty: titleCase(row.pri_spec),
    facilityName: row.facility_name ? titleCase(row.facility_name) : '',
    address: row.adr_ln_1 ? titleCase(row.adr_ln_1) : '',
    city: titleCase(row.citytown),
    state: row.state,
    zip: row.zip_code,
    phone: row.telephone_number,
    telehealth: row.telehlth === 'Y',
  }
}

export interface PhysicianSearchResult {
  physicians: CMSPhysician[]
  widened: boolean
}

async function queryPhysicians(
  zipValue: string,
  zipOperator: '=' | 'LIKE',
  specialty?: string,
  limit = 20,
): Promise<CMSPhysician[]> {
  const url = new URL(BASE_URL)
  url.searchParams.set('limit', String(limit))
  url.searchParams.set('offset', '0')
  url.searchParams.set('conditions[0][property]', 'zip_code')
  url.searchParams.set('conditions[0][value]', zipValue)
  url.searchParams.set('conditions[0][operator]', zipOperator)

  if (specialty) {
    url.searchParams.set('conditions[1][property]', 'pri_spec')
    url.searchParams.set('conditions[1][value]', `%${specialty.toUpperCase()}%`)
    url.searchParams.set('conditions[1][operator]', 'LIKE')
  }

  const res = await fetch(url.toString())
  if (!res.ok) return []

  const data = (await res.json()) as { results?: CMSRow[] }
  const rows = data.results ?? []

  // Deduplicate by NPI (same doctor can appear multiple times for different addresses)
  const seen = new Set<string>()
  const unique: CMSRow[] = []
  for (const row of rows) {
    if (!seen.has(row.npi)) {
      seen.add(row.npi)
      unique.push(row)
    }
  }

  return unique.map(parseRow)
}

export async function searchPhysicians(
  zip: string,
  specialty?: string,
): Promise<PhysicianSearchResult> {
  // Try exact ZIP first
  const exact = await queryPhysicians(zip, '=', specialty)
  if (exact.length >= 3) {
    return { physicians: exact, widened: false }
  }

  // Widen to 3-digit ZIP prefix
  const prefix = zip.slice(0, 3)
  const wide = await queryPhysicians(`${prefix}%`, 'LIKE', specialty, 30)

  const exactNpis = new Set(exact.map((p) => p.npi))
  const nearby = wide.filter((p) => !exactNpis.has(p.npi))

  const zipNum = parseInt(zip, 10)
  nearby.sort(
    (a, b) =>
      Math.abs(parseInt(a.zip, 10) - zipNum) -
      Math.abs(parseInt(b.zip, 10) - zipNum),
  )

  return {
    physicians: [...exact, ...nearby].slice(0, 20),
    widened: nearby.length > 0,
  }
}
