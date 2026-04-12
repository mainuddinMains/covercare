import type { InsurancePlan, PlanRecommendation } from './types'

export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
  'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
  'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
  'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
]

export const HEALTH_CONDITIONS = [
  { id: 'diabetes', label: 'Diabetes' },
  { id: 'heartDisease', label: 'Heart Disease' },
  { id: 'cancer', label: 'Cancer' },
  { id: 'mentalHealth', label: 'Mental Health' },
  { id: 'pregnancy', label: 'Pregnancy / Planning Pregnancy' },
  { id: 'chronicPain', label: 'Chronic Pain' },
  { id: 'asthma', label: 'Asthma / Respiratory' },
  { id: 'none', label: 'No Major Conditions' },
]

export const PRIORITIES = [
  { id: 'premium', label: 'Lowest Monthly Premium' },
  { id: 'deductible', label: 'Lowest Deductible' },
  { id: 'doctor', label: 'Specific Doctor Coverage' },
  { id: 'mental', label: 'Mental Health Coverage' },
  { id: 'rx', label: 'Prescription Drug Coverage' },
  { id: 'dental', label: 'Dental and Vision' },
]

export const TOP_UNIVERSITIES = [
  'MIT', 'Harvard University', 'Stanford University', 'Yale University',
  'Princeton University', 'Columbia University', 'University of Chicago',
  'University of Pennsylvania', 'Duke University', 'Northwestern University',
  'Johns Hopkins University', 'Dartmouth College', 'Brown University',
  'Vanderbilt University', 'Rice University', 'Cornell University',
  'University of Notre Dame', 'Georgetown University', 'Carnegie Mellon University',
  'UC Berkeley', 'UCLA', 'University of Michigan', 'University of Virginia',
  'University of North Carolina', 'University of Southern California',
  'Emory University', 'Boston University', 'Tufts University',
  'New York University', 'UC San Diego', 'University of Washington',
  'University of Texas Austin', 'Ohio State University',
  'University of Illinois Urbana-Champaign', 'Purdue University',
  'Penn State University', 'University of Wisconsin-Madison',
  'University of Minnesota', 'Indiana University', 'Michigan State University',
  'Arizona State University', 'University of Florida', 'University of Georgia',
  'Virginia Tech', 'University of Maryland', 'Rutgers University',
  'University of Colorado Boulder', 'University of Arizona',
  'Iowa State University', 'University of Pittsburgh',
]

export const STATE_PROGRAMS: Record<string, { name: string; coverage: string }> = {
  CA: { name: 'Medi-Cal', coverage: 'Full coverage for all income-eligible regardless of status' },
  NY: { name: 'NY State of Health Essential Plan', coverage: 'Low-cost coverage for those 0-200% FPL' },
  IL: { name: 'Illinois All Kids / Medi-Assist', coverage: 'Coverage for children and some adults' },
  WA: { name: 'Washington Apple Health', coverage: 'Expanded coverage including undocumented adults' },
  OR: { name: 'Oregon Health Plan', coverage: 'Covers all Oregon residents regardless of status' },
  MA: { name: 'MassHealth', coverage: 'Expanded coverage for low-income residents' },
  CT: { name: 'HUSKY Health', coverage: 'Children and pregnant women coverage' },
  VT: { name: 'Dr. Dynasaur', coverage: 'Children and pregnant women regardless of status' },
  MN: { name: 'MinnesotaCare', coverage: 'Affordable coverage including some undocumented' },
  NM: { name: 'NM Medicaid Expansion', coverage: 'Coverage for low-income adults' },
  DC: { name: 'DC Medicaid', coverage: 'Expanded Medicaid regardless of immigration status' },
}

