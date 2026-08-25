/**
 * Contact-form bindings and vars declared in wrangler.jsonc.
 * They ride on the CloudflareEnv global that @opennextjs/cloudflare declares.
 */
declare global {
  interface CloudflareEnv {
    CONTACT_TO_EMAIL?: string;
    CONTACT_FROM_EMAIL?: string;
    /** wrangler secret gating the internal send route in custom-worker.js */
    CONTACT_INTERNAL_KEY?: string;
    /** send_email binding — only usable from custom-worker.js */
    CONTACT_EMAIL?: { send(message: unknown): Promise<void> };
  }
}

export {};
