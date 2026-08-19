"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const SITE = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Writing", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

// TODO: swap the remaining placeholder hrefs for real profile URLs
const SOCIAL = [
  { label: "GitHub", href: "https://github.com/josesebastian445" },
  { label: "Read.cv", href: "#" },
  { label: "X", href: "#" },
  { label: "LinkedIn", href: "#" },
];

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  // the wordmark rises into place as the footer is revealed
  const y = useTransform(scrollYProgress, [0, 1], ["28%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [0.15, 1]);

  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-line">
      <div className="mx-auto max-w-[1400px] px-6 pt-20 md:px-10">
        <div className="flex flex-wrap items-start justify-between gap-12 pb-20">
          <div>
            <div className="font-display text-sm font-bold tracking-tight">
              JOSE<span className="text-fog">.SEBASTIAN</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-fog">
              Web developer and interface engineer. Lisbon, working with teams
              anywhere in GMT ±3.
            </p>
            <div className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-line px-3.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-volt" />
              <span className="font-display text-[11px] tracking-[0.15em] text-fog">
                AVAILABLE FOR Q4
              </span>
            </div>
          </div>

          <nav className="flex gap-14">
            <div>
              <div className="mb-4 font-display text-[11px] uppercase tracking-[0.22em] text-fog">
                Site
              </div>
              <ul className="space-y-2.5">
                {SITE.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      data-cursor="link"
                      className="group relative font-display text-sm text-bone"
                    >
                      {l.label}
                      <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-volt transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="mb-4 font-display text-[11px] uppercase tracking-[0.22em] text-fog">
                Elsewhere
              </div>
              <ul className="space-y-2.5">
                {SOCIAL.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      data-cursor="link"
                      className="group relative font-display text-sm text-bone"
                    >
                      {s.label}
                      <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-volt transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        {/* oversized wordmark */}
        <div className="overflow-hidden">
          <motion.div
            style={{ y, opacity }}
            className="select-none whitespace-nowrap font-display text-[clamp(2rem,11.2vw,10.5rem)] font-bold leading-[0.85] tracking-[-0.04em] text-bone/[0.07]"
          >
            JOSE SEBASTIAN
          </motion.div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line py-7 font-display text-xs text-fog">
          <span>&copy; {new Date().getFullYear()} Jose Sebastian. All rights reserved.</span>
          <span>Built with Next.js, Three.js and too much coffee.</span>
        </div>
      </div>
    </footer>
  );
}
