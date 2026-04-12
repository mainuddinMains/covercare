"use client";

import { useState, useRef, useEffect } from "react";
import { GlossaryEntry } from "@/lib/glossary";
import { useLanguage } from "@/contexts/language";

interface Props {
  entry: GlossaryEntry;
  children: string;
}

export default function GlossaryTerm({ entry, children }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const { locale } = useLanguage();

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <span ref={ref} className="relative inline">
      <button
        onClick={() => setOpen((v) => !v)}
        className="underline decoration-dotted decoration-blue-400 underline-offset-2 text-blue-700 hover:text-blue-900 cursor-help transition-colors"
        aria-expanded={open}
        aria-label={`Definition: ${entry.term}`}
      >
        {children}
      </button>

      {open && (
        <span
          role="tooltip"
          className="absolute z-50 left-0 bottom-full mb-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 text-left block"
          style={{ minWidth: "260px" }}
        >
          {/* Arrow */}
          <span className="absolute -bottom-1.5 left-4 w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45 block" />

          <p className="font-semibold text-gray-900 text-sm mb-1.5">{entry.term}</p>

          {/* Simple or standard based on context — always show simple prominently */}
          <p className="text-xs text-gray-700 leading-relaxed">{entry.simple}</p>

          {entry.example && (
            <p className="text-xs text-blue-600 mt-2 leading-relaxed italic">
              Example: {entry.example}
            </p>
          )}

          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-[10px] text-gray-400 leading-relaxed">{entry.definition}</p>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="absolute top-2 right-2 text-gray-300 hover:text-gray-600 text-base leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </span>
      )}
    </span>
  );
}
