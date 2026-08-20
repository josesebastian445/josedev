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
    "Notes from the work: technical SEO, WordPress and Next.js, and practical security for small offices in Dubai.",
};

export default function BlogPage() {
  const sorted = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <main>
      <PageHero
        eyebrow="Writing"
        title="Notes from the work."
        lede="A new post most weeks — usually something I had to figure out for a client that week, written down so the next person does not have to."
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
