import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RelatedArticles from "@/components/RelatedArticles";
import { relatedPosts } from "@/lib/blog-discovery";
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

  const related = relatedPosts(post, sorted);

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

      <article className="article-motion py-20 md:py-28">
        <div className="mx-auto max-w-[760px] px-6">
          <CmsBlocks blocks={post.layout} />
        </div>
      </article>

      <RelatedArticles posts={related} />

      <CTABand />
    </main>
  );
}
