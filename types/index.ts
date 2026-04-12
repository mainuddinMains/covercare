export type Role = "user" | "assistant" | "system";

export interface Message {
  role: Role;
  content: string;
}

export interface ChatRequest {
  messages: Message[];
}

export interface ChatResponse {
  message: Message;
}

// HRSA
export interface Clinic {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  url?: string;
  latitude?: number;
  longitude?: number;
}

// NPI
export interface Provider {
  npi: string;
  name: string;
  credential?: string;
  specialty?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone?: string;
}

// Healthcare.gov
export interface InsurancePlan {
  id: string;
  name: string;
  issuer: string;
  type: string; // HMO, PPO, EPO, POS
  premium: number;
  deductible: number;
  metalLevel: string; // Bronze, Silver, Gold, Platinum
  url?: string;
}
