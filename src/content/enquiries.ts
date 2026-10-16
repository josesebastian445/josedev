export const ENQUIRY_SERVICES = [
  { slug: "web-design-development", label: "Website development", prompt: "What do you want to build?", hint: "A new site or a rebuild, key pages and features, and your target launch date.", detail: "Website or reference URL", placeholder: "https://example.com" },
  { slug: "seo-search-performance", label: "SEO", prompt: "Where do you want better visibility?", hint: "Your target services, locations, search visibility concerns, and what you have tried so far.", detail: "Website to review", placeholder: "https://your-website.com" },
  { slug: "web-security-maintenance", label: "Maintenance", prompt: "What needs ongoing care?", hint: "Your platform, current issue, and whether you need a one-off fix or ongoing maintenance.", detail: "Website to maintain", placeholder: "https://your-website.com" },
  { slug: "it-support-infrastructure", label: "IT support", prompt: "What is getting in your team's way?", hint: "The affected systems, team size, location, and how urgently you need support. Never include passwords.", detail: "Team size and affected systems", placeholder: "e.g. 12 people, Microsoft 365 and office network" },
] as const;

export function getEnquiryService(slug: string) {
  return ENQUIRY_SERVICES.find((service) => service.slug === slug);
}
