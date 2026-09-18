/**
 * The shape of what the Payload instance returns, mirrored locally.
 *
 * Deliberately a copy rather than an import from the CMS repo: this site is one
 * tenant among several and must build without the CMS checked out beside it.
 * Keep in step with `payload-types.ts` there — the block set is shared by Pages
 * and Posts, so a block added to `pageBlocks` needs a case added here and in
 * `components/CmsBlocks.tsx`, or it saves in the admin and renders as nothing.
 *
 * Only the fields this site actually renders are modelled. Relationship fields
 * are typed as `string | { ... }` because Payload returns an id at depth 0 and
 * an object at depth 1 or more.
 */

/** Payload returns an id at depth 0, the document at depth ≥ 1. */
export type Rel<T> = string | T | null;

export type Media = {
  url?: string | null;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
};

/** Lexical's serialised tree. Nodes are open — unknown types are skipped. */
export type LexicalNode = {
  type: string;
  version?: number;
  children?: LexicalNode[];
  [k: string]: unknown;
};

export type LexicalRoot = { root: LexicalNode };

export type CmsLink = {
  label: string;
  type?: "internal" | "external" | null;
  url?: string | null;
  newTab?: boolean | null;
};

export type HeroBlock = {
  blockType: "hero";
  heading: string;
  subheading?: string | null;
  alignment?: "left" | "center" | null;
  links?: { link: CmsLink }[] | null;
};

export type RichTextBlock = {
  blockType: "richText";
  content: LexicalRoot;
  width?: "normal" | "wide" | null;
};

export type MediaBlockT = {
  blockType: "mediaBlock";
  media: Rel<Media>;
  caption?: string | null;
  size?: "normal" | "wide" | "full" | null;
};

export type GalleryBlock = {
  blockType: "gallery";
  heading?: string | null;
  items: { image: Rel<Media>; caption?: string | null }[];
  columns?: "2" | "3" | "4" | null;
};

export type TableBlock = {
  blockType: "table";
  caption?: string | null;
  columns: { label: string; align?: "left" | "right" | null }[];
  rows: { cells: { value: string }[] }[];
  footnote?: string | null;
};

export type StatsBlock = {
  blockType: "stats";
  heading?: string | null;
  items: { value: string; label: string }[];
};

export type FAQBlock = {
  blockType: "faq";
  heading?: string | null;
  items: { question: string; answer: LexicalRoot }[];
};

export type CalloutBlock = {
  blockType: "callout";
  label?: string | null;
  body: string;
  tone?: "copper" | "navy" | null;
};

export type CTABlock = {
  blockType: "cta";
  heading: string;
  body?: string | null;
  links: { link: CmsLink }[];
};

/**
 * Blocks this site knowingly does not render. `advisorCTA` and `form` exist for
 * other tenants; rendering them here would mean importing a form runtime this
 * site has no use for. They are matched and skipped rather than throwing, so a
 * shared-block change never breaks a build.
 */
export type UnsupportedBlock = {
  blockType: "advisorCTA" | "form";
};

/**
 * Not in the shared set yet. Added for this tenant because three of the
 * existing posts are unreadable without code samples, and Payload's default
 * Lexical config has inline code but no code block.
 */
export type CodeBlock = {
  blockType: "code";
  lang?: string | null;
  code: string;
};

export type CmsBlock =
  | HeroBlock
  | RichTextBlock
  | MediaBlockT
  | GalleryBlock
  | TableBlock
  | StatsBlock
  | FAQBlock
  | CalloutBlock
  | CTABlock
  | CodeBlock
  | UnsupportedBlock;

export type CmsPost = {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  featuredImage?: Rel<Media>;
  layout: CmsBlock[];
  categories?: Rel<{ title?: string | null; name?: string | null }>[] | null;
  author?: Rel<{ name?: string | null }>;
  publishedAt?: string | null;
  _status?: "draft" | "published" | null;
};

/** What the site's components actually consume. */
export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  /** YYYY-MM-DD, derived from publishedAt */
  date: string;
  /** Derived from the block content — the CMS has no such field. */
  readingMinutes: number;
  /** First category, or a fallback. Drives the pill on the post row. */
  tag: string;
  tags?: string[];
  author?: string;
  layout: CmsBlock[];
};

/** Everything a listing row needs, without dragging the body along. */
export type PostSummary = Omit<Post, "layout">;

export function relDoc<T>(v: Rel<T> | undefined): T | null {
  return v && typeof v === "object" ? (v as T) : null;
}
