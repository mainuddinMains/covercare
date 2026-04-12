import { InsuranceType } from "./cost-estimator";

export interface ScannedCard {
  planName: string;
  insuranceType: InsuranceType | "";
  memberId: string;
  groupNumber: string;
  insurerPhone: string;
  issuerName: string;
}

const SCAN_PROMPT = `You are analyzing a health insurance card image.
Extract all visible text and return ONLY a JSON object with these exact fields (use empty string if not found):

{
  "planName": "full plan/product name as printed",
  "insuranceType": "one of: medicare | medicaid | aca-bronze | aca-silver | aca-gold | employer | uninsured | empty string",
  "memberId": "member ID / subscriber ID / ID number",
  "groupNumber": "group number / group #",
  "insurerPhone": "customer service or member services phone number",
  "issuerName": "insurance company name (e.g. UnitedHealthcare, Aetna, BCBS)"
}

Rules:
- Return ONLY the raw JSON — no markdown, no explanation.
- For insuranceType: infer from the plan name/logo if not explicitly stated. Most employer-sponsored cards = "employer". Medicare cards say "Medicare". Medicaid cards say "Medicaid" or the state program name.
- Preserve exact formatting of IDs and group numbers (dashes, spaces).`;

export async function parseScannedCard(raw: string): Promise<ScannedCard> {
  try {
    // Strip possible markdown code fences the model might add
    const json = raw.replace(/^```[\w]*\n?/, "").replace(/\n?```$/, "").trim();
    const parsed = JSON.parse(json);
    return {
      planName:      String(parsed.planName      ?? ""),
      insuranceType: (parsed.insuranceType as InsuranceType) || "",
      memberId:      String(parsed.memberId      ?? ""),
      groupNumber:   String(parsed.groupNumber   ?? ""),
      insurerPhone:  String(parsed.insurerPhone  ?? ""),
      issuerName:    String(parsed.issuerName    ?? ""),
    };
  } catch {
    throw new Error("Could not parse card data from the image. Try a clearer photo.");
  }
}

export { SCAN_PROMPT };
