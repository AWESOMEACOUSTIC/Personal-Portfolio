import { useRef } from "react";
import { useMotionValue, useTransform, useMotionTemplate, animate } from "motion/react";

/**
 * useTextGlowAnimation
 * Encapsulates the interactive glow / parallax shadow for text.
 * Returns ref, animated style, and event handlers to wire up on a motion element.
 */
export const useTextGlowAnimation = () => {
  const textRef = useRef(null);

  // Cursor position (0..1) relative to element bounds
  const positionX = useMotionValue(0.5);
  const positionY = useMotionValue(0.5);

  const handleMouseMove = (event) => {
    const el = textRef.current;
    if (!el) return;
    const { clientX, clientY } = event;
    const { left, top, width, height } = el.getBoundingClientRect();
    if (!width || !height) return;
    positionX.set((clientX - left) / width);
    positionY.set((clientY - top) / height);
  };

  const handleMouseLeave = () => {
    animate(positionX, 0.5, { duration: 0.3, ease: "easeInOut" });
    animate(positionY, 0.5, { duration: 0.3, ease: "easeInOut" });
  };

  // Map 0..1 to pixel offsets for shadows
  const shadowX = useTransform(positionX, [0, 1], [40, -40]);
  const shadowY = useTransform(positionY, [0, 1], [40, -40]);
  const shadowXWide = useTransform(positionX, [0, 1], [250, -250]);
  const shadowYWide = useTransform(positionY, [0, 1], [250, -250]);

  // Composite text-shadow string
  const textShadow = useMotionTemplate`
    1px 1px 0px rgba(20, 50, 100, 0.7),
    2px 2px 0px rgba(20, 50, 100, 0.6),
    3px 3px 0px rgba(20, 50, 100, 0.5),
    4px 4px 0px rgba(20, 50, 100, 0.4),
    5px 5px 10px rgba(0, 0, 0, 0.5),
    0 0 8px rgba(255, 255, 255, 0.9),
    0 0 50px rgba(59, 130, 246, 0.7),
    ${shadowX}px ${shadowY}px 60px rgba(59, 130, 246, 0.6),
    ${shadowXWide}px ${shadowYWide}px 300px rgba(37, 99, 235, 0.5)
  `;

  return {
    textRef,
    style: { textShadow },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  };
};
