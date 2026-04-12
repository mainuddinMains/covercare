// Federal Poverty Level (FPL) guidelines for 2024 (48 contiguous states + DC)
// Source: https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines
const FPL_BASE = 15060
const FPL_PER_PERSON = 5380

export function getFederalPovertyLevel(householdSize: number): number {
  return FPL_BASE + FPL_PER_PERSON * (Math.max(1, householdSize) - 1)
}

export function getFplPercentage(
  annualIncome: number,
  householdSize: number,
): number {
  const fpl = getFederalPovertyLevel(householdSize)
  return Math.round((annualIncome / fpl) * 100)
}

// Medicaid expansion status by state (as of 2025)
// Expansion states cover adults up to 138% FPL
// Non-expansion states have very limited adult coverage (often parents only, very low thresholds)
interface MedicaidStateInfo {
  expanded: boolean
  // For non-expansion states: parent income limit as % FPL (childless adults generally ineligible)
  parentLimitPct?: number
}

const MEDICAID_BY_STATE: Record<string, MedicaidStateInfo> = {
  AL: { expanded: false, parentLimitPct: 18 },
  AK: { expanded: true },
  AZ: { expanded: true },
  AR: { expanded: true },
  CA: { expanded: true },
  CO: { expanded: true },
  CT: { expanded: true },
  DE: { expanded: true },
  DC: { expanded: true },
  FL: { expanded: false, parentLimitPct: 26 },
  GA: { expanded: false, parentLimitPct: 33 },
  HI: { expanded: true },
  ID: { expanded: true },
  IL: { expanded: true },
  IN: { expanded: true },
  IA: { expanded: true },
  KS: { expanded: false, parentLimitPct: 38 },
  KY: { expanded: true },
  LA: { expanded: true },
  ME: { expanded: true },
  MD: { expanded: true },
  MA: { expanded: true },
  MI: { expanded: true },
  MN: { expanded: true },
  MS: { expanded: false, parentLimitPct: 27 },
  MO: { expanded: true },
  MT: { expanded: true },
  NE: { expanded: true },
  NV: { expanded: true },
  NH: { expanded: true },
  NJ: { expanded: true },
  NM: { expanded: true },
  NY: { expanded: true },
  NC: { expanded: true },
  ND: { expanded: true },
  OH: { expanded: true },
  OK: { expanded: true },
  OR: { expanded: true },
  PA: { expanded: true },
  RI: { expanded: true },
  SC: { expanded: false, parentLimitPct: 62 },
  SD: { expanded: true },
  TN: { expanded: false, parentLimitPct: 89 },
  TX: { expanded: false, parentLimitPct: 14 },
  UT: { expanded: true },
  VT: { expanded: true },
  VA: { expanded: true },
  WA: { expanded: true },
  WV: { expanded: true },
  // Wisconsin covers adults up to 100% FPL via waiver (not technically expansion)
  WI: { expanded: false, parentLimitPct: 100 },
  WY: { expanded: false, parentLimitPct: 49 },
}

// HRSA sliding-scale fee schedule brackets
// Community health centers are required to use these income-based tiers
export interface SlidingScaleBracket {
  maxFplPct: number
  label: string
  discountDescription: string
}

export const SLIDING_SCALE_BRACKETS: SlidingScaleBracket[] = [
  { maxFplPct: 100, label: 'Nominal fee', discountDescription: 'Little to no cost for visits and services' },
  { maxFplPct: 150, label: 'Deeply reduced', discountDescription: 'Significant discount on all services' },
  { maxFplPct: 200, label: 'Reduced fee', discountDescription: 'Reduced fees based on your income' },
]

export function getSlidingScaleBracket(
  fplPct: number,
): SlidingScaleBracket | null {
  for (const bracket of SLIDING_SCALE_BRACKETS) {
    if (fplPct <= bracket.maxFplPct) return bracket
  }
  return null
}

