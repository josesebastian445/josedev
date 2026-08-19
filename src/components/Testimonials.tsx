"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { SectionLabel } from "./motion-primitives";

const QUOTES = [
  {
    quote:
      "We had three agencies quote us. Jose was the only one who opened DevTools on the call and showed us exactly what was slow.",
    name: "Marta Oliveira",
    role: "Head of Growth, Nomad Atlas",
  },
  {
    quote:
      "The scroll work is the part everyone comments on, but the real win was the CMS. Our team stopped filing tickets to change a headline.",
    name: "Daniel Roos",
    role: "Founder, Halden Studio",
  },
  {
    quote:
      "Shipped on the day he said he would, six weeks out. I have genuinely never had that happen before.",
    name: "Priya Raman",
    role: "CTO, Fable Finance",
  },
  {
    quote:
      "Our LCP went from 4.2s to under a second. Paid for itself in the first month of ad spend.",
    name: "Tom Kessler",
    role: "Ecommerce Lead, Orbit",
  },
];

export default function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // opposing drift on the two rows creates parallax between them
  const rawA = useTransform(scrollYProgress, [0, 1], ["6%", "-18%"]);
  const rawB = useTransform(scrollYProgress, [0, 1], ["-18%", "6%"]);
  const xA = useSpring(rawA, { stiffness: 80, damping: 24 });
  const xB = useSpring(rawB, { stiffness: 80, damping: 24 });

  const row = (items: typeof QUOTES, x: typeof xA, keyPrefix: string) => (
    <motion.div style={{ x }} className="flex gap-5 md:gap-6">
      {[...items, ...items].map((q, i) => (
        <figure
          key={`${keyPrefix}-${i}`}
          className="group flex w-[85vw] shrink-0 flex-col justify-between rounded-2xl border border-line bg-ink-2/50 p-8 transition-colors duration-500 hover:border-volt/30 sm:w-[46vw] lg:w-[32vw]"
        >
          <svg
            width="26"
            height="20"
            viewBox="0 0 26 20"
            fill="none"
            className="mb-6 text-volt/50 transition-colors duration-500 group-hover:text-volt"
            aria-hidden
          >
            <path
              d="M0 20V12C0 5.4 3.9 1 10 0v4.2C6.7 5.2 5 7.5 5 11h5v9H0zm16 0v-8c0-6.6 3.9-11 10-12v4.2c-3.3 1-5 3.3-5 6.8h5v9h-10z"
              fill="currentColor"
            />
          </svg>

          <blockquote className="font-display text-lg leading-relaxed text-bone md:text-xl">
            {q.quote}
          </blockquote>

          <figcaption className="mt-8 flex items-center gap-3 border-t border-line pt-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-plasma/60 to-volt/40 font-display text-sm font-bold text-ink">
              {q.name
                .split(" ")
                .map((p) => p[0])
                .join("")}
            </span>
            <span>
              <span className="block font-display text-sm font-medium">
                {q.name}
              </span>
              <span className="block font-display text-xs text-fog">
                {q.role}
              </span>
            </span>
          </figcaption>
        </figure>
      ))}
    </motion.div>
  );

  return (
    <section ref={ref} className="relative overflow-hidden py-32 md:py-44">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionLabel index="05">Word of mouth</SectionLabel>
        <h2 className="mb-16 max-w-2xl font-display text-[clamp(2rem,5vw,4rem)] font-bold leading-[0.98] tracking-[-0.03em]">
          What clients say
          <span className="text-fog"> once the invoice is paid.</span>
        </h2>
      </div>

      <div className="edge-fade space-y-5 md:space-y-6">
        {row(QUOTES, xA, "a")}
        {row([...QUOTES].reverse(), xB, "b")}
      </div>
    </section>
  );
}
