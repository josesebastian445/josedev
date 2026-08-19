import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * No incremental cache is configured: every route here is either fully static
 * or a server action, so there is nothing to revalidate. Add an R2 or KV cache
 * here if ISR is introduced later — see https://opennext.js.org/cloudflare/caching
 */
export default defineCloudflareConfig();
