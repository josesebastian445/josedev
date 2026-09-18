/**
 * The blog's data layer.
 *
 * Reads posts from the multi-tenant Payload instance when PAYLOAD_URL is set,
 * and falls back to the committed content in `content/posts.ts` — converted to
 * the same block vocabulary — when it is not. The fallback is load-bearing:
 * `next dev` without the CMS, a CI build before this tenant exists, and a CMS
 * outage all keep rendering rather than shipping an empty blog.
 *
 * Caching is tagged rather than time-based on purpose. The CMS calls the site's
 * revalidate route with tags `posts` and `post:<slug>` whenever a post is
 * published, renamed or deleted (see `hooks/revalidateSite.ts` there), so the
 * tags below are the contract between the two. The revalidate window is a
 * backstop for when that call does not arrive.
 *
 * Types and this module are server-only — it reads process.env and fetches.
 * Client components import types from `lib/cms-types` instead.
 */
import { POSTS as LEGACY_POSTS } from "@/content/posts";
import { legacyPostToCms } from "./legacy-to-cms";
import { lexicalToText } from "./lexical";
import {
  type CmsBlock,
  type CmsPost,
  type Post,
  type PostSummary,
  relDoc,
} from "./cms-types";

const CMS_URL = process.env.PAYLOAD_URL?.replace(/\/$/, "");
const API_KEY = process.env.PAYLOAD_API_KEY;
const TENANT = process.env.PAYLOAD_TENANT_SLUG ?? "joseviews";

/** Backstop only; the CMS pushes tag invalidations on publish. */
const REVALIDATE_SECONDS = 300;

export const POSTS_TAG = "posts";
export const postTag = (slug: string) => `post:${slug}`;

const WORDS_PER_MINUTE = 200;

/** The CMS has no reading-time field, so derive it from what is actually there. */
function readingMinutes(layout: CmsBlock[]): number {
  let words = 0;
  for (const b of layout) {
    switch (b.blockType) {
      case "richText":
        words += lexicalToText(b.content).split(/\s+/).filter(Boolean).length;
        break;
      case "callout":
        words += b.body.split(/\s+/).filter(Boolean).length;
        break;
      case "table":
        // a table is read, not skimmed, but far faster than its word count
        words += b.rows.length * b.columns.length * 2;
        break;
      case "code":
        // code is scanned rather than read; counting it as prose overstates
        words += Math.min(b.code.split("\n").length * 4, 120);
        break;
      case "faq":
        for (const item of b.items) {
          words += item.question.split(/\s+/).filter(Boolean).length;
          words += lexicalToText(item.answer).split(/\s+/).filter(Boolean).length;
        }
        break;
      default:
        break;
    }
  }
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function categoryTitles(cats: CmsPost["categories"]): string[] {
  if (!Array.isArray(cats)) return [];
  return cats
    .map((c) => {
      const doc = relDoc(c);
      return doc?.title ?? doc?.name ?? "";
    })
    .filter(Boolean);
}

function toPost(raw: CmsPost): Post {
  if (!raw.slug) throw new Error("CMS post is missing a slug");
  const where = `post "${raw.slug}"`;
  if (!raw.title) throw new Error(`${where}: missing title`);
  if (!Array.isArray(raw.layout) || raw.layout.length === 0) {
    throw new Error(`${where}: empty layout`);
  }

  const tags = categoryTitles(raw.categories);
  const author = relDoc(raw.author)?.name ?? undefined;

  return {
    slug: raw.slug,
    title: raw.title,
    excerpt: raw.excerpt ?? "",
    // publishedAt is an ISO datetime; everything downstream wants a date
    date: (raw.publishedAt ?? "").slice(0, 10),
    readingMinutes: readingMinutes(raw.layout),
    tag: tags[0] ?? "Writing",
    tags: tags.length ? tags : undefined,
    author,
    layout: raw.layout,
  };
}

const byNewest = (a: Post, b: Post) => b.date.localeCompare(a.date);

function fallbackPosts(): Post[] {
  return LEGACY_POSTS.map((p) => toPost(legacyPostToCms(p))).sort(byNewest);
}

async function fetchPosts(): Promise<Post[]> {
  // The CMS denies unauthenticated reads outright — `tenantRead` returns false
  // when there is no user. Without a key the request succeeds with zero docs
  // and the blog renders empty, which is exactly the silent failure this module
  // exists to prevent, so refuse to start instead.
  if (!API_KEY) {
    throw new Error(
      "PAYLOAD_URL is set but PAYLOAD_API_KEY is not. The CMS returns no " +
        "documents to an anonymous caller, so this would silently empty the blog.",
    );
  }

  const url =
    `${CMS_URL}/api/posts` +
    `?where[tenant.slug][equals]=${encodeURIComponent(TENANT)}` +
    `&where[_status][equals]=published` +
    `&depth=1&limit=500&sort=-publishedAt`;

  const res = await fetch(url, {
    // The api-key strategy resolves to a real user, and that user's single
    // tenant membership is what scopes the query — the tenant filter above is
    // belt and braces, not the mechanism.
    headers: { Authorization: `users API-Key ${API_KEY}` },
    next: { tags: [POSTS_TAG], revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) {
    const hint =
      res.status === 401 || res.status === 403
        ? " — check PAYLOAD_API_KEY, and that its user is a member of this tenant"
        : "";
    throw new Error(
      `Payload returned ${res.status} ${res.statusText} for ${url}${hint}`,
    );
  }

  const json = (await res.json()) as { docs?: CmsPost[] };
  if (!Array.isArray(json.docs)) {
    throw new Error(`Payload response for tenant "${TENANT}" had no docs array`);
  }

  return json.docs.map(toPost).sort(byNewest);
}

let inflight: Promise<Post[]> | null = null;

export function getPosts(): Promise<Post[]> {
  if (!CMS_URL) return Promise.resolve(fallbackPosts());
  inflight ??= fetchPosts();
  return inflight;
}

export async function getPost(slug: string): Promise<Post | undefined> {
  return (await getPosts()).find((p) => p.slug === slug);
}

/** Listing rows never render a body; keeping it out of the RSC payload matters. */
export async function getPostSummaries(): Promise<PostSummary[]> {
  return (await getPosts()).map(({ layout: _layout, ...rest }) => rest);
}

/** True when posts are coming from the CMS rather than committed content. */
export const usingCMS = Boolean(CMS_URL);
