import { useState, useRef } from 'react'
import { usePreferencesStore } from '@/store/appStore'
import { translations } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import type { ScannedCard } from '@/lib/card-scanner'
import { Camera, Loader2, Upload } from 'lucide-react'

interface Props {
  onScan: (card: ScannedCard) => void
}

export default function InsuranceCardScanner({ onScan }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const locale = usePreferencesStore((s) => s.locale)
  const t = translations[locale]

  async function handleFile(file: File) {
    setError('')
    setLoading(true)

    try {
      const base64 = await fileToBase64(file)
      setPreview(base64)

      const res = await fetch('/api/scan-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 }),
      })

      if (!res.ok) throw new Error('Scan failed')
      const card: ScannedCard = await res.json()
      onScan(card)
    } catch {
      setError(t.scanner_error)
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-3">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        className="hidden"
      />

      {preview && (
        <img
          src={preview}
          alt={t.scanner_card_alt}
          className="w-full rounded-lg border border-border"
        />
      )}

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => fileRef.current?.click()}
          disabled={loading}
        >
          {loading ? (
            <Loader2 size={16} className="mr-2 animate-spin" />
          ) : (
            <Camera size={16} className="mr-2" />
          )}
          {loading ? t.scanner_scanning : t.scanner_take_photo}
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => {
            if (fileRef.current) {
              fileRef.current.removeAttribute('capture')
              fileRef.current.click()
              fileRef.current.setAttribute('capture', 'environment')
            }
          }}
          disabled={loading}
        >
          <Upload size={16} className="mr-2" />
          {t.scanner_upload}
        </Button>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
