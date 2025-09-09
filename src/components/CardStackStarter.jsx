import * as React from "react";
import { motion, useMotionValue, useTransform } from "motion/react";

// Clamp helper
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export default function CardStackStarter({
  images,
  className,
  peek = 26,
  gapY = 14,
  radius = "1.25rem",
  shadow = 1,
  hoverScale = 1.02,
  hoverTiltDeg = 6,
  baseSpreadDeg = 10,
  cardWidth = 560,          // ✅ force a predictable card box
  aspect = "3 / 2",        // ✅ keep space reserved while images load
  onCycle,
}) {
  const safeImages = Array.isArray(images) ? images : [];

  const [order, setOrder] = React.useState(safeImages.map((_, i) => i));

  React.useEffect(() => {
    setOrder(safeImages.map((_, i) => i));
  }, [safeImages.length]);

  const ref = React.useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rotateY = useTransform(mx, (x) => x * hoverTiltDeg);
  const rotateX = useTransform(my, (y) => -y * hoverTiltDeg);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    mx.set(clamp(dx, -1, 1));
    my.set(clamp(dy, -1, 1));
  };

  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const cycle = React.useCallback(() => {
    setOrder((prev) => {
      if (prev.length <= 1) return prev;
      const [front, ...rest] = prev;
      const next = [...rest, front];
      if (onCycle) onCycle(next[0]);
      return next;
    });
  }, [onCycle]);

  const spreadAngle = (i, n, spread) => {
    if (n <= 1) return 0;
    const t = i / (n - 1);
    return (t - 0.5) * spread;
  };

  return (
    <div
      className={"relative select-none " + (className || "")}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="absolute inset-0 rounded-2xl outline-none"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            cycle();
          }
        }}
        aria-label="Card stack. Press Enter or Space to cycle."
      />

      <div className="relative h-full w-full">
        {order.map((imgIdx, visualIdx) => {
          const n = order.length;
          const z = n - visualIdx;
          const fromBack = n - 1 - visualIdx;
          const offsetX = (fromBack - (n - 1) / 2) * peek;
          const offsetY = fromBack * gapY;
          const baseRot = spreadAngle(visualIdx, n, baseSpreadDeg);
          const isTop = visualIdx === 0;

          return (
            <motion.button
              key={imgIdx}
              type="button"
              onClick={cycle}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 focus:outline-none"
              style={{ zIndex: z }}
              whileHover={isTop ? { scale: hoverScale } : undefined}
              aria-label={isTop ? "Front card. Click to send to back" : "Card in stack"}
            >
              <motion.div
                className="overflow-hidden shadow-xl bg-neutral-200"
                style={{
                  width: `min(100%, ${cardWidth}px)`,
                  aspectRatio: aspect,
                  borderRadius: radius,
                  boxShadow: `0 10px 20px rgba(0,0,0,${0.10 * shadow}), 0 20px 40px rgba(0,0,0,${0.10 * shadow})`,
                }}
                initial={{
                  opacity: 0,
                  scale: 0.98,
                  rotate: baseRot,
                  x: offsetX,
                  y: offsetY + 24,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: baseRot,
                  x: offsetX,
                  y: offsetY,
                }}
                transition={{ type: "spring", stiffness: 180, damping: 20, mass: 0.6 }}
              >
                {/* image fills the box; if it fails to load, card still keeps size */}
                <motion.img
                  src={safeImages[imgIdx]}
                  alt=""
                  className="h-full w-full block object-cover"
                  draggable={false}
                  style={{
                    transformStyle: "preserve-3d",
                    rotateX: isTop ? rotateX : 0,
                    rotateY: isTop ? rotateY : 0,
                  }}
                />
              </motion.div>
            </motion.button>
          );
        })}
      </div>

      <button
        onClick={cycle}
        className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1.5 text-xs text-white backdrop-blur hover:bg-black/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      >
        Cycle (Enter/Space)
      </button>
    </div>
  );
}