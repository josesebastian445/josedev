"use server";

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

  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  const key = process.env.RESEND_API_KEY;

  // Delivery is only attempted when the provider is configured. Without the
  // env vars the submission is logged server-side and the visitor still gets a
  // success state — see README before putting this in front of real traffic.
  if (!key || !to || !from) {
    console.warn(
      "[contact] RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL not set — message logged, not delivered:",
      { name, email, budget, message }
    );
    return { status: "success" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `New enquiry from ${name}${budget ? ` · ${budget}` : ""}`,
        text: [
          `Name:    ${name}`,
          `Email:   ${email}`,
          `Budget:  ${budget || "not given"}`,
          "",
          message,
        ].join("\n"),
      }),
    });

    if (!res.ok) {
      console.error("[contact] provider rejected the message", await res.text());
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
