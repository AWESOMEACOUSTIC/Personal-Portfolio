"use client";
import React, { useEffect, useMemo, useRef } from "react";
// Corrected import from 'framer-motion'
import { useReducedMotion } from "framer-motion"; 
import Letter from "./Letter";
import { splitGraphemes, mulberry32 } from "../utils/utils";

export default function Word({
  text,
  className,
  radius = 510,
  maxOffset = 42,
  settleDelay = 1500,
}) {
  const prefersReduced = useReducedMotion();
  const letters = useMemo(() => {
    const chars = splitGraphemes(text);
    return chars.map((ch, i) => ({ id: `l${i}`, char: ch, seed: (i + 1) * 7777 }));
  }, [text]);

  const containerRef = useRef(null);
  const centers = useRef(new Map());
  const springs = useRef(new Map());
  const rafId = useRef(0);
  const idleTimer = useRef(null);
  const lastMouse = useRef({ x: 0, y: 0, dirty: false });

  const burstTargets = useMemo(() => {
    const rnd = mulberry32(text.length + 1337);
    return letters.map(() => {
      const angle = rnd() * Math.PI * 2;
      const mag = 16 + rnd() * 18; 
      const rot = (rnd() * 2 - 1) * 8;
      return { x: Math.cos(angle) * mag, y: Math.sin(angle) * mag, r: rot };
    });
  }, [letters, text]);

  const handleMount = (id, mv) => {
    if (mv) springs.current.set(id, mv); else springs.current.delete(id);
  };
  const handleMeasure = (id, c) => centers.current.set(id, c);

  const settleAll = () => {
    springs.current.forEach(({ x, y, r }) => { x.set(0); y.set(0); r.set(0); });
  };

  const burst = () => {
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
  };
  
  // --- This is the corrected and completed useEffect hook ---
  useEffect(() => {
    if (prefersReduced) return;
    const host = containerRef.current;
    if (!host) return;

    const onEnter = () => burst();

    const onLeave = () => {
      cancelAnimationFrame(rafId.current);
      clearTimeout(idleTimer.current);
      settleAll();
    };

    const onMove = (e) => {
      lastMouse.current.x = e.clientX;
      lastMouse.current.y = e.clientY;
      lastMouse.current.dirty = true;
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(settleAll, settleDelay);
    };

    const loop = () => {
      rafId.current = requestAnimationFrame(loop);
      if (!lastMouse.current.dirty) return;
      lastMouse.current.dirty = false;
      const mx = lastMouse.current.x;
      const my = lastMouse.current.y;

      springs.current.forEach((mv, id) => {
        const c = centers.current.get(id);
        if (!c) return;
        const dx = mx - c.cx;
        const dy = my - c.cy;
        const d = Math.hypot(dx, dy);
        if (d < radius) {
          const f = 1 - d / radius;
          const k = 28 * f * f;
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
  }, [prefersReduced, burstTargets, maxOffset, radius, settleDelay]); // Added dependency array
  
  // The rest of your component's return statement would go here
  return (
    <div ref={containerRef} className={"inline-flex items-center justify-center " + (className || "")} aria-label={text}>
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