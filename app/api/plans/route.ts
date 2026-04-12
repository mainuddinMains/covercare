import { NextRequest, NextResponse } from "next/server";
import { findPlans } from "@/lib/healthcare-gov";

export async function GET(req: NextRequest) {
  const zip = req.nextUrl.searchParams.get("zip");
  const year = req.nextUrl.searchParams.get("year") ?? "2024";

  if (!zip) return NextResponse.json({ error: "zip is required" }, { status: 400 });

  try {
    const plans = await findPlans(zip, Number(year));
    return NextResponse.json({ plans });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
