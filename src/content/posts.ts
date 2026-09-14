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
    slug: "why-website-not-showing-on-google",
    title: "Why your website is not showing up on Google",
    excerpt:
      "Nine reasons, in the order I check them. Most of the time it is one of the first three, and the fix takes minutes rather than months.",
    date: "2026-09-14",
    readingMinutes: 9,
    tag: "SEO",
    tags: ["SEO", "Technical SEO", "Google Search Console"],
    body: [
      {
        type: "p",
        text: "This is the most common message I get. A company has paid for a website, it went live weeks ago, and searching for the business name returns everything except the business. Something is obviously broken, and nobody can say what.",
      },
      {
        type: "p",
        text: "Before anything else, you have to separate two completely different problems that feel identical from the outside. Either Google does not have your pages at all, or Google has them and is choosing not to show them for the searches you are testing.",
      },
      {
        type: "p",
        text: "The fixes have nothing in common, so guessing between them wastes weeks.",
      },

      { type: "h2", text: "Work out which problem you have" },
      {
        type: "p",
        text: "Search Google for site:yourdomain.com — with no space after the colon. That asks Google to list what it currently holds for your domain.",
      },
      {
        type: "table",
        head: ["What you see", "What it means", "Go to"],
        rows: [
          ["No results at all", "Nothing is indexed", "Reasons 1 to 5"],
          ["Homepage only", "Crawling is blocked, or discovery is failing", "Reasons 3 and 4"],
          ["All your pages listed", "A ranking problem, not an indexing one", "Reasons 6 to 9"],
        ],
      },
      {
        type: "p",
        text: "Then open Search Console and put a single page URL through the URL Inspection tool. It will tell you plainly whether that page is indexed and, if not, why not. Everything below is faster once you have that answer.",
      },

      { type: "h2", text: "1. The site is simply too new" },
      {
        type: "p",
        text: "A brand new domain with no inbound links takes anywhere from a few days to a few weeks to be crawled and indexed properly. There is no fee to pay and no button that skips the queue. Submit the sitemap in Search Console, request indexing on the pages that matter, and give it time.",
      },
      {
        type: "p",
        text: "If it has been more than three weeks and nothing at all is indexed, it is not patience you need. It is one of the next four.",
      },

      { type: "h2", text: "2. A noindex tag shipped with the site" },
      {
        type: "p",
        text: "This is the most common cause I find, and it is almost always accidental. The site was built on a staging domain, the developer told search engines to stay away, and that setting travelled to production with everything else.",
      },
      {
        type: "p",
        text: "In WordPress it is one checkbox: Settings, Reading, Discourage search engines from indexing this site. On a custom build it is a meta tag or an HTTP header. View the page source and search for the word noindex. If it is there, that is your answer, and the fix takes ninety seconds.",
      },
      {
        type: "quote",
        text: "I have found a sitewide noindex on a live, trading business more than once. In one case it had been there for eight months while the company paid every month for content nobody could ever find.",
      },

      { type: "h2", text: "3. robots.txt is blocking the crawler" },
      {
        type: "p",
        text: "Visit yourdomain.com/robots.txt. You are looking for a rule that disallows everything.",
      },
      {
        type: "code",
        lang: "robots.txt",
        code: "# this blocks the entire site\nUser-agent: *\nDisallow: /\n\n# this is what a normal site looks like\nUser-agent: *\nAllow: /\n\nSitemap: https://example.com/sitemap.xml",
      },
      {
        type: "p",
        text: "Worth knowing: robots.txt controls crawling, not indexing. A blocked page can still surface as a bare URL with no description, which is why a site sometimes looks half-present. It also means robots.txt is the wrong tool for hiding a page — that is what noindex is for, and the two cancel each other out. If a page is blocked in robots.txt, Google never crawls it, so it never sees the noindex.",
      },

      { type: "h2", text: "4. Nothing links to the page, and there is no sitemap" },
      {
        type: "p",
        text: "Google finds pages by following links. A page that no menu, no footer and no other page links to, and that appears in no sitemap, is invisible in a very literal sense.",
      },
      {
        type: "p",
        text: "Generate a sitemap, make sure it lists only the URLs you actually want indexed, reference it in robots.txt and submit it in Search Console. Then check that every important page can be reached by clicking from the homepage in three steps or fewer.",
      },

      { type: "h2", text: "5. Search Console was never set up" },
      {
        type: "p",
        text: "This does not cause the problem, but it guarantees you stay blind to it. Search Console is free, takes ten minutes to verify, and is the only place Google tells you directly what it thinks of your site. If you are guessing about indexing, you are guessing by choice.",
      },

      { type: "h2", text: "6. You are indexed, but not for anything anyone searches" },
      {
        type: "p",
        text: "If site: shows your pages, the site is fine and the writing is the problem. A page headed Welcome to Our Company, followed by two paragraphs about excellence and synergy, contains none of the words a customer would actually type.",
      },
      {
        type: "p",
        text: "Open the Performance report in Search Console and look at the queries you already receive impressions for. That is Google telling you what it currently believes each page is about. If the answer surprises you, rewrite the page around the words you want instead.",
      },

      { type: "h2", text: "7. You are ranking, just not on the first page" },
      {
        type: "p",
        text: "People test by searching a competitive phrase and scanning the top few results. Position 34 feels identical to not existing, but it is a very different starting point — you are in the race and need to move up, rather than needing to be admitted at all.",
      },
      {
        type: "p",
        text: "Look for pages sitting between positions 8 and 20. Those are where better titles, stronger internal links and a genuine content upgrade pay back fastest, because you are moving a page that Google already considers relevant.",
      },

      { type: "h2", text: "8. Your competitors are simply stronger" },
      {
        type: "p",
        text: "Sometimes nothing is broken. You have a three-page site six months old and you are trying to outrank businesses with a decade of coverage and thousands of links behind them. No technical fix closes that gap.",
      },
      {
        type: "p",
        text: "The way through is specificity. You will not win web design. You may well win the narrower, more commercial phrases that describe exactly what you do and who you do it for, and those convert better anyway.",
      },

      { type: "h2", text: "9. It is a map problem, not a website problem" },
      {
        type: "p",
        text: "If people are searching for a service near them, the result that matters is the map pack, and that is driven by your Google Business Profile rather than your site. An unverified profile, a primary category that does not match the business, or an address that differs from the one on your website will each keep you out of it.",
      },
      {
        type: "p",
        text: "Make the business name, address and phone number identical everywhere they appear — website, profile, directories, invoices. Inconsistency here is quietly expensive in the UAE, where plenty of businesses list a landline in one place and a mobile in another and never think about it again.",
      },

      { type: "h2", text: "The short version" },
      {
        type: "ul",
        items: [
          "Run site:yourdomain.com first — it splits the problem in two",
          "Check for a stray noindex before anything else",
          "Read robots.txt with your own eyes",
          "Submit a clean sitemap and verify Search Console",
          "If you are indexed, it is a content and competition problem, not a technical one",
          "Service searches near you are won on the Business Profile, not the site",
        ],
      },
      {
        type: "p",
        text: "If you have worked through this and still cannot tell which problem you have, send me the URL. Ten minutes with Search Console usually settles it.",
      },
    ],
  },

  {
    slug: "emails-going-to-spam-spf-dkim-dmarc",
    title: "Why your emails go to spam, and the three DNS records that fix it",
    excerpt:
      "SPF, DKIM and DMARC explained without the acronym soup — what each one does, how to set them up in the right order, and the non-DNS reasons mail still lands in junk.",
    date: "2026-09-11",
    readingMinutes: 10,
    tag: "Email",
    tags: ["Email", "DNS", "IT Infrastructure"],
    body: [
      {
        type: "p",
        text: "A client sends a quotation. The customer never replies. Two weeks later it turns out the quotation was sitting in junk the entire time, along with the invoice and the two follow-ups. Nobody did anything wrong, and the business lost the job.",
      },
      {
        type: "p",
        text: "Almost every time I look at this, the cause is the same: the domain has never been told to vouch for its own mail. Three DNS records fix it. They are not difficult, but the order matters and the middle one is where people give up.",
      },

      { type: "h2", text: "What the receiving server is actually asking" },
      {
        type: "p",
        text: "When mail arrives claiming to be from your domain, the receiving server has one question: can this be verified? Anyone in the world can put your address in the From field. Without proof, a cautious server has to treat your mail as possibly forged, and possibly forged means junk.",
      },
      {
        type: "p",
        text: "The three records answer that question from three different angles.",
      },
      {
        type: "table",
        head: ["Record", "The question it answers", "Where it lives"],
        rows: [
          ["SPF", "Is this server allowed to send for the domain?", "TXT record on the domain"],
          ["DKIM", "Has the message been altered in transit?", "TXT record on a selector subdomain"],
          ["DMARC", "What should happen when the first two fail?", "TXT record on _dmarc"],
        ],
      },

      { type: "h2", text: "SPF — the list of who may send" },
      {
        type: "p",
        text: "SPF is a published list of the servers permitted to send mail using your domain. Your mail provider, your CRM, your invoicing system, your website contact form — anything that sends on your behalf needs to be in it.",
      },
      {
        type: "code",
        lang: "DNS",
        code: "; one TXT record on the root domain\nexample.com.  TXT  \"v=spf1 include:_spf.google.com include:sendgrid.net ~all\"",
      },
      {
        type: "p",
        text: "Two rules people break constantly. First, you may have exactly one SPF record per domain — two records is not stricter, it is invalid, and it fails outright. Second, SPF evaluation is capped at ten DNS lookups, and every include: counts. Stack up enough services and you silently break the record you were trying to fix.",
      },
      {
        type: "p",
        text: "End it with ~all, which means treat anything else as suspicious. Use -all, a hard fail, only once you are certain the list is complete.",
      },

      { type: "h2", text: "DKIM — the signature" },
      {
        type: "p",
        text: "DKIM signs each outgoing message with a private key held by your mail provider. The matching public key sits in your DNS. The receiving server checks the signature, and in doing so confirms both that the message really came from your provider and that nothing was changed along the way.",
      },
      {
        type: "p",
        text: "You do not write this record by hand. You enable DKIM in your mail provider, it gives you a hostname and a value, and you paste them into DNS. Google Workspace, Microsoft 365 and every serious sending platform all have a one-page guide for it.",
      },
      {
        type: "p",
        text: "This is the step that most often gets skipped, because it has to be done separately for each service that sends mail. Doing it for your mailbox provider and not for your invoicing platform leaves half your mail unsigned.",
      },

      { type: "h2", text: "DMARC — the instruction" },
      {
        type: "p",
        text: "SPF and DKIM produce a verdict. DMARC tells the receiving server what to do with it, and asks for reports so you can see who is sending as you.",
      },
      {
        type: "code",
        lang: "DNS",
        code: "_dmarc.example.com.  TXT  \"v=DMARC1; p=none; rua=mailto:dmarc@example.com; adkim=s; aspf=s\"",
      },
      {
        type: "p",
        text: "Start at p=none. That changes nothing about delivery and simply turns on the reports. Read them for two or three weeks until you recognise every legitimate sender. Then move to p=quarantine, and later to p=reject once nothing legitimate is failing.",
      },
      {
        type: "p",
        text: "Going straight to p=reject is how people delete their own invoices. The reporting period is not optional caution, it is the part that tells you what you forgot.",
      },

      { type: "h2", text: "The reasons that are not DNS" },
      {
        type: "p",
        text: "Authentication gets you considered. It does not get you delivered. If mail still lands in junk with all three records passing, look here.",
      },
      {
        type: "ul",
        items: [
          "Sending from a free address in the From field — a From of yourbusiness@gmail.com sent through a marketing platform can never authenticate properly",
          "A brand new domain sending in volume from day one, with no sending history at all",
          "Bought or scraped recipient lists, which generate complaints and hard bounces immediately",
          "A shared sending IP on cheap hosting, where your reputation is somebody else's behaviour",
          "Mail that looks like a campaign — one large image, a tracking pixel, a link shortener and almost no text",
          "No unsubscribe link on anything resembling bulk mail",
        ],
      },
      {
        type: "p",
        text: "The single biggest improvement for most small businesses is separating the two streams. Transactional mail — quotations, invoices, order confirmations, password resets — should not leave from the same place as newsletters. Marketing complaints should never be able to damage the delivery of an invoice.",
      },

      { type: "h2", text: "How to check your work" },
      {
        type: "p",
        text: "Send a message to a mail-testing service, which will report the authentication results and a spam score. Then send one to an account you control on a different provider, open the full message headers and look for three lines reading spf=pass, dkim=pass and dmarc=pass. Anything else is a lead to follow.",
      },
      {
        type: "p",
        text: "Check every system that sends on your behalf, not just the mailbox. Website forms are the usual blind spot — this site routes its contact form through Cloudflare Email Routing rather than a third-party provider precisely so there is one less unauthenticated sender to keep track of.",
      },

      { type: "h2", text: "The short version" },
      {
        type: "ul",
        items: [
          "One SPF record, listing every sender, under ten lookups, ending in ~all",
          "DKIM enabled separately on every service that sends as you",
          "DMARC at p=none first, read the reports, then tighten",
          "Never send business mail from a free address through a platform",
          "Keep invoices and newsletters on separate sending paths",
          "Verify in the message headers, not by hoping",
        ],
      },
      {
        type: "p",
        text: "If your mail is going to junk and you would rather not spend an afternoon in DNS, send me the domain. The diagnosis is usually visible within a few minutes.",
      },
    ],
  },
  {
    slug: "what-a-website-costs-in-dubai",
    title: "What a website actually costs in Dubai, itemised",
    excerpt:
      "Quotes for the same brief range from AED 1,500 to AED 80,000. Here is where the money genuinely goes, what the cheap end leaves out, and what it costs to keep running.",
    date: "2026-09-08",
    readingMinutes: 9,
    tag: "Business",
    tags: ["Business", "Web Development", "Pricing"],
    body: [
      {
        type: "p",
        text: "Ask five agencies in Dubai to quote the same eight-page company website and you will get five numbers that do not appear to describe the same job. I have seen AED 1,500 and AED 80,000 quoted for briefs that were, on paper, identical.",
      },
      {
        type: "p",
        text: "That spread is not really about profit margin. It is about what is silently included and what is silently left out. Here is the itemised version, so you can read a quote properly.",
      },

      { type: "h2", text: "What you are actually buying" },
      {
        type: "p",
        text: "A website is five separate pieces of work that often arrive bundled under one line item:",
      },
      {
        type: "ul",
        items: [
          "Design — the layout, the type, the visual system, and the decisions about what goes where",
          "Content — the words, the photography, the product data, translated if you need Arabic",
          "Build — turning that into a working, responsive, accessible site on a real platform",
          "Integrations — payments, CRM, booking, stock, shipping, whatever the business runs on",
          "Setup — hosting, domain, SSL, email, analytics, Search Console, backups",
        ],
      },
      {
        type: "p",
        text: "A cheap quote is almost never cheaper labour. It is fewer of these five, usually design and content, on the quiet assumption that you will supply them.",
      },

      { type: "h2", text: "The three tiers, roughly" },
      {
        type: "table",
        head: ["Tier", "Typical range", "What it genuinely covers"],
        rows: [
          [
            "Template build",
            "AED 4,500 – 12,000",
            "Existing theme, your content, up to about ten pages, contact form, basic SEO setup",
          ],
          [
            "Custom marketing site",
            "AED 12,000 – 35,000",
            "Original design, CMS your team can use, content structure, performance and SEO built in",
          ],
          [
            "Store or application",
            "AED 35,000+",
            "WooCommerce or custom build, payment gateway, integrations, user accounts, ongoing work",
          ],
        ],
      },
      {
        type: "p",
        text: "My own builds start at AED 4,500 and most company sites land in the middle band. Anything materially below the bottom of that first row is either a template with your logo dropped in, or work that is about to be subcontracted to somebody you will never speak to.",
      },

      { type: "h2", text: "Where the money goes" },
      {
        type: "p",
        text: "On a typical custom marketing site, the split is roughly a third design, a third build, and a third everything else — content structure, integrations, testing, SEO groundwork and launch. People consistently underestimate that last third, which is precisely the part that determines whether the site earns anything.",
      },
      {
        type: "p",
        text: "Content is the item that derails most projects. A beautiful build waiting four months for product descriptions costs the client far more than the design did, and it is nobody's fault but it is always somebody's budget.",
      },

      { type: "h2", text: "What the cheap quote leaves out" },
      {
        type: "p",
        text: "Not always deliberately. But when a quote comes in far below the others, check specifically for these:",
      },
      {
        type: "ul",
        items: [
          "Who writes the content — if it is you, factor in your own weeks",
          "Whether hosting is included, for how long, and on whose account",
          "Whether the domain is registered in your name or the developer's",
          "Whether you receive admin access and the source files at handover",
          "Whether responsiveness on real phones is tested, or merely claimed",
          "What happens after launch, and at what rate",
        ],
      },
      {
        type: "quote",
        text: "The expensive version of a cheap website is the one where the developer owns the domain, owns the hosting, and stops answering messages. I have migrated several of those. Recovering a domain you do not control costs more than the original build did.",
      },

      { type: "h2", text: "The part nobody quotes for: keeping it running" },
      {
        type: "p",
        text: "A website is not a purchase, it is a subscription with a large joining fee. The recurring costs are modest, but they exist whether or not anybody budgeted for them.",
      },
      {
        type: "table",
        head: ["Item", "Typical cost", "Notes"],
        rows: [
          ["Domain", "AED 50 – 200 per year", "Register it yourself, in the company name"],
          ["Hosting", "AED 300 – 3,000 per year", "Shared at the bottom, managed at the top"],
          ["SSL certificate", "Usually free", "If someone is billing you for this, ask why"],
          ["Maintenance", "From AED 750 per month", "Updates, backups, monitoring, small fixes"],
          ["SEO", "From AED 2,500 per month", "Optional, and only worth it with a real plan"],
        ],
      },
      {
        type: "p",
        text: "Maintenance is the line item people cut first and regret most. An unpatched WordPress site is not stable, it is simply not yet compromised.",
      },

      { type: "h2", text: "What genuinely makes a project cost more" },
      {
        type: "ul",
        items: [
          "Arabic as a real second language, with right-to-left layout — not a translation plugin",
          "Payment gateways and the compliance around them",
          "Connecting to a CRM or an accounting system that was never designed to be connected to",
          "Migrating an existing site without losing rankings, which is a project in itself",
          "More than about five approvers, which costs in revision rounds rather than in code",
        ],
      },

      { type: "h2", text: "How to compare two quotes fairly" },
      {
        type: "p",
        text: "Ask every bidder the same four questions and the price differences usually explain themselves: who writes the content, who owns the domain and hosting, what happens in month two, and what the site is expected to do for the business.",
      },
      {
        type: "p",
        text: "That last question is the one that matters. A site that needs to generate enquiries is a different engineering problem from a site that needs to exist because the trade licence is being renewed. Both are legitimate. They should not cost the same.",
      },

      { type: "h2", text: "The short version" },
      {
        type: "ul",
        items: [
          "Template build, AED 4,500 – 12,000. Custom site, AED 12,000 – 35,000. Store or app, AED 35,000 and up",
          "Cheap quotes are usually missing design, content, or both",
          "Register the domain yourself, in the company name, today",
          "Budget from AED 750 a month for maintenance before you sign anything",
          "Content is the schedule risk, not the build",
        ],
      },
      {
        type: "p",
        text: "If you have a quote in front of you and cannot tell what it includes, send it over. I will tell you what is missing, whether or not you end up working with me.",
      },
    ],
  },

  {
    slug: "core-web-vitals-wordpress-without-a-plugin",
    title: "Fixing Core Web Vitals on WordPress without buying another plugin",
    excerpt:
      "LCP, INP and CLS in plain English, why the plugin you just installed made it worse, and the handful of changes that actually move the numbers.",
    date: "2026-09-04",
    readingMinutes: 11,
    tag: "Performance",
    tags: ["Performance", "WordPress", "Core Web Vitals"],
    body: [
      {
        type: "p",
        text: "The usual sequence: PageSpeed Insights returns a red score, somebody installs an optimisation plugin, the score moves by four points, and a fortnight later the site has an extra plugin, a broken layout on mobile and the same problem.",
      },
      {
        type: "p",
        text: "Core Web Vitals are three specific measurements of how a page feels to a real person. Once you know which one is failing and why, the fixes are usually small, specific and permanent.",
      },

      { type: "h2", text: "The three numbers" },
      {
        type: "table",
        head: ["Metric", "What it measures", "Good"],
        rows: [
          ["LCP", "How long until the main content appears", "Under 2.5 seconds"],
          ["INP", "How quickly the page responds when tapped", "Under 200 milliseconds"],
          ["CLS", "How much the layout jumps while loading", "Under 0.1"],
        ],
      },
      {
        type: "p",
        text: "They fail for entirely different reasons. Treating them as one score called speed is why generic optimisation plugins disappoint.",
      },

      { type: "h2", text: "First, check the right data" },
      {
        type: "p",
        text: "There are two kinds of measurement and people constantly argue using the wrong one. Lab data — a Lighthouse run on your machine — is a simulation. Field data is what real visitors experienced over the past 28 days, and it is the only thing Google uses.",
      },
      {
        type: "p",
        text: "Look at the field data section at the top of PageSpeed Insights, or the Core Web Vitals report in Search Console. A site can score 62 in the lab and pass in the field, because your visitors are on better connections than the simulation assumes. Fix what real people experience.",
      },
      {
        type: "p",
        text: "One consequence worth knowing: field data lags by weeks. Do not judge a fix the same afternoon you ship it.",
      },

      { type: "h2", text: "LCP — almost always one image or a slow server" },
      {
        type: "p",
        text: "The largest element on screen is usually the hero image. LCP fails when that image is enormous, loaded late, or arriving from a server that took a second to start replying.",
      },
      {
        type: "ul",
        items: [
          "Serve the hero at the size it is displayed. A 4,000 pixel wide photograph in a 1,200 pixel slot is the single most common cause I see",
          "Use a modern format. WebP or AVIF typically saves half the bytes for no visible difference",
          "Do not lazy-load the hero. Lazy loading everything is a plugin default, and on the one image that defines LCP it actively hurts. That image should be eager, and ideally preloaded",
          "Check server response time. If time to first byte is over about 600 milliseconds, no front-end tuning will save you — that is hosting, or an uncached page, or a database problem",
          "Put a CDN in front of it. Cloudflare in front of a Dubai-hosted site is a large win for visitors elsewhere, and free at the entry tier",
        ],
      },
      {
        type: "p",
        text: "Fonts contribute here too. A web font that blocks rendering delays the text version of LCP entirely. Self-host the font, subset it, and set font-display to swap.",
      },

      { type: "h2", text: "INP — this one is JavaScript, every time" },
      {
        type: "p",
        text: "INP measures the delay between a tap and something visibly happening. It fails when the browser is busy running script and cannot respond. On WordPress there are three usual culprits.",
      },
      {
        type: "p",
        text: "Page builders ship a great deal of JavaScript for animations, and a great deal more for features the page does not use. A builder-heavy theme can load half a megabyte of script to display a page of text.",
      },
      {
        type: "p",
        text: "Third-party tags are the second. Tag Manager containing a chat widget, two analytics platforms, a heatmap tool and three advertising pixels will make any site feel slow, and none of it is your code. Audit that container. Most have at least one tag nobody remembers adding, for a campaign that finished in 2023.",
      },
      {
        type: "p",
        text: "Third is plugins loading their assets on every page. A contact form plugin has no reason to load on the blog. A slider has no reason to load on the contact page. Conditional loading is more work than installing something, and it is the fix that actually holds.",
      },

      { type: "h2", text: "CLS — things moving after you have started reading" },
      {
        type: "p",
        text: "Layout shift is the cheapest of the three to fix and the most irritating to experience. It has four common causes.",
      },
      {
        type: "ul",
        items: [
          "Images without width and height attributes, so the browser cannot reserve space",
          "Web fonts swapping in at a different size to the fallback, pushing text around",
          "Cookie banners, promotional bars and chat widgets injected at the top of the page after render",
          "Advertisements or embeds in containers with no reserved height",
        ],
      },
      {
        type: "p",
        text: "Give every image explicit dimensions, reserve space for anything injected, and match the fallback font metrics to the web font as closely as you can. That is generally the whole fix.",
      },

      { type: "h2", text: "Why another plugin usually makes it worse" },
      {
        type: "p",
        text: "Optimisation plugins are not useless. A good caching plugin is genuinely valuable. But they work by deferring, combining and minifying assets generically, and generic decisions about specific code break things — a deferred script that another script depended on, a combined stylesheet that changes cascade order, a lazy-loaded hero that costs you the metric you were trying to fix.",
      },
      {
        type: "p",
        text: "You then spend an afternoon adding exclusions until the plugin does almost nothing, and you have added a dependency to get there. Fix the cause where you can, and use caching for what caching is actually good at.",
      },

      { type: "h2", text: "When the theme is the problem" },
      {
        type: "p",
        text: "Sometimes the honest answer is that no amount of tuning will rescue a page built from forty nested builder rows. At that point the choice is a lighter theme, a rebuild of the templates that matter, or accepting the numbers.",
      },
      {
        type: "p",
        text: "That is a business decision, not a technical one. If the site converts well and traffic is healthy, mediocre vitals may be perfectly survivable. If you are competing on local search against faster competitors, it is not.",
      },

      { type: "h2", text: "The short version" },
      {
        type: "ul",
        items: [
          "Use field data, not a Lighthouse score, and wait weeks before judging a fix",
          "LCP is the hero image or the server, almost without exception",
          "Never lazy-load the largest image on the page",
          "INP is JavaScript — audit the tag manager before you touch the theme",
          "CLS is missing dimensions and things injected after render",
          "Fix causes; use caching for caching, not as a cure",
        ],
      },
      {
        type: "p",
        text: "If your Search Console vitals report is red and you want to know which of the three is genuinely costing you, send me the domain and I will read the field data with you.",
      },
    ],
  },

  {
    slug: "hardening-wordpress-without-a-security-plugin",
    title: "Hardening WordPress without a security plugin",
    excerpt:
      "Most WordPress sites are not compromised through clever exploits. They are compromised through an outdated plugin and a weak password — neither of which a security plugin fixes.",
    date: "2026-09-01",
    readingMinutes: 11,
    tag: "Security",
    tags: ["Security", "WordPress", "Cloudflare"],
    body: [
      {
        type: "p",
        text: "Search for WordPress security and you will find a thousand articles recommending the same handful of plugins, most written by people who are paid when you install one. The plugins are not bad. But installing one is a purchase, not a decision, and it adds code with full database access to a site you were worried about.",
      },
      {
        type: "p",
        text: "This is what I actually do, in the order I do it. It costs nothing, adds one plugin at most, and addresses how sites genuinely get compromised.",
      },

      { type: "h2", text: "How sites are actually compromised" },
      {
        type: "p",
        text: "Not by someone targeting your company. By automated scanners working through every WordPress site they can find, testing for four things:",
      },
      {
        type: "ul",
        items: [
          "A plugin or theme with a known, published vulnerability that has not been updated",
          "An administrator password that appears in a leaked credential list",
          "A nulled premium theme or plugin, which frequently ships with a backdoor included",
          "A neighbouring site on the same shared hosting account that was compromised first",
        ],
      },
      {
        type: "p",
        text: "Nothing in that list is exotic, and a firewall plugin meaningfully helps with only part of one of them.",
      },

      { type: "h2", text: "Layer one: updates, on a schedule" },
      {
        type: "p",
        text: "Most compromises exploit a vulnerability that was patched weeks or months earlier. The window between a fix being published and a site being scanned for it is short, because publishing the fix tells attackers exactly where to look.",
      },
      {
        type: "p",
        text: "Enable automatic updates for WordPress core minor releases. Update plugins and themes on a fixed day each month, on a staging copy first and then production. Delete anything deactivated — an inactive plugin sitting in the directory is still code on the server, and it is still exploitable.",
      },
      {
        type: "p",
        text: "Before each round, check whether anything you rely on has been abandoned. A plugin with no update in two years is a liability regardless of whether it currently works.",
      },

      { type: "h2", text: "Layer two: accounts" },
      {
        type: "ul",
        items: [
          "No user named admin, administrator, or the company name",
          "Two-factor authentication on every administrator account, without exception",
          "Least privilege — your content team are Editors, not Administrators. A marketing coordinator does not need to install plugins",
          "Remove accounts for people who left. Check this quarterly; it is always worse than expected",
          "Unique passwords from a manager, never reused from anywhere else",
        ],
      },
      {
        type: "p",
        text: "Two-factor is the highest-value item on this entire page. It makes stolen credentials almost worthless, and it takes ten minutes to roll out.",
      },

      { type: "h2", text: "Layer three: configuration" },
      {
        type: "p",
        text: "A few lines that remove whole categories of risk. In wp-config.php:",
      },
      {
        type: "code",
        lang: "php",
        code: "// no editing theme or plugin files from the dashboard\ndefine('DISALLOW_FILE_EDIT', true);\n\n// no installing or updating from the dashboard at all\n// use this on sites deployed from version control\ndefine('DISALLOW_FILE_MODS', true);\n\n// force the login and admin area over HTTPS\ndefine('FORCE_SSL_ADMIN', true);",
      },
      {
        type: "p",
        text: "The first one matters more than it looks. Dashboard file editing turns a single stolen administrator password into arbitrary code execution on your server. There is no good reason to leave it enabled on a production site.",
      },
      {
        type: "p",
        text: "Then stop PHP executing inside the uploads directory. If someone does manage to upload a file, this is what stops it from being a shell.",
      },
      {
        type: "code",
        lang: "apache",
        code: "# wp-content/uploads/.htaccess\n<Files *.php>\n  deny from all\n</Files>",
      },
      {
        type: "p",
        text: "Also disable XML-RPC unless you genuinely use the mobile app or Jetpack. It is the standard route for brute-force amplification, because it lets an attacker test hundreds of passwords in a single request.",
      },
      {
        type: "p",
        text: "File permissions should be 644 for files and 755 for directories. If anything is 777, that is not a configuration, it is somebody who was in a hurry.",
      },

      { type: "h2", text: "Layer four: the edge" },
      {
        type: "p",
        text: "This is where a plugin is genuinely the wrong tool. A security plugin inspects requests after WordPress has already booted, loaded PHP and connected to the database. Blocking at the edge means the request never reaches your server at all.",
      },
      {
        type: "p",
        text: "On Cloudflare, at the free tier, three rules cover most of it:",
      },
      {
        type: "ul",
        items: [
          "Rate limit requests to /wp-login.php — a handful per minute per address is generous for humans and fatal for scanners",
          "Challenge or block traffic to /xmlrpc.php entirely",
          "If your team is all in one country, challenge administrator access from everywhere else",
        ],
      },
      {
        type: "p",
        text: "That last rule alone removes the overwhelming majority of automated login attempts against a typical UAE business site, and it costs nothing.",
      },

      { type: "h2", text: "Layer five: backups you have actually restored" },
      {
        type: "p",
        text: "Every host offers backups. Very few businesses have ever tested one. A backup you have not restored is a belief, not a safeguard.",
      },
      {
        type: "ul",
        items: [
          "Daily, automated, including both files and database",
          "Stored somewhere other than the server being backed up — a compromised host takes its own backups with it",
          "Retained long enough to predate a slow compromise, which means at least thirty days",
          "Restored to a staging site once, deliberately, so you know the procedure and how long it takes",
        ],
      },
      {
        type: "quote",
        text: "The worst call I take is not the one about a hacked site. It is the one where the site is hacked, the backups were running to the same server, and the last clean copy is from whenever somebody happened to download a ZIP.",
      },

      { type: "h2", text: "The one plugin worth having" },
      {
        type: "p",
        text: "Everything above is prevention. The gap it leaves is detection — knowing that something has changed. For that, a plugin that monitors file integrity and scans for malware earns its place, because it tells you within hours rather than when a customer reports a warning in their browser.",
      },
      {
        type: "p",
        text: "Choose one that does that job, rather than a suite that also wants to handle your firewall, your logins, your CDN and your backups. Narrow tools are easier to trust.",
      },

      { type: "h2", text: "The short version" },
      {
        type: "ul",
        items: [
          "Patch on a schedule and delete what you are not using",
          "Two-factor on every administrator, and nobody is called admin",
          "DISALLOW_FILE_EDIT, no PHP in uploads, XML-RPC off",
          "Block at the edge with Cloudflare rules, not inside PHP",
          "Off-site backups you have restored at least once",
          "One plugin, for detection only",
        ],
      },
      {
        type: "p",
        text: "This covers the site. The office around it — laptops, accounts, network, the things that cause weekend emergencies — is a separate afternoon, and I have written that one up as well.",
      },
    ],
  },
  {
    slug: "woocommerce-speed-what-actually-works",
    title: "WooCommerce speed: what actually works, from maintaining real stores",
    excerpt:
      "A store is not a brochure site with a cart bolted on. The pages that matter most cannot be cached, which changes every optimisation decision you make.",
    date: "2026-08-28",
    readingMinutes: 10,
    tag: "Performance",
    tags: ["Performance", "WooCommerce", "WordPress"],
    body: [
      {
        type: "p",
        text: "Most WooCommerce speed advice is WordPress speed advice with the word store added. It is not wrong, but it misses the thing that makes a store different: the pages that decide whether you get paid cannot be cached.",
      },
      {
        type: "p",
        text: "Cart, checkout and account pages are unique to each visitor. A full-page cache has to skip them, which means every one of those requests runs the full PHP and database stack, every time. Your homepage can be served in 40 milliseconds from cache while checkout takes two seconds, and only one of those numbers costs you revenue.",
      },

      { type: "h2", text: "Measure before you change anything" },
      {
        type: "p",
        text: "Install Query Monitor on staging and load a product page, then the cart, then checkout. It reports the number of database queries, the slowest ones, the PHP time and which plugin is responsible for each.",
      },
      {
        type: "p",
        text: "This takes ten minutes and it usually ends the debate outright. A checkout running 400 queries has a plugin problem, not a hosting problem, and no amount of upgrading the server will hide it for long.",
      },

      { type: "h2", text: "Cart fragments, the classic WooCommerce tax" },
      {
        type: "p",
        text: "Woo keeps the cart total in the header current using an AJAX request called cart fragments. It fires on page load, it cannot be cached, and on a busy store it becomes the single most requested endpoint on the site.",
      },
      {
        type: "p",
        text: "If your header does not display a live cart count — and many store designs do not — that request is pure cost. Dequeue the script on pages where it is not needed, or all of them if the design never shows it. On stores where checkout felt slow under load, this has been the largest single win I have made.",
      },
      {
        type: "p",
        text: "Be careful rather than clever here. If the cart count is visible in the header, removing fragments will make it stale, and a customer who cannot see that an item was added will add it twice.",
      },

      { type: "h2", text: "Autoloaded options — the invisible weight" },
      {
        type: "p",
        text: "WordPress loads every option marked autoload on every single request. Plugins write to that table freely, and uninstalled plugins frequently leave their entries behind.",
      },
      {
        type: "p",
        text: "Check the total size of autoloaded data. Under about 800 kilobytes is healthy. I have opened stores carrying five megabytes, loaded on every request including checkout, most of it left by plugins that were removed years earlier.",
      },
      {
        type: "code",
        lang: "sql",
        code: "SELECT SUM(LENGTH(option_value))/1024 AS autoload_kb\nFROM wp_options WHERE autoload = 'yes';\n\n-- the worst offenders\nSELECT option_name, LENGTH(option_value)/1024 AS kb\nFROM wp_options WHERE autoload = 'yes'\nORDER BY LENGTH(option_value) DESC LIMIT 20;",
      },
      {
        type: "p",
        text: "Read the list before deleting anything, and take a backup first. Some large entries are legitimate.",
      },

      { type: "h2", text: "Expired transients and a bloated options table" },
      {
        type: "p",
        text: "Transients are cached values with an expiry, and WordPress is unreliable about clearing them. On stores with pricing or shipping plugins I regularly find hundreds of thousands of expired rows in wp_options, which slows every query against that table.",
      },
      {
        type: "p",
        text: "Clear expired transients on a schedule. If the table is already enormous, clear it once manually and then keep it clean, rather than letting it rebuild.",
      },

      { type: "h2", text: "Object caching, which stores benefit from most" },
      {
        type: "p",
        text: "A page cache stores finished HTML. An object cache stores the results of individual database queries, in memory, so repeated queries never touch the database. Because store pages are largely uncacheable as pages, this is where the gain is.",
      },
      {
        type: "p",
        text: "Redis with a persistent object cache is the standard answer, and most managed WordPress hosts in the region offer it as a switch. On a store with a large catalogue it is frequently the difference between checkout at two seconds and checkout at half a second.",
      },

      { type: "h2", text: "The orders table" },
      {
        type: "p",
        text: "Historically Woo stored orders as posts, alongside your pages and products, which meant a store with 80,000 orders was querying a table with hundreds of thousands of rows for routine work. High-Performance Order Storage moves orders into their own properly indexed tables.",
      },
      {
        type: "p",
        text: "If you are on a recent Woo version and have not migrated, plan it. Test on staging first — some older extensions are not compatible, and that is exactly the kind of thing you want to discover before a weekend rather than during one.",
      },

      { type: "h2", text: "Plugins, honestly audited" },
      {
        type: "p",
        text: "Stores accumulate extensions. A shipping calculator, a currency switcher, a wishlist, a reviews platform, an abandoned-cart tool, three tracking pixels and a live chat widget is an ordinary inventory, and every one of them loads on every page unless told otherwise.",
      },
      {
        type: "ul",
        items: [
          "Sort by PHP time in Query Monitor and start at the top",
          "Load assets conditionally — a shipping calculator has no business on the blog",
          "Replace anything abandoned, because it is a security problem as well as a speed one",
          "Remove anything installed for a campaign that has finished",
        ],
      },

      { type: "h2", text: "Images, since catalogues are mostly images" },
      {
        type: "p",
        text: "Product photography arrives from suppliers at print resolution and gets uploaded untouched. Serve modern formats, generate sensible sizes, lazy-load everything below the fold — and never lazy-load the main product image, which is almost always the LCP element.",
      },

      { type: "h2", text: "What not to do" },
      {
        type: "ul",
        items: [
          "Do not full-page cache cart, checkout or account. Customers will see each other's carts, and eventually each other's details",
          "Do not minify and combine every script blindly. Gateway and shipping scripts break in ways that only appear at the final step",
          "Do not judge a store by a homepage PageSpeed score. Test the product page and the checkout",
          "Do not upgrade hosting to escape a plugin problem. It buys about six months",
        ],
      },

      { type: "h2", text: "Symptom to cause" },
      {
        type: "table",
        head: ["Symptom", "Usual cause", "First thing to try"],
        rows: [
          ["Homepage fast, checkout slow", "Uncacheable pages, no object cache", "Redis object caching"],
          ["Slow under traffic, fine when quiet", "Cart fragments, admin-ajax load", "Dequeue fragments where unused"],
          ["Everything slow, including admin", "Bloated options or orders table", "Audit autoload, migrate to HPOS"],
          ["Slow only on product pages", "Oversized images, review or variation plugins", "Query Monitor on that template"],
        ],
      },

      { type: "h2", text: "The short version" },
      {
        type: "ul",
        items: [
          "Measure checkout, not the homepage",
          "Object caching matters more than page caching on a store",
          "Cart fragments are the most common easy win",
          "Check autoloaded options and expired transients",
          "Migrate to HPOS, on staging first",
          "Never cache the pages where money changes hands",
        ],
      },
      {
        type: "p",
        text: "If your checkout is slow and you are not sure whether it is the host, the plugins or the database, that is a one-hour diagnosis. Send me the store and I will tell you which.",
      },
    ],
  },

  {
    slug: "redesign-without-losing-rankings",
    title: "How to redesign a website without losing your rankings",
    excerpt:
      "The fastest way to lose half your traffic overnight is a beautiful new website. Here is the migration process that prevents it, in the order it has to happen.",
    date: "2026-08-25",
    readingMinutes: 10,
    tag: "SEO",
    tags: ["SEO", "Migration", "Web Development"],
    body: [
      {
        type: "p",
        text: "A company spends four months and a serious budget on a new website. It launches. Within a fortnight, enquiries have halved. The site looks better than it ever has and it is performing worse than the one it replaced.",
      },
      {
        type: "p",
        text: "This is entirely preventable, and it is prevented almost entirely before launch. Once the old site is gone, your options narrow considerably.",
      },

      { type: "h2", text: "Before anything: record what you currently have" },
      {
        type: "p",
        text: "You cannot tell what you lost if you never wrote down what you had. Capture all of this while the old site is still live:",
      },
      {
        type: "ul",
        items: [
          "A full crawl of every URL, with its title, meta description, headings and status code",
          "Your top 100 pages by organic traffic from Search Console, over the last twelve months",
          "Every query bringing meaningful impressions, with its current position",
          "Traffic and conversion baselines by month, so seasonality does not get blamed later",
          "Every page with inbound links from other websites, which are the ones you truly cannot afford to break",
        ],
      },
      {
        type: "p",
        text: "Export it and keep it. This becomes your checklist on launch day and your evidence a month later.",
      },

      { type: "h2", text: "Keep the URLs if you possibly can" },
      {
        type: "p",
        text: "The safest migration changes the design and not the addresses. Every URL you keep is a redirect you do not have to write, a link you do not risk breaking and a ranking you do not put in play.",
      },
      {
        type: "p",
        text: "URLs are changed far more often than necessary — usually because a new platform has different conventions, or because someone wants a tidier structure. Neither is worth traffic. If the old structure is genuinely harmful, change it deliberately as its own project, not quietly inside a redesign.",
      },

      { type: "h2", text: "If URLs must change, map them one to one" },
      {
        type: "p",
        text: "Every old URL needs a 301 redirect to the single most equivalent new page. Not to a category. Not to the homepage.",
      },
      {
        type: "p",
        text: "Redirecting everything that no longer exists to the homepage is the most common mistake in this entire process. Google treats those as soft 404s, passes nothing on, and you lose the page and its links. If there is genuinely no equivalent page, a 410 and a helpful 404 page is the better answer.",
      },
      {
        type: "ul",
        items: [
          "One hop only — old URL straight to final URL, never a chain through two other addresses",
          "301, not 302. A temporary redirect signals that you intend to change your mind",
          "Include the awkward ones: old parameter URLs, uppercase variants, the trailing-slash forms",
          "Test the map against your crawl export before launch, not after",
        ],
      },

      { type: "h2", text: "Do not quietly delete the content" },
      {
        type: "p",
        text: "Redesigns almost always shorten the copy. A 1,400-word service page that ranked becomes a 200-word page with a large photograph, because the new design is cleaner. The design is cleaner. The page now says almost nothing, and it ranks accordingly.",
      },
      {
        type: "p",
        text: "If a page performs well, the new version needs to cover the same ground. You can restructure it, you can write it better, but the substance has to survive the visual upgrade.",
      },
      {
        type: "quote",
        text: "The most expensive sentence in a redesign kick-off is: the old site had too much text on it. Sometimes true. Frequently it means the pages that earned the traffic are about to be deleted.",
      },

      { type: "h2", text: "Carry the technical details across" },
      {
        type: "ul",
        items: [
          "Title tags and meta descriptions for pages that already rank — copy them, do not regenerate them",
          "Heading structure, so the new page is still about what the old page was about",
          "Structured data: organisation, products, reviews, FAQs, local business details",
          "Internal links, including the ones in old body copy that a new template silently drops",
          "Canonical tags pointing at the new self-referencing URL",
          "Language and region tags, if the site serves Arabic and English",
          "Image filenames and alt text, if image search sends you anything",
        ],
      },

      { type: "h2", text: "The single most common disaster" },
      {
        type: "p",
        text: "The staging site was blocked from search engines, correctly. That block goes live with the launch.",
      },
      {
        type: "p",
        text: "The site looks perfect, everyone celebrates, and it quietly deindexes over the following fortnight. Removing that block is the first item on the launch checklist, and it should be verified by a second person looking at the live page source, not by asking whether someone remembered.",
      },

      { type: "h2", text: "Launch day, in order" },
      {
        type: "ul",
        items: [
          "Remove the noindex and the staging robots.txt block, then confirm in the live page source",
          "Verify redirects are firing, by running your old URL export through a crawler against production",
          "Check the canonical tags on a sample of pages resolve to themselves",
          "Submit the new sitemap in Search Console, and leave the old one in place for a few weeks so Google recrawls the old URLs and discovers the redirects",
          "Confirm analytics and conversion tracking still fire — new templates break tags constantly",
          "Crawl the whole site for broken internal links and unintended 404s",
        ],
      },

      { type: "h2", text: "What normal looks like afterwards" },
      {
        type: "table",
        head: ["Period", "Expected", "Cause for concern"],
        rows: [
          ["Week 1", "Rankings fluctuate, some pages drop", "Pages returning 404 or 500"],
          ["Weeks 2 to 4", "Recovery begins, indexing settles", "Traffic still falling, or indexed pages dropping"],
          ["Weeks 4 to 8", "Back to baseline, often above it", "No recovery at all — audit the redirect map"],
        ],
      },
      {
        type: "p",
        text: "A short dip is normal and expected. A sustained decline after six weeks is a fault, not a settling period, and the redirect map is where I would look first.",
      },
      {
        type: "p",
        text: "Watch the Pages report in Search Console throughout. A rise in Not found or Redirect error tells you precisely which URLs were missed.",
      },

      { type: "h2", text: "The short version" },
      {
        type: "ul",
        items: [
          "Export everything before the old site disappears",
          "Keep the URLs unless you have a strong reason not to",
          "One-to-one 301s, no chains, never a mass redirect to the homepage",
          "Keep the substance of pages that already rank",
          "Remove the staging noindex, and have someone else verify it",
          "Six weeks without recovery means something is broken",
        ],
      },
      {
        type: "p",
        text: "If a redesign is being planned and nobody has mentioned redirects yet, that is the moment to raise it. Afterwards is considerably more expensive.",
      },
    ],
  },
  {
    slug: "getting-cited-by-chatgpt-and-ai-overviews",
    title: "Getting cited by ChatGPT and AI Overviews",
    excerpt:
      "Every client is now asking why the assistant does not mention them. It is not a new discipline, but the emphasis shifts — and some of what works is uncomfortably old-fashioned.",
    date: "2026-08-21",
    readingMinutes: 10,
    tag: "SEO",
    tags: ["SEO", "AI Search", "Schema"],
    body: [
      {
        type: "p",
        text: "The question arrives in roughly this form: I asked ChatGPT for the best supplier in Dubai and it listed four companies and none of them were us. How do we get in there?",
      },
      {
        type: "p",
        text: "It is a fair question and it deserves a straight answer, including the parts that are genuinely uncertain. Anyone selling you a guaranteed method for this is selling you something they cannot deliver.",
      },

      { type: "h2", text: "How these answers are actually assembled" },
      {
        type: "p",
        text: "An assistant answering a question about real businesses is generally not recalling something from training. It is running a search, retrieving a handful of pages, and writing an answer grounded in what those pages say.",
      },
      {
        type: "p",
        text: "That has a useful consequence. The competition is not for a position in a list, it is to be one of the sources retrieved and quoted. Which means most of what already works in search still works — with the emphasis moved.",
      },
      {
        type: "table",
        head: ["Classic SEO", "Still matters?", "Changed emphasis"],
        rows: [
          ["Crawlable, indexable pages", "Yes, entirely", "Now also for non-Google crawlers"],
          ["Keywords in the title", "Somewhat", "Answering the question outright matters more"],
          ["Backlinks", "Yes", "Being mentioned matters, linked or not"],
          ["Structured data", "Yes", "More useful, because it removes ambiguity"],
          ["Ranking position", "Yes", "Being quotable matters alongside ranking"],
        ],
      },

      { type: "h2", text: "Decide which crawlers you allow" },
      {
        type: "p",
        text: "AI systems use their own user agents, and plenty of sites block them without ever having made a decision about it — often through a security plugin's default bot rules, or a Cloudflare setting somebody enabled in a hurry.",
      },
      {
        type: "p",
        text: "You cannot be cited by a system that cannot read you. Check your robots.txt and your edge rules for the agents belonging to the major assistants, and decide deliberately. If you publish original research you may reasonably want to restrict training use while still permitting the retrieval that produces citations — those are frequently separate agents, and the names change, so check current documentation rather than copying a list from a blog post.",
      },
      {
        type: "p",
        text: "For most businesses the decision is simple: you want to be found. Blocking retrieval to protect brochure copy costs you visibility and protects nothing.",
      },

      { type: "h2", text: "Answer the question in the first paragraph" },
      {
        type: "p",
        text: "Pages built to hold a reader's attention — a story, some scene-setting, the answer in the eighth paragraph — are poor source material. A system assembling an answer takes the passage that states the thing plainly.",
      },
      {
        type: "p",
        text: "So state it plainly, early, and then elaborate. Use a clear question as a heading and answer it in the two sentences underneath. This is also better for human readers, who have never enjoyed the eighth paragraph either.",
      },

      { type: "h2", text: "Be unambiguous about who you are" },
      {
        type: "p",
        text: "These systems work with entities — a company, a person, a place — and they need to be confident that the various mentions across the web refer to the same one. Ambiguity is the enemy of a citation.",
      },
      {
        type: "ul",
        items: [
          "Identical business name, address and phone number everywhere — site, Business Profile, directories, social profiles",
          "A real About page stating what the company does, where, since when, and for whom",
          "Organisation or LocalBusiness structured data, with sameAs links to your verified profiles",
          "Named authors with genuine credentials, rather than posts attributed to Admin",
          "A consistent description of the business, rather than three different ones on three pages",
        ],
      },
      {
        type: "p",
        text: "This is dull work. It is also the part most sites fail, and it is entirely within your control.",
      },

      { type: "h2", text: "Publish things that can be quoted" },
      {
        type: "p",
        text: "Vague marketing copy cannot be cited, because there is no fact in it to carry across. Specific statements can.",
      },
      {
        type: "p",
        text: "Concrete numbers, dated observations, comparison tables, clear definitions, step counts, prices where you are willing to publish them. Anything a system can lift as a discrete claim and attribute to you. A comparison table is disproportionately effective here, because it is already structured as an answer.",
      },
      {
        type: "quote",
        text: "The most quotable page I have published was a price list. Not because pricing is interesting, but because it contained specific figures nobody else in the category would state publicly.",
      },

      { type: "h2", text: "Mentions matter, with or without links" },
      {
        type: "p",
        text: "Retrieval-based answers frequently draw on pages about you rather than pages written by you — a directory listing, an industry roundup, a forum thread, a news item, a supplier's customer page.",
      },
      {
        type: "p",
        text: "This makes unlinked mentions considerably more valuable than they were when we only counted links. Getting your business accurately described on sites other than your own is, quietly, the highest-leverage work in this whole area, and it looks a great deal like ordinary public relations.",
      },

      { type: "h2", text: "What about llms.txt?" },
      {
        type: "p",
        text: "There is a proposed convention for a file at the root of a site describing its content for language models, along the lines of robots.txt. It is inexpensive to publish and it may become meaningful.",
      },
      {
        type: "p",
        text: "As things stand, adoption is limited and I have no evidence that it produces citations. Publish it if you like, but treat it as a small bet rather than a strategy, and do not let anyone bill you for it as one.",
      },

      { type: "h2", text: "Measuring it, honestly" },
      {
        type: "p",
        text: "There is no rank tracker for this in the sense people want. What you can do:",
      },
      {
        type: "ul",
        items: [
          "Keep a fixed list of twenty questions a customer might ask, and check them monthly across the major assistants, recording who is cited",
          "Watch referral traffic from assistant domains in analytics — small numbers, but the trend is informative",
          "Track brand searches, which tend to rise when you are being mentioned in answers",
          "Accept that results vary by user, by session and by week, so treat any single result as an anecdote",
        ],
      },

      { type: "h2", text: "The short version" },
      {
        type: "ul",
        items: [
          "Check nothing is blocking assistant crawlers, then decide deliberately",
          "Answer the question in the opening lines, not the eighth paragraph",
          "Remove ambiguity about who you are, everywhere you appear",
          "Publish specific, quotable facts — tables and figures travel best",
          "Being described accurately on other people's sites is the real work",
          "Measure with a fixed question set and modest expectations",
        ],
      },
      {
        type: "p",
        text: "If you want to know why competitors are being cited and you are not, the answer is usually visible within an hour of looking. Send me the business name and the questions you are testing.",
      },
    ],
  },

  {
    slug: "nextjs-app-router-seo",
    title: "Next.js App Router SEO: metadata, sitemaps and OG images that actually work",
    excerpt:
      "Is Next.js SEO friendly is the wrong question. It gives you excellent primitives and then lets you ship a site that renders nothing. Here is the setup I use on every build.",
    date: "2026-08-18",
    readingMinutes: 11,
    tag: "Next.js",
    tags: ["Next.js", "SEO", "React"],
    body: [
      {
        type: "p",
        text: "People ask whether Next.js is good for SEO. The framework is excellent for it. That is not the same as your site being good for it, and the gap between the two is where the real problems live.",
      },
      {
        type: "p",
        text: "This is the setup I use on every App Router build, including this site. All of it is framework-native — no SEO package required.",
      },

      { type: "h2", text: "Start with metadataBase, or nothing else works" },
      {
        type: "p",
        text: "Set this once in the root layout. Without it, relative Open Graph and canonical URLs resolve against nothing useful, and your social previews break in ways that only show up after you have shared the link.",
      },
      {
        type: "code",
        lang: "tsx",
        code: "// app/layout.tsx\nimport type { Metadata } from \"next\";\n\nexport const metadata: Metadata = {\n  metadataBase: new URL(\"https://example.com\"),\n  title: \"Company — what you do, where you do it\",\n  description: \"One sentence a human would recognise as a description.\",\n  alternates: { canonical: \"/\" },\n  openGraph: { type: \"website\", locale: \"en_AE\" },\n};",
      },
      {
        type: "p",
        text: "Note the canonical is set per route, not globally inherited as a fixed value. Every page should declare a canonical pointing at itself.",
      },

      { type: "h2", text: "Per-page metadata, and the async version" },
      {
        type: "p",
        text: "A static page exports a metadata object. A dynamic route exports generateMetadata, which receives the params and can fetch whatever it needs.",
      },
      {
        type: "code",
        lang: "tsx",
        code: "// app/blog/[slug]/page.tsx\nexport async function generateMetadata(\n  { params }: { params: Promise<{ slug: string }> },\n): Promise<Metadata> {\n  const { slug } = await params;\n  const post = getPost(slug);\n  if (!post) return {};\n\n  return {\n    title: post.title,\n    description: post.excerpt,\n    alternates: { canonical: `/blog/${slug}` },\n    openGraph: {\n      type: \"article\",\n      publishedTime: post.date,\n      title: post.title,\n      description: post.excerpt,\n    },\n  };\n}",
      },
      {
        type: "p",
        text: "In Next 15 params is a promise and has to be awaited. If you are upgrading an older codebase, this is the change that breaks every dynamic route at once.",
      },
      {
        type: "p",
        text: "Requests made inside generateMetadata are deduplicated against the same request in the page component, so fetching the post in both places does not fetch it twice.",
      },

      { type: "h2", text: "Sitemap as code, not as a plugin" },
      {
        type: "p",
        text: "A file at app/sitemap.ts exporting a default function produces /sitemap.xml. Because it is code, it reads from the same source as your routes and cannot drift out of date.",
      },
      {
        type: "code",
        lang: "ts",
        code: "// app/sitemap.ts\nimport type { MetadataRoute } from \"next\";\nimport { POSTS } from \"@/content/posts\";\n\nconst BASE = \"https://example.com\";\n\nexport default function sitemap(): MetadataRoute.Sitemap {\n  const pages: MetadataRoute.Sitemap = [\n    { url: `${BASE}/`, priority: 1 },\n    { url: `${BASE}/services`, priority: 0.8 },\n    { url: `${BASE}/blog`, priority: 0.6 },\n  ];\n\n  const posts: MetadataRoute.Sitemap = POSTS.map((p) => ({\n    url: `${BASE}/blog/${p.slug}`,\n    lastModified: p.date,\n    priority: 0.5,\n  }));\n\n  return [...pages, ...posts];\n}",
      },
      {
        type: "p",
        text: "That is the whole advantage of this approach. Add a post to the content file and the sitemap, the static params, the OG image and the next-and-previous links all follow automatically. Nobody has to remember anything.",
      },

      { type: "h2", text: "robots.ts" },
      {
        type: "code",
        lang: "ts",
        code: "// app/robots.ts\nimport type { MetadataRoute } from \"next\";\n\nexport default function robots(): MetadataRoute.Robots {\n  return {\n    rules: { userAgent: \"*\", allow: \"/\" },\n    sitemap: \"https://example.com/sitemap.xml\",\n  };\n}",
      },
      {
        type: "p",
        text: "If you have a staging deployment, gate this on an environment variable so staging disallows everything and production does not. Then check production after every deploy, because this is exactly the file that ends up wrong.",
      },

      { type: "h2", text: "Open Graph images, generated per route" },
      {
        type: "p",
        text: "An opengraph-image.tsx file next to a route generates a social image for it, rendered at build time. No design tool, no manual export, no forgotten image for the post published last Tuesday.",
      },
      {
        type: "code",
        lang: "tsx",
        code: "// app/blog/[slug]/opengraph-image.tsx\nimport { ImageResponse } from \"next/og\";\n\nexport const alt = \"Article\";\nexport const size = { width: 1200, height: 630 };\nexport const contentType = \"image/png\";\n\nexport function generateStaticParams() {\n  return POSTS.map((p) => ({ slug: p.slug }));\n}\n\nexport default async function Image(\n  { params }: { params: Promise<{ slug: string }> },\n) {\n  const { slug } = await params;\n  const post = getPost(slug);\n\n  return new ImageResponse(\n    <div style={{ display: \"flex\", /* ... */ }}>{post?.title}</div>,\n    size,\n  );\n}",
      },
      {
        type: "p",
        text: "Two things catch people out. Every element needs an explicit display value — the renderer supports a subset of CSS and will not infer flex for you. And exporting generateStaticParams is what makes these render at build time rather than on every request.",
      },

      { type: "h2", text: "JSON-LD, which has no metadata API" },
      {
        type: "p",
        text: "Structured data is not part of the Metadata type. You render it as a script tag in the component, which works correctly in a server component.",
      },
      {
        type: "code",
        lang: "tsx",
        code: "const schema = {\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"BlogPosting\",\n  headline: post.title,\n  datePublished: post.date,\n  author: { \"@type\": \"Person\", name: \"Jose Sebastian\" },\n};\n\n<script\n  type=\"application/ld+json\"\n  dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}\n/>",
      },

      { type: "h2", text: "The trap that matters more than any of the above" },
      {
        type: "p",
        text: "All of this configures the head. None of it guarantees the body contains anything.",
      },
      {
        type: "p",
        text: "Mark a page as client-only, fetch its content in an effect, and Next will happily serve a shell with perfect metadata and no content. Crawlers do execute JavaScript, but doing so is slower and less reliable than reading HTML, and you have given away the main reason to use this framework at all.",
      },
      {
        type: "p",
        text: "Check what you actually ship. View source — genuine source, not the inspector, which shows the page after hydration — and look for your content. If it is not there, fix the rendering before touching anything else.",
      },
      {
        type: "ul",
        items: [
          "Keep pages as server components and push use client down to the leaves that need interactivity",
          "Content that should be indexed is fetched on the server, always",
          "Watch for opting a whole route out of static rendering by reading headers or cookies high in the tree",
          "Verify with curl or View Source, not with the dev tools inspector",
        ],
      },

      { type: "h2", text: "The short version" },
      {
        type: "ul",
        items: [
          "metadataBase first, then canonicals per route",
          "generateMetadata for dynamic routes, and await params on Next 15",
          "sitemap.ts and robots.ts as code, driven by the same data as the routes",
          "opengraph-image.tsx with generateStaticParams, and explicit display on every element",
          "JSON-LD as a script tag, since there is no API for it",
          "Then verify the HTML actually contains the content",
        ],
      },
      {
        type: "p",
        text: "This site runs exactly this setup across every route, including a generated image per article and per case study. The code is straightforward; remembering to check the rendered HTML is the discipline.",
      },
    ],
  },

  {
    slug: "nextjs-on-cloudflare-workers-errors",
    title: "Next.js on Cloudflare Workers: the errors nobody documents",
    excerpt:
      "Six failures I hit putting a Next.js 15 site on Workers through OpenNext, with the exact error text and what each one actually means. Written down because nothing else had them.",
    date: "2026-08-14",
    readingMinutes: 10,
    tag: "Cloudflare",
    tags: ["Cloudflare", "Next.js", "OpenNext", "DevOps"],
    body: [
      {
        type: "p",
        text: "This site runs on Cloudflare Workers, built with the OpenNext adapter. Getting there was mostly pleasant and occasionally baffling, in the specific way that happens when an error message is technically accurate and tells you nothing about the cause.",
      },
      {
        type: "p",
        text: "These are the six that cost me real time. The error text is included verbatim, because that is what you will be searching for at the time.",
      },

      { type: "h2", text: "1. Service binding WORKER_SELF_REFERENCE was not found" },
      {
        type: "code",
        lang: "text",
        code: "Service binding 'WORKER_SELF_REFERENCE' references Worker 'dev-portfolio'\nwhich was not found. [code: 10143]",
      },
      {
        type: "p",
        text: "The adapter needs the Worker to be able to call itself, and if you let it generate its own wrangler configuration it derives that Worker name from the name field in package.json. If your Cloudflare project is called something else, the deploy fails, and the error names a Worker you have never heard of.",
      },
      {
        type: "p",
        text: "The fix is to commit wrangler.jsonc rather than letting it be generated, and to make sure the package name, the name in that file and the actual Cloudflare project name are all identical. If you later rename the project in the dashboard, all three have to move together.",
      },

      { type: "h2", text: "2. Could not find compiled Open Next config" },
      {
        type: "p",
        text: "Cloudflare Workers Builds runs npm run build and then wrangler deploy. If your build script is a plain next build, the deploy step looks for a file that was never created.",
      },
      {
        type: "p",
        text: "The deploy needs the adapter's output at .open-next/.build/open-next.config.edge.mjs. So build has to be the adapter command, and the plain Next build belongs under a different name.",
      },
      {
        type: "code",
        lang: "json",
        code: "{\n  \"scripts\": {\n    \"build\": \"opennextjs-cloudflare build\",\n    \"build:next\": \"next build\",\n    \"preview\": \"opennextjs-cloudflare build && opennextjs-cloudflare preview\",\n    \"deploy\": \"opennextjs-cloudflare build && opennextjs-cloudflare deploy\"\n  }\n}",
      },

      { type: "h2", text: "3. The build that never finishes" },
      {
        type: "p",
        text: "Having made that change, the build hangs and then repeats itself. The adapter shells out to npm run build to produce the Next output — which is now the adapter command, which shells out to npm run build, indefinitely.",
      },
      {
        type: "p",
        text: "Tell it explicitly which script produces the Next build:",
      },
      {
        type: "code",
        lang: "ts",
        code: "// open-next.config.ts\nexport default {\n  buildCommand: \"npm run build:next\",\n};",
      },
      {
        type: "p",
        text: "Two configuration files pointing at each other, each individually reasonable. Worth an explanatory comment in the repository, because the next person to read it will assume one of them is redundant and remove it.",
      },

      { type: "h2", text: "4. cloudflare:email cannot be imported from application code" },
      {
        type: "p",
        text: "Cloudflare Email Routing can send mail from a Worker, which makes it an appealing way to deliver a contact form without a third-party provider. But the cloudflare:email module can only be imported from code that wrangler itself bundles — not from inside the Next application, which the adapter has already compiled by then.",
      },
      {
        type: "p",
        text: "The way through is a custom Worker entrypoint that wraps the OpenNext worker and holds the email binding. The server action then reaches it through the self-reference binding, authenticated with a secret so the route cannot be used as an open relay by anyone who discovers it.",
      },
      {
        type: "p",
        text: "Worth knowing before you build on this: the recipient has to be a verified destination address on the account, and the sending domain has to have Email Routing enabled. Neither is difficult, but both will fail at runtime rather than at build time.",
      },

      { type: "h2", text: "5. A use server module that fails only at request time" },
      {
        type: "p",
        text: "A module marked use server may export async functions and nothing else. Export a plain object from it — a state type's initial value, say — and the build passes cleanly, the types are fine, and the request fails in production.",
      },
      {
        type: "p",
        text: "The fix is trivial once you know: keep constants and types in an ordinary module and import them where they are needed. The reason it costs time is that a green build feels like a guarantee, and here it is not.",
      },

      { type: "h2", text: "6. Every route 404s after a successful build" },
      {
        type: "p",
        text: "Occasionally a build completes and then every route returns 404. This has been, every time I have seen it, a truncated app-paths-manifest.json — caused by building while a dev server still held the .next directory open.",
      },
      {
        type: "p",
        text: "Delete .next and rebuild. It is not worth diagnosing further; just stop the server first.",
      },

      { type: "h2", text: "The broader lesson: verify in a browser" },
      {
        type: "p",
        text: "Four of these six produce a green build. Type checking proves the types agree with each other, and nothing else.",
      },
      {
        type: "p",
        text: "So I keep a verification script that drives real Chrome across every route and reports status codes, console errors, failed requests, horizontal overflow and dead links, then submits the contact form twice — once invalid to confirm the error states, once valid to confirm the success state. It runs against a local build and against the actual Workers runtime through wrangler dev.",
      },
      {
        type: "p",
        text: "Running it against workerd specifically matters, because the Workers runtime is not Node. Something that works under next start can still fail once deployed, and finding that out from a script is considerably cheaper than finding it out from a customer.",
      },

      { type: "h2", text: "The short version" },
      {
        type: "ul",
        items: [
          "Commit wrangler.jsonc, and keep the package name and project name identical",
          "build must be the adapter command; keep next build under another name",
          "Set buildCommand in open-next.config.ts or the build recurses forever",
          "cloudflare:email only works from a custom entrypoint that wrangler bundles",
          "use server modules export async functions only — this fails at request time, not build time",
          "404s everywhere after a build means a stale .next; delete it",
          "A green build is not a working site. Drive it with a browser",
        ],
      },
    ],
  },

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
