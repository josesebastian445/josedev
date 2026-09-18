# Jose Sebastian — web developer portfolio

A scroll-driven, multi-page site built with Next.js 15 (App Router), React 19,
Three.js via React Three Fiber, Motion, and Tailwind v4.

```bash
npm install
npm run dev                    # http://localhost:3000
npm run build && npm start
```

## Pages

| Route | What it is |
|---|---|
| `/` | Showcase home — WebGL hero, pinned horizontal gallery, process, stats, testimonials |
| `/work` | Grid of all projects |
| `/work/[slug]` | Case study: brief, approach, outcome, results, client quote, next-project link |
| `/services` | Capabilities, pricing tiers, process, FAQ |
| `/blog` | Writing index |
| `/blog/[slug]` | Article, rendered from CMS blocks |
| `/contact` | Contact form with validation and success state |
| `/api/revalidate` | Cache invalidation from the CMS — the only dynamic route |
| `404` | Custom not-found |

Everything else prerenders: 42 static routes, including a generated OpenGraph
image per project and per article.

## What moves, and how

Every section is animated on scroll. The mechanisms differ on purpose — one
effect repeated ten times reads as a gimmick.

| Section | Motion |
|---|---|
| Intro | Counter to 100, then five panels lift in sequence. Session-gated, and skipped entirely under `prefers-reduced-motion`. Page entrances wait on it via `lib/intro.ts`. |
| Hero | WebGL blob: noise-displaced icosahedron, custom vertex + fragment shader, fresnel rim. Scroll drives noise frequency, camera dolly and mesh lift; pointer drives amplitude and parallax. |
| Ticker | Infinite marquee whose speed *and direction* come from scroll velocity, with a velocity-linked skew. |
| About | Per-word opacity scrubbed against section scroll progress. |
| Work | Pinned section: 420vh of vertical scroll remapped to horizontal travel, spring-smoothed, with a fill rail. |
| Services | Staggered entrance; cards tilt in 3D toward the pointer with a radial spotlight tracking under them. |
| Pricing | Staggered cards, featured tier called out. |
| Process | Sticky WebGL torus knot scrubbed by section progress; timeline rail fills as steps activate. |
| FAQ | Height-animated accordion with a rotating plus/minus. |
| Stats | Count-ups on enter; oversized backdrop word parallaxes against the page. |
| Testimonials | Two rows drifting in opposite directions, masked at the edges. |
| Contact | Instanced lattice (~700 boxes, one draw call) rippling from the pointer; magnetic CTA. |
| Case study | Hero plate scales and drifts on scroll; sticky sidebar against a scrolling narrative. |
| Footer | Oversized wordmark rises into place as the footer is revealed. |

Smooth scrolling is Lenis, with anchor links routed through it.

## Structure

```
src/
  app/          routes, layout, globals.css (design tokens), OG image generators
  components/   sections, chrome (nav, cursor, progress), form, cards
  three/        HeroScene, KnotScene, LatticeScene
  content/      projects.ts, posts.ts  ← edit these, not the components
  lib/          posts data layer, Lexical renderer, scroll and intro stores
scripts/        puppeteer verification harness
```

Projects and services are typed data, deliberately separate from presentation.
To add one, append to `src/content/*.ts` — routes, static params, OG images and
next/previous links all follow automatically.

Posts work differently since the CMS landed. See below.

## Blog content

Posts come from the multi-tenant Payload instance when `PAYLOAD_URL` is set, and
from `src/content/posts.ts` when it is not. The CMS denies unauthenticated
reads, so `PAYLOAD_API_KEY` — a service user whose single tenant membership
scopes the query — is required alongside it. Without the key the request would
succeed with zero documents, so the build refuses to start instead. Both paths render through the same
blocks, because `lib/legacy-to-cms.ts` converts the committed posts into the
CMS's own vocabulary — one function serving as both the offline fallback and the
migration payload, so the two cannot drift.

| File | Role |
|---|---|
| `lib/posts.ts` | Fetch, fallback, and the shape the components consume |
| `lib/cms-types.ts` | The CMS `Post` and its blocks, mirrored locally |
| `lib/lexical.tsx` | Renders Payload's serialised Lexical tree |
| `components/CmsBlocks.tsx` | Renders the shared `pageBlocks` set |
| `lib/legacy-to-cms.ts` | Committed posts → CMS blocks |

The block list is shared across every tenant of that Payload instance, so
`CmsBlocks` tolerates blocks it was not written for: `advisorCTA` and `form` are
matched and skipped, unknown block types fall through to null, and unrecognised
Lexical nodes render their text rather than throwing. **Adding a block to
`pageBlocks` in the CMS means adding a case here too**, or it will save happily
in the admin and render as nothing.

`readingMinutes` is computed rather than stored — the CMS has no such field.
Code and tables are discounted rather than counted as prose.

### Revalidation

Posts are cached under the tags `posts` and `post:<slug>`. The CMS clears them
by POSTing to `/api/revalidate` on publish, rename and delete, authenticated
with `REVALIDATE_SECRET` in an `x-revalidate-secret` header. The route fails
closed: with the secret unset, every request 404s.

