import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import CTABand from "@/components/CTABand";
import { Reveal } from "@/components/motion-primitives";
import { POSTS, getPost, formatDate, type Block } from "@/content/posts";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
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

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h2":
            return (
              <Reveal key={i}>
                <h2 className="mb-5 mt-16 font-display text-2xl font-bold tracking-tight md:text-3xl">
                  {b.text}
                </h2>
              </Reveal>
            );
          case "p":
            return (
              <Reveal key={i}>
                <p className="mb-6 text-lg leading-[1.75] text-fog">{b.text}</p>
              </Reveal>
            );
          case "ul":
            return (
              <Reveal key={i}>
                <ul className="mb-8 space-y-3.5">
                  {b.items.map((item) => (
                    <li key={item} className="flex gap-4 leading-relaxed text-fog">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-volt" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          case "quote":
            return (
              <Reveal key={i}>
                <blockquote className="my-10 border-l-2 border-volt py-2 pl-7 font-display text-xl leading-relaxed text-bone md:text-2xl">
                  {b.text}
                </blockquote>
              </Reveal>
            );
          case "code":
            return (
              <Reveal key={i}>
                <div className="mb-8 overflow-hidden rounded-xl border border-line bg-ink-2/70">
                  <div className="flex items-center justify-between border-b border-line px-5 py-3">
                    <span className="font-display text-[11px] uppercase tracking-[0.2em] text-fog">
                      {b.lang}
                    </span>
                    <span className="flex gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-line" />
                      <span className="h-2 w-2 rounded-full bg-line" />
                      <span className="h-2 w-2 rounded-full bg-line" />
                    </span>
                  </div>
                  <pre className="overflow-x-auto p-5 text-sm leading-relaxed">
                    <code className="font-mono text-bone/90">{b.code}</code>
                  </pre>
                </div>
              </Reveal>
            );
          case "table":
            return (
              <Reveal key={i}>
                {/* the wrapper scrolls, not the page — a 3-column table at
                    760px is tight on a phone */}
                <div className="mb-10 overflow-x-auto rounded-xl border border-line">
                  <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-line">
                        {b.head.map((h) => (
                          <th
                            key={h}
                            scope="col"
                            className="px-5 py-4 font-display text-[11px] uppercase tracking-[0.18em] text-fog"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {b.rows.map((row) => (
                        <tr
                          key={row[0]}
                          className="border-b border-line last:border-b-0"
                        >
                          {row.map((cell, c) => (
                            <td
                              key={c}
                              className={`px-5 py-4 align-top leading-relaxed ${
                                c === 0
                                  ? "font-display font-medium text-bone"
                                  : "text-fog"
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Reveal>
            );
        }
      })}
    </>
  );
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const sorted = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
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
          { label: "Author", value: "Jose Sebastian" },
        ]}
      />

      <article className="py-20 md:py-28">
        <div className="mx-auto max-w-[760px] px-6">
          <Blocks blocks={post.body} />
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
