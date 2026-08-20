"use client";

import dynamic from "next/dynamic";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import { SplitText } from "./motion-primitives";
import { SITE } from "@/content/site";

const LatticeScene = dynamic(() => import("@/three/LatticeScene"), {
  ssr: false,
});

/** Button that leans toward the pointer while it is nearby. */
function MagneticButton({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    // pull is a third of the distance from centre — noticeable, not silly
    x.set((e.clientX - (r.left + r.width / 2)) * 0.32);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.32);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      data-cursor="link"
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className="group relative inline-flex items-center gap-4 overflow-hidden rounded-full bg-volt px-10 py-6 font-display text-lg font-semibold text-on-accent transition-colors duration-400 group-hover:text-ink md:px-14 md:py-8 md:text-2xl"
    >
      <span className="relative z-10 flex items-center gap-4">{children}</span>
      <span className="absolute inset-0 origin-bottom scale-y-0 bg-bone transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
    </motion.a>
  );
}

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  const progressRef = useRef(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
  });

  const glow = useTransform(scrollYProgress, [0, 1], [0.05, 0.3]);

  return (
    <section
      id="contact"
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden py-32"
    >
      {/* WebGL lattice floor */}
      <div className="absolute inset-x-0 bottom-0 top-1/4 -z-10 opacity-70">
        <LatticeScene progress={progressRef} />
      </div>

      <motion.div
        style={{ opacity: glow }}
        className="pointer-events-none absolute inset-0 -z-10 bg-glow-close"
      />

      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <div className="mb-8 flex items-center gap-4">
          <span className="font-display text-xs tracking-[0.3em] text-accent">
            06
          </span>
          <span className="h-px w-10 bg-line" />
          <span className="font-display text-xs uppercase tracking-[0.3em] text-fog">
            Let&rsquo;s talk
          </span>
        </div>

        <h2 className="max-w-5xl font-display text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[0.94] tracking-[-0.035em]">
          <SplitText text="Got a project that needs" />
          <br />
          <span className="text-fog">
            <SplitText text="building or fixing?" delay={0.12} />
          </span>
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 max-w-lg text-lg leading-relaxed text-fog"
        >
          Tell me what you&rsquo;re trying to achieve. I&rsquo;ll come back with
          an honest read on scope, timeline and whether I&rsquo;m the right
          person for it.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 flex flex-wrap items-center gap-8"
        >
          <MagneticButton href="/contact">
            Start a project
            <svg width="22" height="22" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 7h11M7 2l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </MagneticButton>

          <a
            href={SITE.whatsapp}
            target="_blank"
            rel="noreferrer"
            data-cursor="link"
            className="rounded-full border border-line px-8 py-4 font-display font-medium text-bone transition-colors duration-400 hover:border-volt/60 hover:bg-bone/5"
          >
            Message on WhatsApp
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="mt-8 font-display text-xs uppercase tracking-[0.2em] text-fog"
        >
          Typically replies within a few hours · Dubai time
        </motion.p>
      </div>
    </section>
  );
}
