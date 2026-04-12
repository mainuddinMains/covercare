import { NextRequest, NextResponse } from "next/server";
import { findClinics } from "@/lib/hrsa";

export async function GET(req: NextRequest) {
  const zip = req.nextUrl.searchParams.get("zip");
  const radius = req.nextUrl.searchParams.get("radius") ?? "25";

  if (!zip) return NextResponse.json({ error: "zip is required" }, { status: 400 });

  try {
    const clinics = await findClinics(zip, Number(radius));
    return NextResponse.json({ clinics });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