// Demo fallback plans for Missouri/St. Louis when live API is unavailable.
// NOTE: These are representative demo values, not actual current plan data.
// Always verify current plan details at healthcare.gov before enrolling.
export const DEMO_PLANS_MO: InsurancePlan[] = [
  {
    id: 'demo-1', name: 'Anthem Silver PPO Missouri',
    issuer: 'Anthem Blue Cross Blue Shield', type: 'PPO',
    premium: 285, deductible: 3000, oopMax: 7000, metalLevel: 'Silver', rating: 3.5,
  },
  {
    id: 'demo-2', name: 'Cigna Gold HMO Missouri',
    issuer: 'Cigna', type: 'HMO',
    premium: 425, deductible: 1500, oopMax: 5000, metalLevel: 'Gold', rating: 4.0,
  },
  {
    id: 'demo-3', name: 'UHC Bronze HSA Missouri',
    issuer: 'UnitedHealthcare', type: 'PPO',
    premium: 195, deductible: 6000, oopMax: 8700, metalLevel: 'Bronze', rating: 3.0,
  },
  {
    id: 'demo-4', name: 'Ambetter Silver HMO Missouri',
    issuer: 'Ambetter from Home State Health', type: 'HMO',
    premium: 310, deductible: 2500, oopMax: 6500, metalLevel: 'Silver', rating: 3.5,
  },
  {
    id: 'demo-5', name: 'Medica Silver EPO Missouri',
    issuer: 'Medica', type: 'EPO',
    premium: 265, deductible: 3500, oopMax: 7500, metalLevel: 'Silver', rating: 3.0,
  },
  {
    id: 'demo-6', name: 'Aetna Platinum HMO Missouri',
    issuer: 'Aetna CVS Health', type: 'HMO',
    premium: 520, deductible: 500, oopMax: 3500, metalLevel: 'Platinum', rating: 4.5,
  },
]

// Priority weights: rank 1 gets the most weight, rank 6 the least
const PRIORITY_WEIGHTS = [0.30, 0.25, 0.20, 0.13, 0.08, 0.04]

const HIGH_NEED_CONDITIONS = new Set(['heartDisease', 'cancer', 'pregnancy'])
const MODERATE_NEED_CONDITIONS = new Set(['diabetes', 'chronicPain', 'asthma'])

function normalize(value: number, min: number, max: number): number {
  if (max === min) return 1
  return 1 - (value - min) / (max - min)
}

function priorityScore(priorityId: string, plan: InsurancePlan): number {
  const metal = plan.metalLevel.toLowerCase()
  switch (priorityId) {
    case 'doctor': return 0.70
    case 'mental': return plan.type === 'HMO' ? 0.82 : 0.72
    case 'rx':
      return ['gold', 'platinum', 'silver'].includes(metal) ? 0.85 : 0.55
    case 'dental':
      return metal === 'platinum' ? 0.80 : plan.type === 'PPO' ? 0.60 : 0.35
    default: return 0.50
  }
}

function conditionBonus(plan: InsurancePlan, conditions: string[]): number {
  if (conditions.length === 0 || conditions.includes('none')) return 0
  const metal = plan.metalLevel.toLowerCase()
  const hasHigh = conditions.some(c => HIGH_NEED_CONDITIONS.has(c))
  const hasModerate = conditions.some(c => MODERATE_NEED_CONDITIONS.has(c))

  let bonus = 0
  if (hasHigh) {
    if (metal === 'platinum') bonus = 0.15
    else if (metal === 'gold') bonus = 0.10
    else if (metal === 'silver') bonus = 0.02
    else bonus = -0.05
  } else if (hasModerate) {
    if (metal === 'gold') bonus = 0.08
    else if (metal === 'silver') bonus = 0.06
    else if (metal === 'platinum') bonus = 0.04
    else bonus = -0.03
  }

  if (conditions.includes('mentalHealth')) {
    bonus += plan.type === 'HMO' ? 0.03 : 0.01
  }
  return bonus
}

export interface ScoredPlan {
  plan: InsurancePlan
  score: number
  rank: number
  reason: string
  benefits: string[]
}

