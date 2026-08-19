"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { Reveal, SectionLabel } from "./motion-primitives";

const COPY =
  "Most sites load, look fine, and are forgotten by lunch. I care about the other kind — the ones where the scroll feels weighted, the type lands, and the whole thing still hits 95+ on Lighthouse. Eight years, sixty-odd launches, and a stubborn belief that fast and beautiful were never a trade.";

/** Each word brightens as it crosses the middle of the viewport. */
function Word({
  children,
  range,
  progress,
}: {
  children: string;
  range: [number, number];
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const y = useTransform(progress, range, [6, 0]);
  return (
    <motion.span style={{ opacity, y }} className="mr-[0.28em] inline-block">
      {children}
    </motion.span>
  );
}

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.4"],
  });

  const words = COPY.split(" ");

  return (
    <section id="about" className="relative py-32 md:py-44">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionLabel index="01">The short version</SectionLabel>

        <div ref={ref} className="max-w-4xl">
          <p className="flex flex-wrap font-display text-[clamp(1.5rem,3.6vw,3rem)] font-medium leading-[1.28] tracking-[-0.02em]">
            {words.map((word, i) => {
              const start = i / words.length;
              const end = start + 1 / words.length;
              return (
                <Word key={i} range={[start, end]} progress={scrollYProgress}>
                  {word}
                </Word>
              );
            })}
          </p>
        </div>

        <div className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: "Based", v: "Lisbon / Remote" },
            { k: "Focus", v: "Product & marketing sites" },
            { k: "Stack", v: "Next.js · TS · WebGL" },
            { k: "Turnaround", v: "3–6 weeks typical" },
          ].map((row, i) => (
            <Reveal key={row.k} delay={i * 0.07} className="bg-ink p-7">
              <div className="font-display text-[11px] uppercase tracking-[0.22em] text-fog">
                {row.k}
              </div>
              <div className="mt-3 font-display text-lg text-bone">{row.v}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
