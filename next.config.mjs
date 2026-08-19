import path from "node:path";
import { fileURLToPath } from "node:url";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const here = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // other lockfiles live in parent folders; pin the trace root to this app
  outputFileTracingRoot: here,
};

// makes Cloudflare bindings available during `next dev`; no-op in production
initOpenNextCloudflareForDev();

export default nextConfig;
