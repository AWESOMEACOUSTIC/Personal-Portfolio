import { useMemo } from "react";
import { splitGraphemes } from "../utils/utils";

/**
 * Derive stable letter metadata from raw text.
 * Each letter gets an id, char, and deterministic seed.
 */
export function useLetters(text) {
  return useMemo(() => {
    const chars = splitGraphemes(text || "");
    return chars.map((ch, i) => ({ id: `l${i}`, char: ch, seed: (i + 1) * 7777 }));
  }, [text]);
}
