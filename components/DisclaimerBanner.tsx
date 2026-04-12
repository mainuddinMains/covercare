"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useLanguage } from "@/contexts/language";

export default function DisclaimerBanner() {
  const [dismissed, setDismissed] = useLocalStorage("covercare:disclaimer_dismissed", false);
  const { t } = useLanguage();

  if (dismissed) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200" role="alert" aria-live="polite">
      <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-start gap-3">
        <span className="text-amber-500 text-base leading-5 flex-shrink-0 mt-px" aria-hidden>⚠</span>
        <p className="text-xs text-amber-800 leading-relaxed flex-1">
          <span className="font-semibold">{t.disclaimer_label}</span>{" "}
          {t.disclaimer_body}{" "}
          <a href="tel:911" className="font-semibold underline hover:no-underline">911</a>.
        </p>
        <button
          onClick={() => setDismissed(true)}
          aria-label={t.disclaimer_dismiss}
          className="flex-shrink-0 text-amber-400 hover:text-amber-700 transition-colors text-lg leading-none mt-px"
        >
          ×
        </button>
      </div>
    </div>
  );
}
