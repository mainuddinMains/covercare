import type { DetectedLocation } from './types'

interface BigDataCloudResponse {
  city?: string
  locality?: string
  principalSubdivision?: string
  principalSubdivisionCode?: string
  postcode?: string
}

export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<DetectedLocation> {
  const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`)

  const data: BigDataCloudResponse = await res.json()

  const city = data.city || data.locality || ''
  const state = data.principalSubdivision ?? ''
  const stateCode = (data.principalSubdivisionCode ?? '').replace(
    /^[A-Z]+-/,
    '',
  )
  const zip = data.postcode ?? ''

  const display = [city, stateCode, zip].filter(Boolean).join(', ')

  return { city, state, stateCode, zip, display }
}
