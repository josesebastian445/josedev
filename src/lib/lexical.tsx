/**
 * Renders Payload's serialised Lexical tree.
 *
 * The CMS runs `lexicalEditor()` with no arguments, so this covers the default
 * feature set and nothing more: paragraphs, headings, lists, quotes, links,
 * horizontal rules, uploads, line breaks and the inline formats. Unknown node
 * types render their children rather than throwing — a feature added to the
 * editor upstream should degrade to its text, never blank the article.
 *
 * Classes deliberately match the hand-authored block renderer in
 * `components/CmsBlocks.tsx`, so a migrated post is visually identical to the
 * typed-content version it replaced.
 */
import Link from "next/link";
import type { LexicalNode, LexicalRoot } from "./cms-types";

/** Lexical packs inline formatting into a bitmask on each text node. */
const BOLD = 1;
const ITALIC = 1 << 1;
const STRIKETHROUGH = 1 << 2;
const UNDERLINE = 1 << 3;
const CODE = 1 << 4;
const SUBSCRIPT = 1 << 5;
const SUPERSCRIPT = 1 << 6;

function Text({ node }: { node: LexicalNode }) {
  const format = typeof node.format === "number" ? node.format : 0;
  let el = <>{String(node.text ?? "")}</>;

  // innermost first, so the tags nest in a stable order
  if (format & CODE) {
    el = (
      <code className="rounded bg-ink-2 px-1.5 py-0.5 font-mono text-[0.9em] text-bone">
        {el}
      </code>
    );
  }
  if (format & BOLD) el = <strong className="font-semibold text-bone">{el}</strong>;
  if (format & ITALIC) el = <em>{el}</em>;
  if (format & UNDERLINE) el = <u>{el}</u>;
  if (format & STRIKETHROUGH) el = <s>{el}</s>;
  if (format & SUBSCRIPT) el = <sub>{el}</sub>;
  if (format & SUPERSCRIPT) el = <sup>{el}</sup>;
  return el;
}

function linkHref(node: LexicalNode): { href: string; external: boolean } {
  const fields = (node.fields ?? {}) as Record<string, unknown>;
  const url = typeof fields.url === "string" ? fields.url : "";
  const linkType = fields.linkType;

  if (linkType === "internal") {
    const doc = fields.doc as { value?: unknown } | undefined;
    const value = doc?.value;
    const slug =
      value && typeof value === "object"
        ? (value as { slug?: string }).slug
        : undefined;
    if (slug) return { href: `/${slug}`, external: false };
  }
  return { href: url, external: /^https?:\/\//i.test(url) };
}

function Children({ nodes }: { nodes?: LexicalNode[] }) {
  if (!Array.isArray(nodes)) return null;
  return (
    <>
      {nodes.map((n, i) => (
        <Node key={i} node={n} />
      ))}
    </>
  );
}

function Node({ node }: { node: LexicalNode }) {
  switch (node.type) {
    case "text":
      return <Text node={node} />;

    case "linebreak":
      return <br />;

    case "tab":
      return <span className="inline-block w-8" />;

    case "paragraph": {
      // Lexical emits an empty paragraph for a blank line; rendering it would
      // add a stray gap to the measured rhythm of the article
      if (!node.children?.length) return null;
      return (
        <p className="mb-6 text-lg leading-[1.75] text-fog">
          <Children nodes={node.children} />
        </p>
      );
    }

    case "heading": {
      const tag = typeof node.tag === "string" ? node.tag : "h2";
      const inner = <Children nodes={node.children} />;
      // h1 is the page title, rendered by PageHero — demote anything claiming
      // it so an article never ships two h1s
      if (tag === "h1" || tag === "h2") {
        return (
          <h2 className="mb-5 mt-16 font-display text-2xl font-bold tracking-tight md:text-3xl">
            {inner}
          </h2>
        );
      }
      return (
        <h3 className="mb-4 mt-10 font-display text-xl font-semibold tracking-tight text-bone">
          {inner}
        </h3>
      );
    }

    case "quote":
      return (
        <blockquote className="my-10 border-l-2 border-volt py-2 pl-7 font-display text-xl leading-relaxed text-bone md:text-2xl">
          <Children nodes={node.children} />
        </blockquote>
      );

    case "list": {
      const ordered = node.listType === "number";
      if (ordered) {
        return (
          <ol className="mb-8 list-decimal space-y-3.5 pl-6 marker:text-volt">
            <Children nodes={node.children} />
          </ol>
        );
      }
      return (
        <ul className="mb-8 space-y-3.5">
          <Children nodes={node.children} />
        </ul>
      );
    }

    case "listitem": {
      // a nested list arrives as a listitem whose only child is a list
      const onlyChild = node.children?.length === 1 ? node.children[0] : null;
      if (onlyChild?.type === "list") return <Node node={onlyChild} />;

      const inOrdered = node.listType === "number";
      if (inOrdered) {
        return (
          <li className="leading-relaxed text-fog">
            <Children nodes={node.children} />
          </li>
        );
      }
      // matches the diamond bullets used elsewhere in the article
      return (
        <li className="flex gap-4 leading-relaxed text-fog">
          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-volt" />
          <span>
            <Children nodes={node.children} />
          </span>
        </li>
      );
    }

    case "link":
    case "autolink": {
      const { href, external } = linkHref(node);
      if (!href) return <Children nodes={node.children} />;
      const cls =
        "border-b border-line text-bone transition-colors hover:border-volt";
      if (external) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="link"
            className={cls}
          >
            <Children nodes={node.children} />
          </a>
        );
      }
      return (
        <Link href={href} data-cursor="link" className={cls}>
          <Children nodes={node.children} />
        </Link>
      );
    }

    case "horizontalrule":
      return <hr className="my-14 border-line" />;

    case "upload": {
      const value = node.value as
        | { url?: string; alt?: string; width?: number; height?: number }
        | undefined;
      if (!value?.url) return null;
      return (
        <figure className="my-10">
          {/* plain img: media lives on the CMS origin, and next/image would
              need that host in remotePatterns plus an img-src entry in the CSP */}
          <img
            src={value.url}
            alt={value.alt ?? ""}
            width={value.width ?? undefined}
            height={value.height ?? undefined}
            className="w-full rounded-xl border border-line"
          />
          {value.alt ? (
            <figcaption className="mt-3 text-sm text-fog">{value.alt}</figcaption>
          ) : null}
        </figure>
      );
    }

    // relationship nodes and anything added upstream: keep the words, drop the
    // chrome, rather than failing the render
    default:
      return <Children nodes={node.children} />;
  }
}

export function Lexical({ content }: { content?: LexicalRoot | null }) {
  const children = content?.root?.children;
  if (!Array.isArray(children) || children.length === 0) return null;
  return <Children nodes={children} />;
}

/** Plain text of a Lexical tree — used for reading time and OG images. */
export function lexicalToText(content?: LexicalRoot | null): string {
  const out: string[] = [];
  const walk = (n: LexicalNode) => {
    if (typeof n.text === "string") out.push(n.text);
    if (Array.isArray(n.children)) n.children.forEach(walk);
  };
  if (content?.root) walk(content.root);
  return out.join(" ");
}
