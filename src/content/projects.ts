export type Project = {
  slug: string;
  index: string;
  title: string;
  client: string;
  year: string;
  summary: string;
  role: string;
  duration: string;
  tags: string[];
  stack: string[];
  metric: string;
  metricLabel: string;
  /** headline numbers shown on the case study */
  results: { value: string; label: string }[];
  brief: string;
  approach: string[];
  outcome: string;
  quote?: { text: string; name: string; role: string };
  /** two-stop gradient standing in for artwork */
  art: [string, string];
  featured: boolean;
};

export const PROJECTS: Project[] = [
  {
    slug: "nomad-atlas",
    index: "01",
    title: "Nomad Atlas",
    client: "Travel platform",
    year: "2025",
    summary:
      "A booking platform for long-stay rentals, rebuilt from a jQuery monolith into a typed Next.js app with maps, payments and a CMS the ops team runs themselves.",
    role: "Lead developer",
    duration: "9 weeks",
    tags: ["Next.js", "Mapbox", "Stripe"],
    stack: ["Next.js 15", "TypeScript", "Mapbox GL", "Stripe", "Sanity", "Vercel"],
    metric: "+41%",
    metricLabel: "booking conversion",
    results: [
      { value: "+41%", label: "booking conversion" },
      { value: "-62%", label: "time to first booking" },
      { value: "1.4s", label: "LCP, down from 5.1s" },
    ],
    brief:
      "Nomad Atlas had product-market fit and a checkout nobody could finish. Six steps, a map that locked the main thread, and a price that changed between the listing and the payment screen. Support was fielding the same three complaints every day.",
    approach: [
      "Rebuilt search as a server-rendered route with the map hydrated separately, so results are readable before any JavaScript for the map has downloaded.",
      "Collapsed checkout from six steps to two, and moved price calculation server-side so the number quoted on the listing is the number charged.",
      "Moved every string and image into Sanity, so the ops team stopped filing tickets to change copy.",
      "Added a typed booking state machine, which killed the class of bug where a half-finished booking could be paid for twice.",
    ],
    outcome:
      "Conversion rose 41% in the first full month against the previous quarter's baseline. The support queue for checkout issues went to near zero, and the ops team now ships copy changes without me.",
    quote: {
      text: "We had three agencies quote us. Jose was the only one who opened DevTools on the call and showed us exactly what was slow.",
      name: "Marta Oliveira",
      role: "Head of Growth, Nomad Atlas",
    },
    art: ["#6b5bff", "#0b0d16"],
    featured: true,
  },
  {
    slug: "halden-studio",
    index: "02",
    title: "Halden Studio",
    client: "Architecture practice",
    year: "2025",
    summary:
      "A portfolio site for an architecture practice, where the work had to feel physical without costing a second of load time.",
    role: "Design & build",
    duration: "5 weeks",
    tags: ["WebGL", "GSAP", "Sanity"],
    stack: ["Next.js", "Three.js", "GSAP", "Sanity", "Cloudflare Images"],
    metric: "1.1s",
    metricLabel: "largest contentful paint",
    results: [
      { value: "1.1s", label: "largest contentful paint" },
      { value: "100", label: "lighthouse accessibility" },
      { value: "3.1×", label: "avg. session duration" },
    ],
    brief:
      "Halden had photography worth showing and a site that showed it in a 900px column. They wanted something that felt like the buildings — heavy, quiet, precise — and they had been told that meant a slow site.",
    approach: [
      "Built the gallery on a WebGL plane with a displacement shader on transition, so images cross-fade with weight instead of a CSS opacity blink.",
      "Every image goes through Cloudflare Images with AVIF and a blurhash placeholder, so the layout never shifts.",
      "The 3D layer is deferred entirely: the site is fully readable and navigable before Three.js is requested.",
      "Type is set in a variable font, with weight interpolated on scroll rather than swapping files.",
    ],
    outcome:
      "LCP landed at 1.1s on a throttled 4G profile, with the WebGL layer arriving after. Sessions run three times longer than the old site, and they have started getting inbound from outside Norway.",
    quote: {
      text: "The scroll work is the part everyone comments on, but the real win was the CMS. Our team stopped filing tickets to change a headline.",
      name: "Daniel Roos",
      role: "Founder, Halden Studio",
    },
    art: ["#c8ff2e", "#101408"],
    featured: true,
  },
  {
    slug: "fable-finance",
    index: "03",
    title: "Fable Finance",
    client: "Fintech dashboard",
    year: "2024",
    summary:
      "A reporting dashboard for 18k daily users, where the hard part was rendering 40k data points without dropping a frame.",
    role: "Frontend lead",
    duration: "14 weeks",
    tags: ["React", "D3", "Node"],
    stack: ["React", "D3", "Node", "Postgres", "TimescaleDB", "AWS"],
    metric: "18k",
    metricLabel: "daily active users",
    results: [
      { value: "18k", label: "daily active users" },
      { value: "60fps", label: "on 40k-point charts" },
      { value: "-78%", label: "dashboard load time" },
    ],
    brief:
      "The existing dashboard re-rendered every chart on every filter change. With a year of data selected it locked the tab for eleven seconds. Their enterprise customers — the ones with the most data — had the worst experience.",
    approach: [
      "Replaced the SVG chart layer with canvas rendering and a windowed data pipeline, so the number of drawn points is bounded by pixels, not rows.",
      "Moved aggregation into TimescaleDB continuous aggregates, so the API returns pre-rolled buckets instead of raw rows.",
      "Introduced a typed query layer with request coalescing, which removed the waterfall of eleven parallel fetches on load.",
      "Added virtualised tables and made every filter a URL parameter, so a view can be shared as a link.",
    ],
    outcome:
      "Charts hold 60fps at 40k points. Dashboard load dropped 78%. The enterprise tier stopped churning at renewal, which was the actual business problem.",
    quote: {
      text: "Shipped on the day he said he would, six weeks out. I have genuinely never had that happen before.",
      name: "Priya Raman",
      role: "CTO, Fable Finance",
    },
    art: ["#ff5c39", "#170c09"],
    featured: true,
  },
  {
    slug: "orbit-commerce",
    index: "04",
    title: "Orbit Commerce",
    client: "DTC storefront",
    year: "2024",
    summary:
      "A headless storefront replatform where the whole brief was one number: revenue per session.",
    role: "Developer",
    duration: "7 weeks",
    tags: ["Shopify", "Edge", "TS"],
    stack: ["Next.js", "Shopify Storefront API", "Edge runtime", "TypeScript"],
    metric: "2.4×",
    metricLabel: "revenue per session",
    results: [
      { value: "2.4×", label: "revenue per session" },
      { value: "-71%", label: "time to interactive" },
      { value: "+18%", label: "add-to-cart rate" },
    ],
    brief:
      "Orbit were paying for traffic that bounced. Their Shopify theme carried nine apps, each injecting its own script, and the product page took eleven seconds to become interactive on a mid-range Android.",
    approach: [
      "Rebuilt the storefront headless on the Shopify Storefront API, rendering product pages at the edge with per-product cache tags.",
      "Audited all nine apps and replaced seven with server-side equivalents; the two that stayed load after interaction.",
      "Cart is optimistic and local-first, so adding to it never waits on a round trip.",
      "Instrumented real-user monitoring so regressions surface as alerts rather than as a bad quarter.",
    ],
    outcome:
      "Revenue per session more than doubled against the same period the previous year. Time to interactive fell 71%, and their paid acquisition became profitable at the same spend.",
    quote: {
      text: "Our LCP went from 4.2s to under a second. Paid for itself in the first month of ad spend.",
      name: "Tom Kessler",
      role: "Ecommerce Lead, Orbit",
    },
    art: ["#2ee6c8", "#06110f"],
    featured: true,
  },
  {
    slug: "terrace-type",
    index: "05",
    title: "Terrace Type",
    client: "Independent foundry",
    year: "2023",
    summary:
      "A type foundry storefront with live variable-font testing, built to stay fast while loading a lot of fonts.",
    role: "Design & build",
    duration: "4 weeks",
    tags: ["Variable fonts", "Canvas"],
    stack: ["Next.js", "Canvas", "Variable fonts", "Stripe"],
    metric: "98",
    metricLabel: "lighthouse performance",
    results: [
      { value: "98", label: "lighthouse performance" },
      { value: "12", label: "families, one request each" },
      { value: "+34%", label: "trial-to-licence rate" },
    ],
    brief:
      "A foundry site has an unavoidable problem: it must load the thing that makes sites slow. Terrace wanted every family testable live, at any weight, without the page becoming a font-loading waterfall.",
    approach: [
      "Each family ships as a single variable font subset to the glyphs the tester actually needs, then upgraded on demand.",
      "The specimen renderer draws to canvas, so dragging a weight axis never triggers layout on the document.",
      "Fonts are self-hosted with immutable cache headers and preloaded per route, so a family page has its face before first paint.",
      "Licensing and checkout run through Stripe with the licence tier encoded in the price object, so there is no separate entitlements store.",
    ],
    outcome:
      "98 on Lighthouse performance with twelve families available. Trial-to-licence conversion rose 34%, which they attribute to the tester being fast enough to actually play with.",
    art: ["#e8e9ee", "#0d0d10"],
    featured: false,
  },
  {
    slug: "meridian-health",
    index: "06",
    title: "Meridian Health",
    client: "Patient portal",
    year: "2023",
    summary:
      "An accessibility-first patient portal, rebuilt to pass WCAG 2.2 AA and an external audit on the first pass.",
    role: "Frontend lead",
    duration: "11 weeks",
    tags: ["a11y", "Next.js", "Auth"],
    stack: ["Next.js", "TypeScript", "Radix", "Auth0", "Playwright"],
    metric: "AA",
    metricLabel: "WCAG 2.2, first-pass audit",
    results: [
      { value: "AA", label: "WCAG 2.2 on first audit" },
      { value: "0", label: "critical axe violations" },
      { value: "-44%", label: "support calls for login" },
    ],
    brief:
      "Meridian had a legal deadline and a portal that failed on almost every axis: keyboard traps in the appointment picker, form errors announced to nobody, and a login flow that timed out silently.",
    approach: [
      "Rebuilt every interactive primitive on Radix, so focus management and ARIA come from a tested base rather than from us.",
      "Made errors live-region announced and tied to their inputs, and gave every failure a plain-language message.",
      "Added axe checks to CI and Playwright keyboard-only journeys for the five critical paths, so regressions fail the build.",
      "Rewrote session handling to warn before expiry and preserve form state across re-auth.",
    ],
    outcome:
      "Passed the external WCAG 2.2 AA audit on the first pass with zero critical findings. Login-related support calls dropped 44%, which nobody had predicted but everybody appreciated.",
    art: ["#5b8cff", "#080c16"],
    featured: false,
  },
];

export function getProject(slug: string) {
  return PROJECTS.find((p) => p.slug === slug);
}

export const FEATURED = PROJECTS.filter((p) => p.featured);
