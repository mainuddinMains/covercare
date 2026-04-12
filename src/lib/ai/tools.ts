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

const checkAssistanceEligibilityDef = toolDefinition({
  name: 'check_assistance_eligibility' as const,
  description:
    'Check what financial assistance programs a user qualifies for based on their income, household size, and state. Returns Medicaid eligibility (accounting for whether their state expanded Medicaid), HRSA community health center sliding-scale fee bracket, ACA marketplace subsidy eligibility, and whether they fall in the coverage gap. Also returns their Federal Poverty Level percentage and a top recommendation. Use this whenever the user mentions being uninsured, having low income, needing help affording care, or asks about Medicaid/financial assistance.',
  inputSchema: z.object({
    annualIncome: z
      .number()
      .describe('Annual household income in dollars'),
    householdSize: z
      .number()
      .int()
      .min(1)
      .describe('Number of people in the household'),
    stateCode: z
      .string()
      .length(2)
      .describe('2-letter US state abbreviation (e.g. "TX", "CA")'),
  }),
})

const findCommunityHealthCentersDef = toolDefinition({
  name: 'find_community_health_centers' as const,
  description:
    'Find HRSA-funded community health centers near a ZIP code. These centers are required by federal law to serve all patients regardless of ability to pay, and offer sliding-scale fees based on income. They provide primary care, dental, mental health, and pharmacy services. Use this when the user needs affordable care, is uninsured, or when check_assistance_eligibility suggests a health center.',
  inputSchema: z.object({
    zip: z
      .string()
      .length(5)
      .describe('5-digit US ZIP code to search near'),
    radius: z
      .number()
      .optional()
      .describe('Search radius in miles (default 25)'),
  }),
})

const searchDrugInfoDef = toolDefinition({
  name: 'search_drug_info' as const,
  description:
    'Search for drug information using the FDA database. Returns brand name, generic name, dosage forms, whether a generic is available, purpose, and usage information. Also can find generic alternatives for a drug. Use this when the user asks about a medication, needs to find cheaper alternatives, or wants to know if a generic version exists.',
  inputSchema: z.object({
    drug: z
      .string()
      .describe('Drug name to search (brand or generic name, e.g. "Lipitor", "atorvastatin")'),
    mode: z
      .enum(['search', 'alternatives'])
      .optional()
      .describe('"search" for drug info (default), "alternatives" to find generic alternatives'),
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

const checkAssistanceEligibilityClient =
  checkAssistanceEligibilityDef.client(async (args) => {
    const params = new URLSearchParams({
      income: String(args.annualIncome),
      householdSize: String(args.householdSize),
      state: args.stateCode,
    })
    const res = await fetch(`/api/assistance-eligibility?${params}`)
    if (!res.ok) return { error: 'Failed to check eligibility' }
    return res.json()
  })

const findCommunityHealthCentersClient =
  findCommunityHealthCentersDef.client(async (args) => {
    const params = new URLSearchParams({ zip: args.zip })
    if (args.radius) params.set('radius', String(args.radius))
    const res = await fetch(`/api/clinics?${params}`)
    if (!res.ok) return { error: 'Failed to find health centers' }
    const clinics = await res.json()
    return { clinics }
  })

const searchDrugInfoClient = searchDrugInfoDef.client(async (args) => {
  const params = new URLSearchParams({ drug: args.drug })
  if (args.mode) params.set('mode', args.mode)
  const res = await fetch(`/api/drug-prices?${params}`)
  if (!res.ok) return { error: 'Failed to search drug information' }
  return res.json()
})

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
  checkAssistanceEligibilityDef,
  findCommunityHealthCentersDef,
  searchDrugInfoDef,
  getInsuranceProfileDef,
  detectLocationDef,
]

/** Client tools (with execute) -- passed to useChat() */
export const CLIENT_TOOLS = [
  searchHospitalsClient,
  searchProvidersClient,
  estimateCostClient,
  compareHospitalPricesClient,
  checkAssistanceEligibilityClient,
  findCommunityHealthCentersClient,
  searchDrugInfoClient,
  getInsuranceProfileClient,
  detectLocationClient,
] as const

/** Labels shown while tools are executing */
export const TOOL_LABELS: Record<string, string> = {
  search_hospitals: 'Searching hospitals',
  search_providers: 'Searching providers',
  estimate_cost: 'Estimating cost',
  compare_hospital_prices: 'Comparing hospital prices',
  check_assistance_eligibility: 'Checking assistance programs',
  find_community_health_centers: 'Finding health centers',
  search_drug_info: 'Looking up drug info',
  get_insurance_profile: 'Reading your profile',
  detect_location: 'Detecting your location',
}
