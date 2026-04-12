export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  rating?: number;
  totalRatings?: number;
  openNow?: boolean;
  lat: number;
  lng: number;
  distanceMiles?: number;
}

interface PlacesResponse {
  places?: PlaceResult[];
}

interface PlaceResult {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  nationalPhoneNumber?: string;
  websiteUri?: string;
  rating?: number;
  userRatingCount?: number;
  currentOpeningHours?: { openNow?: boolean };
  location?: { latitude: number; longitude: number };
}

function haversineMiles(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function findHospitals(
  lat: number,
  lng: number,
  radiusMeters = 16000 // ~10 miles
): Promise<Hospital[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_PLACES_API_KEY is not set");

  const res = await fetch(
    "https://places.googleapis.com/v1/places:searchNearby",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": [
          "places.id",
          "places.displayName",
          "places.formattedAddress",
          "places.nationalPhoneNumber",
          "places.websiteUri",
          "places.rating",
          "places.userRatingCount",
          "places.currentOpeningHours.openNow",
          "places.location",
        ].join(","),
      },
      body: JSON.stringify({
        includedTypes: ["hospital", "emergency_room"],
        maxResultCount: 15,
        locationRestriction: {
          circle: {
            center: { latitude: lat, longitude: lng },
            radius: radiusMeters,
          },
        },
        rankPreference: "DISTANCE",
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google Places API error ${res.status}: ${err}`);
  }

  const data: PlacesResponse = await res.json();

  return (data.places ?? []).map((p) => ({
    id: p.id,
    name: p.displayName?.text ?? "Unknown",
    address: p.formattedAddress ?? "",
    phone: p.nationalPhoneNumber,
    website: p.websiteUri,
    rating: p.rating,
    totalRatings: p.userRatingCount,
    openNow: p.currentOpeningHours?.openNow,
    lat: p.location?.latitude ?? 0,
    lng: p.location?.longitude ?? 0,
    distanceMiles:
      p.location
        ? Math.round(haversineMiles(lat, lng, p.location.latitude, p.location.longitude) * 10) / 10
        : undefined,
  }));
}
