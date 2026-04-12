import type { InsurancePlan } from './types'

// CMS Marketplace API v1 - no API key required
// Docs: https://marketplaceapi.cms.gov/docs/
const CMS_BASE = 'https://marketplace.api.healthcare.gov/api/v1'

interface CmsPlan {
  id?: string
  name?: string
  issuer?: { name?: string }
  type?: string
  premium?: number
  deductibles?: Array<{ amount?: number; type?: string }>
  metal_level?: string
  brochure_url?: string
}

interface CmsResponse {
  plans?: CmsPlan[]
  total?: number
}

export async function findPlans(
  zip: string,
  year = 2025,
  apiKey?: string,
): Promise<InsurancePlan[]> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }
  if (apiKey) {
    headers['apikey'] = apiKey
  }

  const params = new URLSearchParams({
    zipcode: zip,
    year: String(year),
    market: 'Individual',
    limit: '20',
    offset: '0',
  })

  const res = await fetch(`${CMS_BASE}/plans/search?${params}`, { headers })

  if (!res.ok) throw new Error(`CMS Marketplace API error: ${res.status}`)

  const data: CmsResponse = await res.json()
  const plans = data?.plans ?? []

  return plans.map((p) => {
    const medDeductible = (p.deductibles ?? []).find(
      (d) => d.type?.toLowerCase().includes('medical'),
    )
    return {
      id: p.id ?? '',
      name: p.name ?? 'Unknown Plan',
      issuer: p.issuer?.name ?? '',
      type: p.type ?? '',
      premium: p.premium ?? 0,
      deductible: medDeductible?.amount ?? 0,
      metalLevel: p.metal_level ?? '',
      url: p.brochure_url,
    }
  })
}
