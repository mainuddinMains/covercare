"use client";

import { useState, useRef, useEffect } from "react";
import { useAccessibility, FontSize } from "@/contexts/accessibility";

const SIZES: { value: FontSize; label: string; aria: string }[] = [
  { value: "sm", label: "A−", aria: "Small text" },
  { value: "md", label: "A",  aria: "Medium text (default)" },
  { value: "lg", label: "A+", aria: "Large text" },
];

export default function AccessibilityPanel() {
  const { highContrast, toggleHighContrast, fontSize, setFontSize } = useAccessibility();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { setOpen(false); triggerRef.current?.focus(); }
    }
    function onClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Accessibility options"
        title="Accessibility options"
        className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors ${
          open || highContrast || fontSize !== "md"
            ? "bg-blue-600 text-white border-blue-600"
            : "border-gray-200 text-gray-500 hover:border-blue-400 hover:text-blue-600"
        }`}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-1 5h2v6h-2V7zm-4.5.5 1.4 1.4A6.96 6.96 0 0 0 5 14c0 3.86 3.14 7 7 7s7-3.14 7-7a6.96 6.96 0 0 0-2.9-5.1l1.4-1.4A8.97 8.97 0 0 1 21 14c0 4.97-4.03 9-9 9s-9-4.03-9-9a8.97 8.97 0 0 1 3.5-7z"/>
        </svg>
        Aa
      </button>

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Accessibility options"
          className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl p-4 z-50"
        >
          {/* Arrow */}
          <div className="absolute -top-1.5 right-4 w-3 h-3 bg-white border-l border-t border-gray-100 rotate-45" aria-hidden="true" />

          {/* Font size */}
          <fieldset className="mb-4">
            <legend className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Text Size
            </legend>
            <div className="flex gap-1" role="group" aria-label="Font size options">
              {SIZES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setFontSize(s.value)}
                  aria-label={s.aria}
                  aria-pressed={fontSize === s.value}
                  className={`flex-1 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    fontSize === s.value
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </fieldset>

          {/* High contrast */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Contrast
            </p>
            <button
              onClick={toggleHighContrast}
              aria-pressed={highContrast}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                highContrast
                  ? "bg-gray-900 text-white border-gray-600"
                  : "border-gray-200 text-gray-700 hover:border-gray-400"
              }`}
            >
              <span>High Contrast</span>
              <span
                className={`w-8 h-4 rounded-full relative transition-colors ${
                  highContrast ? "bg-yellow-400" : "bg-gray-200"
                }`}
                aria-hidden="true"
              >
                <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
                  highContrast ? "translate-x-4" : "translate-x-0.5"
                }`} />
              </span>
            </button>
            {highContrast && (
              <p className="text-[10px] text-gray-400 mt-1.5 text-center">
                Black background · White text · Yellow links
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
