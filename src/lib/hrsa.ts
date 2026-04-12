import type { Clinic } from './types'

const BASE = 'https://findahealthcenter.hrsa.gov/api/v2/get-health-centers'

interface HrsaResult {
  id: string
  site_name: string
  physical_address_1: string
  physical_city: string
  physical_state: string
  physical_zip_code: string
  telephone: string
  site_web_address?: string
  latitude?: number
  longitude?: number
}

export async function findClinics(
  zip: string,
  radius = 25,
): Promise<Clinic[]> {
  const params = new URLSearchParams({
    address: zip,
    radius: String(radius),
    pageNumber: '1',
    pageSize: '10',
  })

  const res = await fetch(`${BASE}?${params}`)
  if (!res.ok) throw new Error(`HRSA API error: ${res.status}`)

  const data = await res.json()
  const results: HrsaResult[] = data?.data ?? []

  return results.map((r) => ({
    id: r.id,
    name: r.site_name,
    address: r.physical_address_1,
    city: r.physical_city,
    state: r.physical_state,
    zip: r.physical_zip_code,
    phone: r.telephone,
    url: r.site_web_address,
    latitude: r.latitude,
    longitude: r.longitude,
  }))
}
