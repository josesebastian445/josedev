"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Reveal, SectionLabel } from "./motion-primitives";

const FAQS = [
  {
    q: "How do we start?",
    a: "A 45-minute call, free. You tell me the problem and the deadline; I ask enough questions to price it. Within two working days you get a written plan with scope, cost and a delivery date. No discovery phase that bills for a month before anything is built.",
  },
  {
    q: "What do you need from me?",
    a: "Copy and brand assets, one decision-maker who can approve things, and about an hour a week. The most common cause of a late project is not development — it is waiting on content. If your copy is not ready, I will tell you that up front and we will plan around it.",
  },
  {
    q: "Do you do design as well as development?",
    a: "Yes, and I design in the browser rather than in Figma. You see the real thing moving by the end of week one, on a URL you can open on your phone. If you already have a designer I work to their files happily — that is often the fastest route.",
  },
  {
    q: "What happens if it runs late?",
    a: "If the delay is mine, you do not pay for the extra time. If the scope changed, we re-quote in the open before any extra work happens. I have not missed a delivery date in three years, and the way I protect that is by cutting scope early rather than quietly slipping.",
  },
  {
    q: "Who owns the code?",
    a: "You do, from the first commit. It lives in your repository, deployed to your accounts, with no licence and no lock-in. If you want to take it in-house or hand it to another developer, everything is documented and there is nothing to unpick.",
  },
  {
    q: "Can you work with our existing team?",
    a: "Regularly. I take the frontend slice, review pull requests, and leave the team able to keep building after I go. A handover recording and written architecture notes come as standard, not as an extra.",
  },
  {
    q: "What about hosting and maintenance?",
    a: "Sites deploy to Vercel or Cloudflare on your account, so you own the bill and it is usually small. Support is included for 30 to 60 days depending on the project. After that you can leave it alone, or keep me on a light retainer for updates.",
  },
  {
    q: "Do you take equity instead of cash?",
    a: "No. I have tried it twice and both times it made the working relationship worse. Straight invoices keep everybody honest.",
  },
];

function Item({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <Reveal delay={index * 0.05} className="border-b border-line">
      <h3>
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          data-cursor="link"
          className="group flex w-full items-start justify-between gap-8 py-7 text-left"
        >
          <span className="font-display text-lg font-medium tracking-tight transition-colors duration-300 group-hover:text-volt md:text-xl">
            {q}
          </span>

          <span className="relative mt-1 flex h-6 w-6 shrink-0 items-center justify-center">
            <span className="absolute h-px w-4 bg-fog transition-colors duration-300 group-hover:bg-volt" />
            <motion.span
              animate={{ rotate: open ? 0 : 90 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute h-px w-4 bg-fog transition-colors duration-300 group-hover:bg-volt"
            />
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-8 pr-10 leading-relaxed text-fog">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </Reveal>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionLabel index="05">Questions</SectionLabel>

        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] font-bold leading-[0.98] tracking-[-0.03em]">
              The things
              <span className="text-fog"> everyone asks.</span>
            </h2>
            <p className="mt-6 max-w-sm leading-relaxed text-fog">
              Still unclear on something? Ask me directly — I answer within a
              day, and I will tell you if I am not the right fit.
            </p>
          </div>

          <div>
            {FAQS.map((f, i) => (
              <Item key={f.q} q={f.q} a={f.a} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
