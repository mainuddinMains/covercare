import { Phone } from 'lucide-react'

const LINES = [
  { label: 'Emergency', number: '911', href: 'tel:911', color: 'text-red-600' },
  { label: 'Mental Health Crisis', number: '988', href: 'tel:988', color: 'text-purple-600' },
  { label: 'Poison Control', number: '1-800-222-1222', href: 'tel:18002221222', color: 'text-amber-600' },
  { label: 'Insurance Hotline', number: 'Back of your card', href: null, color: 'text-muted-foreground' },
]

export default function QuickReference() {
  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      <h2 className="font-heading text-sm font-semibold">Quick Reference</h2>
      <div className="divide-y">
        {LINES.map(({ label, number, href, color }) => (
          <div key={label} className="flex items-center justify-between py-2">
            <p className="text-xs text-muted-foreground">{label}</p>
            {href ? (
              <a href={href} className={`flex items-center gap-1 text-xs font-semibold ${color}`}>
                <Phone size={11} />
                {number}
              </a>
            ) : (
              <p className={`text-xs font-medium ${color}`}>{number}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
