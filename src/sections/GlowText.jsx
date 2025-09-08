import React from "react";
import { motion } from "motion/react";
import { useTextGlowAnimation } from "../hooks/useTextGlowAnimation";

/**
 * GlowText
 * A reusable text component that applies the interactive glow effect.
 */
export default function GlowText({
  as: As = motion.h1,
  className = "",
  children,
}) {
  const { textRef, style, onMouseMove, onMouseLeave } = useTextGlowAnimation();

  return (
    <As
      ref={textRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={
        "relative cursor-pointer select-none text-9xl md:text-7xl lg:text-[12em] font-bold text-white" +
        className
      }
      style={style}
    >
      {children}
    </As>
  );
}
