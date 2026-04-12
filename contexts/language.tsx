"use client";

import { createContext, useContext, ReactNode } from "react";
import { Locale, translations, Translations } from "@/lib/i18n";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: "en",
  setLocale: () => {},
  t: translations.en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useLocalStorage<Locale>("covercare:locale", "en");
  const t = translations[locale];
  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
