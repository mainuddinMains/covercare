import { toolDefinition } from '@tanstack/ai'
import { z } from 'zod'
import { PROCEDURES, INSURANCE_LABELS } from '@/lib/cost-estimator'
import { reverseGeocode } from '@/lib/geocoding'
import { useInsuranceStore } from '@/store/appStore'

const procedureKeys = Object.keys(PROCEDURES) as [string, ...string[]]
const insuranceKeys = Object.keys(INSURANCE_LABELS) as [string, ...string[]]

// ── Tool Definitions ──

const searchHospitalsDef = toolDefinition({
  name: 'search_hospitals' as const,
  description:
    'Search for Medicare-certified hospitals near a ZIP code. Returns hospital names, addresses, phone numbers, CMS quality star ratings (1-5), and whether they have emergency services. Automatically widens the search area if few results are found in the exact ZIP.',
  inputSchema: z.object({
    zip: z
      .string()
      .length(5)
      .describe('5-digit US ZIP code to search near'),
  }),
})

const estimateCostDef = toolDefinition({
  name: 'estimate_cost' as const,
  description: `Estimate out-of-pocket cost for a medical procedure based on real CMS Medicare Fee Schedule rates and the patient's insurance type. Returns the Medicare base rate, estimated total billed amount, and the patient's estimated out-of-pocket range. May return null costs if CMS does not have rate data for the procedure.

Available procedures: ${Object.entries(PROCEDURES)
    .map(([key, p]) => `${key} (${p.name})`)
    .join(', ')}

Available insurance types: ${Object.entries(INSURANCE_LABELS)
    .map(([key, label]) => `${key} (${label})`)
    .join(', ')}`,
  inputSchema: z.object({
    procedure: z
      .enum(procedureKeys)
      .describe('Procedure key from the available list'),
    insurance: z
      .enum(insuranceKeys)
      .describe('Insurance type key from the available list'),
  }),
})

const getInsuranceProfileDef = toolDefinition({
  name: 'get_insurance_profile' as const,
  description:
    'Read the user\'s saved insurance profile. Returns their insurance type, plan name, member ID, group number, location, and other saved details. Use this to personalize cost estimates and recommendations. Returns empty fields if the user has not set up their profile yet.',
  inputSchema: z.object({}),
})

const searchProvidersDef = toolDefinition({
  name: 'search_providers' as const,
  description:
    'Search for doctors and healthcare providers near a ZIP code, optionally filtered by specialty. Returns provider names, credentials, specialty, facility, address, phone, and whether they offer telehealth. Uses CMS Medicare provider data. Specialty search is case-insensitive and matches partial names (e.g. "cardio" matches "Cardiovascular Disease (Cardiology)").',
  inputSchema: z.object({
    zip: z
      .string()
      .length(5)
      .describe('5-digit US ZIP code to search near'),
    specialty: z
      .string()
      .optional()
      .describe(
        'Specialty keyword to filter by (e.g. "cardiology", "psychiatry", "orthopedic", "dermatology", "internal medicine"). Omit to search all specialties.',
      ),
  }),
})

const compareHospitalPricesDef = toolDefinition({
  name: 'compare_hospital_prices' as const,
  description:
    'Compare what different hospitals charge for an inpatient procedure using real CMS Medicare claims data. Search by DRG code (a number like 470 for knee replacement) or a keyword (like "hip", "heart", "sepsis"). Optionally filter by state. Returns hospital name, city, state, procedure description, average total payment, average Medicare payment, and number of discharges. Use this when the user wants to compare hospital costs or asks "how much does X cost at hospitals in Y".',
  inputSchema: z.object({
    keyword: z
      .string()
      .describe(
        'DRG code (e.g. "470") or keyword to search procedure descriptions (e.g. "knee", "hip replacement", "heart failure")',
      ),
    state: z
      .string()
      .length(2)
      .optional()
      .describe('2-letter state abbreviation to filter by (e.g. "CA", "TX")'),
  }),
})

const detectLocationDef = toolDefinition({
  name: 'detect_location' as const,
  description:
    'Detect the user\'s current location using their browser\'s geolocation. Returns their ZIP code, city, and state. Use this when the user says "near me" or "my area" and you do not already have their ZIP from their profile. May fail if the user denies location permission.',
  inputSchema: z.object({}),
})

// ── Client Tools (with execute functions) ──

const searchHospitalsClient = searchHospitalsDef.client(async (args) => {
  const res = await fetch(`/api/hospitals?zip=${args.zip}`)
  if (!res.ok) return { error: 'Failed to search hospitals' }
  return res.json()
})

const estimateCostClient = estimateCostDef.client(async (args) => {
  const res = await fetch(
    `/api/cost-estimate?procedure=${args.procedure}&insurance=${args.insurance}`,
  )
  if (!res.ok) return { error: 'Failed to estimate cost' }
  return res.json()
})

const searchProvidersClient = searchProvidersDef.client(async (args) => {
  const params = new URLSearchParams({ zip: args.zip })
  if (args.specialty) params.set('specialty', args.specialty)
  const res = await fetch(`/api/providers?${params}`)
  if (!res.ok) return { error: 'Failed to search providers' }
  return res.json()
})

const getInsuranceProfileClient = getInsuranceProfileDef.client(() => {
  return useInsuranceStore.getState().profile
})

const compareHospitalPricesClient = compareHospitalPricesDef.client(
  async (args) => {
    const params = new URLSearchParams({ keyword: args.keyword })
    if (args.state) params.set('state', args.state)
    const res = await fetch(`/api/hospital-prices?${params}`)
    if (!res.ok) return { error: 'Failed to look up hospital prices' }
    return res.json()
  },
)

const detectLocationClient = detectLocationDef.client(async () => {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return { error: 'Geolocation is not available in this browser' }
  }

  const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: 10000,
    })
  }).catch(() => null)

  if (!pos) {
    return { error: 'User denied location permission or location timed out' }
  }

  const loc = await reverseGeocode(
    pos.coords.latitude,
    pos.coords.longitude,
  )

  if (!loc.zip) {
    return { error: 'Could not determine ZIP code from coordinates' }
  }

  return {
    zip: loc.zip,
    city: loc.city,
    state: loc.state,
    stateCode: loc.stateCode,
  }
})

// ── Exports ──

/** Tool definitions (no execute) -- passed to server-side chat() */
export const TOOL_DEFS = [
  searchHospitalsDef,
  searchProvidersDef,
  estimateCostDef,
  compareHospitalPricesDef,
  getInsuranceProfileDef,
  detectLocationDef,
]

/** Client tools (with execute) -- passed to useChat() */
export const CLIENT_TOOLS = [
  searchHospitalsClient,
  searchProvidersClient,
  estimateCostClient,
  compareHospitalPricesClient,
  getInsuranceProfileClient,
  detectLocationClient,
] as const

/** Labels shown while tools are executing */
export const TOOL_LABELS: Record<string, string> = {
  search_hospitals: 'Searching hospitals',
  search_providers: 'Searching providers',
  estimate_cost: 'Estimating cost',
  compare_hospital_prices: 'Comparing hospital prices',
  get_insurance_profile: 'Reading your profile',
  detect_location: 'Detecting your location',
}
