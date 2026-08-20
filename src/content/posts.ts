/**
 * Blog content as typed data. Rendering blocks rather than MDX keeps the
 * dependency surface at zero; swap in @next/mdx later if posts need JSX.
 */
export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "code"; lang: string; code: string }
  | { type: "quote"; text: string }
  | { type: "table"; head: string[]; rows: string[][] };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  readingMinutes: number;
  /** primary tag, used on the list row */
  tag: string;
  /** full topic list, shown on the article */
  tags?: string[];
  body: Block[];
};

export const POSTS: Post[] = [
  {
    slug: "technical-seo-audit-checklist",
    title: "The 12-point technical SEO audit I run before touching a site",
    excerpt:
      "Before any keyword research, I check twelve things. Most sites fail at least four of them, and fixing those usually moves rankings more than new content does.",
    date: "2026-08-10",
    readingMinutes: 10,
    tag: "SEO",
    tags: ["SEO", "Technical SEO", "Audit"],
    body: [
      {
        type: "p",
        text: "When someone asks me to “do their SEO”, the first thing I do is not keyword research. It is a technical pass, because there is no point writing content for a site Google struggles to crawl, render or trust.",
      },
      {
        type: "p",
        text: "This is the list I work through, roughly in order. It takes about two hours with Screaming Frog, Search Console and PageSpeed Insights open.",
      },

      { type: "h2", text: "1. Is it actually indexable?" },
      {
        type: "p",
        text: "Sounds obvious. It is not. I check for a stray noindex in the page head, a Disallow: / left in robots.txt from the staging site, and whether the canonical tag on each page points at itself rather than the homepage.",
      },
      {
        type: "p",
        text: "I have found a noindex sitewide on a live site more than once. It is usually a staging setting that shipped. It costs everything and takes ninety seconds to fix.",
      },

      { type: "h2", text: "2. One canonical version of every URL" },
      {
        type: "p",
        text: "https://example.com, http://example.com, https://www.example.com and https://example.com/index.php should all resolve to exactly one address with a 301. Trailing slash handling should be consistent.",
      },
      { type: "p", text: "Every duplicate splits your signals." },

      { type: "h2", text: "3. XML sitemap that matches reality" },
      {
        type: "p",
        text: "The sitemap should contain the URLs you want indexed and nothing else — no redirects, no 404s, no noindex pages, no tag archives you do not care about. Then confirm it is referenced in robots.txt and submitted in Search Console.",
      },

      { type: "h2", text: "4. Core Web Vitals on mobile, on real data" },
      {
        type: "p",
        text: "Lab scores are a diagnostic tool. The number that counts is the field data in Search Console’s Core Web Vitals report, because that is real visitors on real phones on real networks.",
      },
      {
        type: "p",
        text: "I look at Largest Contentful Paint first. It is usually a hero image that has not been compressed, or a font loading strategy that blocks rendering.",
      },

      { type: "h2", text: "5. Render check, not just source check" },
      {
        type: "p",
        text: "Fetch the page with JavaScript disabled. If your content only appears after JS runs, Google will probably still index it — eventually, and less reliably. For a content site there is rarely a good reason to accept that risk.",
      },

      { type: "h2", text: "6. Internal linking depth" },
      {
        type: "p",
        text: "Every important page should be reachable within three clicks of the homepage. Screaming Frog gives you crawl depth in one column. Anything sitting at depth five or more is effectively invisible, no matter how good it is.",
      },
      {
        type: "p",
        text: "Orphan pages — in the sitemap but linked from nowhere — are the same problem in a worse form.",
      },

      { type: "h2", text: "7. Heading structure that means something" },
      {
        type: "p",
        text: "One <h1> per page, describing that page. Then <h2> and <h3> in a logical order without skipping levels. This is as much an accessibility fix as an SEO one, and it is a reliable indicator of general build quality: sites that get this wrong usually get other things wrong too.",
      },

      { type: "h2", text: "8. Title tags and meta descriptions, written for humans" },
      {
        type: "p",
        text: "Every page needs a unique title under about 60 characters that leads with the thing people search for. Descriptions do not directly affect ranking, but they affect click-through rate, which is the metric that actually matters.",
      },
      {
        type: "p",
        text: "Duplicates across pages are a symptom of a template writing them automatically. Fix the template.",
      },

      { type: "h2", text: "9. Structured data that validates" },
      {
        type: "p",
        text: "At minimum: Organization or Person, BreadcrumbList, and Article on blog posts. LocalBusiness if you have a physical location — important in the UAE market. Run it through Google’s Rich Results Test and fix every error before worrying about warnings.",
      },

      { type: "h2", text: "10. Image weight and alt text" },
      {
        type: "p",
        text: "Images are almost always the largest thing on the page. Modern format, sized for the container rather than the original camera resolution, lazy-loaded below the fold, and given width and height attributes so nothing shifts as they load.",
      },
      {
        type: "p",
        text: "Alt text describes the image. It is not a place to put keywords.",
      },

      { type: "h2", text: "11. HTTPS everywhere, with no mixed content" },
      {
        type: "p",
        text: "Valid certificate, HTTP redirecting to HTTPS, and no assets loading over plain HTTP inside an HTTPS page. Add HSTS once you are confident. Check the certificate expiry and whether renewal is automated — an expired certificate takes a site down completely, and it happens on a schedule you can predict.",
      },

      { type: "h2", text: "12. Local signals, if you serve a city" },
      {
        type: "p",
        text: "For UAE businesses this is often the highest-leverage item on the whole list. Google Business Profile complete and verified, name/address/phone consistent everywhere they appear, and location pages that say something specific rather than being one template with the city name swapped.",
      },

      { type: "h2", text: "What I do with the results" },
      {
        type: "p",
        text: "Everything goes in a sheet with three columns: effort, impact, and owner. High impact and low effort gets done this week. Low impact and high effort probably never gets done, and saying so out loud is more useful than leaving it on a list to feel comprehensive.",
      },
      {
        type: "quote",
        text: "A 90-page audit PDF that nobody reads is not a deliverable. A prioritised list of twelve things with names against them is.",
      },
    ],
  },

  {
    slug: "wordpress-or-nextjs-dubai-sme",
    title: "WordPress or Next.js? An honest answer for a Dubai SME",
    excerpt:
      "Most comparisons are written by people selling one of the two. Here is how I actually decide, based on who edits the site and what it has to do.",
    date: "2026-08-05",
    readingMinutes: 7,
    tag: "WordPress",
    tags: ["WordPress", "Next.js", "Web Development"],
    body: [
      {
        type: "p",
        text: "Every few weeks someone asks me whether they should build on WordPress or move to something modern like Next.js. The honest answer is that the question is usually framed wrong. The platform is downstream of two things: who edits the site, and what the site has to do beyond displaying pages.",
      },
      { type: "p", text: "Here is the decision as I actually make it." },

      { type: "h2", text: "Start with who edits it" },
      { type: "p", text: "This matters more than any technical consideration." },
      {
        type: "p",
        text: "If your marketing coordinator needs to publish a promotion on Thursday afternoon without opening a support ticket, you need a real CMS with a real editor. WordPress does this better than almost anything, and it has done for fifteen years. Fighting that is stubbornness, not engineering.",
      },
      {
        type: "p",
        text: "If content changes rarely, or changes only through you, that constraint disappears and faster options open up.",
      },

      { type: "h2", text: "Then ask what it has to do" },
      { type: "p", text: "Sort your site into one of three buckets:" },
      {
        type: "ul",
        items: [
          "Bucket one — it shows information. Company site, service pages, a blog, contact form. Perhaps a few hundred pages.",
          "Bucket two — it sells things. Product catalogue, cart, checkout, payment gateway, stock levels, order emails.",
          "Bucket three — it does work. Accounts, dashboards, quotes, bookings, anything where a user logs in and the site behaves differently for them.",
        ],
      },

      { type: "h2", text: "The actual recommendation" },
      {
        type: "table",
        head: ["Bucket", "Editors are non-technical", "Editors are technical"],
        rows: [
          ["Shows information", "WordPress, hardened", "Astro"],
          ["Sells things", "WooCommerce or Shopify", "Next.js + a commerce backend"],
          ["Does work", "Next.js with a headless CMS", "Next.js"],
        ],
      },
      {
        type: "p",
        text: "That is genuinely most of it. The interesting cases are the edges.",
      },

      { type: "h2", text: "When I move a brochure site off WordPress" },
      {
        type: "p",
        text: "When speed is a business requirement rather than a preference. If you are competing on local search in a crowded category, and your competitors all load in four seconds, being the one that loads in under one is a real advantage — and it is much easier to hold that with Astro than to fight a WordPress theme into shape every time a plugin updates.",
      },
      {
        type: "p",
        text: "Astro also removes a maintenance surface entirely. There is no PHP, no database, no plugin ecosystem waiting to be exploited. For a site that changes twice a month, that trade is very often worth it. You still get a proper editor if you pair it with a Git-based CMS — this site runs exactly that way.",
      },

      { type: "h2", text: "When I keep WordPress despite the temptation" },
      {
        type: "p",
        text: "When there are more than about five people who touch the content, or when the business already runs on WordPress plugins that would each need replacing. Rebuilding a working WooCommerce store as a headless commerce project is a six-figure decision dressed up as a technical upgrade.",
      },
      {
        type: "p",
        text: "Hardened WordPress on decent hosting behind Cloudflare, with a caching layer and a disciplined plugin diet, is genuinely fast. Most slow WordPress sites are not slow because of WordPress. They are slow because of a page builder, thirty-one plugins and six unoptimised hero images.",
      },

      { type: "h2", text: "When Next.js earns its keep" },
      {
        type: "p",
        text: "When the site is an application. Customer portals, booking systems, anything with authentication and per-user state. At that point you are writing software, and you want a framework designed for it rather than a CMS bent into that shape.",
      },

      { type: "h2", text: "The question nobody asks" },
      { type: "p", text: "Who maintains it in eighteen months?" },
      {
        type: "p",
        text: "A Next.js site built by a contractor who then becomes unreachable is worse than a WordPress site any local developer can pick up. Choose the platform your future self, or your future agency, can actually operate.",
      },
      {
        type: "quote",
        text: "This is the single most common expensive mistake I see in Dubai. A company pays for a beautiful custom build, the developer moves on, and two years later nobody can change the phone number in the footer without a quote.",
      },

      { type: "h2", text: "The short version" },
      {
        type: "ul",
        items: [
          "Non-technical editors, ordinary content site → WordPress, properly hardened",
          "Technical editors, speed matters → Astro",
          "Selling products → WooCommerce, unless you have outgrown it",
          "Users log in and do things → Next.js",
          "Nobody to maintain it → the boring option, every time",
        ],
      },
      {
        type: "p",
        text: "If you are weighing this up for a specific site, send me the URL and I will tell you which bucket it is in. It usually takes about ten minutes to work out.",
      },
    ],
  },

  {
    slug: "security-baseline-small-dubai-office",
    title: "A security baseline for a small Dubai office that takes one afternoon",
    excerpt:
      "Not a compliance framework. Nine practical controls covering firewall, backups, Microsoft 365 and website hardening that a 10 to 50 person office can put in place this week.",
    date: "2026-07-28",
    readingMinutes: 7,
    tag: "Security",
    tags: ["Security", "IT Infrastructure", "Cloudflare"],
    body: [
      {
        type: "p",
        text: "Most small offices I walk into have no security baseline. Not a bad one — none. There is a router the ISP supplied, a shared admin password, and a backup someone set up in 2021 that nobody has restored from since.",
      },
      {
        type: "p",
        text: "This is not a compliance framework. It is the set of controls that would have prevented every incident I have personally cleaned up, and a competent person can put most of it in place in an afternoon.",
      },

      { type: "h2", text: "1. Get the firewall off default settings" },
      {
        type: "p",
        text: "If you have a FortiGate or similar, change the admin password, disable WAN-side management, and turn on the logging you are already paying for. If you are running the ISP’s router as your only perimeter, that is your first purchase.",
      },
      {
        type: "p",
        text: "Segment the guest Wi-Fi from the office network. It is a five-minute change and it means a compromised visitor laptop cannot see your file server.",
      },

      { type: "h2", text: "2. Enforce MFA on Microsoft 365" },
      {
        type: "p",
        text: "Not “enable”. Enforce, through a Conditional Access policy, with no per-user exceptions for the managing director. Business Email Compromise is the most common attack against a small UAE business, and MFA stops nearly all of it.",
      },
      {
        type: "p",
        text: "While you are in there: block legacy authentication protocols. They exist to bypass exactly the control you just turned on.",
      },

      { type: "h2", text: "3. Backups you have actually restored" },
      {
        type: "p",
        text: "A backup is a hypothesis until you restore from it. Pick a file, restore it, note the date you did so. Then do it again in six months.",
      },
      {
        type: "p",
        text: "Follow 3-2-1: three copies, two different media, one off-site. For Microsoft 365 specifically, note that Microsoft does not back up your data in the sense you mean — retention policies are not backups, and a deleted mailbox is gone once the retention window closes.",
      },

      { type: "h2", text: "4. Put Cloudflare in front of the website" },
      {
        type: "p",
        text: "Free tier is enough for most offices. You get DDoS protection, a WAF, and TLS without managing certificates yourself.",
      },
      {
        type: "p",
        text: "Turn on: Always Use HTTPS, Automatic HTTPS Rewrites, and a rate-limiting rule on the login path. If you run WordPress, rate-limit /wp-login.php and /xmlrpc.php specifically. That single rule eliminates the overwhelming majority of automated attacks against a WordPress site.",
      },

      { type: "h2", text: "5. Patch on a schedule, not on an incident" },
      {
        type: "p",
        text: "Operating systems and browsers on automatic updates. WordPress core, themes and plugins updated on a staging copy first, then production, on a fixed day each month.",
      },
      {
        type: "p",
        text: "Uninstall — do not just deactivate — every plugin you are not using. Deactivated plugins still contain exploitable code sitting in your filesystem.",
      },

      { type: "h2", text: "6. Stop sharing accounts" },
      {
        type: "p",
        text: "The shared admin@company.ae login used by four people is the reason you cannot tell who did what. Individual accounts, roles that reflect what each person actually needs, and a password manager so nobody has to remember them.",
      },
      {
        type: "p",
        text: "Offboarding then becomes one action instead of an archaeology project.",
      },

      { type: "h2", text: "7. Know what you own" },
      {
        type: "p",
        text: "A simple sheet: every domain, hosting account, SaaS subscription, and who holds the credentials. Add the renewal dates.",
      },
      {
        type: "p",
        text: "I have watched a business lose a domain because the renewal notice went to a personal email address belonging to someone who left two years earlier. Recovery took weeks and cost more than a decade of renewals.",
      },

      { type: "h2", text: "8. Turn on monitoring you will actually notice" },
      {
        type: "p",
        text: "Uptime monitoring on the website with alerts to a channel someone reads. Certificate expiry alerts. Failed-backup alerts.",
      },
      {
        type: "p",
        text: "An alert nobody sees is not monitoring. Route them somewhere with a human attached.",
      },

      { type: "h2", text: "9. Write the incident plan on one page" },
      {
        type: "p",
        text: "Who to call, in what order, and where the credentials are kept. Whether you have cyber insurance and what the notification requirement is. How to reach the hosting provider outside business hours.",
      },
      {
        type: "p",
        text: "One page. Printed, because the scenario where you need it may be the scenario where you cannot log in to read it.",
      },

      { type: "h2", text: "What this does not cover" },
      {
        type: "p",
        text: "This is a baseline, not a security programme. It does not cover endpoint detection, formal risk assessment, penetration testing, or anything a regulated entity needs. If you handle payment card data or operate under a specific UAE regulatory regime, you need considerably more than this and you need it documented.",
      },
      {
        type: "p",
        text: "But if you have none of the above, doing these nine things this week puts you ahead of most offices your size — and it removes the failure modes that actually cause weekend emergencies.",
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
