"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { SplitText } from "./motion-primitives";
import { useIntroDone } from "@/lib/intro";
import LocalTime from "./LocalTime";
import Typewriter from "./Typewriter";
import { SITE } from "@/content/site";

const HeroScene = dynamic(() => import("@/three/HeroScene"), { ssr: false });

const STATS = [
  { v: "7+", k: "Years experience" },
  { v: "40+", k: "Projects delivered" },
  { v: "99.9%", k: "Uptime maintained" },
];

const STACK = ["WP", "Next", "Astro", "React", "SEO", "CF"];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  // hold the entrance until the intro curtain has lifted
  const ready = useIntroDone();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // the whole hero recedes as you scroll past it
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "24%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(8px)"]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pb-16 pt-32 md:pb-20"
    >
      {/* WebGL layer */}
      <div className="absolute inset-0 -z-10">
        <HeroScene />
      </div>

      {/* atmosphere. The flat scrim only applies on small screens, where the
          type unavoidably sits on top of the geometry. */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-ink/55 md:bg-transparent" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-glow-hero" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-56 bg-gradient-to-t from-ink to-transparent" />

      <motion.div
        style={{ y, opacity, filter: blur }}
        className="mx-auto w-full max-w-[1400px] px-6 md:px-10"
      >
        {/* terminal line — the identity, stated the way a developer would */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 inline-flex flex-wrap items-center gap-x-3 gap-y-2 rounded-full border border-line bg-ink-2/60 px-4 py-2 backdrop-blur-sm"
        >
          <span className="font-display text-xs text-accent">~ $</span>
          <span className="font-display text-xs text-fog">whoami</span>
          <span className="hidden h-3 w-px bg-line sm:block" />
          {/* types the name out, then the role, then loops */}
          <Typewriter
            phrases={[SITE.name, SITE.role]}
            className="font-display text-xs tracking-[0.14em] text-bone"
          />
          <span className="inline-flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-volt opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-volt" />
            </span>
            <span className="font-display text-xs tracking-[0.14em] text-accent">
              AVAILABLE
            </span>
          </span>
        </motion.div>

        {/* The WebGL blob is biased to the right of the viewport, so the copy
            column is capped short of it. Without this the headline and the
            buttons sit on top of the geometry and go muddy. */}
        <div className="lg:max-w-[62%] xl:max-w-[58%]">
          {/* sized so "Websites that load fast," holds on one line inside the
              capped column — at 5.2vw it broke after "load" */}
          <h1 className="font-display text-[clamp(2.2rem,4.5vw,4rem)] font-bold leading-[1.02] tracking-[-0.035em]">
            <span className="block">
              <SplitText text="Websites that load fast," active={ready} />
            </span>
            <span className="block">
              <SplitText text="rank high" delay={0.2} active={ready} />{" "}
              <span className="text-fog">
                <SplitText text="and stay up." delay={0.32} active={ready} />
              </span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 max-w-xl text-balance text-lg leading-relaxed text-fog"
          >
            I&rsquo;m Jose — an IT Manager and web developer in Dubai. For seven
            years I&rsquo;ve built and maintained business websites end to end:
            the build, the hosting, the security, and the SEO that actually
            brings in enquiries.
          </motion.p>

          {/* the second terminal line from the copy: > working in … */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : undefined}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="mt-7 flex items-center gap-2.5 font-display text-sm text-fog"
          >
            <span className="text-accent">&gt;</span>
            <span>working in</span>
            <Typewriter
              phrases={["React", "Next.js", "WordPress", "Astro"]}
              className="text-bone"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/contact"
              data-cursor="link"
              className="group relative overflow-hidden rounded-full bg-bone px-8 py-4 font-display font-semibold text-ink transition-colors duration-500 group-hover:text-on-accent"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start a project
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
              href="/work"
              data-cursor="link"
              className="rounded-full border border-line px-8 py-4 font-display font-medium text-bone transition-colors duration-400 hover:border-bone/60 hover:bg-bone/5"
            >
              See the work
            </Link>
          </motion.div>
        </div>

        {/* the numbers, the availability and the stack — the things a prospect
            checks before they read anything else */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.9, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-[repeat(3,minmax(0,1fr))_1.3fr]"
        >
          {STATS.map((s) => (
            <div key={s.k} className="bg-ink/80 p-6 backdrop-blur-sm md:p-7">
              <div className="font-display text-[clamp(1.9rem,3.4vw,2.75rem)] font-bold leading-none tracking-tight">
                {s.v}
              </div>
              <div className="mt-3 font-display text-[11px] uppercase tracking-[0.22em] text-fog">
                {s.k}
              </div>
            </div>
          ))}

          <div className="flex flex-col justify-between gap-5 bg-ink/80 p-6 backdrop-blur-sm md:p-7">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-volt" />
                <span className="font-display text-[11px] uppercase tracking-[0.22em] text-fog">
                  Available for projects
                </span>
                <span className="ml-auto font-display text-[11px] text-fog">
                  <LocalTime />
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {STACK.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-line px-2.5 py-1 font-display text-[11px] text-fog"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <a
              href={SITE.whatsapp}
              target="_blank"
              rel="noreferrer"
              data-cursor="link"
              className="group inline-flex items-center gap-2 font-display text-sm text-bone transition-colors hover:text-accent"
            >
              Quick question? WhatsApp me
              <svg
                width="13"
                height="13"
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
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
