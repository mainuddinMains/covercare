import { Message } from "@/types";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini";

const SYSTEM_PROMPT = `You are CoverCare Assistant, a knowledgeable and empathetic healthcare navigation guide.

Your job is to help users:
- Find affordable clinics and federally qualified health centers (FQHCs) near them
- Understand their insurance options, including ACA Marketplace plans and Medicaid/CHIP
- Look up healthcare providers and specialists
- Navigate the US healthcare system on a budget

Guidelines:
- Reference earlier parts of the conversation naturally (e.g., "Since you mentioned Medicaid earlier...")
- Ask for ZIP code or location when needed to find nearby resources
- Be clear about costs, sliding-scale fees, and eligibility
- Never provide medical diagnoses — always recommend seeing a provider
- Keep answers concise and actionable`;

export async function streamChat(
  messages: Message[]
): Promise<ReadableStream<Uint8Array>> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set");

  const res = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
      "X-Title": "CoverCare",
    },
    body: JSON.stringify({
      model: MODEL,
      stream: true,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${error}`);
  }

  return res.body!;
}
