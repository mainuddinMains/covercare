"use client";

import { useState, useRef, useEffect } from "react";
import { Message } from "@/types";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

const WELCOME: Message = {
  role: "assistant",
  content:
    "Hi! I'm your CoverCare assistant. I can help you find affordable clinics, compare insurance plans, and look up healthcare providers. What can I help you with today?",
};

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || streaming) return;

    // Add user message — history now includes everything prior
    const userMsg: Message = { role: "user", content: text };
    const history = [...messages, userMsg];
    setMessages(history);
    setStreaming(true);

    // Placeholder for the streaming assistant response
    const assistantPlaceholder: Message = { role: "assistant", content: "" };
    setMessages([...history, assistantPlaceholder]);

    try {
      // Send FULL history (minus the welcome message which is UI-only)
      const payload = history.filter((m) => m.role !== "assistant" || m.content !== WELCOME.content);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
      });

      if (!res.ok) throw new Error(await res.text());

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        // Parse SSE lines
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") break;
          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content ?? "";
            fullText += delta;
            setMessages([
              ...history,
              { role: "assistant", content: fullText },
            ]);
          } catch {
            // skip malformed chunks
          }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setMessages([
        ...history,
        { role: "assistant", content: `Sorry, I ran into an error: ${msg}` },
      ]);
    } finally {
      setStreaming(false);
    }
  }

  function clearHistory() {
    setMessages([WELCOME]);
  }

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">CoverCare</h1>
          <p className="text-xs text-gray-500">Healthcare navigation assistant</p>
        </div>
        <button
          onClick={clearHistory}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          New conversation
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={sendMessage} disabled={streaming} />
    </div>
  );
}
