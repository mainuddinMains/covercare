"use client";

import { useRef, useState } from "react";
import { ScannedCard } from "@/lib/card-scanner";
import { INSURANCE_LABELS, InsuranceType } from "@/lib/cost-estimator";

interface Props {
  onApply: (card: ScannedCard) => void;
}

type Status = "idle" | "previewing" | "scanning" | "done" | "error";

/** Resize and compress an image file to a base64 JPEG — keeps payload small. */
async function compressImage(file: File, maxPx = 1200, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      const w = Math.round(img.width  * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = reject;
    img.src = url;
  });
}

export default function InsuranceCardScanner({ onApply }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>("");
  const [status, setStatus] = useState<Status>("idle");
  const [card, setCard] = useState<ScannedCard | null>(null);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file);
      setPreview(compressed);
      setStatus("previewing");
      setCard(null);
      setError("");
    } catch {
      setError("Could not read image. Try again.");
      setStatus("error");
    }
    // Reset so the same file can be re-selected
    e.target.value = "";
  }

  async function scan() {
    if (!preview) return;
    setStatus("scanning");
    setError("");

    try {
      const res = await fetch("/api/scan-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: preview }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Scan failed");
      setCard(data.card);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }

  function reset() {
    setPreview("");
    setStatus("idle");
    setCard(null);
    setError("");
  }

  function apply() {
    if (card) { onApply(card); reset(); }
  }

  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-medium text-gray-700">Insurance Card Scanner</span>
        <span className="text-xs text-gray-400 bg-white border border-gray-200 px-2 py-0.5 rounded-full">AI-powered</span>
      </div>

      {/* Hidden file input — capture="environment" opens rear camera on mobile */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFile}
      />

      {status === "idle" && (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg py-6 text-center text-sm text-gray-500 hover:text-blue-600 transition-colors"
        >
          <div className="text-2xl mb-1">📷</div>
          Tap to photograph or upload your insurance card
        </button>
      )}

      {(status === "previewing" || status === "scanning" || status === "done" || status === "error") && preview && (
        <div className="space-y-3">
          {/* Preview */}
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Insurance card preview"
              className="w-full max-h-48 object-contain rounded-lg border border-gray-200 bg-white"
            />
            {status === "scanning" && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-blue-600 font-medium">Reading card…</span>
                </div>
              </div>
            )}
          </div>

          {/* Action row */}
          <div className="flex gap-2">
            {status === "previewing" && (
              <button
                onClick={scan}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
              >
                Extract Details
              </button>
            )}
            {status === "error" && (
              <button
                onClick={scan}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
              >
                Retry
              </button>
            )}
            <button
              onClick={() => inputRef.current?.click()}
              className="flex-1 border border-gray-200 text-gray-600 text-sm py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              New photo
            </button>
            <button
              onClick={reset}
              className="border border-gray-200 text-gray-400 text-sm px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              ✕
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 rounded px-3 py-2">{error}</p>
          )}

          {/* Extracted fields */}
          {status === "done" && card && (
            <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Extracted from card</p>

              {[
                { label: "Issuer",          value: card.issuerName },
                { label: "Plan Name",       value: card.planName },
                { label: "Insurance Type",  value: card.insuranceType ? INSURANCE_LABELS[card.insuranceType as InsuranceType] : "" },
                { label: "Member ID",       value: card.memberId },
                { label: "Group Number",    value: card.groupNumber },
                { label: "Insurer Phone",   value: card.insurerPhone },
              ].filter(f => f.value).map(f => (
                <div key={f.label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{f.label}</span>
                  <span className="font-medium text-gray-800 text-right max-w-[60%] truncate">{f.value}</span>
                </div>
              ))}

              {Object.values(card).every(v => !v) && (
                <p className="text-xs text-gray-400 text-center py-2">No data detected. Try a clearer, well-lit photo.</p>
              )}

              <button
                onClick={apply}
                className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
              >
                Apply to Profile
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
