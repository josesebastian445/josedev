"use client";

/**
 * A tiny scroll store read by useFrame loops.
 * Kept outside React so scrolling never triggers a re-render.
 */
export const scrollStore = {
  /** 0 → 1 across the whole document */
  progress: 0,
  /** raw pixels */
  y: 0,
  /** pixels per frame, smoothed — drives "velocity" effects */
  velocity: 0,
};

let started = false;

export function startScrollTracking() {
  if (started || typeof window === "undefined") return () => {};
  started = true;

  let last = window.scrollY;
  let raf = 0;

  const tick = () => {
    const y = window.scrollY;
    const max = Math.max(1, document.body.scrollHeight - window.innerHeight);
    scrollStore.y = y;
    scrollStore.progress = Math.min(1, y / max);
    // exponential smoothing keeps the value stable across frame drops
    scrollStore.velocity += ((y - last) - scrollStore.velocity) * 0.15;
    last = y;
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(raf);
    started = false;
  };
}
