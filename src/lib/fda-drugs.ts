import type { DrugPrice } from './types'

// FDA Drug Label & Product API - free, no key required
// Docs: https://api.fda.gov/drug

interface FdaProduct {
  brand_name?: string[]
  generic_name?: string[]
  dosage_form?: string[]
  route?: string[]
  product_ndc?: string[]
  marketing_status?: string[]
}

interface FdaLabel {
  openfda?: FdaProduct
  purpose?: string[]
  warnings?: string[]
  indications_and_usage?: string[]
}

interface FdaLabelResponse {
  results?: FdaLabel[]
  meta?: { results?: { total?: number } }
}

interface FdaNdcResponse {
  results?: FdaProduct[]
}

export interface DrugInfo {
  brandName: string
  genericName: string
  dosageForms: string[]
  routes: string[]
  purpose?: string
  indications?: string
  warnings?: string
  isGenericAvailable: boolean
  ndcs: string[]
}

export async function searchDrug(name: string, limit = 5): Promise<DrugInfo[]> {
  const encoded = encodeURIComponent(name)
  const labelUrl = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encoded}"+openfda.generic_name:"${encoded}"&limit=${limit}`

  const res = await fetch(labelUrl)

  if (res.status === 404) return []
  if (!res.ok) throw new Error(`FDA Drug API error: ${res.status}`)

  const data: FdaLabelResponse = await res.json()
  const results = data?.results ?? []

  return results.map((r) => {
    const openfda = r.openfda ?? {}
    const brandNames = openfda.brand_name ?? []
    const genericNames = openfda.generic_name ?? []
    return {
      brandName: brandNames[0] ?? name,
      genericName: genericNames[0] ?? '',
      dosageForms: openfda.dosage_form ?? [],
      routes: openfda.route ?? [],
      purpose: r.purpose?.[0],
      indications: r.indications_and_usage?.[0],
      warnings: r.warnings?.[0],
      isGenericAvailable: genericNames.length > 0,
      ndcs: openfda.product_ndc ?? [],
    }
  })
}

export async function getDrugAlternatives(
  genericName: string,
  limit = 10,
): Promise<DrugPrice[]> {
  const encoded = encodeURIComponent(genericName)
  const url = `https://api.fda.gov/drug/ndc.json?search=generic_name:"${encoded}"&limit=${limit}`

  const res = await fetch(url)
  if (res.status === 404) return []
  if (!res.ok) throw new Error(`FDA NDC API error: ${res.status}`)

  const data: FdaNdcResponse = await res.json()
  const results = data?.results ?? []

  return results.map((p) => ({
    drugName: (p.brand_name ?? [])[0] ?? genericName,
    genericName: (p.generic_name ?? [])[0],
    dosage: '',
    quantity: 0,
    form: (p.dosage_form ?? [])[0] ?? '',
    pharmacy: 'See GoodRx or your pharmacy for pricing',
    price: 0,
  }))
}
