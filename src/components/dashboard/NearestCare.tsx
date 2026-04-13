import { useEffect, useState } from 'react'
import { Phone, MapPin, LocateFixed, Loader2 } from 'lucide-react'
import { useInsuranceStore } from '@/store/appStore'
import type { CMSPhysician } from '@/lib/cms-physicians'

type GeoPhase = 'idle' | 'locating' | 'error'

async function detectZip(): Promise<string> {
  const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 })
  )
  const { latitude: lat, longitude: lon } = pos.coords
  const res = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
  )
  const data = await res.json() as { postcode?: string }
  const zip = (data.postcode ?? '').replace(/\D/g, '').slice(0, 5)
  if (!zip) throw new Error('Could not determine ZIP from location.')
  return zip
}

export default function NearestCare() {
  const { profile, updateField } = useInsuranceStore()
  const [providers, setProviders] = useState<CMSPhysician[]>([])
  const [loading, setLoading] = useState(false)
  const [geoPhase, setGeoPhase] = useState<GeoPhase>('idle')
  const [geoError, setGeoError] = useState('')

  useEffect(() => {
    if (!profile.zip || profile.zip.length !== 5) return
    setLoading(true)
    fetch(`/api/providers/?zip=${profile.zip}`)
      .then(r => r.json())
      .then((data: { results?: CMSPhysician[] }) => setProviders((data.results ?? []).slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [profile.zip])

  async function handleDetect() {
    setGeoPhase('locating')
    setGeoError('')
    try {
      const zip = await detectZip()
      updateField('zip', zip)
      setGeoPhase('idle')
    } catch (err) {
      setGeoError(err instanceof Error ? err.message : 'Location access denied or unavailable.')
      setGeoPhase('error')
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <MapPin size={14} className="text-primary" />
        <h2 className="font-heading text-sm font-semibold">Care Near You</h2>
      </div>

      {!profile.zip && (
        <div className="rounded-lg border border-dashed p-3 space-y-2">
          <p className="text-xs text-muted-foreground">
            No ZIP code set. Detect your location or add it in Profile.
          </p>
          <button
            type="button"
            onClick={handleDetect}
            disabled={geoPhase === 'locating'}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {geoPhase === 'locating' ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <LocateFixed size={12} />
            )}
            {geoPhase === 'locating' ? 'Detecting...' : 'Detect my location'}
          </button>
          {geoPhase === 'error' && (
            <p className="text-[11px] text-destructive">{geoError}</p>
          )}
        </div>
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
