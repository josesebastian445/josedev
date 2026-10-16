import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import CTABand from "@/components/CTABand";
import { Reveal, Stagger, staggerItem } from "@/components/motion-primitives";
import ScrollReadout from "@/components/ScrollReadout";
import { PROJECTS, getProject } from "@/content/projects";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Not found" };

  return {
    title: `${project.title} — Jose Sebastian`,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { title: project.title, description: project.summary },
  };
}

export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const idx = PROJECTS.findIndex((p) => p.slug === slug);
  const next = PROJECTS[(idx + 1) % PROJECTS.length];

  return (
    <main>
      <PageHero
        eyebrow={`${project.client} · ${project.year}`}
        title={project.title}
        lede={project.summary}
        backHref="/work"
        backLabel="All work"
        meta={[
          { label: "Role", value: project.role },
          { label: "Duration", value: project.duration },
          { label: "Year", value: project.year },
          { label: "Headline", value: `${project.metric} ${project.metricLabel}` },
        ]}
      />

      {/* hero artwork, scrubbed on scroll */}
      <ScrollReadout art={project.art} />

      <section className="border-b border-line py-20 md:py-28" aria-labelledby="project-change-heading">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <p className="mb-4 font-display text-xs uppercase tracking-[.22em] text-accent">The work, in context</p>
          <h2 id="project-change-heading" className="font-display text-3xl font-semibold tracking-tight md:text-4xl">The problem. My contribution. What changed.</h2>
          <p className="mb-10 mt-4 max-w-2xl text-sm leading-relaxed text-fog">A breakdown of the scope and delivery described in this engagement. Performance improvements and commercial gains are not quantified here without supporting measurement.</p>
          <div className="space-y-5">{project.changes.map((change) => <div key={change.area} className="rounded-2xl border border-line bg-ink-2/50 p-6 md:p-8"><h3 className="mb-6 font-display text-xl font-semibold">{change.area}</h3><dl className="grid gap-6 md:grid-cols-3">{[["The problem", change.before], ["My contribution", change.contribution], ["What changed", change.after]].map(([label, description]) => <div key={label}><dt className="mb-3 font-display text-xs uppercase tracking-wider text-accent">{label}</dt><dd className="text-sm leading-relaxed text-fog">{description}</dd></div>)}</dl></div>)}</div>
          <Link href="/contact?service=web-design-development" className="mt-8 inline-flex text-sm text-accent underline underline-offset-4">Discuss a similar project ↗</Link>
          {project.website && <a href={project.website} target="_blank" rel="noopener noreferrer" className="ml-0 mt-4 block text-sm text-bone underline underline-offset-4 md:ml-8 md:inline-flex">Visit the live website ↗</a>}
        </div>
      </section>

      {/* results */}
      <section className="border-b border-line py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <Stagger className="grid gap-10 sm:grid-cols-3" gap={0.1}>
            {project.results.map((r) => (
              <Reveal key={r.label} className="border-l border-line pl-6">
                <div className="font-display text-[clamp(2.5rem,5vw,4rem)] font-bold leading-none tracking-tight">
                  {r.value}
                </div>
                <div className="mt-3 font-display text-xs uppercase tracking-[0.2em] text-fog">
                  {r.label}
                </div>
              </Reveal>
            ))}
          </Stagger>
        </div>
      </section>

      {/* narrative */}
      <section className="py-24 md:py-32">
        <div className="mx-auto grid max-w-[1400px] gap-16 px-6 md:px-10 lg:grid-cols-[0.35fr_0.65fr] lg:gap-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <h2 className="font-display text-3xl font-bold tracking-tight">
                The brief
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="mt-8 space-y-4">
                <div className="font-display text-[11px] uppercase tracking-[0.22em] text-fog">
                  Stack
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-line px-3 py-1.5 font-display text-xs text-fog"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <div>
            <Reveal>
              <p className="text-xl leading-relaxed text-bone md:text-2xl">
                {project.brief}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <h3 className="mb-8 mt-20 font-display text-3xl font-bold tracking-tight">
                What I did
              </h3>
            </Reveal>

            <Stagger className="space-y-8" gap={0.09}>
              {project.approach.map((step, i) => (
                <div key={i} className="flex gap-6 border-t border-line pt-8">
                  <span className="shrink-0 font-display text-xs tracking-[0.3em] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="leading-relaxed text-fog">{step}</p>
                </div>
              ))}
            </Stagger>

            <Reveal delay={0.1}>
              <h3 className="mb-6 mt-20 font-display text-3xl font-bold tracking-tight">
                Outcome
              </h3>
              <p className="text-lg leading-relaxed text-fog">{project.outcome}</p>
            </Reveal>

            {project.quote && (
              <Reveal delay={0.12}>
                <figure className="mt-16 rounded-2xl border border-line bg-ink-2/50 p-8 md:p-10">
                  <blockquote className="font-display text-xl leading-relaxed text-bone md:text-2xl">
                    &ldquo;{project.quote.text}&rdquo;
                  </blockquote>
                  <figcaption className="mt-7 flex items-center gap-3 border-t border-line pt-6">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-plasma/60 to-volt/40 font-display text-sm font-bold text-on-accent">
                      {project.quote.name
                        .split(" ")
                        .map((p) => p[0])
                        .join("")}
                    </span>
                    <span>
                      <span className="block font-display text-sm font-medium">
                        {project.quote.name}
                      </span>
                      <span className="block font-display text-xs text-fog">
                        {project.quote.role}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* next project */}
      <section className="border-t border-line">
        <Link
          href={`/work/${next.slug}`}
          data-cursor="link"
          className="group block py-20 transition-colors duration-500 hover:bg-ink-2/40 md:py-28"
        >
          <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-8 px-6 md:px-10">
            <div>
              <div className="mb-3 font-display text-[11px] uppercase tracking-[0.25em] text-fog">
                Next project
              </div>
              <div className="font-display text-[clamp(2rem,5vw,4rem)] font-bold tracking-[-0.03em] transition-colors duration-500 group-hover:text-accent">
                {next.title}
              </div>
            </div>
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-line transition-all duration-500 group-hover:border-volt group-hover:bg-volt group-hover:text-on-accent">
              <svg width="20" height="20" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 7h11M7 2l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </Link>
      </section>

      <CTABand />
    </main>
  );
}
