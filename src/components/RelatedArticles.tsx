import Link from "next/link";
import type { PostSummary } from "@/lib/cms-types";

export default function RelatedArticles({ posts }: { posts: PostSummary[] }) {
  if (!posts.length) return null;
  return (
    <section className="border-t border-line py-20 md:py-28" aria-labelledby="related-heading">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <p className="mb-4 font-display text-xs uppercase tracking-[.22em] text-accent">Keep exploring</p>
        <h2 id="related-heading" className="mb-10 font-display text-3xl font-semibold tracking-tight md:text-4xl">A few useful next reads.</h2>
        <div className="grid gap-5 md:grid-cols-3">{posts.map((post) => <Link key={post.slug} href={`/blog/${post.slug}`} className="related-card group"><div className="flex justify-between gap-4 text-xs text-fog"><span className="text-accent">{post.tag}</span><span>{post.readingMinutes} min read</span></div><h3 className="mt-6 font-display text-xl font-semibold leading-snug tracking-tight group-hover:text-accent">{post.title}</h3><p className="mt-4 text-sm leading-relaxed text-fog">{post.excerpt}</p><span className="mt-auto flex items-center justify-between pt-8 font-display text-xs">Read article <span aria-hidden="true">↗</span></span></Link>)}</div>
      </div>
    </section>
  );
}
