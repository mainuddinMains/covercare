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

// Google Places
export interface Hospital {
  id: string
  name: string
  address: string
  phone?: string
  website?: string
  rating?: number
  totalRatings?: number
  openNow?: boolean
  lat: number
  lng: number
  distanceMiles?: number
}

// Geocoding
export interface DetectedLocation {
  city: string
  state: string
  stateCode: string
  zip: string
  display: string
}
