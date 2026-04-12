"use client";

import { useRef, useEffect } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

/**
 * Returns a ref to attach to the modal container.
 * When `active` is true, Tab/Shift+Tab cycle only within the container
 * and initial focus is given to the first focusable element.
 */
export function useFocusTrap<T extends HTMLElement>(active: boolean) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!active || !ref.current) return;

    const container = ref.current;
    const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE));
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    // Move focus into modal
    first?.focus();

    function trap(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      if (focusable.length === 0) { e.preventDefault(); return; }

      if (e.shiftKey) {
        if (document.activeElement === first || !container.contains(document.activeElement)) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last || !container.contains(document.activeElement)) {
          e.preventDefault();
          first?.focus();
        }
      }
    }

    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [active]);

  return ref;
}
