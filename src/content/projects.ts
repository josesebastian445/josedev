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
  quote?: { text: string; name: string; role: string };
  /** two-stop gradient standing in for artwork */
  art: [string, string];
  featured: boolean;
};

export const PROJECTS: Project[] = [
  {
    slug: "best-solution-services",
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
    metric: "99.9%",
    metricLabel: "uptime maintained",
    results: [
      { value: "Multi-site", label: "estate consolidated" },
      { value: "99.9%", label: "uptime maintained" },
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
      "The estate now runs as one system with one person accountable for it, rather than a collection of sites nobody could see end to end. It has held 99.9% uptime, and I still maintain it — which is the part that matters: these are systems I keep running, not screenshots from a portfolio.",
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
    art: ["#c8ff2e", "#101408"],
    featured: true,
  },
];

export function getProject(slug: string) {
  return PROJECTS.find((p) => p.slug === slug);
}

export const FEATURED = PROJECTS.filter((p) => p.featured);
