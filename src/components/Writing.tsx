"use client";

import Link from "next/link";
import { Reveal, SectionLabel, Stagger } from "./motion-primitives";
import PostRow from "./PostRow";
import { POSTS } from "@/content/posts";

/**
 * The three most recent posts on the home page. Reuses PostRow so the /blog
 * index and this section can never drift apart visually.
 */
export default function Writing() {
  const recent = POSTS.slice(0, 3);
  if (recent.length === 0) return null;

  return (
    <section id="writing" className="relative py-32 md:py-44">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionLabel index="05">Writing</SectionLabel>

        <div className="mb-14 flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] font-bold leading-[0.98] tracking-[-0.03em]">
              Notes
              <span className="text-fog"> from the work.</span>
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-fog">
              A new post most weeks — usually something I had to figure out for
              a client that week, written down so the next person does not have
              to.
            </p>
          </div>

          <Link
            href="/blog"
            data-cursor="link"
            className="group flex items-center gap-3 font-display text-sm text-fog transition-colors hover:text-bone"
          >
            All posts
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-all duration-400 group-hover:border-volt group-hover:bg-volt group-hover:text-on-accent">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 7h11M7 2l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        </div>

        <Reveal>
          <Stagger className="border-t border-line" gap={0.07}>
            {recent.map((p) => (
              <PostRow key={p.slug} post={p} />
            ))}
          </Stagger>
        </Reveal>
      </div>
    </section>
  );
}
