"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "motion/react";
import { useRef } from "react";

const ITEMS = [
  "WordPress",
  "Next.js",
  "Astro",
  "React",
  "TypeScript",
  "Tailwind",
  "WooCommerce",
  "MySQL",
  "SQL Server",
  "AWS",
  "Hetzner",
  "Cloudflare",
  "FortiGate",
  "Ahrefs",
  "SEMrush",
  "Screaming Frog",
  "Google Analytics",
  "Search Console",
  "GitHub Actions",
  "Office 365",
];

/**
 * Infinite ticker whose speed and direction are driven by scroll velocity —
 * it drifts on its own, then whips along with the page when you scroll.
 */
export default function Marquee({ baseVelocity = 2.4 }: { baseVelocity?: number }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  const smooth = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  // map scroll speed onto a multiplier; scrolling up reverses the ticker
  const factor = useTransform(smooth, [-1400, 0, 1400], [-4, 1, 4], {
    clamp: false,
  });
  const skew = useTransform(smooth, [-1400, 0, 1400], [-6, 0, 6], {
    clamp: true,
  });

  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    let move = direction.current * baseVelocity * (delta / 1000);

    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;

    move += direction.current * move * f;
    baseX.set(baseX.get() + move);
  });

  // four copies, each 25% wide, wrapped so the strip never runs out
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);

  return (
    <section
      aria-label="Technologies"
      className="relative border-y border-line/70 bg-ink-2/40 py-6"
    >
      <motion.div style={{ skewX: skew }} className="overflow-hidden">
        <motion.div style={{ x }} className="flex whitespace-nowrap">
          {[0, 1, 2, 3].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {ITEMS.map((item, i) => (
                <span key={`${copy}-${i}`} className="flex items-center">
                  <span className="px-8 font-display text-2xl font-medium tracking-tight text-fog md:text-3xl">
                    {item}
                  </span>
                  <span className="h-1.5 w-1.5 rotate-45 bg-volt/70" />
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
