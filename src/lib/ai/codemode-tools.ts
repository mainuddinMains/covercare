import { toolDefinition } from '@tanstack/ai'
import { z } from 'zod'
import { searchHospitalsByZip } from '@/lib/cms-hospitals'
import { searchPhysicians } from '@/lib/cms-physicians'
import {
  estimateCost,
  PROCEDURES,
  INSURANCE_LABELS,
  type InsuranceType,
} from '@/lib/cost-estimator'
import { lookupHospitalPrices } from '@/lib/cms-hospital-prices'
import { assessEligibility } from '@/lib/assistance-eligibility'
import { findClinics } from '@/lib/hrsa'
import { searchDrug, getDrugAlternatives } from '@/lib/fda-drugs'

/**
 * Tools available inside Code Mode's execute_typescript sandbox.
 * These become external_* functions the AI can call from generated code.
 *
 * Unlike client tools, these have .server() implementations because
 * they execute server-side inside the QuickJS isolate.
 */

const procedureKeys = Object.keys(PROCEDURES) as [string, ...string[]]
const insuranceKeys = Object.keys(INSURANCE_LABELS) as [string, ...string[]]

const searchHospitalsTool = toolDefinition({
  name: 'searchHospitals',
  description:
    'Search for Medicare-certified hospitals near a ZIP code. Returns hospital names, addresses, phone numbers, CMS quality ratings, and emergency services status.',
  inputSchema: z.object({
    zip: z.string().length(5).describe('5-digit US ZIP code'),
  }),
}).server(async ({ zip }) => {
  return searchHospitalsByZip(zip)
})

const searchProvidersTool = toolDefinition({
  name: 'searchProviders',
  description:
    'Search for doctors and healthcare providers near a ZIP code, optionally filtered by specialty.',
  inputSchema: z.object({
    zip: z.string().length(5).describe('5-digit US ZIP code'),
    specialty: z.string().optional().describe('Specialty keyword (e.g. "cardiology")'),
  }),
}).server(async ({ zip, specialty }) => {
  return searchPhysicians(zip, specialty)
})

const estimateCostTool = toolDefinition({
  name: 'estimateCost',
  description: `Estimate out-of-pocket cost for a medical procedure based on real CMS data and insurance type.

Available procedures: ${Object.entries(PROCEDURES)
    .map(([key, p]) => `${key} (${p.name})`)
    .join(', ')}

Available insurance types: ${Object.entries(INSURANCE_LABELS)
    .map(([key, label]) => `${key} (${label})`)
    .join(', ')}`,
  inputSchema: z.object({
    procedure: z.enum(procedureKeys).describe('Procedure key'),
    insurance: z.enum(insuranceKeys).describe('Insurance type key'),
  }),
}).server(async ({ procedure, insurance }) => {
  return estimateCost(procedure, insurance as InsuranceType)
})

const compareHospitalPricesTool = toolDefinition({
  name: 'compareHospitalPrices',
  description:
    'Compare what hospitals charge for an inpatient procedure using CMS Medicare claims data. Search by DRG code or keyword.',
  inputSchema: z.object({
    keyword: z.string().describe('DRG code (e.g. "470") or keyword (e.g. "knee")'),
    state: z.string().length(2).optional().describe('2-letter state abbreviation'),
  }),
}).server(async ({ keyword, state }) => {
  const prices = await lookupHospitalPrices(keyword, state)
  return { prices }
})

const checkEligibilityTool = toolDefinition({
  name: 'checkAssistanceEligibility',
  description:
    'Check financial assistance eligibility (Medicaid, sliding-scale fees, ACA subsidies) based on income, household size, and state.',
  inputSchema: z.object({
    annualIncome: z.number().describe('Annual household income in dollars'),
    householdSize: z.number().int().min(1).describe('Number of people in household'),
    stateCode: z.string().length(2).describe('2-letter state abbreviation'),
  }),
}).server(({ annualIncome, householdSize, stateCode }) => {
  return assessEligibility(annualIncome, householdSize, stateCode)
})

const findHealthCentersTool = toolDefinition({
  name: 'findCommunityHealthCenters',
  description:
    'Find HRSA-funded community health centers near a ZIP code. These offer sliding-scale fees and serve all patients regardless of ability to pay.',
  inputSchema: z.object({
    zip: z.string().length(5).describe('5-digit US ZIP code'),
    radius: z.number().optional().describe('Search radius in miles (default 25)'),
  }),
}).server(async ({ zip, radius }) => {
  const clinics = await findClinics(zip, radius)
  return { clinics }
})

const searchDrugInfoTool = toolDefinition({
  name: 'searchDrugInfo',
  description:
    'Search for drug information using the FDA database. Returns brand name, generic name, dosage forms, and whether a generic is available.',
  inputSchema: z.object({
    drug: z.string().describe('Drug name (brand or generic)'),
    mode: z
      .enum(['search', 'alternatives'])
      .optional()
      .describe('"search" for info (default), "alternatives" for generic alternatives'),
  }),
}).server(async ({ drug, mode }) => {
  if (mode === 'alternatives') {
    const alternatives = await getDrugAlternatives(drug)
    return { alternatives }
  }
  const results = await searchDrug(drug)
  return { results }
})

export const codeModeTools = [
  searchHospitalsTool,
  searchProvidersTool,
  estimateCostTool,
  compareHospitalPricesTool,
  checkEligibilityTool,
  findHealthCentersTool,
  searchDrugInfoTool,
]
