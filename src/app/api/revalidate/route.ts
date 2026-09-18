import { revalidateTag } from "next/cache";

/**
 * The receiving end of the CMS's revalidation hook.
 *
 * `hooks/revalidateSite.ts` in the Payload repo POSTs here whenever a post is
 * published, renamed or deleted, with the tags it affects — `posts`, and
 * `post:<slug>` for each of the old and new slugs on a rename. Those tag names
 * are the contract between the two repositories; `lib/posts.ts` attaches the
 * same ones to its fetch.
 *
 * The CMS swallows every failure here so that an editor can always publish, and
 * gives up after three seconds. That means a silent failure on this side looks
 * like nothing at all from the admin — hence returning which tags were cleared,
 * so the CMS logs something useful when it does not match.
 */

/** A body big enough to hold a sensible tag list and nothing more. */
const MAX_TAGS = 64;

export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;

  // An unset secret must not mean an open endpoint. Same posture as the
  // internal contact route in custom-worker.js: a bad key is indistinguishable
  // from a route that does not exist.
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return new Response("Not found", { status: 404 });
  }

  let tags: unknown;
  try {
    ({ tags } = (await request.json()) as { tags?: unknown });
  } catch {
    return Response.json({ ok: false, error: "Body was not JSON" }, { status: 400 });
  }

  if (!Array.isArray(tags) || tags.some((t) => typeof t !== "string")) {
    return Response.json(
      { ok: false, error: "Expected { tags: string[] }" },
      { status: 400 },
    );
  }
  if (tags.length === 0 || tags.length > MAX_TAGS) {
    return Response.json(
      { ok: false, error: `Expected between 1 and ${MAX_TAGS} tags` },
      { status: 400 },
    );
  }

  for (const tag of tags as string[]) revalidateTag(tag);

  return Response.json({ ok: true, revalidated: tags });
}
