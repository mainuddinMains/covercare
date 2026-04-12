"use client";

import { createContext, useContext, ReactNode } from "react";
import { Locale, translations, Translations } from "@/lib/i18n";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Translations;
  simpleMode: boolean;
  toggleSimpleMode: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: "en",
  setLocale: () => {},
  t: translations.en,
  simpleMode: false,
  toggleSimpleMode: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale]         = useLocalStorage<Locale>("covercare:locale", "en");
  const [simpleMode, setSimpleMode] = useLocalStorage<boolean>("covercare:simple_mode", false);

  const t = translations[locale];

  function toggleSimpleMode() {
    setSimpleMode((v) => !v);
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, simpleMode, toggleSimpleMode }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
