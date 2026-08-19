"use client";

import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { useRef } from "react";
import { SectionLabel, Stagger, staggerItem } from "./motion-primitives";

const SERVICES = [
  {
    n: "01",
    title: "Marketing sites",
    body: "Landing pages and brand sites that load fast, rank, and convert. Built on Next.js with a CMS your team can actually use.",
    points: ["Design → build", "Headless CMS", "SEO & analytics"],
  },
  {
    n: "02",
    title: "Web apps & dashboards",
    body: "Complex state, real data, real users. Typed end to end, tested where it counts, and shipped behind a CI pipeline.",
    points: ["React / Next.js", "API & database", "Auth & billing"],
  },
  {
    n: "03",
    title: "Motion & WebGL",
    body: "Scroll choreography, shader work, interactive 3D. The layer that makes a site feel expensive without making it slow.",
    points: ["Three.js / R3F", "Scroll systems", "Custom shaders"],
  },
  {
    n: "04",
    title: "Performance rescue",
    body: "An audit and a fix, not a slide deck. I go after the render path, the bundle, and the images until the numbers move.",
    points: ["Core Web Vitals", "Bundle surgery", "Edge caching"],
  },
];

/** Card that tilts toward the pointer and lights a spotlight under it. */
function ServiceCard({ s }: { s: (typeof SERVICES)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });
  const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });

  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, rgba(200,255,46,0.10), transparent 68%)`;

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
            <span className="font-display text-xs tracking-[0.3em] text-volt">
              {s.n}
            </span>
            <span className="h-px w-16 bg-line transition-all duration-500 group-hover:w-24 group-hover:bg-volt/50" />
          </div>

          <h3 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
            {s.title}
          </h3>
          <p className="mt-4 max-w-md leading-relaxed text-fog">{s.body}</p>

          <ul className="mt-7 flex flex-wrap gap-2">
            {s.points.map((p) => (
              <li
                key={p}
                className="rounded-full border border-line px-3.5 py-1.5 font-display text-xs text-fog"
              >
                {p}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Capabilities() {
  return (
    <section id="services" className="relative py-32 md:py-44">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionLabel index="03">What I do</SectionLabel>

        <div className="mb-16 flex flex-wrap items-end justify-between gap-8">
          <h2 className="max-w-2xl font-display text-[clamp(2rem,5vw,4rem)] font-bold leading-[0.98] tracking-[-0.03em]">
            Four ways I&rsquo;m
            <span className="text-fog"> usually useful.</span>
          </h2>
          <Link
            href="/contact"
            data-cursor="link"
            className="group flex items-center gap-3 font-display text-sm text-fog transition-colors hover:text-bone"
          >
            Something else in mind?
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-all duration-400 group-hover:border-volt group-hover:bg-volt group-hover:text-ink">
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
