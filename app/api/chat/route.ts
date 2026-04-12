import { NextRequest } from "next/server";
import { streamChat } from "@/lib/openrouter";
import { Message } from "@/types";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { messages, profileContext }: { messages: Message[]; profileContext?: string } =
      await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response("messages array is required", { status: 400 });
    }

    const stream = await streamChat(messages, profileContext);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(message, { status: 500 });
  }
}
