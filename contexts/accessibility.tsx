"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export type FontSize = "sm" | "md" | "lg";

interface AccessibilityContextValue {
  highContrast: boolean;
  toggleHighContrast: () => void;
  fontSize: FontSize;
  setFontSize: (s: FontSize) => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue>({
  highContrast: false,
  toggleHighContrast: () => {},
  fontSize: "md",
  setFontSize: () => {},
});

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [highContrast, setHighContrast] = useLocalStorage("covercare:hc", false);
  const [fontSize, setFontSize]         = useLocalStorage<FontSize>("covercare:font_size", "md");

  // Apply to <html> after hydration
  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("hc", highContrast);
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.dataset.fontSize = fontSize;
  }, [fontSize]);

  function toggleHighContrast() {
    setHighContrast((v) => !v);
  }

  return (
    <AccessibilityContext.Provider value={{ highContrast, toggleHighContrast, fontSize, setFontSize }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  return useContext(AccessibilityContext);
}
