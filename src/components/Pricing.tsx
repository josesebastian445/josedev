"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { SectionLabel, Stagger, staggerItem } from "./motion-primitives";

const TIERS = [
  {
    name: "Landing",
    price: "€4.5k",
    from: "from",
    blurb:
      "One page, done properly. For a launch, a campaign, or a product that needs somewhere to point.",
    timeline: "2–3 weeks",
    includes: [
      "Design and build",
      "Up to 6 sections",
      "CMS for all copy",
      "Analytics + SEO setup",
      "30 days of support",
    ],
    cta: "Start here",
    featured: false,
  },
  {
    name: "Site",
    price: "€12k",
    from: "from",
    blurb:
      "A full marketing site with the motion work this page is built on. The usual choice.",
    timeline: "5–7 weeks",
    includes: [
      "Everything in Landing",
      "6–12 pages, blog included",
      "Motion + WebGL layer",
      "Headless CMS, handover recording",
      "Performance budget enforced in CI",
      "60 days of support",
    ],
    cta: "Most projects",
    featured: true,
  },
  {
    name: "Product",
    price: "€6k",
    from: "per month",
    blurb:
      "Ongoing frontend work on an app or platform. Fixed monthly, cancel with 30 days' notice.",
    timeline: "Rolling",
    includes: [
      "Dedicated days each week",
      "App, dashboard or design system work",
      "Code review and mentoring",
      "Direct Slack channel",
      "No minimum term after month two",
    ],
    cta: "Talk retainer",
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionLabel index="04">Pricing</SectionLabel>

        <div className="mb-16 flex flex-wrap items-end justify-between gap-8">
          <h2 className="max-w-2xl font-display text-[clamp(2rem,5vw,4rem)] font-bold leading-[0.98] tracking-[-0.03em]">
            Fixed price,
            <span className="text-fog"> agreed before I start.</span>
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-fog">
            You get a number and a date in writing after the first call. If the
            scope changes we re-quote in the open — you will never see an
            invoice you did not expect.
          </p>
        </div>

        <Stagger className="grid gap-5 lg:grid-cols-3" gap={0.1}>
          {TIERS.map((t) => (
            <motion.div
              key={t.name}
              variants={staggerItem}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border p-8 transition-colors duration-500 md:p-10 ${
                t.featured
                  ? "border-volt/45 bg-volt/[0.04]"
                  : "border-line bg-ink-2/50 hover:border-fog/30"
              }`}
            >
              {t.featured && (
                <span className="absolute right-6 top-6 rounded-full bg-volt px-3 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-ink">
                  Most picked
                </span>
              )}

              <h3 className="font-display text-xl font-semibold tracking-tight">
                {t.name}
              </h3>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-[11px] uppercase tracking-[0.2em] text-fog">
                  {t.from}
                </span>
                <span className="font-display text-5xl font-bold tracking-tight">
                  {t.price}
                </span>
              </div>

              <p className="mt-5 leading-relaxed text-fog">{t.blurb}</p>

              <div className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-line px-3.5 py-1.5 font-display text-xs text-fog">
                <span className="h-1.5 w-1.5 rounded-full bg-volt" />
                {t.timeline}
              </div>

              <ul className="mt-8 space-y-3 border-t border-line pt-8">
                {t.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-bone">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      className="mt-1 shrink-0 text-volt"
                      aria-hidden
                    >
                      <path
                        d="M2 7.5l3.2 3.2L12 4"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                data-cursor="link"
                className={`group/btn relative mt-10 overflow-hidden rounded-full px-6 py-3.5 text-center font-display font-semibold transition-colors duration-400 ${
                  t.featured
                    ? "bg-volt text-ink"
                    : "border border-line text-bone hover:border-bone/50"
                }`}
              >
                <span className="relative z-10">{t.cta}</span>
              </Link>
            </motion.div>
          ))}
        </Stagger>

        <p className="mt-10 max-w-2xl text-sm leading-relaxed text-fog">
          Prices exclude VAT. Non-profits and open-source projects get 30% off,
          no questions asked — just mention it on the first call.
        </p>
      </div>
    </section>
  );
}
