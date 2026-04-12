import type { Hospital } from './types'

// CMS Hospital Compare via Socrata Open Data API - free, no key required
// Docs: https://data.cms.gov/provider-data/topics/hospitals

const HOSPITAL_GENERAL_INFO =
  'https://data.cms.gov/resource/xubh-q36u.json'

interface CmsHospital {
  facility_id?: string
  facility_name?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  phone_number?: string
  hospital_type?: string
  hospital_ownership?: string
  emergency_services?: string
  overall_rating?: string
  overall_rating_footnote?: string
  mortality_national_comparison?: string
  safety_of_care_national_comparison?: string
  readmission_national_comparison?: string
  patient_experience_national_comparison?: string
  effectiveness_of_care_national_comparison?: string
  lat?: string | number
  lon?: string | number
}

export interface HospitalCompare extends Hospital {
  hospitalType: string
  ownership: string
  hasER: boolean
  overallRating: number | null
  mortalityRating: string
  safetyRating: string
  readmissionRating: string
  patientExperienceRating: string
}

export async function findHospitalsWithRatings(
  state: string,
  city?: string,
  limit = 20,
): Promise<HospitalCompare[]> {
  let where = `state='${state.toUpperCase()}'`
  if (city) {
    where += ` AND city='${city.toUpperCase()}'`
  }

  const params = new URLSearchParams({
    $where: where,
    $limit: String(limit),
    $order: 'overall_rating DESC',
  })

  const res = await fetch(`${HOSPITAL_GENERAL_INFO}?${params}`)
  if (!res.ok) throw new Error(`CMS Hospital Compare API error: ${res.status}`)

  const rows: CmsHospital[] = await res.json()

  return rows.map((h) => {
    const rating = parseInt(h.overall_rating ?? '', 10)
    return {
      id: h.facility_id ?? '',
      name: h.facility_name ?? 'Unknown Hospital',
      address: h.address ?? '',
      city: h.city ?? '',
      state: h.state ?? '',
      zip: h.zip_code ?? '',
      phone: h.phone_number,
      lat: parseFloat(String(h.lat ?? 0)),
      lng: parseFloat(String(h.lon ?? 0)),
      hospitalType: h.hospital_type ?? '',
      ownership: h.hospital_ownership ?? '',
      hasER: h.emergency_services?.toLowerCase() === 'yes',
      overallRating: isNaN(rating) ? null : rating,
      mortalityRating: h.mortality_national_comparison ?? '',
      safetyRating: h.safety_of_care_national_comparison ?? '',
      readmissionRating: h.readmission_national_comparison ?? '',
      patientExperienceRating: h.patient_experience_national_comparison ?? '',
    }
  })
}
