/**
 * The blog's data layer.
 *
 * Reads posts from a multi-tenant Payload instance when PAYLOAD_URL is set,
 * and falls back to the typed content in `content/posts.ts` when it is not.
 * The fallback is deliberate and load-bearing: `next dev` without a CMS, a CI
 * build before the CMS exists, and a CMS outage all keep rendering the site
 * rather than shipping an empty blog.
 *
 * Types, `formatDate` and the block union stay in `content/posts.ts` — client
 * components (PostRow) import from there and must not pull this module, which
 * reads process.env and fetches.
 */
import { POSTS as LOCAL_POSTS, type Block, type Post } from "@/content/posts";

const CMS_URL = process.env.PAYLOAD_URL?.replace(/\/$/, "");
const TENANT = process.env.PAYLOAD_TENANT_SLUG ?? "joseviews";

/**
 * Payload names block variants `blockType`; the renderer in blog/[slug] switches
 * on `type`. Normalising here rather than in the renderer keeps the CMS shape
 * from leaking into the presentation layer — and keeps the fallback and the
 * fetched data structurally identical.
 */
const BLOCK_TYPE: Record<string, Block["type"]> = {
  paragraph: "p",
  heading: "h2",
  list: "ul",
  code: "code",
  quote: "quote",
  table: "table",
};

/**
 * Payload array fields are arrays of objects, never arrays of primitives — a
 * list of strings comes back as [{ id, value }]. Accepts both so the same
 * normaliser works against local content and the API.
 */
function str(v: unknown): string {
  if (typeof v === "string") return v;
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    for (const k of ["value", "text", "cell"]) {
      if (typeof o[k] === "string") return o[k] as string;
    }
  }
  return "";
}

function strList(v: unknown): string[] {
  return Array.isArray(v) ? v.map(str) : [];
}

function toBlock(raw: unknown, where: string): Block {
  const b = (raw ?? {}) as Record<string, unknown>;
  const key = (b.blockType ?? b.type) as string;
  const type = BLOCK_TYPE[key] ?? (key as Block["type"]);

  switch (type) {
    case "p":
    case "h2":
    case "quote":
      return { type, text: str(b.text) };
    case "ul":
      return { type, items: strList(b.items) };
    case "code":
      return { type, lang: str(b.lang), code: str(b.code) };
    case "table":
      return {
        type,
        head: strList(b.head),
        // rows are arrays of arrays, which Payload cannot express directly —
        // it models them as rows[].cells[], so unwrap a level if present
        rows: Array.isArray(b.rows)
          ? b.rows.map((r) => {
              const row = r as Record<string, unknown>;
              return strList(Array.isArray(r) ? r : (row.cells ?? row.row));
            })
          : [],
      };
    default:
      throw new Error(`${where}: unknown block type "${key}"`);
  }
}

function toPost(raw: unknown): Post {
  const d = (raw ?? {}) as Record<string, unknown>;
  const slug = str(d.slug);
  const where = `post "${slug || "(no slug)"}"`;

  // fail the build rather than prerender a blank article
  for (const field of ["slug", "title", "excerpt", "date"] as const) {
    if (!str(d[field])) throw new Error(`${where}: missing "${field}"`);
  }
  if (!Array.isArray(d.body) || d.body.length === 0) {
    throw new Error(`${where}: empty body`);
  }

  return {
    slug,
    title: str(d.title),
    excerpt: str(d.excerpt),
    // Payload returns an ISO datetime; the Post type and formatDate want a date
    date: str(d.date).slice(0, 10),
    readingMinutes: Number(d.readingMinutes) || 1,
    tag: str(d.tag),
    tags: Array.isArray(d.tags) ? strList(d.tags) : undefined,
    body: d.body.map((b) => toBlock(b, where)),
  };
}

const byNewest = (a: Post, b: Post) => b.date.localeCompare(a.date);

/**
 * Memoised for the process, not per render. `generateStaticParams`,
 * `generateMetadata`, the page, the OG image and the sitemap all ask for the
 * same list during one build — this makes that one request.
 */
let inflight: Promise<Post[]> | null = null;

async function fetchPosts(): Promise<Post[]> {
  const url =
    `${CMS_URL}/api/posts` +
    `?where[tenant.slug][equals]=${encodeURIComponent(TENANT)}` +
    `&limit=500&depth=0&sort=-date`;

  const res = await fetch(url, { cache: "force-cache" });
  if (!res.ok) {
    throw new Error(`Payload returned ${res.status} ${res.statusText} for ${url}`);
  }

  const json = (await res.json()) as { docs?: unknown[] };
  if (!Array.isArray(json.docs)) {
    throw new Error(`Payload response for ${TENANT} had no docs array`);
  }

  return json.docs.map(toPost).sort(byNewest);
}

export function getPosts(): Promise<Post[]> {
  if (!CMS_URL) return Promise.resolve([...LOCAL_POSTS].sort(byNewest));
  inflight ??= fetchPosts();
  return inflight;
}

export async function getPost(slug: string): Promise<Post | undefined> {
  return (await getPosts()).find((p) => p.slug === slug);
}

/** True when posts are coming from the CMS rather than the committed content. */
export const usingCMS = Boolean(CMS_URL);
