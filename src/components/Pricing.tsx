"use client";

import Link from "next/link";
import { Reveal, SectionLabel, Stagger, staggerItem } from "./motion-primitives";
import { motion } from "motion/react";
import { SERVICES } from "@/content/services";

/**
 * A price table, not a second set of tier cards. The four service cards above
 * already carry the detail — repeating it here as three invented tiers is how
 * a services page ends up saying the same thing twice with different numbers.
 */
export default function Pricing() {
  return (
    <section id="pricing" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionLabel index="02">Pricing</SectionLabel>

        <div className="mb-16 flex flex-wrap items-end justify-between gap-8">
          <h2 className="max-w-2xl font-display text-[clamp(2rem,5vw,4rem)] font-bold leading-[0.98] tracking-[-0.03em]">
            The numbers,
            <span className="text-fog"> before you ask.</span>
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-fog">
            A written scope with a fixed price or a clear rate, a timeline, and
            what is explicitly not included. No surprises on the invoice.
          </p>
        </div>

        <Stagger
          className="overflow-hidden rounded-2xl border border-line"
          gap={0.08}
        >
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.slug}
              variants={staggerItem}
              className={`group flex flex-col gap-5 p-7 transition-colors duration-500 hover:bg-ink-2/50 md:flex-row md:items-center md:gap-10 md:p-9 ${
                i > 0 ? "border-t border-line" : ""
              }`}
            >
              <span className="font-display text-xs tracking-[0.3em] text-accent md:w-12">
                {s.n}
              </span>

              <div className="flex-1">
                <h3 className="font-display text-xl font-semibold tracking-tight md:text-2xl">
                  {s.title}
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-fog">
                  {s.blurb}
                </p>
              </div>

              <div className="shrink-0 md:w-52 md:text-right">
                <div className="font-display text-[11px] uppercase tracking-[0.2em] text-fog">
                  {s.priceNote}
                </div>
                <div className="mt-1 font-display text-2xl font-bold tracking-tight md:text-3xl">
                  {s.price}
                </div>
              </div>
            </motion.div>
          ))}
        </Stagger>

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link
              href="/contact"
              data-cursor="link"
              className="group relative overflow-hidden rounded-full bg-volt px-8 py-4 font-display font-semibold text-on-accent transition-colors duration-400 group-hover:text-ink"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get a fixed quote
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
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-bone transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
            </Link>

            <p className="max-w-md text-sm leading-relaxed text-fog">
              Every project is scoped before it is priced — these are starting
              points, not a menu.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
