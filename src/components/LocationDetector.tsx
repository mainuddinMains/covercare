import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { reverseGeocode } from '@/lib/geocoding'
import type { DetectedLocation } from '@/lib/types'
import { MapPin, Loader2 } from 'lucide-react'
import { usePreferencesStore } from '@/store/appStore'
import { translations } from '@/lib/i18n'

interface Props {
  onDetect: (location: DetectedLocation) => void
  className?: string
}

export default function LocationDetector({ onDetect, className = '' }: Props) {
  const locale = usePreferencesStore((s) => s.locale)
  const t = translations[locale]

  const [loading, setLoading] = useState(false)
  const [manualZip, setManualZip] = useState('')
  const [error, setError] = useState('')

  async function detectLocation() {
    setLoading(true)
    setError('')

    if (!navigator.geolocation) {
      setError(t.location_error_geolocation)
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const loc = await reverseGeocode(
            pos.coords.latitude,
            pos.coords.longitude,
          )
          onDetect(loc)
        } catch {
          setError(t.location_error_determine)
        } finally {
          setLoading(false)
        }
      },
      () => {
        setError(t.location_error_permission)
        setLoading(false)
      },
    )
  }

  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (manualZip.length === 5) {
      onDetect({
        city: '',
        state: '',
        stateCode: '',
        zip: manualZip,
        display: manualZip,
      })
    }
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <Button
        onClick={detectLocation}
        disabled={loading}
        variant="outline"
        className="w-full"
      >
        {loading ? (
          <Loader2 size={16} className="mr-2 animate-spin" />
        ) : (
          <MapPin size={16} className="mr-2" />
        )}
        {loading ? t.location_locating : t.location_use_my_location}
      </Button>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        {t.location_or}
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleManualSubmit} className="flex gap-2">
        <Input
          value={manualZip}
          onChange={(e) => setManualZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
          placeholder={t.location_zip_placeholder}
          inputMode="numeric"
          maxLength={5}
        />
        <Button type="submit" disabled={manualZip.length !== 5}>
          {t.location_go}
        </Button>
      </form>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
