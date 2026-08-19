"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { SplitText } from "./motion-primitives";
import { useIntroDone } from "@/lib/intro";

const HeroScene = dynamic(() => import("@/three/HeroScene"), { ssr: false });

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  // hold the entrance until the intro curtain has lifted
  const ready = useIntroDone();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // the whole hero recedes as you scroll past it
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "34%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const blur = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(8px)"]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* WebGL layer */}
      <div className="absolute inset-0 -z-10">
        <HeroScene />
      </div>

      {/* atmosphere. The flat scrim only applies on small screens, where the
          type unavoidably sits on top of the geometry. */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-ink/55 md:bg-transparent" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_45%,rgba(107,91,255,0.16),transparent_62%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-56 bg-gradient-to-t from-ink to-transparent" />

      <motion.div
        style={{ y, opacity, scale, filter: blur }}
        className="mx-auto w-full max-w-[1400px] px-6 pt-28 md:px-10"
      >
        {/* status pill */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-line bg-ink-2/60 px-4 py-2 backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-volt opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-volt" />
          </span>
          <span className="font-display text-xs tracking-[0.18em] text-fog">
            AVAILABLE — 2 SLOTS FOR Q4
          </span>
        </motion.div>

        <h1 className="font-display text-[clamp(2.8rem,9vw,8.5rem)] font-bold leading-[0.92] tracking-[-0.035em]">
          <span className="block">
            <SplitText text="I build websites" active={ready} />
          </span>
          <span className="block text-fog">
            <SplitText text="people actually" delay={0.18} active={ready} />
          </span>
          <span className="block">
            <SplitText text="remember." delay={0.36} active={ready} />
            <motion.span
              initial={{ scaleX: 0 }}
              animate={ready ? { scaleX: 1 } : undefined}
              transition={{ duration: 1, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="ml-4 inline-block h-[0.09em] w-[clamp(3rem,12vw,11rem)] origin-left bg-volt align-middle"
            />
          </span>
        </h1>

        <div className="mt-12 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-md text-balance text-lg leading-relaxed text-fog"
          >
            Freelance web developer and interface engineer. I turn brands into
            fast, tactile products — Next.js, TypeScript and WebGL, shipped to
            production.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link
              href="/work"
              data-cursor="link"
              className="group relative overflow-hidden rounded-full bg-bone px-8 py-4 font-display font-semibold text-ink"
            >
              <span className="relative z-10 flex items-center gap-2">
                See the work
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="transition-transform duration-400 group-hover:translate-x-1"
                >
                  <path
                    d="M1 7h11M7 2l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="absolute inset-0 origin-left scale-x-0 bg-volt transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
            </Link>

            <Link
              href="/contact"
              data-cursor="link"
              className="rounded-full border border-line px-8 py-4 font-display font-medium text-bone transition-colors duration-400 hover:border-bone/60 hover:bg-bone/5"
            >
              Book a call
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
      >
        <span className="font-display text-[10px] tracking-[0.3em] text-fog">
          SCROLL
        </span>
        <span className="relative h-14 w-px overflow-hidden bg-line">
          <motion.span
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-x-0 h-1/2 bg-volt"
          />
        </span>
      </motion.div>
    </section>
  );
}
