import type { InsurancePlan } from './types'

const CMS_BASE = 'https://marketplace.api.healthcare.gov/api/v1'
const FREE_RESOURCE_ID = '35e06197-7d51-4fbb-809b-6e408c0b4bbd'
const FREE_BASE = `https://data.healthcare.gov/api/1/datastore/query/${FREE_RESOURCE_ID}`

interface CmsMoop {
  amount?: number
  type?: string
}

interface CmsPlan {
  id?: string
  name?: string
  issuer?: { name?: string }
  type?: string
  premium?: number
  premium_w_credit?: number
  deductibles?: Array<{ amount?: number; type?: string }>
  moops?: CmsMoop[]
  metal_level?: string
  brochure_url?: string
}

interface CmsResponse {
  plans?: CmsPlan[]
}

interface FreeRow {
  plan_id?: string
  plan_marketing_name?: string
  issuer_name?: string
  plan_type?: string
  individual_rate?: string
  medical_deductible_individual_standard?: string
  metal_level?: string
  brochure_url?: string
}

function extractMedical(
  items: Array<{ amount?: number; type?: string }> | undefined,
): number {
  return (
    (items ?? []).find((d) => d.type?.toLowerCase().includes('medical'))
      ?.amount ?? 0
  )
}

async function fetchFromCms(
  zip: string,
  year: number,
  apiKey: string,
  householdSize: number,
  income: number,
  age?: number,
): Promise<InsurancePlan[]> {
  const params = new URLSearchParams({
    zipcode: zip,
    year: String(year),
    market: 'Individual',
    limit: '50',
    offset: '0',
    household_size: String(householdSize),
    household_income: String(income),
  })
  if (age && age > 0) params.set('age', String(age))

  const res = await fetch(`${CMS_BASE}/plans/search?${params}`, {
    headers: { Accept: 'application/json', apikey: apiKey },
  })

  if (!res.ok) throw new Error(`CMS API ${res.status}`)

  const data: CmsResponse = await res.json()
  return (data?.plans ?? []).map((p) => ({
    id: p.id ?? '',
    name: p.name ?? 'Unknown Plan',
    issuer: p.issuer?.name ?? '',
    type: p.type ?? '',
    premium: p.premium_w_credit ?? p.premium ?? 0,
    deductible: extractMedical(p.deductibles),
    oopMax: extractMedical(p.moops),
    metalLevel: p.metal_level ?? '',
    url: p.brochure_url,
  }))
}

async function fetchFromFreeDataset(
  zip: string,
  year: number,
): Promise<InsurancePlan[]> {
  const body = {
    conditions: [
      { property: 'zip_code', value: zip, operator: '=' },
      { property: 'plan_year', value: String(year), operator: '=' },
    ],
    limit: 50,
    offset: 0,
  }

  const res = await fetch(FREE_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) throw new Error(`Healthcare.gov free API error: ${res.status}`)

  const data = await res.json()
  const results: FreeRow[] = data?.results ?? []

  return results.map((p) => ({
    id: p.plan_id ?? '',
    name: p.plan_marketing_name ?? 'Unknown Plan',
    issuer: p.issuer_name ?? '',
    type: p.plan_type ?? '',
    premium: parseFloat(p.individual_rate ?? '0') || 0,
    deductible: parseFloat(p.medical_deductible_individual_standard ?? '0') || 0,
    oopMax: 0,
    metalLevel: p.metal_level ?? '',
    url: p.brochure_url,
  }))
}

export async function findPlans(
  zip: string,
  year = 2024,
  apiKey?: string,
  householdSize = 1,
  income = 0,
  age?: number,
): Promise<InsurancePlan[]> {
  if (apiKey) {
    try {
      return await fetchFromCms(zip, year, apiKey, householdSize, income, age)
    } catch {
      // fall through to free dataset
    }
  }
  return fetchFromFreeDataset(zip, year)
}
