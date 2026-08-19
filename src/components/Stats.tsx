"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 64, suffix: "", label: "sites shipped" },
  { value: 8, suffix: "yrs", label: "doing this full time" },
  { value: 96, suffix: "avg", label: "lighthouse score" },
  { value: 100, suffix: "%", label: "projects delivered on date" },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const count = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, to, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, count]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      <span className="text-volt">{suffix}</span>
    </span>
  );
}

export default function Stats() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // the oversized backdrop word drifts against the page
  const wordX = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-y border-line bg-ink-2/40 py-24 md:py-32"
    >
      <motion.div
        style={{ x: wordX }}
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <span className="whitespace-nowrap font-display text-[22vw] font-bold leading-none tracking-tighter text-bone/[0.025]">
          RECEIPTS
        </span>
      </motion.div>

      <div className="relative mx-auto grid max-w-[1400px] grid-cols-2 gap-y-14 px-6 md:px-10 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="border-l border-line pl-6"
          >
            <div className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-none tracking-tight">
              <Counter to={s.value} suffix={s.suffix} />
            </div>
            <div className="mt-3 max-w-[12rem] font-display text-xs uppercase tracking-[0.2em] text-fog">
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