// ACA marketplace subsidy eligibility
// Enhanced subsidies (American Rescue Plan / Inflation Reduction Act) through 2025:
// - Expansion states: subsidies available above 138% FPL
// - Non-expansion states: subsidies available above 100% FPL
// - Premium capped at 8.5% of income for all income levels
function getAcaSubsidyInfo(
  fplPct: number,
  expanded: boolean,
): { eligible: boolean; note: string } {
  const minPct = expanded ? 139 : 100
  if (fplPct < minPct) {
    if (!expanded && fplPct > 0) {
      return {
        eligible: false,
        note: 'Your income may fall in the "coverage gap" -- too high for your state\'s Medicaid but below the ACA subsidy threshold. A community health center can still help.',
      }
    }
    return { eligible: false, note: 'You may qualify for Medicaid instead.' }
  }
  if (fplPct <= 150) {
    return {
      eligible: true,
      note: 'You likely qualify for very low premium plans (close to $0/month) and reduced cost-sharing (Silver plan with extra savings).',
    }
  }
  if (fplPct <= 250) {
    return {
      eligible: true,
      note: 'You likely qualify for premium tax credits and cost-sharing reductions on Silver plans.',
    }
  }
  if (fplPct <= 400) {
    return {
      eligible: true,
      note: 'You likely qualify for premium tax credits to lower your monthly cost.',
    }
  }
  return {
    eligible: true,
    note: 'Under current rules, your premium is capped at 8.5% of your income.',
  }
}

// Main eligibility assessment
export interface EligibilityResult {
  fplPercentage: number
  householdFpl: number
  medicaid: {
    likelyEligible: boolean
    stateExpanded: boolean
    note: string
  }
  slidingScale: {
    eligible: boolean
    bracket: SlidingScaleBracket | null
    note: string
  }
  acaSubsidy: {
    eligible: boolean
    note: string
  }
  coverageGap: boolean
  topRecommendation: string
}

export function assessEligibility(
  annualIncome: number,
  householdSize: number,
  stateCode: string,
): EligibilityResult {
  const fplPct = getFplPercentage(annualIncome, householdSize)
  const householdFpl = getFederalPovertyLevel(householdSize)
  const stateInfo = MEDICAID_BY_STATE[stateCode.toUpperCase()] ?? { expanded: false }

  // Medicaid eligibility
  let medicaidEligible = false
  let medicaidNote = ''
  if (stateInfo.expanded) {
    medicaidEligible = fplPct <= 138
    medicaidNote = medicaidEligible
      ? `Your state expanded Medicaid. At ${fplPct}% of the federal poverty level, you likely qualify.`
      : `Your state expanded Medicaid, but your income is above the 138% FPL limit. Look into ACA marketplace plans with subsidies.`
  } else {
    const parentLimit = stateInfo.parentLimitPct ?? 0
    if (fplPct <= parentLimit) {
      medicaidEligible = true
      medicaidNote = `Your state has not expanded Medicaid, but your income is within your state's limit for parents (${parentLimit}% FPL). You may qualify -- apply to find out.`
    } else {
      medicaidNote = `Your state has not expanded Medicaid. Adult coverage is very limited (parents only, up to ${parentLimit}% FPL). You may fall in the coverage gap.`
    }
  }

  // Sliding scale
  const bracket = getSlidingScaleBracket(fplPct)
  const slidingScale = bracket
    ? {
        eligible: true,
        bracket,
        note: `At ${fplPct}% FPL, community health centers must offer you ${bracket.label.toLowerCase()} pricing. ${bracket.discountDescription}.`,
      }
    : {
        eligible: false,
        bracket: null,
        note: 'Your income is above 200% FPL, but community health centers still often charge less than private clinics. You will not be turned away.',
      }

  // ACA subsidies
  const acaSubsidy = getAcaSubsidyInfo(fplPct, stateInfo.expanded)

  // Coverage gap detection
  const coverageGap =
    !stateInfo.expanded &&
    fplPct > (stateInfo.parentLimitPct ?? 0) &&
    fplPct < 100

  // Top recommendation
  let topRecommendation: string
  if (medicaidEligible) {
    topRecommendation = 'Apply for Medicaid -- you likely qualify and it covers most services with little to no cost.'
  } else if (coverageGap) {
    topRecommendation = 'Visit a community health center near you -- they offer sliding-scale fees and will not turn you away. You can also check if you qualify for other state programs.'
  } else if (bracket) {
    topRecommendation = 'Visit a community health center for affordable care on a sliding scale, and check ACA marketplace plans for insurance coverage.'
  } else if (acaSubsidy.eligible) {
    topRecommendation = 'Check ACA marketplace plans -- you likely qualify for subsidies that lower your monthly premium.'
  } else {
    topRecommendation = 'Compare ACA marketplace plans for the best value. Community health centers are also a good option for affordable visits.'
  }

  return {
    fplPercentage: fplPct,
    householdFpl,
    medicaid: {
      likelyEligible: medicaidEligible,
      stateExpanded: stateInfo.expanded,
      note: medicaidNote,
    },
    slidingScale,
    acaSubsidy,
    coverageGap,
    topRecommendation,
  }
}
