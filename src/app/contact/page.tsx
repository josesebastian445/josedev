import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import { Reveal } from "@/components/motion-primitives";
import { SITE, MAILTO, TEL } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact — Jose Sebastian",
  description:
    "Tell me what you are trying to achieve. I usually reply within a few hours, Dubai time, and I will tell you if I am not the right fit.",
};

const DETAILS = [
  { label: "Email", value: SITE.email, href: MAILTO },
  { label: "Phone", value: SITE.phone, href: TEL },
  { label: "WhatsApp", value: "Message me", href: SITE.whatsapp, external: true },
  { label: "Based", value: SITE.location },
  { label: "Reply time", value: SITE.replyTime },
];

export default function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow="Next step"
        title="Got a project that needs building or fixing?"
        lede="The more concrete the better: what the problem is, when it needs to be live, and anything you already know about how it should work."
      />

      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-[1400px] gap-16 px-6 md:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-24">
          <Reveal>
            <ContactForm />
          </Reveal>

          <div className="lg:pt-4">
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-line bg-ink-2/50 p-8">
                <h2 className="font-display text-lg font-semibold tracking-tight">
                  Details
                </h2>
                <dl className="mt-7 space-y-6">
                  {DETAILS.map((d) => (
                    <div key={d.label}>
                      <dt className="font-display text-[11px] uppercase tracking-[0.22em] text-fog">
                        {d.label}
                      </dt>
                      <dd className="mt-1.5 font-display text-bone">
                        {d.href ? (
                          <a
                            href={d.href}
                            data-cursor="link"
                            {...(d.external
                              ? { target: "_blank", rel: "noreferrer" }
                              : {})}
                            className="border-b border-line pb-0.5 transition-colors hover:border-volt"
                          >
                            {d.value}
                          </a>
                        ) : (
                          d.value
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-6 rounded-2xl border border-volt/35 bg-volt/[0.04] p-8">
                <div className="mb-3 flex items-center gap-2.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-volt opacity-70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-volt" />
                  </span>
                  <span className="font-display text-[11px] uppercase tracking-[0.2em] text-accent">
                    Available
                  </span>
                </div>
                <p className="leading-relaxed text-fog">
                  Currently taking on new projects and retainers. Quickest reply
                  is WhatsApp — usually within a few hours, Dubai time.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <p className="mt-8 text-sm leading-relaxed text-fog">
                Not ready to talk yet? The{" "}
                <a href="/services" data-cursor="link" className="text-bone underline decoration-line underline-offset-4 transition-colors hover:decoration-volt">
                  services page
                </a>{" "}
                has prices and answers to most questions.
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
