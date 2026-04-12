import type { InsurancePlan } from './types'

const RESOURCE_ID = '35e06197-7d51-4fbb-809b-6e408c0b4bbd'

interface RawPlan {
  plan_id?: string
  plan_marketing_name?: string
  issuer_name?: string
  plan_type?: string
  individual_rate?: string
  medical_deductible_individual_standard?: string
  metal_level?: string
  brochure_url?: string
}

export async function findPlans(
  zip: string,
  year = 2024,
): Promise<InsurancePlan[]> {
  const body = {
    resource_id: RESOURCE_ID,
    filters: [
      { property: 'zip_code', value: zip },
      { property: 'plan_year', value: String(year) },
    ],
    limit: 20,
    offset: 0,
  }

  const res = await fetch(
    `https://data.healthcare.gov/api/1/datastore/query/${RESOURCE_ID}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  )

  if (!res.ok) throw new Error(`Healthcare.gov API error: ${res.status}`)

  const data = (await res.json()) as { results?: RawPlan[] }
  const results = data?.results ?? []

  return results.map((p) => ({
    id: p.plan_id ?? '',
    name: p.plan_marketing_name ?? 'Unknown Plan',
    issuer: p.issuer_name ?? '',
    type: p.plan_type ?? '',
    premium: parseFloat(p.individual_rate ?? '0') || 0,
    deductible:
      parseFloat(p.medical_deductible_individual_standard ?? '0') || 0,
    metalLevel: p.metal_level ?? '',
    url: p.brochure_url,
  }))
}
