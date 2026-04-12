"use client";

import { useState } from "react";
import { PROCEDURES, INSURANCE_LABELS, InsuranceType, CostEstimate } from "@/lib/cost-estimator";
import { useInsuranceProfile } from "@/hooks/useInsuranceProfile";

const CATEGORIES = Array.from(new Set(Object.values(PROCEDURES).map((p) => p.category)));

export default function CostEstimator() {
  const { profile } = useInsuranceProfile();
  const [procedure, setProcedure] = useState("");
  // Pre-populate from saved profile; falls back to empty
  const [insurance, setInsurance] = useState<InsuranceType | "">(profile.insuranceType);
  const [estimate, setEstimate] = useState<CostEstimate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("All");

  const filteredProcedures = Object.entries(PROCEDURES).filter(
    ([, p]) => category === "All" || p.category === category
  );

  async function handleEstimate() {
    if (!procedure || !insurance) return;
    setLoading(true);
    setError("");
    setEstimate(null);

    try {
      const res = await fetch(`/api/cost-estimate?procedure=${procedure}&insurance=${insurance}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to estimate cost");
      setEstimate(data.estimate);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  function fmt(n: number) {
    return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  }

  const metalColors: Record<string, string> = {
    "aca-bronze": "text-orange-700 bg-orange-50",
    "aca-silver": "text-gray-600 bg-gray-100",
    "aca-gold":   "text-yellow-700 bg-yellow-50",
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Estimate Your Out-of-Pocket Cost</h2>
        <p className="text-sm text-gray-500">
          Based on real CMS Medicare Fee Schedule rates + typical insurance cost-sharing.
        </p>
      </div>

      {profile.insuranceType && (
        <div className="mb-4 flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
          <span>Pre-filled from your saved profile: <strong>{INSURANCE_LABELS[profile.insuranceType]}</strong></span>
          <a href="/profile" className="ml-auto text-blue-600 hover:underline whitespace-nowrap">Edit profile</a>
        </div>
      )}

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-3">
        {["All", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => { setCategory(cat); setProcedure(""); }}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              category === cat
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-3 mb-4">
        {/* Procedure */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Procedure</label>
          <select
            value={procedure}
            onChange={(e) => setProcedure(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a procedure...</option>
            {filteredProcedures.map(([key, p]) => (
              <option key={key} value={key}>
                {p.name} (CPT {p.cpt})
              </option>
            ))}
          </select>
        </div>

        {/* Insurance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Insurance</label>
          <select
            value={insurance}
            onChange={(e) => setInsurance(e.target.value as InsuranceType)}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select your insurance...</option>
            {(Object.entries(INSURANCE_LABELS) as [InsuranceType, string][]).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleEstimate}
          disabled={!procedure || !insurance || loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium text-sm py-2.5 rounded-lg transition-colors"
        >
          {loading ? "Looking up CMS rates..." : "Estimate Cost"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Result card */}
      {estimate && (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-5 py-4 text-white">
            <h3 className="font-semibold text-base">{estimate.procedure}</h3>
            <p className="text-blue-100 text-xs mt-0.5">CPT {estimate.cpt} · {estimate.insuranceLabel}</p>
          </div>

          {/* Cost breakdown */}
          <div className="px-5 py-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Medicare Rate</p>
                <p className="text-xl font-bold text-gray-800">{fmt(estimate.medicareRate)}</p>
                <p className="text-xs text-gray-400 mt-0.5">gov't benchmark</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Est. Total Billed</p>
                <p className="text-xl font-bold text-gray-800">{fmt(estimate.totalEstimatedCost)}</p>
                <p className="text-xs text-gray-400 mt-0.5">before insurance</p>
              </div>
            </div>

            {/* Out-of-pocket highlight */}
            <div className={`rounded-xl p-4 text-center mb-4 ${
              insurance === "medicaid" ? "bg-green-50" : "bg-blue-50"
            }`}>
              <p className="text-xs text-gray-500 mb-1">Your Estimated Out-of-Pocket</p>
              {estimate.outOfPocketLow === estimate.outOfPocketHigh ||
               estimate.insurance === "medicaid" ? (
                <p className="text-3xl font-bold text-blue-700">
                  {estimate.insurance === "medicaid" ? "$0 – $5" : fmt(estimate.outOfPocketLow)}
                </p>
              ) : (
                <p className="text-3xl font-bold text-blue-700">
                  {fmt(estimate.outOfPocketLow)}
                  <span className="text-lg text-blue-400 mx-1">–</span>
                  {fmt(estimate.outOfPocketHigh)}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {estimate.outOfPocketLow !== estimate.outOfPocketHigh
                  ? "Low = deductible already met · High = deductible not yet met"
                  : ""}
              </p>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <p><span className="font-medium text-gray-700">Plan details:</span> {estimate.note}</p>
              <p><span className="font-medium text-gray-700">Data source:</span> {estimate.source}</p>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
              Estimates are for planning purposes only. Actual costs depend on your specific plan, network status, and facility pricing. Always verify with your insurer.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
