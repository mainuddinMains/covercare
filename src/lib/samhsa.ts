import type { TreatmentFacility } from './types'

interface SamhsaFacility {
  name1?: string
  street1?: string
  street2?: string
  city?: string
  state?: string
  zip?: string
  phone?: string
  website?: string
  latitude?: string | number
  longitude?: string | number
  services?: Array<{ name?: string }>
  typeFacility?: string[]
  paymentAccepted?: string[]
}

interface SamhsaResponse {
  facilities?: SamhsaFacility[]
}

export async function findTreatmentFacilities(
  lat: number,
  lng: number,
  radius = 25,
): Promise<TreatmentFacility[]> {
  const params = new URLSearchParams({
    sType: 'SA,MH',
    lat: String(lat),
    lng: String(lng),
    distance: String(radius),
    page: '1',
    pageSize: '15',
  })

  const res = await fetch(
    `https://findtreatment.samhsa.gov/locator/listing?${params}`,
  )

  if (!res.ok) throw new Error(`SAMHSA API error: ${res.status}`)

  const data: SamhsaResponse = await res.json()
  const facilities = data?.facilities ?? []

  return facilities.map((f) => {
    const payment = f.paymentAccepted ?? []
    const name = f.name1 ?? 'Unknown Facility'
    return {
      id: `${name}-${f.zip ?? ''}`.replace(/\s+/g, '-').toLowerCase(),
      name,
      address: [f.street1, f.street2].filter(Boolean).join(', '),
      city: f.city ?? '',
      state: f.state ?? '',
      zip: f.zip ?? '',
      phone: f.phone,
      website: f.website,
      lat: parseFloat(String(f.latitude ?? 0)),
      lng: parseFloat(String(f.longitude ?? 0)),
      services: (f.services ?? []).map((s) => s.name ?? '').filter(Boolean),
      acceptsMedicaid: payment.some((p) =>
        p.toLowerCase().includes('medicaid'),
      ),
      acceptsMedicare: payment.some((p) =>
        p.toLowerCase().includes('medicare'),
      ),
      acceptsSlidingFee: payment.some(
        (p) =>
          p.toLowerCase().includes('sliding') ||
          p.toLowerCase().includes('scale'),
      ),
    }
  })
}
