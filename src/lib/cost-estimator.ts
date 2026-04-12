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
  'aca-bronze': 'ACA Marketplace - Bronze',
  'aca-silver': 'ACA Marketplace - Silver',
  'aca-gold': 'ACA Marketplace - Gold',
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
  'aca-bronze': { totalCostMultiplier: 1.0, coinsurance: 0.4, typicalDeductible: 7000, note: '40% coinsurance after ~$7,000 deductible' },
  'aca-silver': { totalCostMultiplier: 1.0, coinsurance: 0.3, typicalDeductible: 4500, note: '30% coinsurance after ~$4,500 deductible' },
  'aca-gold': { totalCostMultiplier: 1.0, coinsurance: 0.2, typicalDeductible: 1500, note: '20% coinsurance after ~$1,500 deductible' },
  employer: { totalCostMultiplier: 1.0, coinsurance: 0.2, typicalDeductible: 1500, note: '20% coinsurance after ~$1,500 avg deductible' },
  uninsured: { totalCostMultiplier: 1.0, coinsurance: 1.0, typicalDeductible: 0, note: 'Full charge; ask about self-pay discounts (40-60% off)' },
}

export interface CostEstimate {
  procedure: string
  cpt: string
  medicareRate: number | null
  avgSubmittedCharge: number | null
  totalEstimatedCost: number | null
  outOfPocketLow: number | null
  outOfPocketHigh: number | null
  insurance: InsuranceType
  insuranceLabel: string
  note: string
  source: string
}

interface MedicareRateResult {
  allowedAmount: number
  submittedCharge: number
}

async function getMedicareRate(cpt: string): Promise<MedicareRateResult | null> {
  try {
    const params = new URLSearchParams({
      'filter[HCPCS_Cd]': cpt,
      'filter[Rndrng_Prvdr_Geo_Lvl]': 'National',
      'filter[Place_Of_Srvc]': 'O',
      size: '1',
    })

    const res = await fetch(
      `https://data.cms.gov/data-api/v1/dataset/6fea9d79-0129-4e4c-b1b8-23cd86a4f435/data?${params}`,
    )

    if (!res.ok) return null

    const rows: Record<string, string>[] = await res.json()
    const row = rows?.[0]
    if (!row) return null

    const allowedAmount = parseFloat(row.Avg_Mdcr_Alowd_Amt ?? '0')
    const submittedCharge = parseFloat(row.Avg_Sbmtd_Chrg ?? '0')
    return allowedAmount > 0 ? { allowedAmount, submittedCharge } : null
  } catch {
    return null
  }
}

export async function estimateCost(
  procedureKey: string,
  insurance: InsuranceType,
): Promise<CostEstimate> {
  const proc = PROCEDURES[procedureKey]
  if (!proc) throw new Error(`Unknown procedure: ${procedureKey}`)

  const config = INSURANCE_CONFIG[insurance]
  const rate = await getMedicareRate(proc.cpt)

  if (!rate) {
    return {
      procedure: proc.name,
      cpt: proc.cpt,
      medicareRate: null,
      avgSubmittedCharge: null,
      totalEstimatedCost: null,
      outOfPocketLow: null,
      outOfPocketHigh: null,
      insurance,
      insuranceLabel: INSURANCE_LABELS[insurance],
      note: 'CMS does not have rate data for this procedure. Contact your insurer for a cost estimate.',
      source: 'CMS Medicare Physician & Other Practitioners (2023)',
    }
  }

  // Use the real submitted charge (what providers bill) as the basis for
  // commercial and uninsured estimates instead of applying arbitrary multipliers
  // to the Medicare allowed amount. For Medicare/Medicaid, use the allowed amount.
  const totalCost =
    insurance === 'medicare'
      ? rate.allowedAmount
      : insurance === 'medicaid'
        ? rate.allowedAmount * config.totalCostMultiplier
        : rate.submittedCharge * config.totalCostMultiplier

  const outOfPocketLow = Math.round(totalCost * config.coinsurance)
  const outOfPocketHigh = Math.min(
    Math.round(totalCost * config.coinsurance + config.typicalDeductible),
    Math.round(totalCost),
  )

  return {
    procedure: proc.name,
    cpt: proc.cpt,
    medicareRate: Math.round(rate.allowedAmount),
    avgSubmittedCharge: Math.round(rate.submittedCharge),
    totalEstimatedCost: Math.round(totalCost),
    outOfPocketLow,
    outOfPocketHigh,
    insurance,
    insuranceLabel: INSURANCE_LABELS[insurance],
    note: config.note,
    source: 'CMS Medicare Physician & Other Practitioners (2023)',
  }
}
