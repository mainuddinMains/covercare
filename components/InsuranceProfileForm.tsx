"use client";

import { useState } from "react";
import { useInsuranceProfile } from "@/hooks/useInsuranceProfile";
import { INSURANCE_LABELS, InsuranceType } from "@/lib/cost-estimator";
import { DetectedLocation } from "@/lib/geocoding";
import { ScannedCard } from "@/lib/card-scanner";
import LocationDetector from "./LocationDetector";
import InsuranceCardScanner from "./InsuranceCardScanner";

const PROFILE_SECTIONS = [
  { label: "Insurance type", key: "insuranceType" as const },
  { label: "Plan details",   key: "planName"       as const },
  { label: "Location",       key: "zip"            as const },
  { label: "Effective date", key: "effectiveDate"  as const },
];

function ProfileProgress({ profile }: { profile: ReturnType<typeof useInsuranceProfile>["profile"] }) {
  const done = PROFILE_SECTIONS.filter((s) => Boolean(profile[s.key])).length;
  const pct  = Math.round((done / PROFILE_SECTIONS.length) * 100);

  return (
    <div className="mb-6 bg-gray-50 border border-gray-100 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-600">Profile completion</span>
        <span className="text-xs font-bold text-blue-600">{pct}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Profile ${pct}% complete`}
        className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3"
      >
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        {PROFILE_SECTIONS.map((s) => {
          const filled = Boolean(profile[s.key]);
          return (
            <span
              key={s.key}
              className={`text-[11px] px-2 py-0.5 rounded-full border ${
                filled
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-white border-gray-200 text-gray-400"
              }`}
            >
              {filled ? "✓" : "○"} {s.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function InsuranceProfileForm() {
  const {
    profile, updateField, applyScannedCard, clearProfile,
    hasProfile, hasLocation, locationDisplay, hydrated,
  } = useInsuranceProfile();
  const [saved, setSaved] = useState(false);

  function handleChange<K extends keyof typeof profile>(field: K, value: (typeof profile)[K]) {
    updateField(field, value);
    setSaved(false);
  }

  function handleLocationDetected(loc: DetectedLocation) {
    updateField("city",      loc.city);
    updateField("state",     loc.state);
    updateField("stateCode", loc.stateCode);
    updateField("zip",       loc.zip);
    setSaved(false);
  }

  function handleCardScanned(card: ScannedCard) {
    applyScannedCard(card);
    setSaved(false);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (!hydrated) {
    return <div className="max-w-2xl mx-auto px-4 py-8 text-sm text-gray-400">Loading…</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Insurance Profile</h2>
        <p className="text-sm text-gray-500">
          Saved locally on this device — never sent to a server. Pre-fills Cost Estimator and
          gives the AI assistant your coverage context.
        </p>
      </div>

      {/* Profile progress */}
      <ProfileProgress profile={profile} />

      {/* Card Scanner */}
      <div className="mb-6">
        <InsuranceCardScanner onApply={handleCardScanned} />
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Insurance type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Type</label>
          <select
            value={profile.insuranceType}
            onChange={(e) => handleChange("insuranceType", e.target.value as InsuranceType | "")}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select type…</option>
            {(Object.entries(INSURANCE_LABELS) as [InsuranceType, string][]).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        {/* Plan name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
          <input
            type="text"
            value={profile.planName}
            onChange={(e) => handleChange("planName", e.target.value)}
            placeholder="e.g. UnitedHealthcare Gold Choice Plus"
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Member ID + Group */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Member ID</label>
            <input
              type="text"
              value={profile.memberId}
              onChange={(e) => handleChange("memberId", e.target.value)}
              placeholder="e.g. U1234567890"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Group Number</label>
            <input
              type="text"
              value={profile.groupNumber}
              onChange={(e) => handleChange("groupNumber", e.target.value)}
              placeholder="e.g. 98765"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Insurer phone + effective date */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Insurer Phone</label>
            <input
              type="tel"
              value={profile.insurerPhone}
              onChange={(e) => handleChange("insurerPhone", e.target.value)}
              placeholder="1-800-555-0100"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
            <input
              type="date"
              value={profile.effectiveDate}
              onChange={(e) => handleChange("effectiveDate", e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Location section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Your Location</label>
            <LocationDetector
              onDetected={handleLocationDetected}
              currentDisplay={hasLocation ? locationDisplay : undefined}
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1">
              <input
                type="text"
                value={profile.city}
                onChange={(e) => handleChange("city", e.target.value)}
                placeholder="City"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <input
                type="text"
                value={profile.stateCode}
                onChange={(e) => handleChange("stateCode", e.target.value.toUpperCase().slice(0, 2))}
                placeholder="ST"
                maxLength={2}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <input
                type="text"
                value={profile.zip}
                onChange={(e) => handleChange("zip", e.target.value)}
                placeholder="ZIP"
                maxLength={10}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Used to pre-fill clinic/plan searches and personalize the AI assistant.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
          >
            {saved ? "Saved!" : "Save to This Device"}
          </button>
          {(hasProfile || hasLocation) && (
            <button
              type="button"
              onClick={clearProfile}
              className="text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              Clear profile
            </button>
          )}
        </div>
      </form>

      {(hasProfile || hasLocation) && (
        <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-xl text-sm text-green-700 space-y-1">
          {hasProfile  && <p>Insurance profile saved — pre-fills Cost Estimator and AI chat.</p>}
          {hasLocation && <p>Location saved ({locationDisplay}) — used for clinic and plan searches.</p>}
        </div>
      )}

      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
        All data is stored only in your browser's localStorage. Nothing is transmitted to any server.
      </div>
    </div>
  );
}
