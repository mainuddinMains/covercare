import type { Provider } from './types'

// Zocdoc Partner API - requires business partnership + ZOCDOC_API_KEY
// Apply at: https://www.zocdoc.com/about/developer-api/
// Base URL may differ per partnership agreement

interface ZocdocProvider {
  id?: string
  firstName?: string
  lastName?: string
  credentials?: string
  specialty?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zip?: string
  }
  phone?: string
  npi?: string
}

interface ZocdocResponse {
  providers?: ZocdocProvider[]
}

export async function findZocdocProviders(
  lat: number,
  lng: number,
  specialty: string,
  insurance: string,
  apiKey: string,
  limit = 15,
): Promise<Provider[]> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
    specialty,
    insurance_plan: insurance,
    limit: String(limit),
  })

  const res = await fetch(
    `https://api.zocdoc.com/v2/providers?${params}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
    },
  )

  if (!res.ok) throw new Error(`Zocdoc API error: ${res.status}`)

  const data: ZocdocResponse = await res.json()
  const providers = data?.providers ?? []

  return providers.map((p) => ({
    npi: p.npi ?? p.id ?? '',
    name: [p.firstName, p.lastName].filter(Boolean).join(' '),
    credential: p.credentials,
    specialty: p.specialty,
    address: p.address?.street ?? '',
    city: p.address?.city ?? '',
    state: p.address?.state ?? '',
    zip: p.address?.zip ?? '',
    phone: p.phone,
  }))
}
