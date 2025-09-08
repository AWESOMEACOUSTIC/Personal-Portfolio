import React from "react";
import GlowText from "../sections/GlowText";

/** Demo wrapper showcasing the modular GlowText component. */
export default function GlowDemo() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-black">
      <GlowText>Glow</GlowText>
    </div>
  );
}

// Re-export for convenience if consumers import from components/Glow
export { default as GlowText } from "../sections/GlowText";

