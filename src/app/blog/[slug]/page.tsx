import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import CTABand from "@/components/CTABand";
import CmsBlocks from "@/components/CmsBlocks";
import { formatDate } from "@/lib/format";
import { getPost, getPosts } from "@/lib/posts";

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Not found" };

  return {
    title: `${post.title} — Jose Sebastian`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  // getPosts already returns newest first
  const sorted = await getPosts();
  const idx = sorted.findIndex((p) => p.slug === slug);
  const next = sorted[(idx + 1) % sorted.length];

  return (
    <main>
      <PageHero
        eyebrow={`${post.tag} · ${post.readingMinutes} min read`}
        title={post.title}
        lede={post.excerpt}
        backHref="/blog"
        backLabel="All writing"
        meta={[
          { label: "Published", value: formatDate(post.date) },
          { label: "Topic", value: post.tag },
          { label: "Reading time", value: `${post.readingMinutes} minutes` },
          { label: "Author", value: post.author ?? "Jose Sebastian" },
        ]}
      />

      <article className="py-20 md:py-28">
        <div className="mx-auto max-w-[760px] px-6">
          <CmsBlocks blocks={post.layout} />
        </div>
      </article>

      <section className="border-t border-line">
        <Link
          href={`/blog/${next.slug}`}
          data-cursor="link"
          className="group block py-16 transition-colors duration-500 hover:bg-ink-2/40 md:py-24"
        >
          <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-8 px-6 md:px-10">
            <div className="max-w-2xl">
              <div className="mb-3 font-display text-[11px] uppercase tracking-[0.25em] text-fog">
                Read next
              </div>
              <div className="font-display text-[clamp(1.5rem,3.5vw,2.75rem)] font-bold leading-tight tracking-[-0.03em] transition-colors duration-500 group-hover:text-accent">
                {next.title}
              </div>
            </div>
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-line transition-all duration-500 group-hover:border-volt group-hover:bg-volt group-hover:text-on-accent">
              <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
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
