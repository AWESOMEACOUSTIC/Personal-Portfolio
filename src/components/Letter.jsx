import React, { useEffect, useRef } from "react";
import { motion, useSpring } from "motion/react";

/**
 * spring configuration extracted so it can be imported & shared / tested.
 */
export const POSITION_SPRING = { stiffness: 680, damping: 38, mass: 0.9 };
export const ROTATION_SPRING = { stiffness: 560, damping: 30, mass: 0.9 };

/**
 * Hook: registers springs with the parent when the letter mounts and
 * unregisters them when it unmounts (or id changes).
 */
function useRegisterSprings(id, seed, springs, onMount) {
    useEffect(() => {
        onMount?.(id, { ...springs, seed });
        return () => onMount?.(id, null);
    }, [id, seed]);
}

/**
 * Hook: measures the element center in viewport coordinates & reports it.
 * Re-measures on resize / scroll / element resize.
 */
function useReportCenter(id, ref, onMeasure) {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const measure = () => {
            const rect = el.getBoundingClientRect();
            onMeasure?.(id, {
                cx: rect.left + rect.width / 2,
                cy: rect.top + rect.height / 2,
            });
        };

        measure(); // initial

        const ro = new ResizeObserver(measure);
        ro.observe(el);
        window.addEventListener("scroll", measure, { passive: true });
        window.addEventListener("resize", measure, { passive: true });

        return () => {
            ro.disconnect();
            window.removeEventListener("scroll", measure);
            window.removeEventListener("resize", measure);
        };
    }, [id, onMeasure]);
}

/**
 * Props:
 * - id (string | number) unique identifier
 * - char (string) the character to render
 * - seed (any) arbitrary value passed back to parent for deterministic randomness
 * - onMount(id, springsObj|null) parent collects spring refs
 * - onMeasure(id, {cx, cy}) parent receives center coordinates
 * - reduced (boolean) if true disables motion transforms (a11y / perf)
 * - className, style: optional styling overrides
 */
export default function Letter({
    id,
    char,
    seed,
    onMeasure,
    onMount,
    reduced,
    className = "",
    style,
}) {
    const ref = useRef(null);
    // springs kept local — values are exposed upward via onMount.
    const x = useSpring(0, POSITION_SPRING);
    const y = useSpring(0, POSITION_SPRING);
    const r = useSpring(0, ROTATION_SPRING);

    // register with parent
    useRegisterSprings(id, seed, { x, y, r }, onMount);
    // report center
    useReportCenter(id, ref, onMeasure);

    const motionStyle = reduced ? {} : { x, y, rotate: r };

    return (
        <motion.span
            ref={ref}
            data-letter-id={id}
            className={"inline-flex select-none will-change-transform " + className}
            style={{ ...motionStyle, ...style }}
        >
            {char === " " ? "\u00A0" : char}
        </motion.span>
    );
}