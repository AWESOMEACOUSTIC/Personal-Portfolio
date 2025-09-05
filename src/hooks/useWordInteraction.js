import { useEffect, useRef, useCallback } from "react";

/**
 * Core interaction + physics loop for the animated word.
 * Handles: registering letters, measuring centers, pointer interaction, burst & settle.
 */
export function useWordInteraction({
  containerRef,
  letters,
  radius,
  maxOffset,
  settleDelay,
  prefersReduced,
  burstTargets,
}) {
  const centers = useRef(new Map());      // id -> {cx, cy}
  const springs = useRef(new Map());      // id -> {x,y,r,seed}
  const rafId = useRef(0);
  const idleTimer = useRef(null);
  const lastPointer = useRef({ x: 0, y: 0, dirty: false });

  /** Register / unregister a letter's motion springs */
  const handleMount = useCallback((id, mv) => {
    if (mv) springs.current.set(id, mv); else springs.current.delete(id);
  }, []);

  /** Receive center measurements */
  const handleMeasure = useCallback((id, c) => {
    centers.current.set(id, c);
  }, []);

  /** Reset all springs back to origin */
  const settleAll = useCallback(() => {
    springs.current.forEach(({ x, y, r }) => { x.set(0); y.set(0); r.set(0); });
  }, []);

  /** Burst animation: letters fly outward briefly */
  const burst = useCallback(() => {
    if (prefersReduced) return;
    burstTargets.forEach((t, i) => {
      setTimeout(() => {
        const mv = springs.current.get(`l${i}`);
        if (!mv) return;
        mv.x.set(t.x); mv.y.set(t.y); mv.r.set(t.r);
      }, i * 12);
    });
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(settleAll, 900);
  }, [burstTargets, prefersReduced, settleAll]);

  // Pointer & animation loop effect
  useEffect(() => {
    if (prefersReduced) return; // skip interaction if reduced motion
    const host = containerRef.current;
    if (!host) return;

    const onEnter = () => burst();
    const onLeave = () => {
      cancelAnimationFrame(rafId.current);
      clearTimeout(idleTimer.current);
      settleAll();
    };
    const onMove = (e) => {
      lastPointer.current.x = e.clientX;
      lastPointer.current.y = e.clientY;
      lastPointer.current.dirty = true;
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(settleAll, settleDelay);
    };

    const loop = () => {
      rafId.current = requestAnimationFrame(loop);
      if (!lastPointer.current.dirty) return;
      lastPointer.current.dirty = false;
      const { x: mx, y: my } = lastPointer.current;
      springs.current.forEach((mv, id) => {
        const c = centers.current.get(id);
        if (!c) return;
        const dx = mx - c.cx;
        const dy = my - c.cy;
        const d = Math.hypot(dx, dy);
        if (d < radius) {
          const f = 1 - d / radius; // 0..1 influence
          const k = 28 * f * f;     // falloff curve
          const ux = dx / (d || 1);
          const uy = dy / (d || 1);
          const tx = Math.max(-maxOffset, Math.min(maxOffset, -k * ux));
          const ty = Math.max(-maxOffset, Math.min(maxOffset, -k * uy));
            mv.x.set(tx);
            mv.y.set(ty);
            mv.r.set(ux * 6);
        }
      });
    };

    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointermove", onMove);
    rafId.current = requestAnimationFrame(loop);

    return () => {
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(rafId.current);
      clearTimeout(idleTimer.current);
    };
  }, [prefersReduced, burst, radius, maxOffset, settleAll, settleDelay]);

  return { handleMount, handleMeasure };
}
