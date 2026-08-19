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
    "Marketing sites, web apps, motion and WebGL, and performance rescue. Fixed prices, agreed before work starts.",
};

export default function ServicesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Services"
        title="What I do, and what it costs."
        lede="Four kinds of work, three ways to buy it, and the answers to everything clients ask before signing. No sales call required to see a number."
        meta={[
          { label: "Typical project", value: "€12k" },
          { label: "Typical timeline", value: "5 — 7 weeks" },
          { label: "Availability", value: "2 slots, Q4" },
          { label: "Delivered on date", value: "100%" },
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
