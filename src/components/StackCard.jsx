import { motion, useTransform, useSpring } from "motion/react";

/**
 * One card in the stack.
 * - progress: MotionValue<number> 0..1 from parent useScroll
 * - baseOffset: small constant translate at rest (for the overlapped peek)
 * - targets: the extra deltas applied as you scroll (fan-out)
 */
export default function StackCard({ img, alt, progress, z, baseOffset, targets }) {
  // Map 0..1 -> base .. base+target
  const xRaw = useTransform(progress, [0, 1], [baseOffset.x, baseOffset.x + targets.x]);
  const yRaw = useTransform(progress, [0, 1], [baseOffset.y, baseOffset.y + targets.y]);
  const rRaw = useTransform(progress, [0, 1], [0, targets.r]);

  const spring = { stiffness: 260, damping: 12, mass: 0.35 };
  const x = useSpring(xRaw, spring);
  const y = useSpring(yRaw, spring);
  const rotate = useSpring(rRaw, spring);

  return (
    <motion.div
      style={{ x, y, rotate, zIndex: z, willChange: "transform" }}
      className="absolute inset-0 overflow-hidden rounded-[22px]
                 ring-1 ring-black/10 shadow-[0_0_0_5px_rgb(247,247,247)] bg-white"
    >
      <img
        src={img}
        alt={alt}
        draggable={false}
        className="h-full w-full object-cover rounded-[22px] select-none"
      />
      <div className="pointer-events-none absolute inset-0 rounded-[21px]
        shadow-[inset_0_0.5px_0_0.5px_rgba(255,255,255,0.6),
                inset_0_0_30px_rgba(255,255,255,0.4),
                inset_0_0_12px_rgba(255,255,255,0.8)]" />
    </motion.div>
  );
}
