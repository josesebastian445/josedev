/**
 * Converts the committed typed content into the CMS block vocabulary.
 *
 * Two jobs, one mapping. It keeps the site rendering from `content/posts.ts`
 * while the CMS is unreachable or unset, and it is the payload the migration
 * script posts into Payload — so the fallback and the migrated documents cannot
 * diverge, because they are produced by the same function.
 *
 * Prose runs are merged: a paragraph, a heading and a list in sequence become
 * one richText block, which is how an editor would have written them. Producing
 * a block per paragraph would technically round-trip but would be miserable to
 * edit in the admin.
 */
import type { Block, Post as LegacyPost } from "@/content/posts";
import type { CmsBlock, CmsPost, LexicalNode, LexicalRoot } from "./cms-types";

const text = (s: string): LexicalNode => ({
  type: "text",
  version: 1,
  text: s,
  format: 0,
  style: "",
  mode: "normal",
  detail: 0,
});

const para = (s: string): LexicalNode => ({
  type: "paragraph",
  version: 1,
  format: "",
  indent: 0,
  direction: "ltr",
  children: [text(s)],
});

const heading = (s: string): LexicalNode => ({
  type: "heading",
  tag: "h2",
  version: 1,
  format: "",
  indent: 0,
  direction: "ltr",
  children: [text(s)],
});

const quote = (s: string): LexicalNode => ({
  type: "quote",
  version: 1,
  format: "",
  indent: 0,
  direction: "ltr",
  children: [text(s)],
});

const list = (items: string[]): LexicalNode => ({
  type: "list",
  listType: "bullet",
  tag: "ul",
  start: 1,
  version: 1,
  format: "",
  indent: 0,
  direction: "ltr",
  children: items.map((item, i) => ({
    type: "listitem",
    value: i + 1,
    version: 1,
    format: "",
    indent: 0,
    direction: "ltr",
    children: [text(item)],
  })),
});

const root = (children: LexicalNode[]): LexicalRoot => ({
  root: {
    type: "root",
    version: 1,
    format: "",
    indent: 0,
    direction: "ltr",
    children,
  },
});

/** Blocks that become Lexical nodes inside a shared richText block. */
function proseNode(b: Block): LexicalNode | null {
  switch (b.type) {
    case "p":
      return para(b.text);
    case "h2":
      return heading(b.text);
    case "quote":
      return quote(b.text);
    case "ul":
      return list(b.items);
    default:
      return null;
  }
}

export function legacyBodyToBlocks(body: Block[]): CmsBlock[] {
  const out: CmsBlock[] = [];
  let run: LexicalNode[] = [];

  const flush = () => {
    if (run.length === 0) return;
    out.push({ blockType: "richText", content: root(run), width: "normal" });
    run = [];
  };

  for (const b of body) {
    const node = proseNode(b);
    if (node) {
      run.push(node);
      continue;
    }

    // anything that is not prose breaks the run and becomes its own block
    flush();

    if (b.type === "code") {
      out.push({ blockType: "code", lang: b.lang, code: b.code });
    } else if (b.type === "table") {
      out.push({
        blockType: "table",
        columns: b.head.map((label) => ({ label, align: "left" })),
        rows: b.rows.map((cells) => ({
          cells: cells.map((value) => ({ value })),
        })),
      });
    }
  }

  flush();
  return out;
}

/** A committed post in the shape the CMS would return it. */
export function legacyPostToCms(p: LegacyPost): CmsPost {
  return {
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    layout: legacyBodyToBlocks(p.body),
    // the legacy `tag` and `tags` become categories; the first one drives the
    // pill on listing rows, which is what `tag` did
    categories: [p.tag, ...(p.tags ?? []).filter((t) => t !== p.tag)].map(
      (title) => ({ title }),
    ),
    publishedAt: `${p.date}T00:00:00.000Z`,
    _status: "published",
  };
}
