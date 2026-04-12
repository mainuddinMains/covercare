export const PROCEDURES: Record<
  string,
  { name: string; cpt: string; category: string }
> = {
  'office-visit-new': { name: 'Office Visit (New Patient)', cpt: '99203', category: 'Primary Care' },
  'office-visit-established': { name: 'Office Visit (Established)', cpt: '99213', category: 'Primary Care' },
  'er-visit-moderate': { name: 'Emergency Room Visit (Moderate)', cpt: '99283', category: 'Emergency' },
  'er-visit-high': { name: 'Emergency Room Visit (High)', cpt: '99285', category: 'Emergency' },
  'xray-chest': { name: 'Chest X-Ray (2 views)', cpt: '71046', category: 'Imaging' },
  'mri-brain': { name: 'MRI Brain w/ Contrast', cpt: '70553', category: 'Imaging' },
  'mri-knee': { name: 'MRI Knee', cpt: '73721', category: 'Imaging' },
  'ct-abdomen': { name: 'CT Scan Abdomen/Pelvis', cpt: '74177', category: 'Imaging' },
  'ct-head': { name: 'CT Scan Head', cpt: '70450', category: 'Imaging' },
  'ultrasound-abdomen': { name: 'Ultrasound, Abdomen', cpt: '76700', category: 'Imaging' },
  'blood-panel': { name: 'Comprehensive Metabolic Panel', cpt: '80053', category: 'Lab' },
  cbc: { name: 'Complete Blood Count (CBC)', cpt: '85025', category: 'Lab' },
  cholesterol: { name: 'Lipid Panel (Cholesterol)', cpt: '80061', category: 'Lab' },
  a1c: { name: 'Hemoglobin A1c', cpt: '83036', category: 'Lab' },
  urinalysis: { name: 'Urinalysis', cpt: '81001', category: 'Lab' },
  ekg: { name: 'Electrocardiogram (EKG)', cpt: '93000', category: 'Cardiology' },
  echo: { name: 'Echocardiogram', cpt: '93306', category: 'Cardiology' },
  'stress-test': { name: 'Cardiac Stress Test', cpt: '93015', category: 'Cardiology' },
  colonoscopy: { name: 'Colonoscopy (Diagnostic)', cpt: '45378', category: 'GI' },
  'upper-endoscopy': { name: 'Upper Endoscopy (EGD)', cpt: '43239', category: 'GI' },
  mammogram: { name: 'Mammogram (Screening)', cpt: '77067', category: 'Preventive' },
  'flu-shot': { name: 'Flu Shot Administration', cpt: '90471', category: 'Preventive' },
  'physical-annual': { name: 'Annual Wellness Visit', cpt: 'G0439', category: 'Preventive' },
  'knee-replacement': { name: 'Total Knee Replacement', cpt: '27447', category: 'Surgery' },
  'hip-replacement': { name: 'Total Hip Replacement', cpt: '27130', category: 'Surgery' },
  appendectomy: { name: 'Appendectomy (Laparoscopic)', cpt: '44950', category: 'Surgery' },
  gallbladder: { name: 'Gallbladder Removal (Lap)', cpt: '47562', category: 'Surgery' },
  cataract: { name: 'Cataract Surgery', cpt: '66984', category: 'Surgery' },
  'delivery-vaginal': { name: 'Vaginal Delivery', cpt: '59400', category: 'OB/GYN' },
  'delivery-csection': { name: 'C-Section Delivery', cpt: '59510', category: 'OB/GYN' },
  'physical-therapy': { name: 'Physical Therapy (1 session)', cpt: '97110', category: 'Therapy' },
}

export type InsuranceType =
  | 'medicare'
  | 'medicaid'
  | 'aca-bronze'
  | 'aca-silver'
  | 'aca-gold'
  | 'employer'
  | 'uninsured'

export const INSURANCE_LABELS: Record<InsuranceType, string> = {
  medicare: 'Medicare',
  medicaid: 'Medicaid',
  'aca-bronze': 'ACA Marketplace \u2014 Bronze',
  'aca-silver': 'ACA Marketplace \u2014 Silver',
  'aca-gold': 'ACA Marketplace \u2014 Gold',
  employer: 'Employer / Commercial Insurance',
  uninsured: 'Uninsured (Self-Pay)',
}

