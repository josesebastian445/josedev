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
    return handler.fetch(request, env, ctx);
  },
};
