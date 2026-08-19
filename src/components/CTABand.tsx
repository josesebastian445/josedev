"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { SplitText } from "./motion-primitives";

/** Closing call to action shared by every inner page. */
export default function CTABand() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const glow = useTransform(scrollYProgress, [0, 0.5, 1], [0.04, 0.22, 0.04]);
  const wordX = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-line py-28 md:py-40"
    >
      <motion.div
        style={{ opacity: glow }}
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_70%,rgba(200,255,46,0.45),transparent_62%)]"
      />
      <motion.div
        style={{ x: wordX }}
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <span className="whitespace-nowrap font-display text-[20vw] font-bold leading-none tracking-tighter text-bone/[0.022]">
          LET&rsquo;S TALK
        </span>
      </motion.div>

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <h2 className="max-w-4xl font-display text-[clamp(2rem,6vw,5rem)] font-bold leading-[0.96] tracking-[-0.035em]">
          <SplitText text="Got something worth building?" />
        </h2>

        <p className="mt-7 max-w-lg text-lg leading-relaxed text-fog">
          Tell me the deadline and the problem. I&rsquo;ll tell you within a day
          whether I&rsquo;m the right person — and if not, who is.
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <Link
            href="/contact"
            data-cursor="link"
            className="group relative overflow-hidden rounded-full bg-volt px-9 py-5 font-display text-lg font-semibold text-ink"
          >
            <span className="relative z-10 flex items-center gap-3">
              Start a project
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 7h11M7 2l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="absolute inset-0 origin-bottom scale-y-0 bg-bone transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
          </Link>

          <a
            href="mailto:hello@josesebastian.dev"
            data-cursor="link"
            className="rounded-full border border-line px-9 py-5 font-display text-lg font-medium text-bone transition-colors duration-400 hover:border-bone/50 hover:bg-bone/5"
          >
            hello@josesebastian.dev
          </a>
        </div>
      </div>
    </section>
  );
}