const INSURANCE_CONFIG: Record<
  InsuranceType,
  {
    totalCostMultiplier: number
    coinsurance: number
    typicalDeductible: number
    note: string
  }
> = {
  medicare: { totalCostMultiplier: 1.0, coinsurance: 0.2, typicalDeductible: 240, note: '20% after Part B deductible ($240/yr in 2024)' },
  medicaid: { totalCostMultiplier: 0.7, coinsurance: 0.02, typicalDeductible: 0, note: 'Near-zero cost share; varies by state' },
  'aca-bronze': { totalCostMultiplier: 2.5, coinsurance: 0.4, typicalDeductible: 7000, note: '40% coinsurance after ~$7,000 deductible' },
  'aca-silver': { totalCostMultiplier: 2.5, coinsurance: 0.3, typicalDeductible: 4500, note: '30% coinsurance after ~$4,500 deductible' },
  'aca-gold': { totalCostMultiplier: 2.5, coinsurance: 0.2, typicalDeductible: 1500, note: '20% coinsurance after ~$1,500 deductible' },
  employer: { totalCostMultiplier: 2.2, coinsurance: 0.2, typicalDeductible: 1500, note: '20% coinsurance after ~$1,500 avg deductible' },
  uninsured: { totalCostMultiplier: 3.5, coinsurance: 1.0, typicalDeductible: 0, note: 'Full charge; ask about self-pay discounts (40-60% off)' },
}

export interface CostEstimate {
  procedure: string
  cpt: string
  medicareRate: number
  totalEstimatedCost: number
  outOfPocketLow: number
  outOfPocketHigh: number
  insurance: InsuranceType
  insuranceLabel: string
  note: string
  source: string
}

async function getMedicareRate(cpt: string): Promise<number | null> {
  try {
    const params = new URLSearchParams({
      'filters[hcpcs_cd]': cpt,
      'filters[place_of_srvc]': 'F',
      size: '1',
      offset: '0',
    })

    const res = await fetch(
      `https://data.cms.gov/provider-summary-by-type-of-service/medicare-physician-fee-schedule/medicare-physician-fee-schedule-pfs/api/1/datastore/query?${params}`,
    )

    if (!res.ok) return null

    const data: Record<string, unknown> = await res.json()
    const rows = data?.data as Record<string, string>[] | undefined
    const row = rows?.[0]
    const amount = parseFloat(row?.avg_mdcr_alowd_amt ?? '0')
    return amount > 0 ? amount : null
  } catch {
    return null
  }
}

const FALLBACK_RATES: Record<string, number> = {
  '59400': 2300,
  '59510': 3200,
  '27447': 1850,
  '27130': 1800,
  '44950': 650,
  '47562': 800,
  '66984': 600,
  G0439: 95,
}

export async function estimateCost(
  procedureKey: string,
  insurance: InsuranceType,
): Promise<CostEstimate> {
  const proc = PROCEDURES[procedureKey]
  if (!proc) throw new Error(`Unknown procedure: ${procedureKey}`)

  const config = INSURANCE_CONFIG[insurance]

  let medicareRate = await getMedicareRate(proc.cpt)
  if (!medicareRate) medicareRate = FALLBACK_RATES[proc.cpt] ?? 100

  const totalCost = medicareRate * config.totalCostMultiplier

  const outOfPocketLow = Math.round(totalCost * config.coinsurance)
  const outOfPocketHigh = Math.min(
    Math.round(totalCost * config.coinsurance + config.typicalDeductible),
    Math.round(totalCost),
  )

  return {
    procedure: proc.name,
    cpt: proc.cpt,
    medicareRate: Math.round(medicareRate),
    totalEstimatedCost: Math.round(totalCost),
    outOfPocketLow,
    outOfPocketHigh,
    insurance,
    insuranceLabel: INSURANCE_LABELS[insurance],
    note: config.note,
    source: 'CMS Medicare Physician Fee Schedule (2024)',
  }
}
