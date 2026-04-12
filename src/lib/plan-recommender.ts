import type { InsurancePlan, PlanRecommendation } from './types'

// 2025 Federal Poverty Level (continental US)
const FPL_BASE = 15650
const FPL_PER_PERSON = 5590

export function calcFplPercent(income: number, householdSize: number): number {
  const fpl = FPL_BASE + (householdSize - 1) * FPL_PER_PERSON
  return (income / fpl) * 100
}

function metalWeight(metalLevel: string, fplPercent: number): number {
  const level = metalLevel.toLowerCase()
  if (fplPercent < 150) {
    // Very low income: Bronze and Catastrophic are affordable options;
    // Silver gets CSR boost but Bronze should not be penalized heavily
    if (level === 'silver') return 1.0
    if (level === 'bronze') return 0.95
    if (level === 'catastrophic') return 0.90
    if (level === 'gold') return 0.5
    if (level === 'platinum') return 0.3
  } else if (fplPercent < 250) {
    // Low-moderate: Silver has cost-sharing reductions, Bronze still affordable
    if (level === 'silver') return 1.0
    if (level === 'bronze') return 0.85
    if (level === 'gold') return 0.8
    if (level === 'platinum') return 0.4
  } else if (fplPercent < 400) {
    // Moderate: Gold or Silver
    if (level === 'gold') return 1.0
    if (level === 'silver') return 0.9
    if (level === 'platinum') return 0.7
    if (level === 'bronze') return 0.4
  } else {
    // Higher income: Gold or Platinum if you use care often
    if (level === 'platinum') return 1.0
    if (level === 'gold') return 0.9
    if (level === 'silver') return 0.6
    if (level === 'bronze') return 0.3
  }
  return 0.5
}

function normalize(value: number, min: number, max: number): number {
  if (max === min) return 1
  return 1 - (value - min) / (max - min)
}

function metalLabel(level: string): string {
  return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase()
}

function buildReason(
  plan: InsurancePlan,
  fplPercent: number,
  premiumRank: number,
  deductibleRank: number,
  oopRank: number,
): string {
  const metal = metalLabel(plan.metalLevel)
  const parts: string[] = []

  if (premiumRank === 1) parts.push('lowest monthly premium')
  else if (premiumRank === 2) parts.push('low monthly premium')

  if (deductibleRank === 1) parts.push('lowest deductible')
  else if (deductibleRank === 2) parts.push('low deductible')

  if (oopRank === 1) parts.push('lowest out-of-pocket maximum')

  if (fplPercent < 250 && plan.metalLevel.toLowerCase() === 'silver') {
    parts.push('eligible for Silver cost-sharing reductions at your income')
  } else if (fplPercent >= 250 && fplPercent < 400 && plan.metalLevel.toLowerCase() === 'gold') {
    parts.push('Gold plans offer strong coverage at your income level')
  } else if (parts.length === 0) {
    parts.push(`${metal} plan balances premium and coverage for your household`)
  }

  return parts.length > 0
    ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) +
        (parts.length > 1 ? '; ' + parts.slice(1).join('; ') : '')
    : `${metal} plan is a solid fit for your situation`
}

export function recommendPlans(
  plans: InsurancePlan[],
  income: number,
  householdSize: number,
  topN = 3,
): PlanRecommendation[] {
  if (plans.length === 0) return []

  const fplPercent = calcFplPercent(income, householdSize)

  const premiums = plans.map((p) => p.premium)
  const deductibles = plans.map((p) => p.deductible)
  const oops = plans.map((p) => p.oopMax).filter((v) => v > 0)
  const hasOop = oops.length > 0

  const minP = Math.min(...premiums)
  const maxP = Math.max(...premiums)
  const minD = Math.min(...deductibles)
  const maxD = Math.max(...deductibles)
  const minO = hasOop ? Math.min(...oops) : 0
  const maxO = hasOop ? Math.max(...oops) : 0

  const scored = plans.map((plan) => {
    const premiumScore = normalize(plan.premium, minP, maxP)
    const deductibleScore = normalize(plan.deductible, minD, maxD)
    const oopScore = hasOop ? normalize(plan.oopMax, minO, maxO) : 0
    const metalScore = metalWeight(plan.metalLevel, fplPercent)

    const oopWeight = hasOop ? 0.20 : 0
    const premiumWeight = hasOop ? 0.35 : 0.50
    const deductibleWeight = hasOop ? 0.30 : 0.35

    const score =
      premiumScore * premiumWeight +
      deductibleScore * deductibleWeight +
      oopScore * oopWeight +
      metalScore * 0.15

    return { plan, score }
  })

  scored.sort((a, b) => b.score - a.score)
  const top = scored.slice(0, topN)

  const sortedByPremium = [...plans].sort((a, b) => a.premium - b.premium)
  const sortedByDeductible = [...plans].sort((a, b) => a.deductible - b.deductible)
  const sortedByOop = [...plans].sort((a, b) => a.oopMax - b.oopMax)

  return top.map(({ plan, score }, i) => {
    const premiumRank = sortedByPremium.findIndex((p) => p.id === plan.id) + 1
    const deductibleRank = sortedByDeductible.findIndex((p) => p.id === plan.id) + 1
    const oopRank = sortedByOop.findIndex((p) => p.id === plan.id) + 1

    return {
      plan,
      score: Math.round(score * 100),
      reason: buildReason(plan, fplPercent, premiumRank, deductibleRank, oopRank),
      rank: i + 1,
    }
  })
}
