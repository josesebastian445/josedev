import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ProjectCard from "@/components/ProjectCard";
import { Stagger } from "@/components/motion-primitives";
import CTABand from "@/components/CTABand";
import { PROJECTS } from "@/content/projects";

export const metadata: Metadata = {
  title: "Work — Jose Sebastian",
  description:
    "Selected projects: booking platforms, dashboards, storefronts and portfolio sites, each with the metric the client actually cared about.",
};

export default function WorkPage() {
  return (
    <main>
      <PageHero
        eyebrow="Selected work"
        title="Six builds, and what they moved."
        lede="Every project here shipped to production and changed a number somebody was measuring. Open one to see the brief, the approach and what happened afterwards."
        meta={[
          { label: "Projects", value: String(PROJECTS.length) },
          { label: "Years", value: "2023 — 2025" },
          { label: "Typical duration", value: "4 — 14 weeks" },
          { label: "Delivered on date", value: "100%" },
        ]}
      />

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <Stagger className="grid gap-6 lg:grid-cols-2" gap={0.09}>
            {PROJECTS.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </Stagger>
        </div>
      </section>

      <CTABand />
    </main>
  );
}
