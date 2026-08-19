"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { SplitText } from "./motion-primitives";
import { useIntroDone } from "@/lib/intro";

export default function PageHero({
  eyebrow,
  title,
  lede,
  backHref,
  backLabel,
  meta,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  backHref?: string;
  backLabel?: string;
  meta?: { label: string; value: string }[];
}) {
  const ready = useIntroDone();

  return (
    <header className="relative overflow-hidden border-b border-line pb-16 pt-40 md:pb-24 md:pt-48">
      {/* soft ambient wash, no WebGL cost on inner pages */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_25%_0%,rgba(107,91,255,0.14),transparent_58%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_85%_10%,rgba(200,255,46,0.07),transparent_52%)]" />

      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {backHref && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={ready ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10"
          >
            <Link
              href={backHref}
              data-cursor="link"
              className="group inline-flex items-center gap-3 font-display text-sm text-fog transition-colors hover:text-bone"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line transition-all duration-400 group-hover:border-volt group-hover:bg-volt group-hover:text-ink">
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M13 7H2M7 2L2 7l5 5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              {backLabel ?? "Back"}
            </Link>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : undefined}
          transition={{ duration: 0.5 }}
          className="mb-7 flex items-center gap-4"
        >
          <span className="h-1.5 w-1.5 rotate-45 bg-volt" />
          <span className="font-display text-xs uppercase tracking-[0.3em] text-fog">
            {eyebrow}
          </span>
        </motion.div>

        <h1 className="max-w-5xl font-display text-[clamp(2.4rem,7vw,6rem)] font-bold leading-[0.96] tracking-[-0.035em]">
          <SplitText text={title} active={ready} stagger={0.013} />
        </h1>

        {lede && (
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 max-w-2xl text-lg leading-relaxed text-fog"
          >
            {lede}
          </motion.p>
        )}

        {meta && meta.length > 0 && (
          <motion.dl
            initial={{ opacity: 0, y: 18 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mt-14 grid gap-8 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {meta.map((m) => (
              <div key={m.label}>
                <dt className="font-display text-[11px] uppercase tracking-[0.22em] text-fog">
                  {m.label}
                </dt>
                <dd className="mt-2 font-display text-lg text-bone">{m.value}</dd>
              </div>
            ))}
          </motion.dl>
        )}
      </div>
    </header>
  );
}
