"use client";

import { useState, useEffect, useCallback } from "react";

// SSR-safe: always starts with initialValue, syncs from localStorage after mount.
// This prevents Next.js hydration mismatches.
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw));
    } catch {
      // corrupted data — keep initialValue
    }
    setHydrated(true);
  }, [key]);

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        try {
          localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // storage full or unavailable
        }
        return resolved;
      });
    },
    [key]
  );

  const remove = useCallback(() => {
    localStorage.removeItem(key);
    setValue(initialValue);
  }, [key, initialValue]); // eslint-disable-line react-hooks/exhaustive-deps

  return [value, set, { hydrated, remove }] as const;
}
