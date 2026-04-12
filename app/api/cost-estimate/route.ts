import { NextRequest, NextResponse } from "next/server";
import { estimateCost, InsuranceType } from "@/lib/cost-estimator";

export async function GET(req: NextRequest) {
  const procedure = req.nextUrl.searchParams.get("procedure");
  const insurance = req.nextUrl.searchParams.get("insurance") as InsuranceType | null;

  if (!procedure || !insurance) {
    return NextResponse.json(
      { error: "procedure and insurance are required" },
      { status: 400 }
    );
  }

  try {
    const estimate = await estimateCost(procedure, insurance);
    return NextResponse.json({ estimate });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
