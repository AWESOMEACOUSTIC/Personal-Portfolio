"use client";
import React, { useEffect, useRef } from "react";
import { motion, useSpring } from "motion/react";


/** A single animated glyph that reports its center to the parent */
export default function Letter({ id, char, seed, onMeasure, onMount, reduced }) {
    const ref = useRef(null);
    const x = useSpring(0, { stiffness: 680, damping: 38, mass: 0.9 });
    const y = useSpring(0, { stiffness: 680, damping: 38, mass: 0.9 });
    const r = useSpring(0, { stiffness: 560, damping: 30, mass: 0.9 });


    // Register springs with parent controller
    useEffect(() => {
        onMount?.(id, { x, y, r, seed });
        return () => onMount?.(id, null);
    }, [id, seed]);


    // Measure and re-measure the letter center (viewport coords)
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const measure = () => {
            const rect = el.getBoundingClientRect();
            onMeasure?.(id, { cx: rect.left + rect.width / 2, cy: rect.top + rect.height / 2 });
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        window.addEventListener("scroll", measure, { passive: true });
        window.addEventListener("resize", measure, { passive: true });
        return () => {
            ro.disconnect();
            window.removeEventListener("scroll", measure);
            window.removeEventListener("resize", measure);
        };
    }, [id]);


    return (
        <motion.span
            ref={ref}
            data-letter-id={id}
            className="inline-flex select-none will-change-transform"
            style={reduced ? {} : { x, y, rotate: r }}
        >
            {char === " " ? "\u00A0" : char}
        </motion.span>
    );
}