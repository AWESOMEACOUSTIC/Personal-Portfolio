import React, { useRef } from "react";
import { useReducedMotion } from "motion/react";
import Letter from "./Letter";
import { useLetters } from "../hooks/useLetters";
import { useBurstTargets } from "../hooks/useBurstTargets";
import { useWordInteraction } from "../hooks/useWordInteraction";

/**
 * Animated Word component: letters repel from pointer within a radius and
 * perform a burst animation on entry, then settle.
 */
export default function Word({
  text,
  className = "",
  radius = 510,
  maxOffset = 42,
  settleDelay = 1500,
}) {
  const prefersReduced = useReducedMotion();
  const letters = useLetters(text);
  const burstTargets = useBurstTargets(letters, text?.length || 0);
  const containerRef = useRef(null);

  const { handleMount, handleMeasure } = useWordInteraction({
    containerRef,
    letters,
    radius,
    maxOffset,
    settleDelay,
    prefersReduced,
    burstTargets,
  });

  return (
    <div
      ref={containerRef}
      className={`inline-flex items-center justify-center ${className}`}
      aria-label={text}
    >
      {letters.map((L) => (
        <Letter
          key={L.id}
            id={L.id}
            char={L.char}
            seed={L.seed}
            onMeasure={handleMeasure}
            onMount={handleMount}
            reduced={prefersReduced}
        />
      ))}
    </div>
  );
}
