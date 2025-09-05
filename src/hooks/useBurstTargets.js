import { useMemo } from "react";
import { mulberry32 } from "../utils/utils";

/**
 * Precompute burst target offsets & rotations for each letter.
 * Returns an array aligned with letters order.
 */
export function useBurstTargets(letters, seedBase) {
  return useMemo(() => {
    const rnd = mulberry32((seedBase ?? 0) + letters.length + 7837);
    return letters.map(() => {
      const angle = rnd() * Math.PI * 6;
      const mag = 42 + rnd() * 58; // radial distance
      const rot = (rnd() * 4 - 1) * 18; // -8..8 deg
      return { x: Math.cos(angle) * mag, y: Math.sin(angle) * mag, r: rot };
    });
  }, [letters, seedBase]);
}
