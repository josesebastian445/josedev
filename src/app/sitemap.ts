import type { MetadataRoute } from "next";
import { POSTS } from "@/content/posts";
import { PROJECTS } from "@/content/projects";

const BASE = "https://joseviews.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, priority: 1 },
    { url: `${BASE}/work`, priority: 0.8 },
    { url: `${BASE}/services`, priority: 0.8 },
    { url: `${BASE}/blog`, priority: 0.6 },
    { url: `${BASE}/contact`, priority: 0.8 },
  ];

  const projects: MetadataRoute.Sitemap = PROJECTS.map((p) => ({
    url: `${BASE}/work/${p.slug}`,
    priority: 0.7,
  }));

  const posts: MetadataRoute.Sitemap = POSTS.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: p.date,
    priority: 0.5,
  }));

  return [...pages, ...projects, ...posts];
}
