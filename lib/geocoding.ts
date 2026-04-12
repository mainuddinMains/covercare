export interface DetectedLocation {
  city: string;
  state: string;       // full name, e.g. "Missouri"
  stateCode: string;   // abbreviation, e.g. "MO"
  zip: string;
  display: string;     // e.g. "St. Louis, MO 63101"
}

interface BigDataCloudResponse {
  city?: string;
  locality?: string;
  principalSubdivision?: string;
  principalSubdivisionCode?: string; // "US-MO"
  postcode?: string;
}

export async function reverseGeocode(lat: number, lng: number): Promise<DetectedLocation> {
  const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);

  const data: BigDataCloudResponse = await res.json();

  const city      = data.city || data.locality || "";
  const state     = data.principalSubdivision ?? "";
  // principalSubdivisionCode is like "US-MO" — strip the country prefix
  const stateCode = (data.principalSubdivisionCode ?? "").replace(/^[A-Z]+-/, "");
  const zip       = data.postcode ?? "";

  const display = [city, stateCode, zip].filter(Boolean).join(", ");

  return { city, state, stateCode, zip, display };
}
