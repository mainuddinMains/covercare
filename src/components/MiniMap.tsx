interface MiniMapProps {
  zip: string
  coords?: { lat: number; lng: number } | null
}

export default function MiniMap({ zip, coords }: MiniMapProps) {
  const query = coords
    ? `${coords.lat},${coords.lng}`
    : encodeURIComponent(zip)

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <iframe
        title="Map"
        width="100%"
        height="180"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://maps.google.com/maps?q=${query}&output=embed&zoom=13`}
        className="block"
      />
    </div>
  )
}
