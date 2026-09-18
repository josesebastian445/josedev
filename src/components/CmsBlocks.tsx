/**
 * Renders the CMS page-builder block set.
 *
 * The block list is shared across every tenant of the Payload instance, so this
 * switch must tolerate blocks it was not written for: `advisorCTA` and `form`
 * are matched and skipped, and anything unrecognised falls through to null.
 * Adding a block to `pageBlocks` in the CMS means adding a case here too — it
 * will otherwise save happily in the admin and render as nothing.
 */
import Link from "next/link";
import { Reveal } from "@/components/motion-primitives";
import { Lexical } from "@/lib/lexical";
import { type CmsBlock, type CmsLink, type Media, relDoc } from "@/lib/cms-types";

function BlockLink({ link }: { link: CmsLink }) {
  const href = link.url ?? "#";
  const cls =
    "inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 font-display text-xs uppercase tracking-[0.16em] text-bone transition-colors hover:border-volt hover:text-accent";
  const external = link.type === "external" || /^https?:\/\//i.test(href);

  if (external) {
    return (
      <a
        href={href}
        data-cursor="link"
        className={cls}
        {...(link.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {link.label}
      </a>
    );
  }
  return (
    <Link href={href} data-cursor="link" className={cls}>
      {link.label}
    </Link>
  );
}

function Img({ media, className }: { media: unknown; className?: string }) {
  const m = relDoc(media as Media | string | null) as Media | null;
  if (!m?.url) return null;
  return (
    // plain img rather than next/image: media is served from the CMS origin,
    // which would need a remotePatterns entry and an img-src relaxation in the
    // CSP that custom-worker.js applies to every response
    <img
      src={m.url}
      alt={m.alt ?? ""}
      width={m.width ?? undefined}
      height={m.height ?? undefined}
      className={className}
    />
  );
}

function Block({ block }: { block: CmsBlock }) {
  switch (block.blockType) {
    case "richText":
      return <Lexical content={block.content} />;

    case "hero":
      // the article's own title is rendered by PageHero; a hero inside the body
      // is a section opener, so it is demoted rather than competing with it
      return (
        <div className="mb-10 mt-16">
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            {block.heading}
          </h2>
          {block.subheading ? (
            <p className="mt-3 text-lg leading-[1.75] text-fog">
              {block.subheading}
            </p>
          ) : null}
          {block.links?.length ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {block.links.map((l, i) => (
                <BlockLink key={i} link={l.link} />
              ))}
            </div>
          ) : null}
        </div>
      );

    case "code":
      return (
        <div className="mb-8 overflow-hidden rounded-xl border border-line bg-ink-2/70">
          <div className="flex items-center justify-between border-b border-line px-5 py-3">
            <span className="font-display text-[11px] uppercase tracking-[0.2em] text-fog">
              {block.lang ?? "text"}
            </span>
            <span className="flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-line" />
              <span className="h-2 w-2 rounded-full bg-line" />
              <span className="h-2 w-2 rounded-full bg-line" />
            </span>
          </div>
          <pre className="overflow-x-auto px-5 py-4 text-sm leading-relaxed text-bone">
            <code>{block.code}</code>
          </pre>
        </div>
      );

    case "table": {
      const width = block.columns.length;
      return (
        <figure className="mb-10">
          {block.caption ? (
            <figcaption className="mb-3 font-display text-sm text-fog">
              {block.caption}
            </figcaption>
          ) : null}
          {/* the wrapper scrolls, not the page — a wide table at 760px is
              tight on a phone */}
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line">
                  {block.columns.map((c, i) => (
                    <th
                      key={i}
                      scope="col"
                      className={`px-5 py-3.5 font-display text-[11px] uppercase tracking-[0.16em] text-fog ${
                        c.align === "right" ? "text-right" : "text-left"
                      }`}
                    >
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, r) => (
                  <tr key={r} className="border-b border-line/60 last:border-0">
                    {/* pad short rows rather than letting the layout break,
                        which is what the CMS block documents as the contract */}
                    {Array.from({ length: width }, (_, c) => (
                      <td
                        key={c}
                        className={`px-5 py-3.5 leading-relaxed text-fog ${
                          block.columns[c]?.align === "right"
                            ? "text-right"
                            : "text-left"
                        }`}
                      >
                        {row.cells[c]?.value ?? ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.footnote ? (
            <figcaption className="mt-3 text-sm text-fog">
              {block.footnote}
            </figcaption>
          ) : null}
        </figure>
      );
    }

    case "callout":
      // the CMS tones (copper / navy) belong to another tenant's palette; both
      // map onto this site's single accent, differing only in weight
      return (
        <aside
          className={`my-10 rounded-xl border px-6 py-5 ${
            block.tone === "navy"
              ? "border-line bg-ink-2/70"
              : "border-volt/40 bg-volt/5"
          }`}
        >
          {block.label ? (
            <p className="mb-2 font-display text-[11px] uppercase tracking-[0.2em] text-accent">
              {block.label}
            </p>
          ) : null}
          <p className="leading-relaxed text-bone">{block.body}</p>
        </aside>
      );

    case "stats":
      return (
        <div className="my-12">
          {block.heading ? (
            <h2 className="mb-6 font-display text-2xl font-bold tracking-tight">
              {block.heading}
            </h2>
          ) : null}
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-3">
            {block.items.map((s, i) => (
              <div key={i} className="bg-ink-2/70 px-5 py-6">
                <dt className="font-display text-3xl font-bold tracking-tight text-bone">
                  {s.value}
                </dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-fog">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      );

    case "faq":
      return (
        <div className="my-12">
          {block.heading ? (
            <h2 className="mb-6 font-display text-2xl font-bold tracking-tight">
              {block.heading}
            </h2>
          ) : null}
          <dl className="border-t border-line">
            {block.items.map((item, i) => (
              <div key={i} className="border-b border-line py-6">
                <dt className="font-display text-lg font-semibold text-bone">
                  {item.question}
                </dt>
                <dd className="mt-3 [&>p:last-child]:mb-0">
                  <Lexical content={item.answer} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      );

    case "cta":
      return (
        <div className="my-12 rounded-xl border border-line bg-ink-2/70 px-7 py-8">
          <h2 className="font-display text-2xl font-bold tracking-tight">
            {block.heading}
          </h2>
          {block.body ? (
            <p className="mt-3 leading-relaxed text-fog">{block.body}</p>
          ) : null}
          {block.links?.length ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {block.links.map((l, i) => (
                <BlockLink key={i} link={l.link} />
              ))}
            </div>
          ) : null}
        </div>
      );

    case "mediaBlock":
      return (
        <figure
          className={`my-10 ${block.size === "full" ? "-mx-6 md:-mx-16" : ""}`}
        >
          <Img media={block.media} className="w-full rounded-xl border border-line" />
          {block.caption ? (
            <figcaption className="mt-3 text-sm text-fog">
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );

    case "gallery": {
      const cols = block.columns ?? "2";
      return (
        <div className="my-10">
          {block.heading ? (
            <h2 className="mb-6 font-display text-2xl font-bold tracking-tight">
              {block.heading}
            </h2>
          ) : null}
          <div
            className={`grid gap-4 ${
              cols === "4"
                ? "grid-cols-2 md:grid-cols-4"
                : cols === "3"
                  ? "grid-cols-1 md:grid-cols-3"
                  : "grid-cols-1 md:grid-cols-2"
            }`}
          >
            {block.items.map((item, i) => (
              <figure key={i}>
                <Img
                  media={item.image}
                  className="w-full rounded-xl border border-line"
                />
                {item.caption ? (
                  <figcaption className="mt-2 text-sm text-fog">
                    {item.caption}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </div>
      );
    }

    // belongs to other tenants — matched so it is a deliberate skip, not a
    // silent fall-through
    case "advisorCTA":
    case "form":
      return null;

    default:
      return null;
  }
}

export default function CmsBlocks({ blocks }: { blocks: CmsBlock[] }) {
  return (
    <>
      {blocks.map((b, i) => (
        <Reveal key={i}>
          <Block block={b} />
        </Reveal>
      ))}
    </>
  );
}
