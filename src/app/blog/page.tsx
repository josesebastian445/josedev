import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import CTABand from "@/components/CTABand";
import { Stagger } from "@/components/motion-primitives";
import PostRow from "@/components/PostRow";
import { POSTS } from "@/content/posts";

export const metadata: Metadata = {
  title: "Writing — Jose Sebastian",
  description:
    "Notes on frontend engineering: cascade layers, scroll-linked animation, sticky positioning, and what I check before calling a build done.",
};

export default function BlogPage() {
  const sorted = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <main>
      <PageHero
        eyebrow="Writing"
        title="Notes from the build."
        lede="Mostly bugs that cost me an afternoon and the explanation I wish I had found first. No hot takes, no listicles."
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <Stagger className="border-t border-line" gap={0.07}>
            {sorted.map((post) => (
              <PostRow key={post.slug} post={post} />
            ))}
          </Stagger>

          <p className="mt-16 max-w-lg text-sm leading-relaxed text-fog">
            Posts land every few weeks.{" "}
            <Link
              href="/contact"
              data-cursor="link"
              className="border-b border-line text-bone transition-colors hover:border-volt"
            >
              Get in touch
            </Link>{" "}
            if there is something you want written up properly.
          </p>
        </div>
      </section>

      <CTABand />
    </main>
  );
}
