"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { SITE, MAILTO, TEL } from "@/content/site";

const NAV = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Writing", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const CONTACT = [
  { label: SITE.email, href: MAILTO },
  { label: SITE.phone, href: TEL },
  { label: "WhatsApp", href: SITE.whatsapp, external: true },
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
      <div className="mx-auto max-w-[1400px] px-6 pt-14 md:px-10">
        <div className="flex flex-wrap items-start justify-between gap-10 pb-12">
          <div>
            <div className="font-display text-sm font-bold tracking-tight">
              JOSE<span className="text-fog">.SEBASTIAN</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-fog">
              IT Manager and web developer in Dubai. Websites that load fast,
              rank well and don&rsquo;t fall over.
            </p>
            <div className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-line px-3.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-volt" />
              <span className="font-display text-[11px] tracking-[0.15em] text-fog">
                AVAILABLE FOR PROJECTS
              </span>
            </div>
          </div>

          <nav className="flex gap-14">
            <div>
              <div className="mb-4 font-display text-[11px] uppercase tracking-[0.22em] text-fog">
                Site
              </div>
              <ul className="space-y-2.5">
                {NAV.map((l) => (
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
                Get in touch
              </div>
              <ul className="space-y-2.5">
                {CONTACT.map((c) => (
                  <li key={c.label}>
                    <a
                      href={c.href}
                      data-cursor="link"
                      {...(c.external
                        ? { target: "_blank", rel: "noreferrer" }
                        : {})}
                      className="group relative font-display text-sm text-bone"
                    >
                      {c.label}
                      <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-volt transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100" />
                    </a>
                  </li>
                ))}
                <li className="pt-1 font-display text-sm text-fog">
                  {SITE.location}
                </li>
              </ul>
            </div>
          </nav>
        </div>

        {/* oversized wordmark */}
        <div className="overflow-hidden">
          <motion.div
            style={{ y, opacity }}
            className="select-none whitespace-nowrap font-display text-[clamp(1.6rem,7.4vw,6rem)] font-bold leading-[0.8] tracking-[-0.04em] text-bone/[0.07]"
          >
            JOSE SEBASTIAN
          </motion.div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line py-5 font-display text-xs text-fog">
          <span>&copy; {new Date().getFullYear()} Jose Sebastian. All rights reserved.</span>
          <span>Built with Next.js and Three.js. Hosted on Cloudflare.</span>
        </div>
      </div>
    </footer>
  );
}
