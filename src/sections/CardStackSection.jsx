import { useRef } from "react";
import { MotionConfig, useReducedMotion, useScroll } from "motion/react";
import StackCard from "../components/StackCard";

const IMAGES = [
  "https://framerusercontent.com/images/JXR6jjJ29QlC8NvxRBJ2QbkHyo8.webp",
  "https://framerusercontent.com/images/5GWl5eJalfHVZvcpWBDhadaGg.webp",
  "https://framerusercontent.com/images/bOkRZCtEXWVpcJjCV4itGi9Q.webp",
  "https://framerusercontent.com/images/FDrzrD7FjBI6HZ73ckYinHbqY.webp",
];

export default function CardStackSection() {
  const prefersReduced = useReducedMotion();
  const ref = useRef(null);

  // Animate only while the sticky stage crosses the viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  // >>> key change for image-1 look: stronger initial overlap (peeking on the right)
  const PEEK = 16; // tweak to 48/64 to taste
  const baseOffsets = [
    { x:   -10, y: 10, r:-99 },         // top card (fully visible)
    { x: PEEK * 1.2, y: 20, r: 20 },        // small peek
    { x: PEEK * 2.4, y: 10, r: -90 },    // more peek
    { x: PEEK * 4.3, y: 10, r: 10 },    // biggest peek
  ];

  // Fan-out deltas (added on top of baseOffsets while scrolling)
  const targets = [
    { x: -375, y:  32, r: -10 },
    { x:  -130, y:  32, r:  -8 },
    { x: 250, y:  32, r:  -9 },
    { x:  435, y:  32, r:  -14 },
  ];

  return (
    <MotionConfig reducedMotion={prefersReduced ? "always" : "never"}>
      <section className="w-full">
        {/* top copy (static) */}
        <div className="mx-auto max-w-3xl px-6 pt-20 pb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-[canope] font-semibold tracking-tight">
            Stacked work cards that unfurl on scroll
          </h2>
          <p className="mt-4 text-zinc-600">
            Overlapped at rest, then fan out as this stage crosses the viewport.
          </p>
        </div>

        {/* interaction stage */}
        <div className="min-h-[60vh]">
          <div className="sticky top-24">
            <div
              ref={ref}
              className="relative mx-auto w-[min(490px,88vw)] aspect-[16/10] rounded-[22px] overflow-visible"
            >
              {/* IMPORTANT: first card should be on TOP */}
              {IMAGES.map((src, i) => (
                <StackCard
                  key={src}
                  img={src}
                  alt={`stack-${i}`}
                  progress={scrollYProgress}
                  z={40 - i * 10}                // 40, 30, 20, 10 → first is top
                  baseOffset={baseOffsets[i]}    // creates overlapped peek
                  targets={targets[i]}           // scroll deltas
                />
              ))}
            </div>
          </div>
        </div>

        {/* bottom copy (static) */}
        <div className="mx-auto max-w-3xl px-6 mt-25 pt-12 pb-24 text-center">
          <h3 className="text-4xl font-[canope]">Scroll back up to restack</h3>
          <p className="mt-3 text-zinc-600">
            Powered by <code>useScroll</code>, <code>useTransform</code>, and <code>useSpring</code> from <code>motion/react</code>.
          </p>
        </div>
      </section>
    </MotionConfig>
  );
}
