import { NextRequest, NextResponse } from "next/server";
import { SCAN_PROMPT, parseScannedCard } from "@/lib/card-scanner";

// Use node runtime — edge has a 4 MB body limit which might be tight for images
export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OPENROUTER_API_KEY is not set" }, { status: 500 });
  }

  try {
    const { image }: { image: string } = await req.json();
    if (!image?.startsWith("data:image/")) {
      return NextResponse.json({ error: "image must be a base64 data URL" }, { status: 400 });
    }

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
        "X-Title": "CoverCare Card Scanner",
      },
      body: JSON.stringify({
        // Use a vision-capable model; gpt-4o-mini supports images and is fast/cheap
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "image_url", image_url: { url: image, detail: "high" } },
              { type: "text",      text: SCAN_PROMPT },
            ],
          },
        ],
        max_tokens: 400,
        temperature: 0,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `Vision API error: ${err}` }, { status: 502 });
    }

    const data = await res.json();
    const raw: string = data.choices?.[0]?.message?.content ?? "";
    const card = await parseScannedCard(raw);

    return NextResponse.json({ card });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
