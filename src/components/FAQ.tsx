"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Reveal, SectionLabel } from "./motion-primitives";

const FAQS = [
  {
    q: "How do we start?",
    a: "A call or a WhatsApp thread. You describe the problem, and I ask the awkward questions about budget and deadlines early rather than late. If it looks like a fit, you get a written scope with a fixed price or a clear rate, a timeline, and what is explicitly not included.",
  },
  {
    q: "WordPress, Next.js or Astro — which one will I get?",
    a: "Whichever actually fits. The two questions that decide it are who edits the site every week and what it has to do beyond serving pages. WordPress when your team edits constantly and needs a familiar admin; Next.js or Astro when speed, structure and control matter more than a plugin ecosystem. I will tell you which and why, in writing.",
  },
  {
    q: "What does a website actually cost?",
    a: "Website builds start at AED 4,500. SEO is from AED 2,500 a month, IT support from AED 2,000 a month, and security and maintenance from AED 750 a month. Those are starting points, not a menu — every project gets scoped before it gets priced, and the number you agree is the number you are invoiced.",
  },
  {
    q: "Do you only work with clients in Dubai?",
    a: "I am based in Dubai and a good deal of the work is local, including Google Business Profile and UAE search visibility. But I have supported international teams across timezones for years, and remote work has never been the hard part of this job.",
  },
  {
    q: "Can you take over a site somebody else built?",
    a: "Yes, and a lot of my work is exactly that. It starts with an audit: where it is hosted, what it runs on, who can log in, and what is actually still in use. Sometimes the answer is a rebuild and sometimes it is a fix — I will say which before you spend anything.",
  },
  {
    q: "My site has been hacked. Can you help?",
    a: "Yes. Malware cleanup and recovery for compromised sites is part of the security work, along with the hardening that stops it happening again: Cloudflare WAF, rate limiting and bot mitigation, automated off-site backups with tested restores, and updates staged before they touch production.",
  },
  {
    q: "Do you do SEO as well as the build, or is that separate?",
    a: "Both, and doing them together is the point. Crawlability, speed, schema and internal linking are handled as part of the build rather than patched on afterwards. Ongoing SEO — audits, keyword research, on-page work and content briefs — runs as a monthly engagement if you want it.",
  },
  {
    q: "Who owns the site and the accounts afterwards?",
    a: "You do. Handover means documentation, a training session, and every credential transferred to you. You own everything, including the ability to leave. That is deliberate: the most common complaint I hear about previous developers is not the price, it is not being able to walk away.",
  },
  {
    q: "Do you offer ongoing support after launch?",
    a: "Yes, as a monthly retainer — updates on a staging site first, backups with tested restores, monitoring, and being the person who picks up when something breaks. Plenty of clients stay on it for years; the two case studies on this site are engagements I still maintain.",
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
          <span className="font-display text-lg font-medium tracking-tight transition-colors duration-300 group-hover:text-accent md:text-xl">
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
        <SectionLabel index="04">Questions</SectionLabel>

        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] font-bold leading-[0.98] tracking-[-0.03em]">
              The things
              <span className="text-fog"> everyone asks.</span>
            </h2>
            <p className="mt-6 max-w-sm leading-relaxed text-fog">
              Still unclear on something? Message me directly — I usually reply
              within a few hours, and I will tell you if I am not the right fit.
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
