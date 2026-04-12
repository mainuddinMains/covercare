import { useState } from 'react'
import type { Hospital, DetectedLocation } from '@/lib/types'
import LocationDetector from './LocationDetector'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Star,
  Phone,
  ExternalLink,
  Loader2,
  MapPin,
} from 'lucide-react'

export default function HospitalFinder() {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState<DetectedLocation | null>(null)
  const [error, setError] = useState('')

  async function handleDetect(loc: DetectedLocation) {
    setLocation(loc)
    setLoading(true)
    setError('')

    if (loc.zip && !loc.city) {
      setError('Please use "Use My Location" for hospital search, or enter your location on the Profile page first.')
      setLoading(false)
      return
    }

    // If we have coordinates from geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const res = await fetch(
              `/api/hospitals?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`,
            )
            if (!res.ok) throw new Error('Failed to fetch hospitals')
            const data: Hospital[] = await res.json()
            setHospitals(data)
          } catch {
            setError('Could not load hospitals. Please try again.')
          } finally {
            setLoading(false)
          }
        },
        () => {
          setError('Location access needed for hospital search.')
          setLoading(false)
        },
      )
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold">Find Hospitals Near You</h1>
        <p className="text-sm text-muted-foreground">
          Real-time data from Google Maps.
        </p>
      </div>

      {!location && <LocationDetector onDetect={handleDetect} />}

      {location && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin size={14} />
          <span>{location.display}</span>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-muted-foreground" size={24} />
          <span className="ml-2 text-sm text-muted-foreground">
            Searching nearby hospitals...
          </span>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="space-y-3">
        {hospitals.map((h) => (
          <Card key={h.id}>
            <CardContent className="p-4">
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold">{h.name}</h3>
                  <p className="text-xs text-muted-foreground">{h.address}</p>
                </div>
                {h.openNow !== undefined && (
                  <Badge variant={h.openNow ? 'default' : 'secondary'}>
                    {h.openNow ? 'Open' : 'Closed'}
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                {h.rating && (
                  <span className="flex items-center gap-1">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    {h.rating}
                    {h.totalRatings && (
                      <span>({h.totalRatings})</span>
                    )}
                  </span>
                )}
                {h.distanceMiles !== undefined && (
                  <span>{h.distanceMiles} mi</span>
                )}
                {h.phone && (
                  <a
                    href={`tel:${h.phone}`}
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <Phone size={12} />
                    {h.phone}
                  </a>
                )}
                {h.website && (
                  <a
                    href={h.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <ExternalLink size={12} />
                    Website
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
