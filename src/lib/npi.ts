import type { Provider } from './types'

const BASE = 'https://npiregistry.cms.hhs.gov/api/'

interface NpiAddress {
  address_1: string
  city: string
  state: string
  postal_code: string
  telephone_number?: string
}

interface NpiBasicInfo {
  first_name?: string
  last_name?: string
  organization_name?: string
  credential?: string
}

interface NpiTaxonomy {
  desc?: string
}

interface NpiResult {
  number: string
  basic: NpiBasicInfo
  addresses: NpiAddress[]
  taxonomies: NpiTaxonomy[]
}

export async function findProviders(
  query: string,
  state?: string,
  limit = 10,
): Promise<Provider[]> {
  const params = new URLSearchParams({
    version: '2.1',
    limit: String(limit),
    pretty: 'false',
  })

  const isOrg = /hospital|clinic|health|medical|center/i.test(query)
  if (isOrg) {
    params.set('organization_name', query)
  } else {
    const [first, ...rest] = query.trim().split(' ')
    params.set('first_name', first)
    if (rest.length) params.set('last_name', rest.join(' '))
  }
  if (state) params.set('state', state)

  const res = await fetch(`${BASE}?${params}`)
  if (!res.ok) throw new Error(`NPI API error: ${res.status}`)

  const data = await res.json()
  const results: NpiResult[] = data?.results ?? []

  return results.map((r) => {
    const addr = r.addresses?.[0] ?? ({} as NpiAddress)
    const name = r.basic.organization_name
      ? r.basic.organization_name
      : `${r.basic.first_name ?? ''} ${r.basic.last_name ?? ''}`.trim()

    return {
      npi: r.number,
      name,
      credential: r.basic.credential,
      specialty: r.taxonomies?.[0]?.desc,
      address: addr.address_1 ?? '',
      city: addr.city ?? '',
      state: addr.state ?? '',
      zip: addr.postal_code ?? '',
      phone: addr.telephone_number,
    }
  })
}
