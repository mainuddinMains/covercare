"use client";

import { useState, useRef, useEffect } from "react";
import { Message } from "@/types";
import { useInsuranceProfile } from "@/hooks/useInsuranceProfile";
import { INSURANCE_LABELS } from "@/lib/cost-estimator";
import { useLanguage } from "@/contexts/language";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

export default function ChatWindow() {
  const { profile, hasProfile, hasLocation, locationDisplay } = useInsuranceProfile();
  const { t } = useLanguage();

  const WELCOME: Message = {
    role: "assistant",
    content: t.chat_welcome,
  };

  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Build a natural-language summary of the saved profile to inject into the system prompt
  function buildProfileContext(): string | undefined {
    if (!hasProfile && !hasLocation) return undefined;
    const parts: string[] = [];
    if (profile.insuranceType) parts.push(`Insurance type: ${INSURANCE_LABELS[profile.insuranceType]}`);
    if (profile.planName)      parts.push(`Plan name: ${profile.planName}`);
    if (profile.memberId)      parts.push(`Member ID: ${profile.memberId}`);
    if (profile.groupNumber)   parts.push(`Group number: ${profile.groupNumber}`);
    if (profile.insurerPhone)  parts.push(`Insurer phone: ${profile.insurerPhone}`);
    if (profile.effectiveDate) parts.push(`Effective date: ${profile.effectiveDate}`);
    if (hasLocation)           parts.push(`User's location: ${locationDisplay}`);
    if (profile.zip)           parts.push(`ZIP code: ${profile.zip}`);
    if (profile.stateCode)     parts.push(`State: ${profile.state} (${profile.stateCode})`);
    return parts.join("\n");
  }

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
        body: JSON.stringify({ messages: payload, profileContext: buildProfileContext() }),
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
    <div className="flex flex-col flex-1 max-w-2xl mx-auto w-full">
      {/* Chat toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-white">
        {hasProfile ? (
          <a href="/profile" className="text-xs text-green-700 bg-green-50 border border-green-100 px-2 py-1 rounded-full hover:bg-green-100 transition-colors">
            {profile.insuranceType ? `${INSURANCE_LABELS[profile.insuranceType]} · ${t.chat_profile_active}` : t.chat_profile_active}
          </a>
        ) : (
          <a href="/profile" className="text-xs text-gray-400 hover:text-blue-600 transition-colors">
            {t.chat_save_profile}
          </a>
        )}
        <button
          onClick={clearHistory}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          {t.chat_new_convo}
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
