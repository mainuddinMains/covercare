"use client";

import { useState, useEffect } from "react";
import { Hospital } from "@/lib/google-places";
import { useInsuranceProfile } from "@/hooks/useInsuranceProfile";

type Status = "idle" | "locating" | "loading" | "done" | "error";

export default function HospitalFinder() {
  const { hasLocation, locationDisplay } = useInsuranceProfile();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState("16000");

  // Auto-locate on mount if we haven't already found coords
  useEffect(() => {
    if (status === "idle" && navigator.geolocation) locate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchHospitals(lat: number, lng: number, r = radius) {
    setStatus("loading");
    try {
      const res = await fetch(`/api/hospitals?lat=${lat}&lng=${lng}&radius=${r}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load hospitals");
      setHospitals(data.hospitals);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }

  function locate() {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setStatus("error");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        fetchHospitals(coords.lat, coords.lng);
      },
      () => {
        setError("Location access denied. Please allow location permissions.");
        setStatus("error");
      },
      { timeout: 10000 }
    );
  }

  function handleRadiusChange(newRadius: string) {
    setRadius(newRadius);
    if (userCoords) fetchHospitals(userCoords.lat, userCoords.lng, newRadius);
  }

  const radiusOptions = [
    { value: "5000",  label: "3 miles" },
    { value: "8000",  label: "5 miles" },
    { value: "16000", label: "10 miles" },
    { value: "32000", label: "20 miles" },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-xl font-semibold text-gray-900">Find Hospitals Near You</h2>
          {hasLocation && (
            <span className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5">
              {locationDisplay}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-1">Real-time data from Google Maps. Auto-locating on page load.</p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={locate}
          disabled={status === "locating" || status === "loading"}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          {status === "locating" ? (
            <>
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Locating...
            </>
          ) : status === "loading" ? (
            <>
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Searching...
            </>
          ) : (
            "Use My Location"
          )}
        </button>

        {userCoords && (
          <select
            value={radius}
            onChange={(e) => handleRadiusChange(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {radiusOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        )}
      </div>

      {/* Error */}
      {status === "error" && (
        <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-sm text-red-700 mb-4">
          {error}
        </div>
      )}

      {/* Idle prompt */}
      {status === "idle" && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">🏥</div>
          <p className="text-sm">Click "Use My Location" to find nearby hospitals.</p>
        </div>
      )}

      {/* Results */}
      {status === "done" && hospitals.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-8">No hospitals found in this area. Try a larger radius.</p>
      )}

      <div className="space-y-3">
        {hospitals.map((h) => (
          <div
            key={h.id}
            className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{h.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{h.address}</p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                {h.distanceMiles !== undefined && (
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    {h.distanceMiles} mi
                  </span>
                )}
                {h.openNow !== undefined && (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    h.openNow
                      ? "text-green-700 bg-green-50"
                      : "text-red-600 bg-red-50"
                  }`}>
                    {h.openNow ? "Open Now" : "Closed"}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
              {h.rating !== undefined && (
                <span>
                  {"★".repeat(Math.round(h.rating))}{"☆".repeat(5 - Math.round(h.rating))} {h.rating.toFixed(1)}
                  {h.totalRatings ? ` (${h.totalRatings.toLocaleString()})` : ""}
                </span>
              )}
              {h.phone && (
                <a href={`tel:${h.phone}`} className="text-blue-600 hover:underline">
                  {h.phone}
                </a>
              )}
              {h.website && (
                <a
                  href={h.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Website
                </a>
              )}
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(h.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Directions
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
