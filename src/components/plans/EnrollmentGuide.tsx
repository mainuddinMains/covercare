import { useState } from 'react'
import { ChevronDown, ExternalLink } from 'lucide-react'

interface Props {
  isStudent?: boolean
}

export default function EnrollmentGuide({ isStudent = false }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-lg border">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between px-3 py-2.5 text-left"
      >
        <span className="text-sm font-semibold">How to Enroll</span>
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="border-t px-3 pb-3 pt-2 space-y-3 text-xs text-muted-foreground">
          <div>
            <p className="font-semibold text-foreground mb-1">Enrollment Periods</p>
            <p><span className="font-medium">Open Enrollment:</span> Nov 1 to Jan 15 each year. Plans chosen by Dec 15 start Jan 1.</p>
            <p className="mt-1"><span className="font-medium">Special Enrollment:</span> Within 60 days of a qualifying life event such as job loss, marriage, birth of a child, or moving to a new state.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-1">Steps to Enroll</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Save the plan you want to your profile using the Save to Profile button.</li>
              <li>Click "Enroll at healthcare.gov" on the plan card.</li>
              <li>Create a free account or log in at healthcare.gov.</li>
              <li>Enter your household info and income to confirm your tax credit amount.</li>
              <li>Select your plan and complete the application.</li>
              <li>Pay your first month's premium to activate coverage.</li>
            </ol>
          </div>
          {isStudent && (
            <div className="rounded bg-muted/60 p-2">
              <p className="font-medium text-foreground">International Students (F-1 / J-1)</p>
              <p className="mt-0.5">Most universities require enrollment in the campus Student Health Insurance Plan (SHIP) or an approved waiver. Contact your international student services office before applying on the marketplace.</p>
            </div>
          )}
          <a
            href="https://www.healthcare.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
          >
            Open healthcare.gov <ExternalLink size={10} />
          </a>
        </div>
      )}
    </div>
  )
}
