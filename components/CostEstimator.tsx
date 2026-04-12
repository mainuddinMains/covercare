"use client";

import { useState } from "react";
import { PROCEDURES, INSURANCE_LABELS, InsuranceType, CostEstimate } from "@/lib/cost-estimator";
import { useInsuranceProfile } from "@/hooks/useInsuranceProfile";
import StepIndicator from "./StepIndicator";

// ── Category config ───────────────────────────────────────────────────────────

const CATEGORY_META: Record<string, { icon: string; description: string }> = {
  "Primary Care": { icon: "🏥", description: "Regular check-ups and sick visits" },
  "Emergency":    { icon: "🚨", description: "ER and urgent care visits" },
  "Imaging":      { icon: "🔬", description: "X-rays, MRIs, CT scans, ultrasounds" },
  "Lab":          { icon: "🧪", description: "Blood tests and urine tests" },
  "Cardiology":   { icon: "❤️", description: "Heart tests and monitoring" },
  "GI":           { icon: "🫁", description: "Stomach and digestive care" },
  "Preventive":   { icon: "🛡️", description: "Screenings and vaccines" },
  "Surgery":      { icon: "✂️", description: "Planned operations" },
  "OB/GYN":       { icon: "👶", description: "Pregnancy and women's health" },
  "Therapy":      { icon: "🦾", description: "Physical and rehab therapy" },
};

const CATEGORIES = Array.from(new Set(Object.values(PROCEDURES).map((p) => p.category)));

