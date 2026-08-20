"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Writing", href: "/blog" },
];

export default function Nav() {
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  // The header stays pinned the whole way down — it only condenses into the
  // floating pill once you leave the top of the page.
  useMotionValueEvent(scrollY, "change", (y) => {
    setSolid(y > 40);
  });

  // close the sheet on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={`mx-auto flex max-w-[1400px] items-center justify-between px-6 transition-all duration-500 md:px-10 ${
          solid
            ? "my-3 rounded-full border border-line/80 bg-ink-2/70 py-3 backdrop-blur-xl"
            : "my-0 border border-transparent py-6"
        }`}
      >
        <Link href="/" data-cursor="link" className="group flex items-center gap-3">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-volt/40">
            <span className="absolute inset-0 rounded-full bg-volt/20 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
            <span className="h-2 w-2 rounded-full bg-volt transition-transform duration-500 group-hover:scale-150" />
          </span>
          <span className="font-display text-sm font-bold tracking-tight">
            JOSE<span className="text-fog">.SEBASTIAN</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              data-cursor="link"
              className={`group relative px-4 py-2 font-display text-sm transition-colors ${
                isActive(l.href) ? "text-bone" : "text-fog hover:text-bone"
              }`}
            >
              {l.label}
              <span
                className={`absolute inset-x-4 bottom-1 h-px origin-left bg-volt transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive(l.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Link
            href="/contact"
            data-cursor="link"
            className="group relative hidden overflow-hidden rounded-full border border-volt/50 px-5 py-2.5 font-display text-sm font-medium text-accent transition-colors duration-400 hover:text-on-accent sm:block"
          >
            <span className="relative z-10">Start a project</span>
            <span className="absolute inset-0 origin-bottom scale-y-0 bg-volt transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
          </Link>

          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-line md:hidden"
          >
            <span
              className={`h-px w-4 bg-bone transition-transform duration-300 ${
                open ? "translate-y-[3px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-4 bg-bone transition-transform duration-300 ${
                open ? "-translate-y-[3px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* mobile sheet */}
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mx-4 overflow-hidden rounded-2xl border border-line bg-ink-2/95 backdrop-blur-xl md:hidden"
      >
        <div className="flex flex-col p-4">
          {[...LINKS, { label: "Contact", href: "/contact" }].map((l, i) => (
            <motion.div
              key={l.href}
              initial={{ x: -12, opacity: 0 }}
              animate={open ? { x: 0, opacity: 1 } : { x: -12, opacity: 0 }}
              transition={{ delay: open ? 0.06 * i : 0, duration: 0.4 }}
            >
              <Link
                href={l.href}
                className="block border-b border-line/60 py-4 font-display text-2xl"
              >
                {l.label}
              </Link>
            </motion.div>
          ))}

          <div className="flex items-center justify-between pt-5">
            <span className="font-display text-[11px] uppercase tracking-[0.22em] text-fog">
              Appearance
            </span>
            <ThemeToggle />
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
}
