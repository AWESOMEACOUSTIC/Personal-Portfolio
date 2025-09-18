import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, animate } from "framer-motion";
import Card from "../components/Cards";
import { cards } from "../data/Cards";

export default function Circle() {
  const BASE_R = 220;   // distance from center
  const HOVER_R = 300;  // distance when hovered

  // spring for card radius
  const raw = useMotionValue(BASE_R);
  const radius = useSpring(raw, { stiffness: 120, damping: 20 });

  // continuous rotation value
  const rotation = useMotionValue(0);
  const rotationAnimRef = useRef(null);

  // start infinite spin
  const startSpin = () => {
    rotationAnimRef.current = animate(
      rotation,
      rotation.get() + 360,
      {
        type: "tween",
        ease: "linear",
        duration: 20,
        repeat: Infinity,
        repeatType: "loop",
      }
    );
  };

  useEffect(() => {
    startSpin();
    return () => rotationAnimRef.current?.stop();
  }, []);

  // pause spin + expand
  const handleMouseEnter = () => {
    rotationAnimRef.current?.stop();
    raw.set(HOVER_R);
  };
  // resume spin + contract
  const handleMouseLeave = () => {
    raw.set(BASE_R);
    startSpin();
  };

  const step = 360 / cards.length;

  return (
    <div
      // outer wrapper: holds text + rotating cards
      style={{ position: "relative", width: 500, height: 500 }}
      className="mx-auto"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Static Center Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <p className="text-black text-4xl font-[smarkan] text-center">
          Aham Brahmasmi
        </p>
        <p className="text-gray-500 mt-1 text-center font-[canope]">
          HOVER TO EXPLORE
        </p>
      </div>

      {/* Rotating Group: only cards live in here */}
      <motion.div
        className="absolute inset-0"
        style={{
          rotate: rotation,
          transformOrigin: "50% 50%",
        }}
      >
        {cards.map((c, i) => (
          <Card
            key={c.id}
            angle={i * step}
            radius={radius}
            defaultSrc={c.defaultSrc}
            hoverSrc={c.hoverSrc}
            alt={c.alt}
          />
        ))}
      </motion.div>
    </div>
  );
}