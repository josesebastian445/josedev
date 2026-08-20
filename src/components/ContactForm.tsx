"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { submitContact } from "@/app/actions";
import { initialContactState } from "@/lib/contact";
import { SITE, MAILTO } from "@/content/site";

const BUDGETS = [
  "< AED 10k",
  "AED 10k – 30k",
  "AED 30k +",
  "Monthly retainer",
  "Not sure yet",
];

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      data-cursor="link"
      className="group relative w-full overflow-hidden rounded-full bg-volt px-8 py-5 font-display text-lg font-semibold text-on-accent transition-[color,opacity] duration-400 group-hover:text-ink disabled:opacity-60 sm:w-auto sm:px-12"
    >
      <span className="relative z-10 flex items-center justify-center gap-3">
        {pending ? "Sending…" : "Send it"}
        {!pending && (
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 7h11M7 2l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className="absolute inset-0 origin-bottom scale-y-0 bg-bone transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
    </button>
  );
}

const fieldBase =
  "w-full rounded-xl border bg-ink-2/50 px-5 py-4 font-body text-bone outline-none transition-colors duration-300 placeholder:text-fog/60 focus:border-volt/60 focus:bg-ink-2";

export default function ContactForm() {
  const [state, formAction] = useActionState(submitContact, initialContactState);

  if (state.status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-2xl border border-volt/40 bg-volt/[0.05] p-10 md:p-14"
      >
        <motion.span
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-7 flex h-14 w-14 items-center justify-center rounded-full bg-volt text-on-accent"
        >
          <svg width="22" height="22" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 7.5l3.2 3.2L12 4"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.span>

        <h3 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          Got it — thank you.
        </h3>
        <p className="mt-4 max-w-md leading-relaxed text-fog">
          I read everything myself and reply within one working day. If it is
          urgent, email me directly at{" "}
          <a
            href={MAILTO}
            className="border-b border-volt/50 text-bone transition-colors hover:border-volt"
          >
            {SITE.email}
          </a>
          .
        </p>
      </motion.div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      {/* honeypot — hidden from people, irresistible to bots */}
      <div aria-hidden className="absolute left-[-9999px]">
        <label>
          Company
          <input name="company" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="mb-2.5 block font-display text-[11px] uppercase tracking-[0.22em] text-fog"
          >
            Your name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={state.values?.name}
            aria-invalid={!!state.errors?.name}
            aria-describedby={state.errors?.name ? "name-error" : undefined}
            placeholder="Jane Okafor"
            className={`${fieldBase} ${
              state.errors?.name ? "border-ember" : "border-line"
            }`}
          />
          {state.errors?.name && (
            <p id="name-error" className="mt-2 text-sm text-ember">
              {state.errors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2.5 block font-display text-[11px] uppercase tracking-[0.22em] text-fog"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={state.values?.email}
            aria-invalid={!!state.errors?.email}
            aria-describedby={state.errors?.email ? "email-error" : undefined}
            placeholder="jane@company.com"
            className={`${fieldBase} ${
              state.errors?.email ? "border-ember" : "border-line"
            }`}
          />
          {state.errors?.email && (
            <p id="email-error" className="mt-2 text-sm text-ember">
              {state.errors.email}
            </p>
          )}
        </div>
      </div>

      <fieldset>
        <legend className="mb-3 block font-display text-[11px] uppercase tracking-[0.22em] text-fog">
          Budget
        </legend>
        <div className="flex flex-wrap gap-2.5">
          {BUDGETS.map((b) => (
            <label key={b} className="cursor-pointer">
              <input
                type="radio"
                name="budget"
                value={b}
                defaultChecked={state.values?.budget === b}
                className="peer sr-only"
              />
              <span className="block rounded-full border border-line px-4 py-2.5 font-display text-sm text-fog transition-all duration-300 hover:border-fog/50 peer-checked:border-volt peer-checked:bg-volt peer-checked:text-on-accent peer-focus-visible:ring-2 peer-focus-visible:ring-volt/50">
                {b}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label
          htmlFor="message"
          className="mb-2.5 block font-display text-[11px] uppercase tracking-[0.22em] text-fog"
        >
          What are you building?
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          defaultValue={state.values?.message}
          aria-invalid={!!state.errors?.message}
          aria-describedby={state.errors?.message ? "message-error" : undefined}
          placeholder="The problem, the deadline, and anything you already know about how it should work."
          className={`${fieldBase} resize-y ${
            state.errors?.message ? "border-ember" : "border-line"
          }`}
        />
        {state.errors?.message && (
          <p id="message-error" className="mt-2 text-sm text-ember">
            {state.errors.message}
          </p>
        )}
      </div>

      <AnimatePresence>
        {state.message && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
            className="rounded-xl border border-ember/40 bg-ember/[0.06] px-5 py-4 text-sm text-ember"
          >
            {state.message}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap items-center gap-6 pt-2">
        <Submit />
        <p className="text-sm text-fog">
          Or email{" "}
          <a
            href={MAILTO}
            data-cursor="link"
            className="border-b border-line text-bone transition-colors hover:border-volt"
          >
            {SITE.email}
          </a>
        </p>
      </div>
    </form>
  );
}
