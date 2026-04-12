import { useState } from 'react'
import { RotateCw, X, MapPin } from 'lucide-react'

interface MiniMapProps {
  zip: string
  coords?: { lat: number; lng: number } | null
  showHospitals?: boolean
  locationDisplay?: string
  onReset?: () => void
}

export default function MiniMap({
  zip,
  coords,
  showHospitals,
  locationDisplay,
  onReset,
}: MiniMapProps) {
  const [key, setKey] = useState(0)

  const location = coords ? `${coords.lat},${coords.lng}` : zip
  const query = showHospitals
    ? encodeURIComponent(`hospitals near ${location}`)
    : encodeURIComponent(location)

  const src = `https://maps.google.com/maps?q=${query}&output=embed&zoom=13`

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      {coords && locationDisplay && (
        <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-3 py-2">
          <MapPin size={13} className="shrink-0 text-primary" />
          <span className="text-xs font-medium text-foreground">{locationDisplay}</span>
          <span className="ml-auto text-[10px] text-muted-foreground">
            {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
          </span>
        </div>
      )}
      <div className="relative">
        <iframe
          key={key}
          title={showHospitals ? 'Hospitals near you' : 'Your location'}
          width="100%"
          height="240"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={src}
          className="block"
        />
        <div className="absolute right-2 top-2 flex gap-1">
          <button
            onClick={() => setKey((k) => k + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-background/90 shadow-sm backdrop-blur-sm hover:bg-background"
            title="Refresh map"
          >
            <RotateCw size={14} />
          </button>
          {onReset && (
            <button
              onClick={onReset}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-background/90 shadow-sm backdrop-blur-sm hover:bg-background"
              title="Clear location"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
