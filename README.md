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
| `/work` | Grid of all six projects |
| `/work/[slug]` | Case study: brief, approach, outcome, results, client quote, next-project link |
| `/services` | Capabilities, pricing tiers, process, FAQ |
| `/blog` | Writing index |
| `/blog/[slug]` | Article, rendered from typed content blocks |
| `/contact` | Contact form with validation and success state |
| `404` | Custom not-found |

Everything prerenders: 32 static routes, including a generated OpenGraph image
per project and per article.

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
  lib/          scroll store, intro store, contact types, GLSL noise
scripts/        puppeteer verification harness
```

Content is typed data, deliberately separate from presentation. To add a project
or post, append to `src/content/*.ts` — routes, static params, OG images and
next/previous links all follow automatically.

## Contact form

`src/app/actions.ts` is a server action that validates server-side (name, email
format, message length) and carries a honeypot field.

> **Email delivery is off by default.** Without `RESEND_API_KEY`,
> `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` set, a submission is validated and
> logged to the server console, and the visitor still sees the success state.
> Copy `.env.example` to `.env.local` and fill it in before putting this in
> front of real traffic.

Note that `lib/contact.ts` holds the state type and initial value rather than
`actions.ts`: a `"use server"` module may only export async functions, and
exporting a plain object from one fails at request time, not at build time.

## Verifying

A green build proves the types line up. It does not prove the page renders.

```bash
npx next start -p 3222
node scripts/verify.mjs
```

This drives real Chrome across every route and reports status codes, console and
page errors, failed requests, horizontal overflow, whether the intro dismissed,
and dead `href="#"` links. It then exercises the contact form twice — once with
invalid input to confirm the error states, once valid to confirm the success
state — and checks that each OpenGraph route returns a PNG. Screenshots land in
`preview/`.

`scripts/probe.mjs` reads computed styles for cases where a screenshot shows
that something is wrong but not why.

## Still placeholder

- Project artwork is CSS gradients with mock browser chrome — swap in real
  screenshots or short video loops.
- The four social links in `components/Footer.tsx` and the cal.com link are
  `href="#"`.
- Copy, project details, testimonials, stats, prices and the Lisbon location are
  invented. So is `hello@josesebastian.dev`.

## Notes

- `prefers-reduced-motion` skips the intro and disables Lenis, the custom cursor
  and CSS animation. Scroll-*linked* transforms still run.
- Scroll state for the WebGL loops lives in a plain module (`lib/scroll-store.ts`)
  read inside `useFrame`, so scrolling never triggers a React render.
- All three canvases are `dynamic(..., { ssr: false })`.
- If routes 404 after a build, delete `.next` and rebuild — building while a
  server holds `.next` open can leave `app-paths-manifest.json` truncated.
