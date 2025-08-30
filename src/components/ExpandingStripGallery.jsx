import React, { useMemo, useState, useRef, useCallback } from "react";
import { motion, useReducedMotion, useInView } from "motion/react";

/**
 * Strip — a single vertical strip that expands/collapses.
 * We memoize to avoid unnecessary re-renders when siblings animate.
 */
const Strip = React.memo(function Strip({
  i,                     // index of this strip (for keys/labels)
  img,                   // { src, alt, placeholder? } image payload
  isActive,              // true if this strip is the one currently expanded
  collapsedPx,           // width (px) in the condensed "slit" state
  expandedPx,            // width (px) when expanded
  heightPx,              // fixed height (px) of the gallery row
  onActivate,            // handler to request activation (with hover-intent delay)
  onActivateNow,         // handler to activate immediately (for keyboard focus)
  transitionWidth,       // Motion transition config for width (spring)
  dimOthers,             // overlay opacity for non-active strips (0..1)
}) {
  const shouldReduce = useReducedMotion(); 
  const ref = useRef(null);               
  const inView = useInView(ref, {         
    once: true,                            // run only a single time
    amount: 0.01,                          // 1% visibility threshold
    margin: "300px 0px",                   // start a bit before it actually enters
  });

  const [loaded, setLoaded] = useState(false);     // track when the real image has loaded
  const onLoad = useCallback(() => setLoaded(true), []); 

  return (
    <motion.button
      ref={ref}                                        
      type="button"                                      
      className="relative grow-0 shrink-0 overflow-hidden focus:outline-none rounded-xl"
      style={{
        height: heightPx,                          
        background: "transparent",                     
        willChange: "width",                            
      }}
      onMouseEnter={() => onActivate(i)}                 // hover activates with small delay
      onFocus={() => onActivateNow(i)}                   // keyboard focus activates instantly
      initial={{ width: collapsedPx }}                   // start in the condensed "slit" width
      animate={{ width: isActive ? expandedPx : collapsedPx }} // expand if active; else slit
      transition={transitionWidth}                       // spring config for buttery motion
      aria-label={img.alt ?? `Gallery image ${i + 1}`}   // accessible label for screen readers
    >
      <img
        src={inView ? img.src : (img.placeholder || "data:image/gif;base64,R0lGODlhAQABAAAAACw=")}
        alt={img.alt ?? ""}                         
        loading={i < 2 ? "eager" : "lazy"}                // a couple eager for good LCP
        fetchpriority={i < 2 ? "high" : "auto"}           // hint to the browser about priority
        decoding="async"                                   // ask browser to decode off-main-thread
        draggable={false}                                  // prevent drag ghost on desktop
        referrerPolicy="no-referrer"                       // avoid referrer issues with CDNs
        crossOrigin="anonymous"                            // allow canvas use / avoids CORS taint
        className={[
          "block h-full w-full object-cover",              // fill the strip; crop to cover
          "transition-[filter,opacity] duration-250 ease-[cubic-bezier(.25,.46,.45,.94)]",
          // fade-in/contrast transition only (no transforms -> no zoom)
          loaded ? "opacity-100" : "opacity-85",           // small opacity lift after load
          shouldReduce ? "motion-reduce:transition-none" : "", // honor reduced motion
        ].join(" ")}
        onLoad={onLoad}                                    // flip "loaded" when the image finishes
        style={{ willChange: "filter, opacity" }}          // micro-optim for the fade/contrast
      />

      {/* Overlay tint: keeps attention on the active strip without expensive CSS filters */}
      <motion.div
        aria-hidden="true"                                 // purely decorative
        className="pointer-events-none absolute inset-0 rounded-xl"
        initial={false}                                    // don't animate from mount default
        animate={{ opacity: isActive ? 0 : dimOthers }}    // hide on active; dim others
        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }} // quick but smooth
        style={{ background: "black" }}                    // black tint color
      />
    </motion.button>
  );
});

/**
 * ExpandingStripGallery — orchestrates the row of strips and shared state.
 */
export default function ExpandingStripGallery({
  images = [],            // array of {src, alt, placeholder?}
  collapsedPx = 16,       // thin width for the condensed "slit" look
  expandedPx = 520,       // width of the hovered/active strip
  heightPx = 420,         // gallery height
  gapPx = 14,             // spacing between strips => shows black vertical bars
  dimOthers = 0.22,       // how much to darken non-active strips (0..1)
  activationDelay = 90,   // ms delay to confirm hover intent (prevents flicker across gaps)
  className = "",         // optional external classes
}) {
  const [active, setActive] = useState(-1);       // index of active strip; -1 = none
  const shouldReduce = useReducedMotion();        // honor user's "reduce motion" preference
  const intentTimer = useRef(null);               // timer id for hover-intent debounce

  // Spring config for width animation (no bounce / critically damped feel)
  const transitionWidth = useMemo(
    () =>
      shouldReduce
        ? { duration: 0 }                          // disable animation if reduced motion
        : {
            width: {                               // target property: width
              type: "spring",                      // spring = physically-plausible motion
              stiffness: 180,                      // lower stiffness => softer/slower
              damping: 34,                         // higher damping => less overshoot/bounce
              mass: 0.9,                           // tunes acceleration curve
            },
          },
    [shouldReduce]
  );

  // Scheduled activation with small delay to avoid jitter when skimming across gaps
  const scheduleActivate = useCallback((i) => {
    if (intentTimer.current) clearTimeout(intentTimer.current);  // clear any previous intent
    intentTimer.current = setTimeout(() => setActive(i), activationDelay); // set after delay
  }, [activationDelay]);

  // Immediate activation (used for keyboard focus so UI feels responsive)
  const activateNow = useCallback((i) => {
    if (intentTimer.current) clearTimeout(intentTimer.current);  // cancel pending delay
    setActive(i);                                                // set active right away
  }, []);

  // Collapse everything + clear timers when pointer/focus leaves the gallery
  const clearAndCollapse = useCallback(() => {
    if (intentTimer.current) clearTimeout(intentTimer.current);  // stop any scheduled change
    setActive(-1);                                               // no active strip => all collapse
  }, []);

  return (
    <div className={`w-full bg-black py-10 ${className}`}>
      {/* Outer wrapper just centers the gallery block */}
      <div className="flex justify-center">
        {/* This is the "track" that holds all the strips side-by-side */}
        <div
          className="inline-flex items-stretch"      // inline so it shrinks to content width
          style={{ gap: gapPx }}                     // visual black bars between strips
          onMouseLeave={clearAndCollapse}            // contract smoothly when exiting the track
          onBlur={(e) => {                           // also collapse if focus leaves the track
            if (!e.currentTarget.contains(e.relatedTarget)) clearAndCollapse();
          }}
        >
          {images.map((img, i) => (
            <Strip
              key={img.src ?? i}                    
              i={i}                                  
              img={img}                             
              isActive={active === i}                
              collapsedPx={collapsedPx}            
              expandedPx={expandedPx}               
              heightPx={heightPx}                   
              onActivate={scheduleActivate}        
              onActivateNow={activateNow}           
              transitionWidth={transitionWidth}     
              dimOthers={dimOthers}                
            />
          ))}
        </div>
      </div>
    </div>
  );
}
