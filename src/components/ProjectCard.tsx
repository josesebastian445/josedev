"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { Project } from "@/content/projects";
import { staggerItem } from "./motion-primitives";

/** The fake product shot used in place of a real screenshot. */
export function ProjectArt({ project }: { project: Project }) {
  return (
    <>
      <div
        className="absolute inset-0 scale-105 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100"
        style={{
          background: `radial-gradient(120% 100% at 20% 0%, ${project.art[0]}, ${project.art[1]} 62%)`,
        }}
      />
      <div className="absolute inset-x-8 top-8 rounded-xl border border-bone/15 bg-ink/45 backdrop-blur-md">
        <div className="flex items-center gap-1.5 border-b border-bone/10 px-3 py-2.5">
          <span className="h-2 w-2 rounded-full bg-bone/25" />
          <span className="h-2 w-2 rounded-full bg-bone/25" />
          <span className="h-2 w-2 rounded-full bg-bone/25" />
          <span className="ml-3 h-2 w-24 rounded-full bg-bone/15" />
        </div>
        <div className="space-y-2.5 p-4">
          <span className="block h-2.5 w-2/3 rounded-full bg-bone/25" />
          <span className="block h-2 w-1/2 rounded-full bg-bone/15" />
          <div className="flex gap-2 pt-2">
            <span className="h-8 w-20 rounded-md bg-bone/20" />
            <span className="h-8 w-14 rounded-md bg-bone/10" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 translate-y-3 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
        <div className="rounded-2xl border border-bone/15 bg-ink/70 px-5 py-3 backdrop-blur-md">
          <div className="font-display text-3xl font-bold text-bone">
            {project.metric}
          </div>
          <div className="font-display text-[10px] uppercase tracking-[0.2em] text-fog">
            {project.metricLabel}
          </div>
        </div>
      </div>
    </>
  );
}

export function ProjectMeta({ project }: { project: Project }) {
  return (
    <div className="flex items-end justify-between gap-6 border-t border-line p-6 md:p-7">
      <div>
        <div className="mb-2 flex items-center gap-3">
          <span className="font-display text-xs text-accent">{project.index}</span>
          <span className="font-display text-xs uppercase tracking-[0.2em] text-fog">
            {project.client} · {project.year}
          </span>
        </div>
        <h3 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
          {project.title}
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-line px-3 py-1 font-display text-[11px] text-fog"
            >
              {t}
            </span>
          ))}
        </div>
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
  );
}

/** Grid card used on /work. */
export default function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div variants={staggerItem}>
      <Link
        href={`/work/${project.slug}`}
        data-cursor="link"
        className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-ink-2 transition-colors duration-500 hover:border-fog/30"
      >
        <div className="relative aspect-[16/11] overflow-hidden">
          <ProjectArt project={project} />
        </div>
        <ProjectMeta project={project} />
      </Link>
    </motion.div>
  );
}
