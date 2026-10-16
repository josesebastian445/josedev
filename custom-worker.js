/**
 * Custom Worker entrypoint wrapping the OpenNext-generated handler.
 *
 * The contact form delivers mail through Cloudflare Email Routing via a
 * `send_email` binding, and the `cloudflare:email` module can only be
 * imported from code that wrangler itself bundles — never from code that
 * goes through the Next/OpenNext build. So the send lives here, and the
 * server action (src/app/actions.ts) reaches it through the
 * WORKER_SELF_REFERENCE service binding with a shared-secret header.
 */
import { EmailMessage } from "cloudflare:email";
import { createMimeMessage, Mailbox } from "mimetext";
import handler from "./.open-next/worker.js";

export {
  DOQueueHandler,
  DOShardedTagCache,
  BucketCachePurge,
} from "./.open-next/worker.js";

const SEND_PATH = "/__internal/contact-email";

/**
 * Applied to every response. The site loads very little cross-origin: fonts
 * are self-hosted by next/font and the three.js scenes are fully procedural.
 * The exceptions are Cloudflare Web Analytics and Google Analytics 4, both of
 * which need explicit entries below or they fail silently. script-src /
 * style-src need 'unsafe-inline' for Next's RSC payload scripts, the theme
 * boot script and motion/react's style attributes.
 */
const SECURITY_HEADERS = {
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy": [
    "default-src 'self'",
    // Two analytics platforms, each needing entries in more than one
    // directive. cloudflareinsights is the Web Analytics beacon Cloudflare
    // injects at the edge — invisible to a repo scan. googletagmanager serves
    // gtag.js; GA4 then beacons to google-analytics.com and to a regional
    // subdomain of it, hence wildcards rather than hosts.
    //
    // www.google.com is the one that is easy to miss. GA4 sends a second
    // /g/collect request there for Google signals, separate from the
    // measurement hit. Without it the page still records, but every visitor
    // gets a CSP error in the console and the signals data is dropped. If
    // Google Ads is ever linked, *.g.doubleclick.net and
    // www.googleadservices.com will need adding here too.
    "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com https://*.googletagmanager.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://*.google-analytics.com https://*.googletagmanager.com https://www.google.com",
    "font-src 'self'",
    "connect-src 'self' https://cloudflareinsights.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://www.google.com",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; "),
};

async function sendContactEmail(request, env) {
  const key = env.CONTACT_INTERNAL_KEY;
  // wrong or missing key looks identical to any unknown route
  if (!key || request.headers.get("x-internal-key") !== key) {
    return new Response("Not found", { status: 404 });
  }

  const { name, email, budget, message } = await request.json();
  const from = env.CONTACT_FROM_EMAIL;
  const to = env.CONTACT_TO_EMAIL;
  if (!from || !to) {
    return Response.json(
      { ok: false, error: "CONTACT_FROM_EMAIL / CONTACT_TO_EMAIL not set" },
      { status: 500 }
    );
  }

  try {
    const msg = createMimeMessage();
    msg.setSender({ name: "joseviews.com contact form", addr: from });
    msg.setRecipient(to);
    // address-type headers must be Mailbox instances, not bare strings
    msg.setHeader("Reply-To", new Mailbox(email));
    msg.setSubject(`New enquiry from ${name}${budget ? ` · ${budget}` : ""}`);
    msg.addMessage({
      contentType: "text/plain",
      data: [
        `Name:    ${name}`,
        `Email:   ${email}`,
        `Budget:  ${budget || "not given"}`,
        "",
        message,
      ].join("\n"),
    });

    await env.CONTACT_EMAIL.send(new EmailMessage(from, to, msg.asRaw()));
  } catch (err) {
    console.error("[contact] send_email rejected the message", err);
    return Response.json({ ok: false, error: String(err) }, { status: 502 });
  }
  return Response.json({ ok: true });
}

export default {
  async fetch(request, env, ctx) {
    if (
      request.method === "POST" &&
      new URL(request.url).pathname === SEND_PATH
    ) {
      return sendContactEmail(request, env);
    }
    const res = await handler.fetch(request, env, ctx);
    const withHeaders = new Response(res.body, res);
    for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
      if (!withHeaders.headers.has(k)) withHeaders.headers.set(k, v);
    }
    return withHeaders;
  },
};