const STEPS = [
  { label: "Service type" },
  { label: "Procedure" },
  { label: "Insurance" },
  { label: "Your estimate" },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function CostEstimator() {
  const { profile } = useInsuranceProfile();

  const [step, setStep]         = useState(0);
  const [category, setCategory] = useState("");
  const [procedure, setProcedure] = useState("");
  const [insurance, setInsurance] = useState<InsuranceType | "">(profile.insuranceType);
  const [estimate, setEstimate]   = useState<CostEstimate | null>(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  const filteredProcedures = Object.entries(PROCEDURES).filter(
    ([, p]) => p.category === category
  );

  // ── Navigation ──────────────────────────────────────────────────────────────

  function pickCategory(cat: string) {
    setCategory(cat);
    setProcedure("");
    setStep(1);
  }

  function pickProcedure(key: string) {
    setProcedure(key);
    setStep(2);
  }

  async function getEstimate() {
    if (!procedure || !insurance) return;
    setLoading(true);
    setError("");
    setEstimate(null);

    try {
      const res = await fetch(`/api/cost-estimate?procedure=${procedure}&insurance=${insurance}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to estimate cost");
      setEstimate(data.estimate);
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  function restart() {
    setStep(0); setCategory(""); setProcedure("");
    setInsurance(profile.insuranceType); setEstimate(null); setError("");
  }

  function fmt(n: number) {
    return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">Estimate Your Out-of-Pocket Cost</h1>
        <p className="text-sm text-gray-500">
          Real costs from the CMS Medicare rate database. Takes about 30 seconds.
        </p>
      </div>

      {/* Step progress */}
      <StepIndicator steps={STEPS} current={step} className="mb-6" />

      {/* ── Step 0: Category ───────────────────────────────────────────────── */}
      {step === 0 && (
        <section aria-labelledby="step-category-heading">
          <h2 id="step-category-heading" className="text-sm font-semibold text-gray-700 mb-3">
            What type of service do you need?
          </h2>
          <div className="grid grid-cols-2 gap-2" role="list">
            {CATEGORIES.map((cat) => {
              const meta = CATEGORY_META[cat] ?? { icon: "🏥", description: "" };
              return (
                <button
                  key={cat}
                  onClick={() => pickCategory(cat)}
                  aria-label={`${cat}: ${meta.description}`}
                  role="listitem"
                  className="flex items-start gap-3 bg-white border border-gray-100 hover:border-blue-300 hover:shadow-sm rounded-xl p-3 text-left transition-all group"
                >
                  <span className="text-2xl flex-shrink-0 mt-0.5" aria-hidden>{meta.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-800 group-hover:text-blue-700">{cat}</p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-snug">{meta.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Step 1: Procedure ──────────────────────────────────────────────── */}
      {step === 1 && (
        <section aria-labelledby="step-procedure-heading">
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => setStep(0)}
              aria-label="Back to service type"
              className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
            >
              ← Back
            </button>
            <span className="text-xs text-gray-300">|</span>
            <span className="text-xs text-blue-600 font-medium">
              {CATEGORY_META[category]?.icon} {category}
            </span>
          </div>

          <h2 id="step-procedure-heading" className="text-sm font-semibold text-gray-700 mb-3">
            Which procedure?
          </h2>
          <div className="space-y-1.5" role="list">
            {filteredProcedures.map(([key, proc]) => (
              <button
                key={key}
                onClick={() => pickProcedure(key)}
                aria-label={`${proc.name}, CPT code ${proc.cpt}`}
                role="listitem"
                className="w-full flex items-center justify-between bg-white border border-gray-100 hover:border-blue-300 hover:shadow-sm rounded-xl px-4 py-3 text-left transition-all group"
              >
                <span className="text-sm text-gray-800 group-hover:text-blue-700">{proc.name}</span>
                <span className="text-xs text-gray-400 flex-shrink-0 ml-2">CPT {proc.cpt}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── Step 2: Insurance ──────────────────────────────────────────────── */}
      {step === 2 && (
        <section aria-labelledby="step-insurance-heading">
          <div className="flex items-center gap-2 mb-3">
            <button onClick={() => setStep(1)} aria-label="Back to procedure" className="text-xs text-gray-400 hover:text-gray-700">
              ← Back
            </button>
            <span className="text-xs text-gray-300">|</span>
            <span className="text-xs text-blue-600 font-medium truncate">
              {PROCEDURES[procedure]?.name}
            </span>
          </div>

          <h2 id="step-insurance-heading" className="text-sm font-semibold text-gray-700 mb-3">
            What insurance do you have?
          </h2>

          {profile.insuranceType && (
            <div className="mb-3 flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
              <span>Pre-filled from your profile: <strong>{INSURANCE_LABELS[profile.insuranceType]}</strong></span>
              <a href="/profile" className="ml-auto text-blue-600 hover:underline whitespace-nowrap">Change</a>
            </div>
          )}

          <select
            id="insurance-select"
            value={insurance}
            onChange={(e) => setInsurance(e.target.value as InsuranceType)}
            aria-label="Select your insurance type"
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-3 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          >
            <option value="">Select your insurance…</option>
            {(Object.entries(INSURANCE_LABELS) as [InsuranceType, string][]).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>

          {error && (
            <p role="alert" className="text-xs text-red-600 bg-red-50 rounded px-3 py-2 mb-3">{error}</p>
          )}

          <button
            onClick={getEstimate}
            disabled={!insurance || loading}
            aria-busy={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium text-sm py-3 rounded-xl transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden />
                Looking up CMS rates…
              </span>
            ) : "Get My Estimate →"}
          </button>
        </section>
      )}

      {/* ── Step 3: Results ────────────────────────────────────────────────── */}
      {step === 3 && estimate && (
        <section aria-labelledby="step-result-heading" aria-live="polite">
          <h2 id="step-result-heading" className="sr-only">Your cost estimate</h2>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            {/* Header bar */}
            <div className="bg-blue-600 px-5 py-4 text-white">
              <h3 className="font-semibold text-base">{estimate.procedure}</h3>
              <p className="text-blue-100 text-xs mt-0.5">CPT {estimate.cpt} · {estimate.insuranceLabel}</p>
            </div>

            <div className="px-5 py-4">
              {/* Rate grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Medicare Rate</p>
                  <p className="text-xl font-bold text-gray-800">{fmt(estimate.medicareRate)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">gov't benchmark</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Est. Total Bill</p>
                  <p className="text-xl font-bold text-gray-800">{fmt(estimate.totalEstimatedCost)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">before insurance</p>
                </div>
              </div>

              {/* Out-of-pocket highlight */}
              <div className="rounded-2xl bg-blue-50 p-4 text-center mb-4">
                <p className="text-xs text-gray-500 mb-1">Your Estimated Out-of-Pocket</p>
                {estimate.insurance === "medicaid" ? (
                  <p className="text-3xl font-bold text-green-600">$0 – $5</p>
                ) : estimate.outOfPocketLow === estimate.outOfPocketHigh ? (
                  <p className="text-3xl font-bold text-blue-700">{fmt(estimate.outOfPocketLow)}</p>
                ) : (
                  <p className="text-3xl font-bold text-blue-700">
                    {fmt(estimate.outOfPocketLow)}
                    <span className="text-lg text-blue-400 mx-1">–</span>
                    {fmt(estimate.outOfPocketHigh)}
                  </p>
                )}
                {estimate.outOfPocketLow !== estimate.outOfPocketHigh && estimate.insurance !== "medicaid" && (
                  <p className="text-[11px] text-gray-400 mt-1">
                    Low = if you already met your deductible this year · High = if you haven't yet
                  </p>
                )}
              </div>

              <div className="text-xs text-gray-500 space-y-1 mb-4">
                <p><span className="font-medium text-gray-700">Plan details:</span> {estimate.note}</p>
                <p><span className="font-medium text-gray-700">Source:</span> {estimate.source}</p>
              </div>

              <div className="text-xs text-amber-700 bg-amber-50 rounded-xl px-3 py-2 mb-4">
                These are estimates for planning only. Actual costs depend on your plan and the facility.
                Always check with your insurer.
              </div>

              <button
                onClick={restart}
                aria-label="Estimate another procedure"
                className="w-full border border-gray-200 text-gray-600 text-sm py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                ← Estimate another procedure
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
