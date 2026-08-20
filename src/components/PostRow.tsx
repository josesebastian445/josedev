"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { formatDate, type Post } from "@/content/posts";
import { staggerItem } from "./motion-primitives";

export default function PostRow({ post }: { post: Post }) {
  return (
    <motion.div variants={staggerItem}>
      <Link
        href={`/blog/${post.slug}`}
        data-cursor="link"
        className="group relative block border-b border-line py-10 md:py-12"
      >
        {/* wipe that fills from the left on hover */}
        <span className="absolute inset-x-[-1.5rem] inset-y-0 -z-10 origin-left scale-x-0 rounded-xl bg-ink-2/70 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />

        <div className="flex flex-col gap-6 md:flex-row md:items-baseline md:gap-12">
          <div className="flex shrink-0 items-center gap-4 md:w-56">
            <span className="rounded-full border border-line px-3 py-1 font-display text-[11px] uppercase tracking-[0.16em] text-accent">
              {post.tag}
            </span>
            <span className="font-display text-xs text-fog">
              {formatDate(post.date)}
            </span>
          </div>

          <div className="flex-1">
            <h2 className="font-display text-2xl font-semibold leading-tight tracking-tight transition-colors duration-400 group-hover:text-accent md:text-3xl">
              {post.title}
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-fog">
              {post.excerpt}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-5">
            <span className="font-display text-xs text-fog">
              {post.readingMinutes} min
            </span>
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-fog transition-all duration-500 group-hover:border-volt group-hover:bg-volt group-hover:text-on-accent">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 7h11M7 2l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
