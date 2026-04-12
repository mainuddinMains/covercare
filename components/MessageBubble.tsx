"use client";

import { Message } from "@/types";
import { useSpeech } from "@/hooks/useSpeech";
import { useLanguage } from "@/contexts/language";
import RichMessage from "./RichMessage";

interface Props {
  message: Message;
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";
  const isEmpty = message.content === "";
  const { speak, stop, speaking, supported } = useSpeech();
  const { locale } = useLanguage();

  function handleSpeak() {
    if (speaking) { stop(); return; }
    speak(message.content, locale === "es" ? "es-US" : "en-US");
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold mr-2 mt-1">
          CC
        </div>
      )}

      <div className="flex flex-col gap-1 max-w-[80%]">
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isUser
              ? "bg-blue-600 text-white rounded-br-sm"
              : "bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-sm"
          } ${isEmpty ? "animate-pulse w-16 h-8" : ""}`}
        >
          {isEmpty ? (
            <span className="text-gray-400 italic">thinking…</span>
          ) : isUser ? (
            <span className="whitespace-pre-wrap">{message.content}</span>
          ) : (
            // Assistant messages: glossary highlighting + whitespace preserved
            <span className="whitespace-pre-wrap">
              <RichMessage content={message.content} />
            </span>
          )}
        </div>

        {/* TTS button — only for non-empty assistant messages */}
        {!isUser && !isEmpty && supported && (
          <button
            onClick={handleSpeak}
            title={speaking ? "Stop reading" : "Read aloud"}
            className={`self-start ml-1 flex items-center gap-1 text-[11px] transition-colors rounded-full px-2 py-0.5 ${
              speaking
                ? "text-blue-600 bg-blue-50 border border-blue-200"
                : "text-gray-400 hover:text-blue-500 hover:bg-blue-50"
            }`}
          >
            {speaking ? (
              <>
                <span className="flex gap-px items-end h-3">
                  {[1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className="w-0.5 bg-blue-500 rounded-full animate-pulse"
                      style={{ height: `${6 + i * 2}px`, animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </span>
                Stop
              </>
            ) : (
              <>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                </svg>
                Listen
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
