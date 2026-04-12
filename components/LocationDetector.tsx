"use client";

import { useState } from "react";
import { reverseGeocode, DetectedLocation } from "@/lib/geocoding";

interface Props {
  onDetected: (loc: DetectedLocation) => void;
  currentDisplay?: string;
}

type Status = "idle" | "locating" | "done" | "error";

export default function LocationDetector({ onDetected, currentDisplay }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  function detect() {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by this browser.");
      setStatus("error");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const loc = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
          onDetected(loc);
          setStatus("done");
        } catch {
          setError("Could not look up your city. Try entering it manually.");
          setStatus("error");
        }
      },
      () => {
        setError("Location access denied.");
        setStatus("error");
      },
      { timeout: 10000 }
    );
  }

  if (currentDisplay) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-1">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
        {currentDisplay}
        <button
          onClick={detect}
          title="Re-detect location"
          className="ml-0.5 text-green-500 hover:text-green-800 transition-colors leading-none"
        >
          ↺
        </button>
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={detect}
        disabled={status === "locating"}
        className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-full px-3 py-1 transition-colors disabled:opacity-50"
      >
        {status === "locating" ? (
          <>
            <span className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin" />
            Detecting…
          </>
        ) : (
          <>
            <span>⊕</span> Auto-detect my city
          </>
        )}
      </button>
      {status === "error" && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  );
}
