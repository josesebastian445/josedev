"use client";

import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { useRef } from "react";
import { SectionLabel, Stagger, staggerItem } from "./motion-primitives";
import { SERVICES, type Service } from "@/content/services";

/** Card that tilts toward the pointer and lights a spotlight under it. */
function ServiceCard({ s }: { s: Service }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });
  const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });

  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, rgb(200 255 46 / var(--glow-spot)), transparent 68%)`;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    mx.set(px);
    my.set(py);
    // ±5deg tilt, normalised from the card centre
    ry.set(((px - r.width / 2) / (r.width / 2)) * 5);
    rx.set(((py - r.height / 2) / (r.height / 2)) * -5);
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div variants={staggerItem} className="[perspective:1200px]">
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="group relative h-full overflow-hidden rounded-2xl border border-line bg-ink-2/60 p-8 transition-colors duration-500 hover:border-volt/35 md:p-10"
      >
        <motion.div
          style={{ background: spotlight }}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />

        <div className="relative" style={{ transform: "translateZ(30px)" }}>
          <div className="mb-6 flex items-baseline justify-between">
            <span className="font-display text-xs tracking-[0.3em] text-accent">
              {s.n}
            </span>
            <span className="h-px w-16 bg-line transition-all duration-500 group-hover:w-24 group-hover:bg-volt/50" />
          </div>

          <h3 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
            {s.title}
          </h3>
          <p className="mt-4 max-w-md leading-relaxed text-fog">{s.blurb}</p>

          {/* a ticked list, not feature pills: these are four real deliverables
              per service, not three keywords */}
          <ul className="mt-7 space-y-3">
            {s.points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm text-bone">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="mt-1 shrink-0 text-accent"
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
                {p}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-6">
            <div>
              <div className="font-display text-[11px] uppercase tracking-[0.2em] text-fog">
                {s.priceNote}
              </div>
              <div className="mt-1 font-display text-2xl font-bold tracking-tight">
                {s.price}
              </div>
            </div>
            <Link
              href="/services"
              data-cursor="link"
              className="group/link inline-flex items-center gap-2 font-display text-sm text-fog transition-colors hover:text-accent"
            >
              Details
              <span className="sr-only"> about {s.title}</span>
              <svg
                width="13"
                height="13"
                viewBox="0 0 14 14"
                fill="none"
                className="transition-transform duration-400 group-hover/link:translate-x-1"
              >
                <path
                  d="M1 7h11M7 2l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Capabilities() {
  return (
    <section id="services" className="relative py-32 md:py-44">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionLabel index="01">What I do</SectionLabel>

        <div className="mb-16 flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] font-bold leading-[0.98] tracking-[-0.03em]">
              Four things,
              <span className="text-fog"> done properly.</span>
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-fog">
              I would rather be genuinely good at a short list than passable at
              everything. If your project needs something outside this, I will
              tell you and point you at someone better.
            </p>
          </div>
          <Link
            href="/services"
            data-cursor="link"
            className="group flex items-center gap-3 font-display text-sm text-fog transition-colors hover:text-bone"
          >
            All services
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-all duration-400 group-hover:border-volt group-hover:bg-volt group-hover:text-on-accent">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 7h11M7 2l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        </div>

        <Stagger className="grid gap-5 md:grid-cols-2" gap={0.1}>
          {SERVICES.map((s) => (
            <ServiceCard key={s.n} s={s} />
          ))}
        </Stagger>
      </div>
    </section>
  );
}
