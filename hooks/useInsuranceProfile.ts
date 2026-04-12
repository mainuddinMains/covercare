"use client";

import { useLocalStorage } from "./useLocalStorage";
import { InsuranceType } from "@/lib/cost-estimator";
import { ScannedCard } from "@/lib/card-scanner";

export interface InsuranceProfile {
  insuranceType: InsuranceType | "";
  planName: string;
  memberId: string;
  groupNumber: string;
  insurerPhone: string;
  effectiveDate: string;
  // Location (from geolocation or manual entry)
  city: string;
  state: string;
  stateCode: string;
  zip: string;
}

const EMPTY: InsuranceProfile = {
  insuranceType: "",
  planName: "",
  memberId: "",
  groupNumber: "",
  insurerPhone: "",
  effectiveDate: "",
  city: "",
  state: "",
  stateCode: "",
  zip: "",
};

export function useInsuranceProfile() {
  const [profile, setProfile, meta] = useLocalStorage<InsuranceProfile>(
    "covercare:insurance_profile",
    EMPTY
  );

  function updateField<K extends keyof InsuranceProfile>(
    field: K,
    value: InsuranceProfile[K]
  ) {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  function applyScannedCard(card: ScannedCard) {
    setProfile((prev) => ({
      ...prev,
      ...(card.insuranceType && { insuranceType: card.insuranceType }),
      ...(card.planName      && { planName: card.planName }),
      ...(card.memberId      && { memberId: card.memberId }),
      ...(card.groupNumber   && { groupNumber: card.groupNumber }),
      ...(card.insurerPhone  && { insurerPhone: card.insurerPhone }),
    }));
  }

  function clearProfile() {
    meta.remove();
  }

  const hasProfile  = Boolean(profile.insuranceType || profile.planName);
  const hasLocation = Boolean(profile.city || profile.zip);
  const locationDisplay = profile.city
    ? [profile.city, profile.stateCode, profile.zip].filter(Boolean).join(", ")
    : profile.zip || "";

  return {
    profile,
    updateField,
    applyScannedCard,
    clearProfile,
    hasProfile,
    hasLocation,
    locationDisplay,
    hydrated: meta.hydrated,
  };
}
