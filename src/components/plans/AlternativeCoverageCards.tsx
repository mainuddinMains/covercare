import { Building2, GraduationCap, Shield, Stethoscope, ExternalLink } from 'lucide-react'

const FPL_BASE = 14580
const FPL_PER_PERSON = 5140

function fplPercent(income: number, householdSize: number): number {
  const fpl = FPL_BASE + (householdSize - 1) * FPL_PER_PERSON
  return Math.round((income / fpl) * 100)
}

interface Props {
  income: number
  householdSize: number
  isStudent?: boolean
  isMilitary?: boolean
  showShortTerm?: boolean
  showEmployer?: boolean
}

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-card p-3 space-y-1.5">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-sm font-semibold">{title}</p>
      </div>
      <div className="text-xs text-muted-foreground space-y-1">{children}</div>
    </div>
  )
}

export default function AlternativeCoverageCards({
  income,
  householdSize,
  isStudent = false,
  isMilitary = false,
  showShortTerm = true,
  showEmployer = true,
}: Props) {
  const pct = fplPercent(income, householdSize)
  const medicaidLikely = pct <= 138
  const chipLikely = pct <= 200 && householdSize >= 2

  const hasAny = medicaidLikely || chipLikely || showEmployer || showShortTerm || isStudent || isMilitary
  if (!hasAny) return null

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        Other Coverage Options to Consider
      </p>

      {(medicaidLikely || chipLikely) && (
        <Card
          icon={<Stethoscope size={15} className="shrink-0 text-blue-600" />}
          title={medicaidLikely ? 'You may qualify for Medicaid' : 'Your children may qualify for CHIP'}
        >
          {medicaidLikely && (
            <p>
              Your income ({pct}% of the federal poverty level) suggests you likely qualify for Medicaid in states
              that expanded coverage. Medicaid provides free or very low-cost health coverage.
            </p>
          )}
          {!medicaidLikely && chipLikely && (
            <p>
              Your household income ({pct}% FPL) may qualify your children for CHIP, which provides low-cost
              coverage for kids in families that earn too much for Medicaid.
            </p>
          )}
          <a
            href="https://www.healthcare.gov/medicaid-chip/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            Check Medicaid/CHIP eligibility <ExternalLink size={10} />
          </a>
        </Card>
      )}

      {showEmployer && (
        <Card
          icon={<Building2 size={15} className="shrink-0 text-green-600" />}
          title="Employer-Sponsored Insurance"
        >
          <p>
            If you or your spouse's employer offers health insurance, it is often significantly cheaper than
            marketplace plans. Employers typically cover 50-80% of the monthly premium.
          </p>
          <p>
            Check with HR about enrollment windows, which are usually within 30 days of your hire date or during
            annual open enrollment each fall.
          </p>
        </Card>
      )}

      {showShortTerm && (
        <Card
          icon={<Shield size={15} className="shrink-0 text-amber-600" />}
          title="Short-Term Health Plans"
        >
          <p className="font-medium text-foreground">
            Temporary coverage (1-12 months) for gaps between jobs or while waiting for other coverage to start.
          </p>
          <p>
            <span className="font-medium text-green-700">Pros:</span> Lower monthly premiums, quick enrollment,
            flexible term lengths.
          </p>
          <p>
            <span className="font-medium text-red-700">Cons:</span> Do not cover pre-existing conditions, mental
            health, or maternity. Not ACA-compliant. Benefit caps apply.
          </p>
          <div className="flex gap-3 pt-0.5">
            <a
              href="https://www.ehealthinsurance.com/short-term-health-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              eHealth <ExternalLink size={10} />
            </a>
            <a
              href="https://www.healthmarkets.com/health-insurance/short-term/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              HealthMarkets <ExternalLink size={10} />
            </a>
          </div>
        </Card>
      )}

      {isStudent && (
        <Card
          icon={<GraduationCap size={15} className="shrink-0 text-purple-600" />}
          title="University Student Health Insurance Plan"
        >
          <p>
            Many universities offer a Student Health Insurance Plan (SHIP) that provides comprehensive group-rate
            coverage. On-campus health center visits are often included at no additional cost.
          </p>
          <p>
            Contact your university's student health center or student affairs office to compare SHIP costs before
            enrolling in a marketplace plan.
          </p>
        </Card>
      )}

      {isMilitary && (
        <Card
          icon={<Shield size={15} className="shrink-0 text-red-600" />}
          title="VA / TRICARE Coverage"
        >
          <p>
            As a veteran or active-duty service member, you may be eligible for VA health care or TRICARE, which
            are generally more comprehensive and lower cost than marketplace plans.
          </p>
          <div className="flex gap-3 pt-0.5">
            <a
              href="https://www.va.gov/health-care/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              VA Health Care <ExternalLink size={10} />
            </a>
            <a
              href="https://www.tricare.mil"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              TRICARE <ExternalLink size={10} />
            </a>
          </div>
        </Card>
      )}
    </div>
  )
}
