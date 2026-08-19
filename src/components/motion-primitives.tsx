"use client";

import { motion, useInView, type Variants } from "motion/react";
import { useRef } from "react";

/* ------------------------------------------------------------------ */
/* Reveal — the base entrance used by every section                    */
/* ------------------------------------------------------------------ */

/**
 * `show` is a function variant so the delay rides in through `custom`.
 * Passing a `transition` prop instead would be overridden by the variant's
 * own transition, silently dropping the delay.
 */
const REVEAL: Variants = {
  hidden: { y: 34, opacity: 0, filter: "blur(6px)" },
  show: (delay: number = 0) => ({
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay },
  }),
};

export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "span" | "li";
}) {
  const Cmp = motion[as];
  return (
    <Cmp
      className={className}
      variants={REVEAL}
      custom={delay}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
    >
      {children}
    </Cmp>
  );
}

/* Stagger container — children reveal in sequence */
export function Stagger({
  children,
  className,
  gap = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  gap?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: gap, delayChildren: 0.05 } },
      }}
    >
      {children}
    </motion.div>
  );
}

export const staggerItem: Variants = REVEAL;

/* ------------------------------------------------------------------ */
/* SplitText — per-character mask reveal for display headings          */
/* ------------------------------------------------------------------ */

export function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.028,
  active = true,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  /** extra gate, e.g. hold until the intro curtain has lifted */
  active?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const words = text.split(" ");

  let index = 0;

  return (
    <span ref={ref} className={className} aria-label={text}>
      {words.map((word, w) => (
        <span
          key={w}
          className="inline-block overflow-hidden align-bottom pb-[0.12em]"
          aria-hidden
        >
          {Array.from(word).map((char) => {
            const i = index++;
            return (
              <motion.span
                key={i}
                className="inline-block will-change-transform"
                initial={{ y: "110%", rotate: 6 }}
                animate={inView && active ? { y: 0, rotate: 0 } : {}}
                transition={{
                  duration: 0.85,
                  ease: [0.16, 1, 0.3, 1],
                  delay: delay + i * stagger,
                }}
              >
                {char}
              </motion.span>
            );
          })}
          {w < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* SectionLabel — the small monospace eyebrow above each section       */
/* ------------------------------------------------------------------ */

export function SectionLabel({
  index,
  children,
}: {
  index: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal className="mb-8 flex items-center gap-4">
      <span className="font-display text-xs tracking-[0.3em] text-volt">
        {index}
      </span>
      <span className="h-px w-10 bg-line" />
      <span className="font-display text-xs uppercase tracking-[0.3em] text-fog">
        {children}
      </span>
    </Reveal>
  );
}
