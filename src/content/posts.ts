/**
 * Blog content as typed data. Rendering blocks rather than MDX keeps the
 * dependency surface at zero; swap in @next/mdx later if posts need JSX.
 */
export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "code"; lang: string; code: string }
  | { type: "quote"; text: string };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  readingMinutes: number;
  tag: string;
  body: Block[];
};

export const POSTS: Post[] = [
  {
    slug: "unlayered-css-beats-tailwind-utilities",
    title: "The one CSS rule that silently overrode every Tailwind utility",
    excerpt:
      "A single universal border-color rule in globals.css quietly flattened every accent border on a site. The cause is cascade layers, and the fix is one line.",
    date: "2026-07-28",
    readingMinutes: 5,
    tag: "CSS",
    body: [
      {
        type: "p",
        text: "I shipped a build where every border was the same grey. Not wrong-grey — the right grey, everywhere, including the places that were supposed to be lime, transparent, or a translucent white. The utilities were in the markup. DevTools showed them being applied and then beaten by something.",
      },
      {
        type: "p",
        text: "The culprit was four lines at the top of globals.css, written months earlier and never questioned:",
      },
      {
        type: "code",
        lang: "css",
        code: `@import "tailwindcss";

* {
  border-color: var(--color-line);
}`,
      },
      { type: "h2", text: "Why specificity does not save you" },
      {
        type: "p",
        text: "The instinct is to reach for specificity. A class selector (0,1,0) beats a universal selector (0,0,0), so `.border-transparent` should win. It does not, and the reason is that specificity is only consulted after the cascade has compared layers.",
      },
      {
        type: "p",
        text: "Tailwind v4 puts its output into named layers. Every utility lives inside `@layer utilities`. Unlayered CSS — anything you write at the top level of a stylesheet — is treated as a layer that comes last, which means it wins against every layered rule regardless of how specific that rule is.",
      },
      {
        type: "quote",
        text: "Unlayered styles beat layered styles. Specificity is compared only within the same layer.",
      },
      {
        type: "p",
        text: "So a universal selector written outside any layer outranks a class written inside one. That is the entire bug.",
      },
      { type: "h2", text: "The fix" },
      {
        type: "p",
        text: "Put the rule in the layer it belongs to. Tailwind declares its layer order up front, so `base` is available and sits below `utilities`:",
      },
      {
        type: "code",
        lang: "css",
        code: `@layer base {
  * {
    border-color: var(--color-line);
  }
}`,
      },
      {
        type: "p",
        text: "Now every border-color utility overrides the default, and elements without one still get the sensible fallback.",
      },
      { type: "h2", text: "How to catch it" },
      {
        type: "p",
        text: "This class of bug is invisible in a build log and easy to miss by eye, because the wrong value is usually a plausible one. What caught it for me was reading computed styles out of a real browser rather than trusting the screenshot:",
      },
      {
        type: "code",
        lang: "js",
        code: `const cs = getComputedStyle(document.querySelector("header > div"));
console.log(cs.borderTopColor); // expected transparent, got rgb(30, 34, 48)`,
      },
      {
        type: "p",
        text: "If you write any global resets alongside Tailwind v4, audit them now. Anything setting a property that a utility also sets — border-color, font-family, letter-spacing — is a candidate.",
      },
    ],
  },
  {
    slug: "scroll-linked-animation-without-rerenders",
    title: "Scroll-linked WebGL without a single React re-render",
    excerpt:
      "Bridging scroll position into a useFrame loop through React state will cost you frames. A plain module and a rAF loop will not.",
    date: "2026-06-14",
    readingMinutes: 7,
    tag: "WebGL",
    body: [
      {
        type: "p",
        text: "The naive way to drive a Three.js scene from scroll is to put scroll position in state. It works, it is easy to read, and it will re-render your component tree on every scroll event. On a page with a few hundred DOM nodes and three canvases, that is where your frames go.",
      },
      { type: "h2", text: "The shape of the fix" },
      {
        type: "p",
        text: "React does not need to know about scroll. The render loop does. So put the value somewhere both can reach that is not React state:",
      },
      {
        type: "code",
        lang: "ts",
        code: `export const scrollStore = {
  progress: 0,
  y: 0,
  velocity: 0,
};

export function startScrollTracking() {
  let last = window.scrollY;
  const tick = () => {
    const y = window.scrollY;
    const max = Math.max(1, document.body.scrollHeight - window.innerHeight);
    scrollStore.y = y;
    scrollStore.progress = Math.min(1, y / max);
    scrollStore.velocity += (y - last - scrollStore.velocity) * 0.15;
    last = y;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}`,
      },
      {
        type: "p",
        text: "Then read it inside useFrame, which already runs once per frame:",
      },
      {
        type: "code",
        lang: "tsx",
        code: `useFrame((state, delta) => {
  const d = Math.min(delta, 0.05);       // clamp: tab-switches deliver huge deltas
  material.current.uniforms.uScroll.value = scrollStore.progress;
  mesh.current.position.y = scrollStore.progress * 4;
});`,
      },
      { type: "h2", text: "Three details that matter" },
      {
        type: "ul",
        items: [
          "Clamp delta. When a tab is backgrounded and restored, delta can be several seconds, and anything multiplied by it jumps.",
          "Sample in rAF, not in a scroll listener. Scroll events fire at input frequency, which is not display frequency; reading scrollY once per frame gives you exactly the resolution you can draw.",
          "Ease toward the target rather than assigning it. A single lerp line turns a value that snaps into one that feels weighted.",
        ],
      },
      { type: "h2", text: "Passing per-section progress" },
      {
        type: "p",
        text: "For values that come from the DOM — a section's own scroll progress — a ref works as the bridge. Write to it from a motion value subscription, read it in the frame loop, and React still never renders:",
      },
      {
        type: "code",
        lang: "tsx",
        code: `const progressRef = useRef(0);
useMotionValueEvent(scrollYProgress, "change", (v) => {
  progressRef.current = v;
});

return <Scene progress={progressRef} />;`,
      },
      {
        type: "p",
        text: "The scene eases toward progressRef.current every frame. Scrubbing feels tied to the page, and the component that owns the scroll never renders twice.",
      },
    ],
  },
  {
    slug: "sticky-broken-by-overflow-hidden",
    title: "Why your position: sticky stopped working",
    excerpt:
      "Nine times out of ten it is an ancestor with overflow: hidden. There is a one-word fix that almost nobody reaches for.",
    date: "2026-05-02",
    readingMinutes: 4,
    tag: "CSS",
    body: [
      {
        type: "p",
        text: "You add `position: sticky`, set a `top`, and nothing sticks. The element scrolls away like it always did. Before you start adding heights and z-indexes at random, walk up the tree and look for overflow.",
      },
      { type: "h2", text: "The mechanism" },
      {
        type: "p",
        text: "A sticky element sticks within its nearest scrolling ancestor. Setting `overflow` to anything other than `visible` on an ancestor makes that ancestor a scroll container. Your element then dutifully sticks inside a box that never scrolls, which looks identical to not sticking at all.",
      },
      {
        type: "p",
        text: "The usual offender is the one-liner everyone adds to stop a horizontal scrollbar:",
      },
      {
        type: "code",
        lang: "css",
        code: `body {
  overflow-x: hidden; /* also sets overflow-y to auto */
}`,
      },
      {
        type: "p",
        text: "You cannot set one axis to hidden and leave the other visible. The spec computes the other axis to auto, so this single declaration turns body into a scroll container and quietly breaks every sticky descendant on the page.",
      },
      { type: "h2", text: "Use clip instead" },
      {
        type: "code",
        lang: "css",
        code: `body {
  overflow-x: clip;
}`,
      },
      {
        type: "p",
        text: "`clip` cuts the overflow without creating a scroll container, so sticky keeps working. It is supported everywhere that matters and it is almost always what you meant.",
      },
      { type: "h2", text: "The other suspects" },
      {
        type: "ul",
        items: [
          "An ancestor with a fixed height smaller than the sticky element, leaving nothing to travel through.",
          "A flex parent whose default align-items: stretch makes the child full-height, so there is no room to move.",
          "A missing top, right, bottom or left value — sticky does nothing without an inset.",
          "A transform, filter or will-change on an ancestor, which creates a containing block and changes what fixed and sticky resolve against.",
        ],
      },
      {
        type: "p",
        text: "Fastest way to find it: in DevTools, walk up from the element and watch computed overflow on each ancestor. The first one that is not visible is your answer.",
      },
    ],
  },
  {
    slug: "framer-motion-variant-transition-precedence",
    title: "Your stagger delay is being silently ignored",
    excerpt:
      "A variant's own transition beats the transition prop. If you pass delay as a prop next to variants, it does nothing.",
    date: "2026-04-09",
    readingMinutes: 4,
    tag: "Motion",
    body: [
      {
        type: "p",
        text: "This looks correct, reads correctly in review, and does not work:",
      },
      {
        type: "code",
        lang: "tsx",
        code: `const REVEAL = {
  hidden: { y: 34, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

<motion.div
  variants={REVEAL}
  initial="hidden"
  whileInView="show"
  transition={{ delay }}   // ignored
/>`,
      },
      {
        type: "p",
        text: "Every element animates at once. The delay is gone, and nothing warns you.",
      },
      { type: "h2", text: "Precedence" },
      {
        type: "p",
        text: "The `transition` prop sets a default. A transition defined inside the variant is more specific and replaces it wholesale — it is not merged key by key. Since `show` carries its own transition object, that object is what runs, and it has no delay in it.",
      },
      { type: "h2", text: "Use a function variant" },
      {
        type: "p",
        text: "Make the variant a function and feed it through `custom`. The delay then lives in the same object as the duration, so nothing overrides anything:",
      },
      {
        type: "code",
        lang: "tsx",
        code: `const REVEAL = {
  hidden: { y: 34, opacity: 0 },
  show: (delay = 0) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay },
  }),
};

<motion.div variants={REVEAL} custom={delay} initial="hidden" whileInView="show" />`,
      },
      {
        type: "p",
        text: "If every child shares one parent, prefer staggerChildren on the parent and skip per-child delays entirely — it stays correct when the list length changes:",
      },
      {
        type: "code",
        lang: "tsx",
        code: `variants={{
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}}`,
      },
    ],
  },
  {
    slug: "what-i-check-before-calling-it-done",
    title: "What I check before I tell a client it is done",
    excerpt:
      "A build that compiles is not a build that works. The short list I run on every project, and why screenshots are the least of it.",
    date: "2026-03-17",
    readingMinutes: 6,
    tag: "Process",
    body: [
      {
        type: "p",
        text: "A green build tells you the types line up and the bundler found every import. It tells you nothing about whether the page renders, whether the animation runs, or whether the thing you built is legible on a phone. Those are separate questions and each one needs its own check.",
      },
      { type: "h2", text: "Drive a real browser" },
      {
        type: "p",
        text: "I open the built site in actual Chrome, not a mental model of it. The script scrolls the full page, waits for motion to settle at each stop, screenshots, and collects every console error, page error and failed request along the way.",
      },
      {
        type: "p",
        text: "On a recent build that pass found three things the compiler could not: a global CSS rule overriding every accent border, a stagger delay being silently dropped, and a favicon 404. None of them would have failed CI.",
      },
      { type: "h2", text: "Read computed styles, not screenshots" },
      {
        type: "p",
        text: "Screenshots tell you something looks wrong. Computed styles tell you why. When a border looked grey I did not squint at the PNG, I asked the element what colour it thought it was.",
      },
      { type: "h2", text: "The list" },
      {
        type: "ul",
        items: [
          "Zero console errors, page errors and failed requests across the whole page, not just the first screen.",
          "No horizontal overflow: scrollWidth equals clientWidth at every breakpoint.",
          "Real mobile viewport, not a narrowed desktop one — isMobile and hasTouch change layout and event behaviour.",
          "Keyboard-only pass through every interactive element, with a visible focus ring on each.",
          "prefers-reduced-motion honoured, including scroll-linked transforms and not just CSS animation.",
          "Lighthouse on the production build over a throttled connection, because the dev server lies about performance.",
          "Every link resolves — placeholder href=\"#\" is the most common thing shipped by accident.",
        ],
      },
      { type: "h2", text: "Say what you did not check" },
      {
        type: "p",
        text: "The last step is telling the client what is verified and what is not. If I tested three viewports, I say three. If the contact form is wired but has no email provider configured, I say that in the handover, not in a comment nobody reads. A caveat stated up front is a detail; the same caveat discovered later is a defect.",
      },
    ],
  },
];

export function getPost(slug: string) {
  return POSTS.find((p) => p.slug === slug);
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