export function rerankPlans(
  recs: PlanRecommendation[],
  conditions: string[],
  priorities: string[],
): ScoredPlan[] {
  const premiums = recs.map(r => r.plan.premium)
  const deductibles = recs.map(r => r.plan.deductible)
  const minP = Math.min(...premiums), maxP = Math.max(...premiums)
  const minD = Math.min(...deductibles), maxD = Math.max(...deductibles)

  const scored = recs.map(rec => {
    const pNorm = normalize(rec.plan.premium, minP, maxP)
    const dNorm = normalize(rec.plan.deductible, minD, maxD)

    const scoreComponents: Record<string, number> = {
      premium: pNorm,
      deductible: dNorm,
    }

    let total = priorities.reduce((sum, id, i) => {
      const s = scoreComponents[id] ?? priorityScore(id, rec.plan)
      return sum + s * PRIORITY_WEIGHTS[i]
    }, 0)

    total += conditionBonus(rec.plan, conditions)
    return { rec, total }
  })

  scored.sort((a, b) => b.total - a.total)

  return scored.map(({ rec, total }, i) => ({
    plan: rec.plan,
    score: Math.round(total * 100),
    rank: i + 1,
    reason: rec.reason,
    benefits: inferBenefits(rec.plan, conditions),
  }))
}

export function inferBenefits(plan: InsurancePlan, conditions: string[]): string[] {
  const metal = plan.metalLevel.toLowerCase()
  const out: string[] = []

  if (plan.premium < 250) out.push('Low premium')
  if (plan.deductible < 2000) out.push('Low deductible')
  if (metal === 'gold' || metal === 'platinum') out.push('Low cost-sharing')
  if (metal === 'silver') out.push('Subsidy-eligible')
  if (plan.type === 'PPO') out.push('See any doctor')
  if (plan.type === 'HMO') out.push('Coordinated care')
  if (conditions.includes('mentalHealth') && plan.type === 'HMO') out.push('MH network')
  if (conditions.some(c => MODERATE_NEED_CONDITIONS.has(c)) && (metal === 'gold' || metal === 'silver'))
    out.push('Chronic care friendly')

  return out.slice(0, 4)
}

export function estimateCopay(plan: InsurancePlan) {
  const m = plan.metalLevel.toLowerCase()
  if (m === 'platinum') return { pcp: '~$10', specialist: '~$30', er: '~$150' }
  if (m === 'gold') return { pcp: '~$20', specialist: '~$50', er: '~$250' }
  if (m === 'silver') return { pcp: '~$30', specialist: '~$65', er: '~$350' }
  return { pcp: '~$45', specialist: '~$90', er: '~$500' }
}

export function bestForLabel(plan: InsurancePlan): string {
  const m = plan.metalLevel.toLowerCase()
  if (m === 'platinum') return 'Frequent healthcare users'
  if (m === 'gold') return 'Moderate to high healthcare needs'
  if (m === 'silver') return 'Balanced coverage and cost'
  if (m === 'bronze') return 'Healthy, low-use individuals'
  return 'Varies by individual'
}

// 2025 FPL check for subsidy eligibility
export function isSubsidyEligible(income: number, householdSize: number): boolean {
  const fpl = 15650 + (householdSize - 1) * 5590
  const pct = (income / fpl) * 100
  return pct >= 100 && pct < 400
}

// Estimate monthly premium tax credit (APTC) based on 2024 ACA rules.
// Uses the benchmark silver plan premium to calculate the credit amount.
// Returns 0 if not eligible.
export function calcEstimatedSubsidy(
  income: number,
  householdSize: number,
  benchmarkSilverPremium: number,
): number {
  if (income <= 0) return benchmarkSilverPremium
  const fpl = 15650 + (householdSize - 1) * 5590
  const fplPct = (income / fpl) * 100
  if (fplPct >= 400) return 0

  let capPct = 0
  if (fplPct < 150) capPct = 0
  else if (fplPct < 200) capPct = ((fplPct - 150) / 50) * 0.02
  else if (fplPct < 250) capPct = 0.02 + ((fplPct - 200) / 50) * 0.02
  else if (fplPct < 300) capPct = 0.04 + ((fplPct - 250) / 50) * 0.02
  else capPct = 0.06 + ((fplPct - 300) / 100) * 0.025

  const monthlyIncomeCap = (income * capPct) / 12
  return Math.max(0, benchmarkSilverPremium - monthlyIncomeCap)
}

// Apply the subsidy credit to a plan premium (never below $0)
export function applySubsidy(premium: number, credit: number): number {
  return Math.max(0, premium - credit)
}
