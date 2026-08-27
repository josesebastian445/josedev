import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ProjectCard from "@/components/ProjectCard";
import { Stagger } from "@/components/motion-primitives";
import CTABand from "@/components/CTABand";
import { PROJECTS } from "@/content/projects";

export const metadata: Metadata = {
  title: "Work — Jose Sebastian",
  description:
    "Long engagements rather than one-off builds: multi-site web estates, WooCommerce portfolios, SEO and the IT layer underneath them.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <main>
      <PageHero
        eyebrow="Selected work"
        title="Things I've built and kept running."
        lede="Long engagements rather than one-off builds — which means these are systems I still maintain, not screenshots from a portfolio."
        meta={[
          { label: "Engagements", value: String(PROJECTS.length) },
          { label: "Experience", value: "7+ years" },
          { label: "Uptime maintained", value: "99.9%" },
          { label: "Based in", value: "Dubai, UAE" },
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
