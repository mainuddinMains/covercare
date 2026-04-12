export type Role = 'user' | 'assistant' | 'system'

export interface Message {
  role: Role
  content: string
}

export interface ChatRequest {
  messages: Message[]
}

export interface ChatResponse {
  message: Message
}

// HRSA
export interface Clinic {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip: string
  phone: string
  url?: string
  latitude?: number
  longitude?: number
}

// NPI
export interface Provider {
  npi: string
  name: string
  credential?: string
  specialty?: string
  address: string
  city: string
  state: string
  zip: string
  phone?: string
}

// Healthcare.gov
export interface InsurancePlan {
  id: string
  name: string
  issuer: string
  type: string
  premium: number
  deductible: number
  metalLevel: string
  url?: string
}

// Geocoding
export interface DetectedLocation {
  city: string
  state: string
  stateCode: string
  zip: string
  display: string
}

// SAMHSA Treatment Facilities
export interface TreatmentFacility {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip: string
  phone?: string
  website?: string
  lat: number
  lng: number
  services: string[]
  acceptsMedicaid: boolean
  acceptsMedicare: boolean
  acceptsSlidingFee: boolean
}

// CMS Hospital Pricing
export interface HospitalPrice {
  hospitalName: string
  city: string
  state: string
  procedureCode: string
  procedureDescription: string
  averageTotalPayments: number
  averageMedicarePayments: number
  discharges: number
}

// FDA Drug Info
export interface DrugPrice {
  drugName: string
  genericName?: string
  dosage: string
  quantity: number
  form: string
  pharmacy: string
  price: number
  couponUrl?: string
}

// 211 Social Services
export interface SocialService {
  id: string
  name: string
  description: string
  address: string
  city: string
  state: string
  zip: string
  phone?: string
  website?: string
  categories: string[]
  eligibility?: string
}
