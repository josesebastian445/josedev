"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { Reveal, SectionLabel } from "./motion-primitives";

const COPY =
  "I started in banking IT, supporting core banking software where a bad deployment was not a design problem but a customer standing at a counter. That shaped how I work more than anything since.";

const DETAIL = [
  "Since then I've moved through SEO, web development and IT management — which means I'm one of relatively few people who can build the site, configure the firewall in front of it, and explain why it isn't ranking.",
  "You get one person accountable for the whole thing, rather than three vendors pointing at each other.",
];

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
        <SectionLabel index="04">Who you&rsquo;d be working with</SectionLabel>

        <h2 className="mb-14 max-w-3xl font-display text-[clamp(2rem,5vw,4rem)] font-bold leading-[0.98] tracking-[-0.03em]">
          Seven years of the whole stack
          <span className="text-fog"> — not just the pretty part.</span>
        </h2>

        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div ref={ref}>
            <p className="flex flex-wrap font-display text-[clamp(1.35rem,2.6vw,2.15rem)] font-medium leading-[1.32] tracking-[-0.02em]">
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

          <div className="space-y-6 lg:pt-3">
            {DETAIL.map((para, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className="text-lg leading-relaxed text-fog">{para}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: "Based in", v: "Dubai, UAE" },
            { k: "Focus", v: "Web build · SEO · IT" },
            { k: "Response time", v: "Within a few hours" },
            { k: "Engagements", v: "Project · Retainer" },
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
