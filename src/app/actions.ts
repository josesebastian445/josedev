"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { ContactState } from "@/lib/contact";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function submitContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const budget = String(formData.get("budget") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  // honeypot: real people never fill a hidden field
  const trap = String(formData.get("company") ?? "").trim();

  const values = { name, email, budget, message };

  if (trap) {
    // silently accept, so bots get no signal about what gave them away
    return { status: "success" };
  }

  const errors: ContactState["errors"] = {};
  if (name.length < 2) errors.name = "Please tell me your name.";
  if (!EMAIL.test(email)) errors.email = "That does not look like an email address.";
  if (message.length < 20)
    errors.message = "A little more detail helps — 20 characters minimum.";

  if (Object.keys(errors).length > 0) {
    return { status: "error", errors, values };
  }

  // Delivery goes through Cloudflare Email Routing. The send_email binding
  // lives in custom-worker.js (cloudflare:email cannot be imported from
  // Next-bundled code), so we call back into our own worker through the
  // WORKER_SELF_REFERENCE service binding, authenticated with a shared secret.
  // Outside the Workers runtime (plain `next dev`, missing secret) the
  // submission is logged server-side and the visitor still gets a success
  // state — see README before putting this in front of real traffic.
  let env: CloudflareEnv | undefined;
  try {
    env = getCloudflareContext().env;
  } catch {
    env = undefined;
  }
  const worker = env?.WORKER_SELF_REFERENCE;
  const key = env?.CONTACT_INTERNAL_KEY;

  if (!worker || !key) {
    console.warn(
      "[contact] email delivery not configured — message logged, not delivered:",
      { name, email, budget, message }
    );
    return { status: "success" };
  }

  try {
    const res = await worker.fetch("https://self/__internal/contact-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-key": key,
      },
      body: JSON.stringify({ name, email, budget, message }),
    });

    if (!res.ok) {
      console.error("[contact] delivery rejected", await res.text());
      return {
        status: "error",
        message: "Something broke on my end. Email me directly instead.",
        values,
      };
    }
  } catch (err) {
    console.error("[contact] delivery failed", err);
    return {
      status: "error",
      message: "Something broke on my end. Email me directly instead.",
      values,
    };
  }

  return { status: "success" };
}
