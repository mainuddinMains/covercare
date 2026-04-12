import type { DrugPrice } from './types'

// GoodRx Coupon API - requires GOODRX_CLIENT_ID and GOODRX_API_KEY
// Apply at: https://www.goodrx.com/business/solutions/api
// Endpoint: https://api.goodrx.com/

interface GoodRxPrice {
  display?: string
  pharmacy?: string
  price?: number
  form?: string
  dosage?: string
  quantity?: number
  url?: string
}

interface GoodRxResponse {
  data?: {
    name?: string
    slug?: string
    prices?: GoodRxPrice[]
  }
}

export async function getDrugPrices(
  drugName: string,
  quantity = 30,
  apiKey: string,
  clientId: string,
): Promise<DrugPrice[]> {
  const params = new URLSearchParams({
    name: drugName,
    quantity: String(quantity),
  })

  const res = await fetch(`https://api.goodrx.com/fair-price?${params}`, {
    headers: {
      Authorization: `Basic ${btoa(`${clientId}:${apiKey}`)}`,
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) throw new Error(`GoodRx API error: ${res.status}`)

  const data: GoodRxResponse = await res.json()
  const prices = data?.data?.prices ?? []
  const genericName = data?.data?.name

  return prices.map((p) => ({
    drugName,
    genericName,
    dosage: p.dosage ?? '',
    quantity: p.quantity ?? quantity,
    form: p.form ?? '',
    pharmacy: p.pharmacy ?? '',
    price: p.price ?? 0,
    couponUrl: p.url,
  }))
}