> **Not live yet.** Tags need an incremental cache and `open-next.config.ts`
> deliberately configures none, because every route was static. Wiring this up
> means an R2 bucket or KV namespace, a binding in `wrangler.jsonc`, and the
> cache configured in `open-next.config.ts`. Until then the site builds against
> whatever the CMS returns at build time, and a publish needs a redeploy.

## Contact form

`src/app/actions.ts` is a server action that validates server-side (name, email
format, message length) and carries a honeypot field.

Delivery goes through **Cloudflare Email Routing** — no third-party provider.
The `cloudflare:email` module can only be imported from code wrangler bundles
itself, so the actual send lives in `custom-worker.js` (a custom entrypoint
wrapping the OpenNext worker, holding the `CONTACT_EMAIL` send_email binding).
The server action reaches it through `WORKER_SELF_REFERENCE`, authenticated
with the `CONTACT_INTERNAL_KEY` wrangler secret so the route can't be used as
an open relay.

To/from addresses are `vars` in `wrangler.jsonc`. Constraints from Cloudflare:
the recipient must be a **verified destination address** on the account, and
the sender must be on a domain with Email Routing enabled.

> **Delivery silently degrades.** Outside the Workers runtime (plain
> `next dev`) or with `CONTACT_INTERNAL_KEY` unset, a submission is validated
> and logged to the server console, and the visitor still sees the success
> state. Set the secret with `npx wrangler secret put CONTACT_INTERNAL_KEY`
> before putting this in front of real traffic.

Note that `lib/contact.ts` holds the state type and initial value rather than
`actions.ts`: a `"use server"` module may only export async functions, and
exporting a plain object from one fails at request time, not at build time.

## Deploying (Cloudflare Workers)

Runs on Workers via the OpenNext adapter.

```bash
npm run build     # next build + the OpenNext worker bundle
npm run preview   # build, then serve the worker locally through workerd
npm run deploy    # build and deploy
npm run build:next  # plain next build, no Cloudflare bundle
```

Two script details exist to satisfy Cloudflare Workers Builds, which runs
`npm run build` and then `npx wrangler deploy`:

- `build` is `opennextjs-cloudflare build`, not `next build`. The deploy step
  looks for `.open-next/.build/open-next.config.edge.mjs`; a plain Next build
  never creates it and the deploy dies with *"Could not find compiled Open Next
  config"*.
- `open-next.config.ts` sets `buildCommand: "npm run build:next"`. Without it,
  `opennextjs-cloudflare build` shells out to `npm run build` and re-enters
  itself forever.

`wrangler.jsonc` is committed on purpose. Left to generate its own, the adapter
derives the `WORKER_SELF_REFERENCE` service binding from `package.json`'s
`name`, which fails the deploy if that differs from the Cloudflare project name:

```
Service binding 'WORKER_SELF_REFERENCE' references Worker 'dev-portfolio'
which was not found. [code: 10143]
```

Both the package name and `wrangler.jsonc` say `josedev`. **If you rename the
Cloudflare Workers project, change `name` and the `WORKER_SELF_REFERENCE`
service in `wrangler.jsonc` to match it.**

The contact form needs the `CONTACT_INTERNAL_KEY` secret on the worker
(`npx wrangler secret put CONTACT_INTERNAL_KEY --name josedev`); the email
addresses live as `vars` in `wrangler.jsonc`.

## Verifying

A green build proves the types line up. It does not prove the page renders.

```bash
npx next start -p 3222
node scripts/verify.mjs

# or against the actual Workers runtime:
npx wrangler dev --port 3333 --local
BASE=http://127.0.0.1:3333 node scripts/verify.mjs
```

This drives real Chrome across every route and reports status codes, console and
page errors, failed requests, horizontal overflow, whether the intro dismissed,
and dead `href="#"` links. It then exercises the contact form twice — once with
invalid input to confirm the error states, once valid to confirm the success
state — and checks that each OpenGraph route returns a PNG. Screenshots land in
`preview/`.

`scripts/probe.mjs` reads computed styles for cases where a screenshot shows
that something is wrong but not why.

> **The harness routes are stale.** `ROUTES` in `verify.mjs` still lists
> `/work/nomad-atlas` and `/blog/unlayered-css-beats-tailwind-utilities`, neither
> of which exists in `content/` any more, so it reports two 404s that are not
> real. Point them at current slugs before trusting a run.

## Still placeholder

- Project artwork is CSS gradients with mock browser chrome — swap in real
  screenshots or short video loops.
- Read.cv, X and LinkedIn in `components/Footer.tsx` and the cal.com link on
  `/contact` are still `href="#"`. GitHub is wired.
- Prices in `content/services.ts` and the figures in the pricing article are
  indicative. Confirm them before quoting from either.
- Contact details are real and live in `content/site.ts` — Dubai, `hi@joseviews.com`,
  the `+971` number. Earlier drafts of this file said otherwise.

## Notes

- `prefers-reduced-motion` skips the intro and disables Lenis, the custom cursor
  and CSS animation. Scroll-*linked* transforms still run.
- Scroll state for the WebGL loops lives in a plain module (`lib/scroll-store.ts`)
  read inside `useFrame`, so scrolling never triggers a React render.
- All three canvases are `dynamic(..., { ssr: false })`.
- If routes 404 after a build, delete `.next` and rebuild — building while a
  server holds `.next` open can leave `app-paths-manifest.json` truncated.
