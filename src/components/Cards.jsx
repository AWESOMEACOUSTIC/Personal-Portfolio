import React, { useState } from "react";
import { motion, AnimatePresence, useTransform } from "framer-motion";

const CARD_SIZE = 80;

export default function Cards({ angle, radius, defaultSrc, hoverSrc, alt }) {
  const theta = (angle * Math.PI) / 180;
  const x = useTransform(radius, (r) => Math.sin(theta) * r);
  const y = useTransform(radius, (r) => -Math.cos(theta) * r);

  const [isHover, setIsHover] = useState(false);

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
      }}
    >
      <motion.div
        style={{ x, y, width: CARD_SIZE, height: CARD_SIZE }}
        className="cursor-pointer"
        onHoverStart={() => setIsHover(true)}
        onHoverEnd={() => setIsHover(false)}
        whileHover={{ scale: 1.2, zIndex: 20 }}
      >
        <div className="relative w-full h-full overflow-hidden rounded-md">
          <AnimatePresence mode="sync" initial={false}>
            {!isHover ? (
              <motion.img
                key="default"
                src={defaultSrc}
                alt={alt}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            ) : (
              <motion.img
                key="hover"
                src={hoverSrc}
                alt={alt}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}