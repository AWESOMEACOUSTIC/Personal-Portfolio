## Expanding Strip Gallery Interaction

This project includes a custom "Expanding Strip Gallery" component: a horizontal row of images that begin as slim vertical strips and smoothly expand on hover or keyboard focus.

### How it Works (High Level)
1. All images render initially at a small fixed collapsed width (creating the slit effect) inside a flex container.
2. When the user hovers or focuses a strip, that strip animates its width to the configured expanded size while siblings stay collapsed.
3. Moving the pointer across strips switches the active one seamlessly; leaving the gallery (or blurring) collapses everything back.
4. A short hover intent delay reduces flicker when the pointer skims quickly over gaps.
5. Motion uses spring physics (via the `motion` library) for natural easing and respects "prefers-reduced-motion" for accessibility.
6. Images lazy‑load only when near the viewport to improve performance.

### Why This Approach
* Animating width (or flex-basis) inside a single flex row avoids layout jumps.
* Memoized strip components limit re-renders to only what changes.
* Lazy loading + priority hints optimize perceived performance.
* Accessible: focus triggers expansion; reduced motion disables animation duration.

---
