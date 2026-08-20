"use client";

import Link from "next/link";
import { Reveal, SectionLabel } from "./motion-primitives";
import { ProjectArt } from "./ProjectCard";
import { FEATURED, type Project } from "@/content/projects";

/**
 * Two long engagements, not six one-off builds — so this is a pair of full
 * editorial rows rather than the pinned horizontal gallery a six-card reel
 * needed. The rows alternate side so the section still has rhythm.
 */
function Row({ project, index }: { project: Project; index: number }) {
  const flip = index % 2 === 1;

  return (
    <Reveal delay={index * 0.08}>
      <Link
        href={`/work/${project.slug}`}
        data-cursor="link"
        className="group grid overflow-hidden rounded-3xl border border-line bg-ink-2 transition-colors duration-500 hover:border-fog/30 lg:grid-cols-2"
      >
        <div
          className={`relative aspect-[16/11] overflow-hidden lg:aspect-auto lg:min-h-[26rem] ${
            flip ? "lg:order-2" : ""
          }`}
        >
          <ProjectArt project={project} />
        </div>

        <div className="flex flex-col justify-between gap-8 p-8 md:p-12">
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-volt/40 font-display text-xs font-bold tracking-tight text-accent">
                {project.mark}
              </span>
              <span className="font-display text-xs uppercase tracking-[0.2em] text-fog">
                {project.year}
              </span>
              <span className="h-px flex-1 bg-line" />
            </div>

            <h3 className="font-display text-xl font-semibold tracking-tight text-fog">
              {project.client}
            </h3>
            <p className="mt-3 font-display text-2xl font-bold leading-[1.15] tracking-tight md:text-3xl">
              {project.headline}
            </p>
            <p className="mt-5 max-w-xl leading-relaxed text-fog">
              {project.summary}
            </p>
          </div>

          <div className="flex items-end justify-between gap-6">
            <div className="flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-line px-3 py-1 font-display text-[11px] text-fog"
                >
                  {t}
                </span>
              ))}
            </div>

            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line text-fog transition-all duration-500 group-hover:border-volt group-hover:bg-volt group-hover:text-on-accent">
              <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
                <path
                  d="M3 11L11 3M11 3H4.5M11 3v6.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

export default function Work() {
  return (
    <section id="work" className="relative py-32 md:py-44">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionLabel index="02">Selected work</SectionLabel>

        <div className="mb-16 flex flex-wrap items-end justify-between gap-8">
          <h2 className="max-w-2xl font-display text-[clamp(2rem,5vw,4rem)] font-bold leading-[0.98] tracking-[-0.03em]">
            Things I&rsquo;ve built
            <span className="text-fog"> and kept running.</span>
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-fog">
            Long engagements rather than one-off builds — which means these are
            systems I still maintain, not screenshots from a portfolio.
          </p>
        </div>

        <div className="space-y-6">
          {FEATURED.map((p, i) => (
            <Row key={p.slug} project={p} index={i} />
          ))}
        </div>

        <Reveal delay={0.1} className="mt-12">
          <Link
            href="/work"
            data-cursor="link"
            className="group inline-flex items-center gap-4 font-display text-lg font-medium text-bone"
          >
            All case studies
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-volt/40 transition-all duration-500 group-hover:bg-volt group-hover:text-on-accent">
              <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
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
        </Reveal>
      </div>
    </section>
  );
}
