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
    title: "Conversation",
    body: "A call or a WhatsApp thread. You describe the problem, I ask the awkward questions about budget and deadlines early rather than late.",
    meta: "Free",
  },
  {
    n: "02",
    title: "Proposal",
    body: "A written scope with a fixed price or a clear rate, a timeline, and what is explicitly not included. No surprises on the invoice.",
    meta: "In writing",
  },
  {
    n: "03",
    title: "Build",
    body: "Work happens in the open. You get a staging link from day one and can watch it come together instead of waiting for a reveal.",
    meta: "Staging from day one",
  },
  {
    n: "04",
    title: "Handover",
    body: "Documentation, a training session, and every credential transferred to you. You own everything, including the ability to leave.",
    meta: "You own it",
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
        <SectionLabel index="03">How it works</SectionLabel>

        <div className="grid gap-16 lg:grid-cols-[1fr_0.85fr] lg:gap-24">
          {/* steps */}
          <div>
            <h2 className="max-w-xl font-display text-[clamp(2rem,5vw,4rem)] font-bold leading-[0.98] tracking-[-0.03em]">
              No mystery,
              <span className="text-fog"> no lock-in.</span>
            </h2>
            <p className="mb-14 mt-6 max-w-xl leading-relaxed text-fog">
              The most common complaint I hear about previous developers is not
              the price. It is not knowing what was happening, and not being
              able to leave afterwards.
            </p>

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
                        i <= active ? "bg-on-accent" : "bg-fog/40"
                      }`}
                    />
                  </span>

                  <div className="mb-2 flex items-center gap-4">
                    <span
                      className={`font-display text-xs tracking-[0.3em] transition-colors duration-500 ${
                        i <= active ? "text-accent" : "text-fog/50"
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
              <div className="absolute inset-0 rounded-3xl border border-line bg-glow-knot" />
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
