import { NextRequest, NextResponse } from "next/server";
import { findHospitals } from "@/lib/google-places";

export async function GET(req: NextRequest) {
  const lat  = req.nextUrl.searchParams.get("lat");
  const lng  = req.nextUrl.searchParams.get("lng");
  const radius = req.nextUrl.searchParams.get("radius") ?? "16000";

  if (!lat || !lng) {
    return NextResponse.json({ error: "lat and lng are required" }, { status: 400 });
  }

  try {
    const hospitals = await findHospitals(Number(lat), Number(lng), Number(radius));
    return NextResponse.json({ hospitals });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
