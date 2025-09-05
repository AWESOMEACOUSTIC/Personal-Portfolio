"use client";


// Grapheme-safe splitter (falls back to naive split for ASCII)
export function splitGraphemes(str) {
try {
if (typeof Intl !== "undefined" && Intl.Segmenter) {
const seg = new Intl.Segmenter(undefined, { granularity: "grapheme" });
return Array.from(seg.segment(str), (s) => s.segment);
}
} catch {}
return [...str];
}


// Deterministic pseudo-random (so each letter bursts the same way)
export function mulberry32(seed) {
return function () {
let t = (seed += 0x6d2b79f5);
t = Math.imul(t ^ (t >>> 15), t | 1);
t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
}