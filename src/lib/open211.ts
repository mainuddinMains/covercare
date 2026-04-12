import type { SocialService } from './types'

// Open211 API - requires OPEN211_API_KEY
// Apply at: https://api.211.org/
// Uses the Taxonomy of Human Services for categorization

interface Open211Service {
  id?: string
  organization?: {
    name?: string
    description?: string
    phones?: Array<{ number?: string }>
    url?: string
  }
  location?: {
    address?: {
      address_1?: string
      city?: string
      state_province?: string
      postal_code?: string
    }
  }
  taxonomies?: Array<{ name?: string }>
  eligibility?: string
}

interface Open211Response {
  services?: Open211Service[]
}

export async function findSocialServices(
  lat: number,
  lng: number,
  keyword = 'health',
  apiKey: string,
  radius = 10,
  limit = 20,
): Promise<SocialService[]> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
    radius: String(radius),
    keyword,
    per_page: String(limit),
    response_fields: 'services',
  })

  const res = await fetch(
    `https://api.211.org/search/v1/services?${params}`,
    {
      headers: {
        'X-API-Key': apiKey,
        Accept: 'application/json',
      },
    },
  )

  if (!res.ok) throw new Error(`Open211 API error: ${res.status}`)

  const data: Open211Response = await res.json()
  const services = data?.services ?? []

  return services.map((s) => {
    const org = s.organization ?? {}
    const loc = s.location?.address ?? {}
    const phones = org.phones ?? []
    return {
      id: s.id ?? '',
      name: org.name ?? 'Unknown Service',
      description: org.description ?? '',
      address: loc.address_1 ?? '',
      city: loc.city ?? '',
      state: loc.state_province ?? '',
      zip: loc.postal_code ?? '',
      phone: phones[0]?.number,
      website: org.url,
      categories: (s.taxonomies ?? []).map((t) => t.name ?? '').filter(Boolean),
      eligibility: s.eligibility,
    }
  })
}
