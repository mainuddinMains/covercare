import { useState } from 'react'
import type { CMSHospital, HospitalSearchResult } from '@/lib/cms-hospitals'
import { reverseGeocode } from '@/lib/geocoding'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import MiniMap from '@/components/MiniMap'
import {
  Star,
  Phone,
  Loader2,
  Search,
  Siren,
  Building2,
  MapPin,
  PersonStanding,
  Car,
  Train,
  Navigation,
} from 'lucide-react'

interface TravelInfo {
  duration: string
  distance: string
}

interface HospitalDistances {
  driving: TravelInfo | null
  walking: TravelInfo | null
  transit: TravelInfo | null
}

export default function HospitalFinder() {
  const [hospitals, setHospitals] = useState<CMSHospital[]>([])
  const [distances, setDistances] = useState<HospitalDistances[]>([])
  const [widened, setWidened] = useState(false)
  const [loading, setLoading] = useState(false)
  const [locating, setLocating] = useState(false)
  const [zip, setZip] = useState('')
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')

  async function searchByZip(
    searchZip: string,
    userCoords?: { lat: number; lng: number } | null,
  ) {
    setLoading(true)
    setError('')
    setSearched(true)
    setDistances([])

    try {
      const res = await fetch(`/api/hospitals?zip=${searchZip}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = (await res.json()) as HospitalSearchResult
      setHospitals(data.hospitals)
      setWidened(data.widened)

      const activeCoords = userCoords ?? coords
      if (activeCoords && data.hospitals.length > 0) {
        const origin = `${activeCoords.lat},${activeCoords.lng}`
        const dests = data.hospitals
          .map((h) => `${h.address}, ${h.city}, ${h.state} ${h.zip}`)
          .join('|')

        const distRes = await fetch(
          `/api/distance?origin=${encodeURIComponent(origin)}&dests=${encodeURIComponent(dests)}`,
        )
        if (distRes.ok) {
          const distData = await distRes.json() as {
            driving: (TravelInfo | null)[]
            walking: (TravelInfo | null)[]
            transit: (TravelInfo | null)[]
          }
          setDistances(
            data.hospitals.map((_, i) => ({
              driving: distData.driving[i] ?? null,
              walking: distData.walking[i] ?? null,
              transit: distData.transit[i] ?? null,
            })),
          )
        }
      }
    } catch {
      setError('Could not load hospitals. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (zip.length === 5) searchByZip(zip)
  }

  function handleLocate() {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      return
    }

    setLocating(true)
    setError('')

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const loc = await reverseGeocode(
            pos.coords.latitude,
            pos.coords.longitude,
          )
          if (!loc.zip) {
            setError('Could not determine your ZIP code. Please enter it manually.')
            setLocating(false)
            return
          }
          const newCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          setCoords(newCoords)
          setZip(loc.zip)
          setLocating(false)
          searchByZip(loc.zip, newCoords)
        } catch {
          setError('Could not determine your location. Please enter a ZIP code.')
          setLocating(false)
        }
      },
      () => {
        setError('Location permission denied. Please enter a ZIP code.')
        setLocating(false)
      },
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading text-xl font-semibold">
          Find Hospitals
        </h1>
        <p className="text-sm text-muted-foreground">
          CMS Medicare-certified hospitals searchable by ZIP code.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={zip}
          onChange={(e) => {
            setZip(e.target.value.replace(/\D/g, '').slice(0, 5))
            setCoords(null)
          }}
          placeholder="Enter ZIP code"
          inputMode="numeric"
          maxLength={5}
        />
        <Button type="submit" disabled={zip.length !== 5 || loading}>
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Search size={16} />
          )}
        </Button>
      </form>

      <Button
        variant="outline"
        className="w-full"
        disabled={locating || loading}
        onClick={handleLocate}
      >
        {locating ? (
          <Loader2 size={16} className="mr-2 animate-spin" />
        ) : (
          <MapPin size={16} className="mr-2" />
        )}
        {locating ? 'Detecting location...' : 'Use My Location'}
      </Button>

      {zip.length === 5 && <MiniMap zip={zip} coords={coords} />}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {searched && !loading && hospitals.length === 0 && !error && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No hospitals found in this area.
        </p>
      )}

      {widened && hospitals.length > 0 && !loading && (
        <p className="text-xs text-muted-foreground">
          Showing hospitals in the wider {zip.slice(0, 3)}xx area.
        </p>
      )}

      <div className="space-y-3">
        {hospitals.map((h, i) => {
          const dest = encodeURIComponent(
            `${h.address}, ${h.city}, ${h.state} ${h.zip}`,
          )
          const origin = coords
            ? encodeURIComponent(`${coords.lat},${coords.lng}`)
            : ''
          const googleBase = `https://www.google.com/maps/dir/?api=1&destination=${dest}${origin ? `&origin=${origin}` : ''}`
          const appleBase = `https://maps.apple.com/?daddr=${dest}${coords ? `&saddr=${coords.lat},${coords.lng}` : ''}`
          const dist = distances[i] ?? null

          return (
            <Card key={h.facilityId}>
              <CardContent className="p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold leading-tight">
                      {h.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {h.address}, {h.city}, {h.state} {h.zip}
                    </p>
                  </div>
                  {h.emergencyServices && (
                    <Badge variant="destructive" className="shrink-0 gap-1">
                      <Siren size={10} />
                      ER
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  {h.overallRating != null && (
                    <span className="flex items-center gap-1">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      {h.overallRating}/5 CMS Rating
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Building2 size={12} />
                    {h.type}
                  </span>
                  {h.phone && (
                    <a
                      href={`tel:${h.phone}`}
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      <Phone size={12} />
                      {h.phone}
                    </a>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={`${googleBase}&travelmode=walking`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                  >
                    <PersonStanding size={12} />
                    Walk
                    {dist?.walking && (
                      <span className="text-muted-foreground">
                        {dist.walking.duration} ({dist.walking.distance})
                      </span>
                    )}
                  </a>
                  <a
                    href={`${googleBase}&travelmode=driving`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                  >
                    <Car size={12} />
                    Drive
                    {dist?.driving && (
                      <span className="text-muted-foreground">
                        {dist.driving.duration} ({dist.driving.distance})
                      </span>
                    )}
                  </a>
                  <a
                    href={`${googleBase}&travelmode=transit`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                  >
                    <Train size={12} />
                    Transit
                    {dist?.transit && (
                      <span className="text-muted-foreground">
                        {dist.transit.duration} ({dist.transit.distance})
                      </span>
                    )}
                  </a>
                  <a
                    href={googleBase}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    <Navigation size={12} />
                    Google Maps
                  </a>
                  <a
                    href={appleBase}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    <Navigation size={12} />
                    Apple Maps
                  </a>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {hospitals.length > 0 && (
        <p className="text-center text-[10px] text-muted-foreground">
          Source: CMS Provider Data Catalog
        </p>
      )}
    </div>
  )
}
