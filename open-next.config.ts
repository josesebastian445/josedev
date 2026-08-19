import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * Cloudflare Workers Builds runs `npm run build` and then expects the OpenNext
 * bundle to already exist, so `build` has to be `opennextjs-cloudflare build`.
 * That command shells out to the package manager's build script by default,
 * which would re-enter itself — hence pointing buildCommand at `build:next`.
 *
 * No incremental cache is configured: every route is static or a server action,
 * so there is nothing to revalidate. Add R2/KV here if ISR is introduced —
 * see https://opennext.js.org/cloudflare/caching
 */
export default {
  ...defineCloudflareConfig(),
  buildCommand: "npm run build:next",
};
