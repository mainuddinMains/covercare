export type MrfInsurer = 'aetna' | 'uhc' | 'cigna' | 'anthem' | 'bcbs'

export interface PlanFileEntry {
  planName: string
  description: string
  url: string
}

export interface RateSummary {
  billingCode: string
  description: string
  min: number
  max: number
  median: number
  avg: number
  sampleSize: number
}

export const CPT_CODES: { code: string; label: string; category: string }[] = [
  { code: '99213', label: 'Office Visit - Established Patient (low complexity)', category: 'Primary Care' },
  { code: '99214', label: 'Office Visit - Established Patient (moderate complexity)', category: 'Primary Care' },
  { code: '99203', label: 'Office Visit - New Patient (low complexity)', category: 'Primary Care' },
  { code: '99204', label: 'Office Visit - New Patient (moderate complexity)', category: 'Primary Care' },
  { code: '99283', label: 'Emergency Department - Moderate Severity', category: 'Emergency' },
  { code: '99285', label: 'Emergency Department - High Severity', category: 'Emergency' },
  { code: '80053', label: 'Comprehensive Metabolic Panel', category: 'Lab' },
  { code: '85025', label: 'Complete Blood Count (CBC)', category: 'Lab' },
  { code: '71046', label: 'Chest X-Ray (2 views)', category: 'Imaging' },
  { code: '72148', label: 'MRI Lumbar Spine without contrast', category: 'Imaging' },
  { code: '93000', label: 'Electrocardiogram (ECG)', category: 'Cardiology' },
  { code: '90837', label: 'Psychotherapy 60 minutes', category: 'Mental Health' },
  { code: '90834', label: 'Psychotherapy 45 minutes', category: 'Mental Health' },
  { code: '27447', label: 'Total Knee Replacement', category: 'Surgery' },
  { code: '43239', label: 'Upper GI Endoscopy', category: 'GI' },
]

export function normalizeInsurer(issuerName: string): MrfInsurer | null {
  const n = issuerName.toLowerCase()
  if (n.includes('cigna')) return 'cigna'
  if (n.includes('united') || n.includes('uhc') || n.includes('unitedhealthcare')) return 'uhc'
  if (n.includes('aetna')) return 'aetna'
  if (n.includes('anthem') || n.includes('elevance')) return 'anthem'
  if (n.includes('bcbs') || n.includes('blue cross') || n.includes('blue shield')) return 'bcbs'
  return null
}

export function getMrfPortalUrl(insurer: MrfInsurer): string {
  switch (insurer) {
    case 'aetna': return 'https://www.aetna.com/individuals-families/member-rights-resources/machine-readable-files.html'
    case 'uhc': return 'https://transparency-in-coverage.uhc.com/'
    case 'cigna': return 'https://www.cigna.com/legal/compliance/machine-readable-files'
    case 'anthem': return 'https://www.anthem.com/machine-readable-file/search/'
    case 'bcbs': return 'https://www.bcbs.com/bcbs-institute/transparency'
  }
}

// Aetna table-of-contents via HealthSparq CDN.
// brand codes: ALICFI = fully insured, ALICSI = self-insured, TEXASFI = Texas
// Tries previous months descending until one is found.
export function buildAetnaIndexUrl(brandCode = 'ALICFI', date?: Date): string {
  const d = date ?? monthOffset(new Date(), -1)
  const s = ymd(d)
  return (
    `https://mrf.healthsparq.com/aetnacvs-egress.nophi.kyruushsq.com/prd/mrf/` +
    `AETNACVS_I/${brandCode}/${s}/tableOfContents/${s}_Aetna-Life-Insurance-Company_index.json.gz`
  )
}

// Anthem S3 index (may return 403 - current access status unknown)
export function buildAnthemIndexUrl(date?: Date): string {
  return `https://antm-pt-prod-dataz-nogbd-nophi-us-east1.s3.amazonaws.com/anthem/${ymd(date ?? monthOffset(new Date(), -1))}_anthem_index.json.gz`
}

// UHC blobs listing API - returns array of file name strings
export const UHC_BLOBS_URL = 'https://transparency-in-coverage.uhc.com/api/v1/uhc/blobs/'
export const UHC_DOWNLOAD_BASE = 'https://transparency-in-coverage.uhc.com/api/v1/uhc/blobs/download'

// Cigna MRF portal page - contains CloudFront signed links in HTML
export const CIGNA_PORTAL_URL = 'https://www.healthplan.org/cigna_mrfs'

export function ymd(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export function monthOffset(d: Date, months: number): Date {
  const r = new Date(d)
  r.setMonth(r.getMonth() + months)
  return r
}

// Extract plan file URLs from a parsed CMS standard TOC JSON
export function extractPlanFiles(toc: unknown): PlanFileEntry[] {
  const files: PlanFileEntry[] = []
  const root = toc as Record<string, unknown>
  const structure = root.reporting_structure as unknown[] | undefined
  if (!Array.isArray(structure)) return files
  for (const item of structure) {
    const entry = item as Record<string, unknown>
    const plans = entry.reporting_plans as Array<Record<string, unknown>> | undefined
    const planName = Array.isArray(plans) && plans[0]
      ? String(plans[0].plan_name ?? '')
      : String(entry.plan_name ?? '')
    const inNetworkFiles = entry.in_network_files as Array<Record<string, unknown>> | undefined
    if (Array.isArray(inNetworkFiles)) {
      for (const f of inNetworkFiles) {
        const url = String(f.location ?? f.url ?? '')
        if (url) {
          files.push({ planName, description: String(f.description ?? ''), url })
        }
      }
    }
  }
  return files
}
