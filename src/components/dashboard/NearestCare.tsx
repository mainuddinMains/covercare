import { useEffect, useState } from 'react'
import { Phone, MapPin } from 'lucide-react'
import { useInsuranceStore } from '@/store/appStore'
import type { CMSPhysician } from '@/lib/cms-physicians'

export default function NearestCare() {
  const { profile } = useInsuranceStore()
  const [providers, setProviders] = useState<CMSPhysician[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!profile.zip || profile.zip.length !== 5) return
    setLoading(true)
    fetch(`/api/providers/?zip=${profile.zip}`)
      .then(r => r.json())
      .then((data: { results?: CMSPhysician[] }) => setProviders((data.results ?? []).slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [profile.zip])

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <MapPin size={14} className="text-primary" />
        <h2 className="font-heading text-sm font-semibold">Care Near You</h2>
      </div>

      {!profile.zip && (
        <p className="text-xs text-muted-foreground rounded-lg border border-dashed p-3">
          Add your ZIP code in Profile to see nearby providers.
        </p>
      )}

      {profile.zip && loading && (
        <div className="rounded-lg border p-4 text-center text-xs text-muted-foreground animate-pulse">
          Finding providers near {profile.zip}...
        </div>
      )}

      {profile.zip && !loading && providers.length === 0 && (
        <p className="text-xs text-muted-foreground rounded-lg border border-dashed p-3">
          No providers found for ZIP {profile.zip}.
        </p>
      )}

      {providers.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4">
          {providers.map(p => (
            <div
              key={p.npi}
              className="shrink-0 w-52 rounded-xl border bg-card p-3 space-y-1.5"
            >
              <div>
                <p className="text-sm font-semibold leading-tight">
                  {p.firstName} {p.lastName}{p.credential ? `, ${p.credential}` : ''}
                </p>
                <p className="text-[10px] text-muted-foreground">{p.specialty}</p>
              </div>
              {p.facilityName && (
                <p className="text-[10px] text-muted-foreground truncate">{p.facilityName}</p>
              )}
              <p className="text-[10px] text-muted-foreground">{p.city}, {p.state}</p>
              {p.phone && (
                <a
                  href={`tel:${p.phone}`}
                  className="flex items-center gap-1 text-[11px] font-medium text-primary"
                >
                  <Phone size={11} />
                  {p.phone}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
