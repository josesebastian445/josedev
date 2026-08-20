/**
 * The four services, with their prices. Shared so the home page cards and the
 * /services pricing block can never drift apart — the price appears in both.
 */
export type Service = {
  n: string;
  slug: string;
  title: string;
  blurb: string;
  points: string[];
  price: string;
  /** e.g. "from" / "from, per month" — sits above the figure */
  priceNote: string;
};

export const SERVICES: Service[] = [
  {
    n: "01",
    slug: "web-design-development",
    title: "Website Design & Development",
    blurb:
      "Fast, secure sites built on WordPress, Next.js or Astro — whichever actually fits.",
    points: [
      "Corporate sites, landing pages and WooCommerce stores",
      "Built for Core Web Vitals from the first line, not patched afterwards",
      "Clean CMS setup so your team can edit without breaking the layout",
      "Fully responsive, accessible and tested on real devices",
    ],
    price: "AED 4,500",
    priceNote: "from",
  },
  {
    n: "02",
    slug: "seo-search-performance",
    title: "SEO & Search Performance",
    blurb:
      "Technical fixes, content structure and local visibility that bring in enquiries.",
    points: [
      "Full technical audit — crawlability, speed, schema, internal linking",
      "Keyword research grounded in what your buyers actually search",
      "On-page optimisation and content briefs your writers can follow",
      "Google Business Profile and local UAE search visibility",
    ],
    price: "AED 2,500",
    priceNote: "from, per month",
  },
  {
    n: "03",
    slug: "it-support-infrastructure",
    title: "IT Support & Infrastructure",
    blurb:
      "The unglamorous layer — firewalls, backups, Office 365 and servers that stay up.",
    points: [
      "Day-to-day technical support for local and remote teams",
      "Microsoft 365 administration, licensing and migrations",
      "FortiGate firewall, VPN and network configuration",
      "Server, hosting and database administration",
    ],
    price: "AED 2,000",
    priceNote: "from, per month",
  },
  {
    n: "04",
    slug: "web-security-maintenance",
    title: "Web Security & Maintenance",
    blurb:
      "Hardening, backups and monitoring so your site does not become someone's crypto miner.",
    points: [
      "Malware cleanup and recovery for compromised sites",
      "Cloudflare WAF, rate limiting and bot mitigation",
      "Automated off-site backups with tested restores",
      "Core, theme and plugin updates on a staging site first",
    ],
    price: "AED 750",
    priceNote: "from, per month",
  },
];
