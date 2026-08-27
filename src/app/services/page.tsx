import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Capabilities from "@/components/Capabilities";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Process from "@/components/Process";
import CTABand from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Services & pricing — Jose Sebastian",
  description:
    "Website design and development, SEO, IT support and web security. Fixed prices in AED, agreed before work starts.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Services"
        title="Four things, done properly."
        lede="I would rather be genuinely good at a short list than passable at everything. Prices are on this page — no sales call required to see a number."
        meta={[
          { label: "Website builds from", value: "AED 4,500" },
          { label: "Retainers from", value: "AED 750/mo" },
          { label: "Response time", value: "A few hours" },
          { label: "Availability", value: "Open" },
        ]}
      />

      <Capabilities />
      <Pricing />
      <Process />
      <FAQ />
      <CTABand />
    </main>
  );
}
