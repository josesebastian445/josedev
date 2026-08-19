"use client";

import dynamic from "next/dynamic";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";
import { SectionLabel } from "./motion-primitives";

const KnotScene = dynamic(() => import("@/three/KnotScene"), { ssr: false });

const STEPS = [
  {
    n: "01",
    title: "Scope",
    body: "A 45-minute call, then a written plan: what we build, what we cut, what it costs. No discovery phase that bills for a month.",
    meta: "Week 0 · Free",
  },
  {
    n: "02",
    title: "Design",
    body: "Layout, type and motion decided in the browser, not in a static mockup. You see the real thing moving by the end of week one.",
    meta: "Week 1–2",
  },
  {
    n: "03",
    title: "Build",
    body: "Typed, componentised, deployed to a preview URL from day one. You watch it come together instead of waiting for a reveal.",
    meta: "Week 2–5",
  },
  {
    n: "04",
    title: "Ship",
    body: "Performance pass, accessibility pass, analytics wired, CMS handed over with a walkthrough recording. Then 30 days of support.",
    meta: "Week 5–6",
  },
];

export default function Process() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // shared with the WebGL scene without triggering React re-renders
  const progressRef = useRef(0);
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
    // 0.2 → 0.8 of the section maps onto the four steps
    const t = (v - 0.2) / 0.6;
    setActive(Math.max(0, Math.min(STEPS.length - 1, Math.floor(t * STEPS.length))));
  });

  const lineScale = useTransform(scrollYProgress, [0.2, 0.8], [0, 1]);

  return (
    <section id="process" ref={ref} className="relative py-32 md:py-44">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionLabel index="04">How it goes</SectionLabel>

        <div className="grid gap-16 lg:grid-cols-[1fr_0.85fr] lg:gap-24">
          {/* steps */}
          <div>
            <h2 className="mb-14 max-w-xl font-display text-[clamp(2rem,5vw,4rem)] font-bold leading-[0.98] tracking-[-0.03em]">
              Six weeks,
              <span className="text-fog"> four checkpoints, no surprises.</span>
            </h2>

            <div className="relative pl-10">
              {/* the rail fills as you scroll the section */}
              <div className="absolute left-0 top-2 h-[calc(100%-1rem)] w-px bg-line">
                <motion.div
                  style={{ scaleY: lineScale }}
                  className="h-full w-full origin-top bg-gradient-to-b from-volt to-plasma"
                />
              </div>

              {STEPS.map((s, i) => (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-15% 0px" }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative pb-14 last:pb-0"
                >
                  <span
                    className={`absolute -left-10 top-1.5 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full border transition-all duration-500 ${
                      i <= active
                        ? "border-volt bg-volt"
                        : "border-line bg-ink"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${
                        i <= active ? "bg-ink" : "bg-fog/40"
                      }`}
                    />
                  </span>

                  <div className="mb-2 flex items-center gap-4">
                    <span
                      className={`font-display text-xs tracking-[0.3em] transition-colors duration-500 ${
                        i <= active ? "text-volt" : "text-fog/50"
                      }`}
                    >
                      {s.n}
                    </span>
                    <span className="font-display text-[11px] uppercase tracking-[0.2em] text-fog">
                      {s.meta}
                    </span>
                  </div>

                  <h3
                    className={`font-display text-2xl font-semibold tracking-tight transition-colors duration-500 md:text-3xl ${
                      i <= active ? "text-bone" : "text-fog/60"
                    }`}
                  >
                    {s.title}
                  </h3>
                  <p className="mt-3 max-w-md leading-relaxed text-fog">
                    {s.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* WebGL companion, pinned alongside the steps */}
          <div className="relative hidden lg:block">
            <div className="sticky top-24 h-[70vh]">
              <div className="absolute inset-0 rounded-3xl border border-line bg-[radial-gradient(circle_at_50%_40%,rgba(107,91,255,0.10),transparent_65%)]" />
              <KnotScene progress={progressRef} />
              {/* scrim so the geometry never sits on top of the caption */}
              <div className="pointer-events-none absolute inset-x-px bottom-px h-40 rounded-b-3xl bg-gradient-to-t from-ink via-ink/85 to-transparent" />
              <div className="pointer-events-none absolute bottom-8 left-8 right-8 flex items-end justify-between">
                <div>
                  <div className="font-display text-[10px] uppercase tracking-[0.25em] text-fog">
                    Current phase
                  </div>
                  <div className="mt-1 font-display text-3xl font-bold">
                    {STEPS[active].title}
                  </div>
                </div>
                <div className="font-display text-5xl font-bold text-line">
                  {STEPS[active].n}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
