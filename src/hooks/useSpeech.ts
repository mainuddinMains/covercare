import { useState, useCallback, useRef, useEffect } from "react";

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  // Start false so SSR and first client render match, then flip after hydration
  const [supported, setSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setSupported("speechSynthesis" in window);
  }, []);

  const speak = useCallback((text: string, lang = "en-US") => {
    if (!supported) return;
    window.speechSynthesis.cancel();

    // Strip markdown-ish characters that would be read aloud awkwardly
    const clean = text
      .replace(/[*_~`#>]+/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // [text](url) -> text
      .trim();

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = lang;
    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.onstart  = () => setSpeaking(true);
    utterance.onend    = () => setSpeaking(false);
    utterance.onerror  = () => setSpeaking(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [supported]);

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  return { speak, stop, speaking, supported };
}
