"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { useInsuranceProfile } from "@/hooks/useInsuranceProfile";
import { useLanguage } from "@/contexts/language";

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: Props) {
  const { profile, hasLocation } = useInsuranceProfile();
  const { t } = useLanguage();
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const locationHint = hasLocation
    ? `near ${profile.city || profile.zip}`
    : "near ZIP 63101";
  const stateHint = profile.stateCode || "Missouri";

  const SUGGESTIONS = [
    t.suggestion_clinics(locationHint),
    t.suggestion_dental,
    t.suggestion_medicaid,
    t.suggestion_cardiologist(stateHint),
  ];

  function submit() {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
  }

  function handleInput() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }

  return (
    <div className="border-t border-gray-200 bg-white px-4 py-3">
      <div className="flex gap-2 mb-2 overflow-x-auto pb-1 scrollbar-none">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onSend(s)}
            disabled={disabled}
            className="flex-shrink-0 text-xs bg-gray-100 hover:bg-blue-50 hover:text-blue-700 text-gray-600 rounded-full px-3 py-1 transition-colors disabled:opacity-40"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          disabled={disabled}
          placeholder={t.chat_placeholder}
          className="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 max-h-40"
        />
        <button
          onClick={submit}
          disabled={disabled || !value.trim()}
          className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white disabled:text-gray-400 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
        >
          {disabled ? "…" : t.chat_send}
        </button>
      </div>
    </div>
  );
}
