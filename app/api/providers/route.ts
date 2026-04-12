import { NextRequest, NextResponse } from "next/server";
import { findProviders } from "@/lib/npi";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");
  const state = req.nextUrl.searchParams.get("state") ?? undefined;

  if (!query) return NextResponse.json({ error: "q is required" }, { status: 400 });

  try {
    const providers = await findProviders(query, state);
    return NextResponse.json({ providers });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
