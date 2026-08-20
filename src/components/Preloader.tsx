"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { completeIntro, INTRO_SESSION_KEY } from "@/lib/intro";

const PANELS = 5;

export default function Preloader() {
  const [phase, setPhase] = useState<"counting" | "lifting" | "gone">("counting");
  const count = useMotionValue(0);
  const [shown, setShown] = useState(0);
  const barScale = useTransform(count, [0, 100], [0, 1]);

  useEffect(() => {
    const seen =
      typeof sessionStorage !== "undefined" &&
      sessionStorage.getItem(INTRO_SESSION_KEY) === "1";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // already seen this session, or motion is unwelcome: skip straight through
    if (seen || reduced) {
      setPhase("gone");
      completeIntro();
      return;
    }

    document.documentElement.style.overflow = "hidden";

    const controls = animate(count, 100, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setShown(Math.round(v)),
      onComplete: () => setPhase("lifting"),
    });

    return () => {
      controls.stop();
      document.documentElement.style.overflow = "";
    };
  }, [count]);

  // release the page as the panels start moving, then unmount
  useEffect(() => {
    if (phase !== "lifting") return;
    document.documentElement.style.overflow = "";
    sessionStorage.setItem(INTRO_SESSION_KEY, "1");

    const t = setTimeout(() => {
      setPhase("gone");
      completeIntro();
    }, 900);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100]"
      aria-hidden
      role="presentation"
    >
      {/* the curtain: vertical panels that lift in sequence */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: PANELS }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 0 }}
            animate={phase === "lifting" ? { y: "-101%" } : { y: 0 }}
            transition={{
              duration: 0.85,
              ease: [0.76, 0, 0.24, 1],
              delay: phase === "lifting" ? i * 0.055 : 0,
            }}
            className="h-full flex-1 bg-ink"
          />
        ))}
      </div>

      {/* counter + wordmark, faded out before the panels move */}
      <motion.div
        animate={{ opacity: phase === "lifting" ? 0 : 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="absolute inset-0 flex flex-col justify-between p-6 md:p-10"
      >
        <div className="flex items-center gap-3 pt-2">
          <span className="h-2 w-2 rounded-full bg-volt" />
          <span className="font-display text-sm font-bold tracking-tight">
            JOSE<span className="text-fog">.SEBASTIAN</span>
          </span>
        </div>

        <div className="flex items-end justify-between gap-8">
          <div className="overflow-hidden">
            <motion.p
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="font-display text-sm uppercase tracking-[0.3em] text-fog"
            >
              Web developer &amp; interface engineer
            </motion.p>
          </div>

          <div className="font-display text-[clamp(3.5rem,14vw,11rem)] font-bold leading-none tracking-[-0.04em] tabular-nums">
            {shown}
            <span className="text-accent">%</span>
          </div>
        </div>

        {/* progress rail */}
        <motion.div
          style={{ scaleX: barScale }}
          className="absolute inset-x-0 bottom-0 h-px origin-left bg-volt"
        />
      </motion.div>
    </div>
  );
}
