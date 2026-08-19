"use client";

import Link from "next/link";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { SectionLabel } from "./motion-primitives";
import { ProjectArt, ProjectMeta } from "./ProjectCard";
import { FEATURED, type Project } from "@/content/projects";

function Card({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      className="shrink-0"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/work/${project.slug}`}
        data-cursor="link"
        className="group flex h-[56vh] w-[78vw] flex-col overflow-hidden rounded-3xl border border-line bg-ink-2 sm:w-[58vw] lg:h-[62vh] lg:w-[44vw]"
      >
        <div className="relative flex-1 overflow-hidden">
          <ProjectArt project={project} />
        </div>
        <ProjectMeta project={project} />
      </Link>
    </motion.article>
  );
}

export default function Work() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref });

  // pinned viewport: vertical scroll distance is remapped to horizontal travel
  const raw = useTransform(scrollYProgress, [0.05, 0.95], ["2%", "-72%"]);
  const x = useSpring(raw, { stiffness: 90, damping: 26, mass: 0.4 });
  const railScale = useTransform(scrollYProgress, [0.05, 0.95], [0, 1]);

  return (
    <section id="work" ref={ref} className="relative h-[420vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
          <div className="flex flex-wrap items-end justify-between gap-6 pb-10">
            <div>
              <SectionLabel index="02">Selected work</SectionLabel>
              <h2 className="font-display text-[clamp(2rem,5vw,4rem)] font-bold leading-[0.98] tracking-[-0.03em]">
                Things I shipped
                <span className="text-fog"> that moved a number.</span>
              </h2>
            </div>
            <p className="hidden max-w-xs text-sm leading-relaxed text-fog lg:block">
              Keep scrolling — the gallery moves sideways. Open any card for the
              brief, the approach and what happened afterwards.
            </p>
          </div>
        </div>

        <motion.div style={{ x }} className="flex gap-6 pl-6 md:gap-8 md:pl-10">
          {FEATURED.map((p, i) => (
            <Card key={p.slug} project={p} index={i} />
          ))}

          {/* end cap */}
          <Link
            href="/work"
            data-cursor="link"
            className="group flex h-[56vh] w-[70vw] shrink-0 items-center justify-center rounded-3xl border border-dashed border-line transition-colors duration-500 hover:border-volt/50 lg:h-[62vh] lg:w-[34vw]"
          >
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-volt/40 transition-all duration-500 group-hover:bg-volt group-hover:text-ink">
                <svg width="20" height="20" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M1 7h11M7 2l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="font-display text-2xl font-semibold">
                See all six
              </div>
              <div className="mt-2 text-sm text-fog">Full case studies</div>
            </div>
          </Link>

          <div className="w-10 shrink-0 md:w-16" />
        </motion.div>

        {/* horizontal progress rail */}
        <div className="mx-auto mt-10 w-full max-w-[1400px] px-6 md:px-10">
          <div className="h-px w-full bg-line">
            <motion.div
              style={{ scaleX: railScale }}
              className="h-full origin-left bg-volt"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
