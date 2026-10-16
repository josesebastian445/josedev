export type Project = {
  slug: string;
  index: string;
  title: string;
  client: string;
  /** short client mark used where there is no room for the full name */
  mark: string;
  year: string;
  headline: string;
  summary: string;
  role: string;
  duration: string;
  tags: string[];
  stack: string[];
  metric: string;
  metricLabel: string;
  /** headline facts shown on the case study */
  results: { value: string; label: string }[];
  brief: string;
  approach: string[];
  outcome: string;
  changes: { area: string; before: string; contribution: string; after: string }[];
  quote?: { text: string; name: string; role: string };
  /** two-stop gradient standing in for artwork */
  art: [string, string];
  featured: boolean;
  website?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "best-solution-services",
    website: "https://www.best-solution.ae/",
    index: "01",
    title: "Best Solution Services",
    client: "Best Solution Services",
    mark: "BSS",
    year: "2022–present",
    headline: "Rebuilding a multi-site web estate on a modern stack",
    summary:
      "Took over a sprawling set of corporate and client sites, consolidated the hosting, and rebuilt the front ends on WordPress, Next.js and Astro with security and SEO handled as part of the build rather than afterwards.",
    role: "IT Manager & Web Developer",
    duration: "2022 — present",
    tags: ["Web development", "SEO", "IT security", "CRM automation"],
    stack: [
      "WordPress",
      "Next.js",
      "Astro",
      "Cloudflare",
      "FortiGate",
      "Microsoft 365",
    ],
    metric: "End-to-end",
    metricLabel: "development and ongoing care",
    results: [
      { value: "Multi-site", label: "estate consolidated" },
      { value: "Build + care", label: "development and operations" },
      { value: "2022 —", label: "still maintained today" },
    ],
    brief:
      "A corporate and client web estate that had grown site by site over several years, spread across different hosts, stacks and admin logins. Nobody owned the whole picture, security was handled per-site after the fact, and SEO was something that got looked at when traffic dropped.",
    approach: [
      "Audited every site in the estate — where it was hosted, what it ran on, who could log in, and what was actually still in use.",
      "Consolidated hosting and DNS so the estate sits behind one Cloudflare setup rather than a different arrangement per site.",
      "Rebuilt the front ends on WordPress, Next.js or Astro depending on who edits the site and what it has to do, rather than forcing one stack onto everything.",
      "Made security and SEO part of the build: WAF and bot rules, off-site backups with tested restores, and crawlability, schema and internal linking handled before launch instead of after.",
      "Automated the CRM handoff so enquiries from the sites land where the sales side actually works.",
    ],
    outcome:
      "Hosting, DNS, site development, security and enquiry routing now sit within one managed workflow. My role covers both building the sites and maintaining the systems behind them, giving the business a single technical point of accountability.",
    changes: [
      { area: "Hosting & ownership", before: "Sites spread across hosts, stacks and separate admin accounts.", contribution: "Audited the estate and consolidated hosting and DNS behind Cloudflare.", after: "A shared operational setup with one accountable technical owner." },
      { area: "Build decisions", before: "Different editing and application needs across the estate.", contribution: "Selected WordPress, Next.js or Astro to suit each site's requirements.", after: "Sites built around their content workflow and technical needs." },
      { area: "Security & enquiries", before: "Security and SEO were handled reactively, with separate sales workflows.", contribution: "Included WAF rules, tested backups, crawl checks and CRM handoff in the delivery process.", after: "Protection, discovery and enquiry routing are part of ongoing site operations." },
    ],
    art: ["#6b5bff", "#0b0d16"],
    featured: true,
  },
  {
    slug: "peninsula-business-solutions",
    index: "02",
    title: "Peninsula Business Solutions",
    client: "Peninsula Business Solutions",
    mark: "PBS",
    year: "2019–2021",
    headline:
      "WooCommerce uptime, SEO and IT support for an international client base",
    summary:
      "Ran the technical and search side of a portfolio of WordPress and WooCommerce sites while providing frontline IT support for local and international teams.",
    role: "Web Developer & IT Support",
    duration: "2019 — 2021",
    tags: ["WooCommerce", "Technical SEO", "IT support", "Hosting"],
    stack: [
      "WordPress",
      "WooCommerce",
      "MySQL",
      "Ahrefs",
      "Screaming Frog",
      "Microsoft 365",
    ],
    metric: "2 yrs",
    metricLabel: "of continuous support",
    results: [
      { value: "Portfolio", label: "of WooCommerce sites" },
      { value: "Local + intl.", label: "teams supported" },
      { value: "2019–2021", label: "engagement length" },
    ],
    brief:
      "A portfolio of WordPress and WooCommerce sites serving an international client base, alongside internal teams in more than one timezone who needed day-to-day technical support. Store uptime and search visibility mattered commercially, and both sat with the same person as the helpdesk.",
    approach: [
      "Kept the WooCommerce estate patched and monitored — core, theme and plugin updates staged before they went anywhere near a live store.",
      "Ran technical SEO across the portfolio: crawl audits, speed work, schema and internal linking, plus keyword research grounded in what buyers actually searched.",
      "Handled hosting and database administration, including backups and the restores that prove backups work.",
      "Provided frontline IT support for local and international teams — accounts, devices, Microsoft 365 and the everyday problems that stop people working.",
    ],
    outcome:
      "Two years of keeping stores online and findable while being the first line of support for the people running them. It is the engagement that taught me the two jobs are the same job: a store that is down does not rank, and a team that cannot log in does not sell.",
    changes: [
      { area: "Store maintenance", before: "A WordPress and WooCommerce portfolio needing continued updates and support.", contribution: "Staged core, theme and plugin changes before releasing them to live stores.", after: "A maintenance workflow that checks changes before production deployment." },
      { area: "Search & hosting", before: "Search visibility, hosting and databases all needed technical ownership.", contribution: "Handled crawl audits, performance work, database administration and recovery checks.", after: "Search and infrastructure work handled together within the same engagement." },
      { area: "Team support", before: "Local and international teams needed day-to-day technical help.", contribution: "Supported accounts, devices and Microsoft 365 alongside the web estate.", after: "One support role spanning the stores and the people operating them during 2019–2021." },
    ],
    art: ["#c8ff2e", "#101408"],
    featured: true,
  },
];

export function getProject(slug: string) {
  return PROJECTS.find((p) => p.slug === slug);
}

export const FEATURED = PROJECTS.filter((p) => p.featured);
