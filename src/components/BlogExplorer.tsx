"use client";

import { useState } from "react";
import type { PostSummary } from "@/lib/cms-types";
import { filterPosts } from "@/lib/blog-discovery";
import PostRow from "./PostRow";
import { Stagger } from "./motion-primitives";

export default function BlogExplorer({ posts }: { posts: PostSummary[] }) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("All topics");
  const topics = ["All topics", ...Array.from(new Set(posts.map((post) => post.tag))).sort()];
  const filtered = filterPosts(posts, query, topic);
  return (
    <div>
      <div className="blog-controls">
        <div className="blog-search"><label htmlFor="blog-search">Find something useful</label><div><span aria-hidden="true">⌕</span><input id="blog-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search articles, topics, or a problem…" autoComplete="off" /></div></div>
        <div className="blog-topic"><label htmlFor="blog-topic">Browse by topic</label><select id="blog-topic" value={topic} onChange={(event) => setTopic(event.target.value)}>{topics.map((item) => <option key={item}>{item}</option>)}</select></div>
      </div>
      <div className="mb-5 flex items-center justify-between gap-4 text-sm text-fog"><p role="status" aria-live="polite">{filtered.length} {filtered.length === 1 ? "article" : "articles"}{topic !== "All topics" ? ` in ${topic}` : " to explore"}</p>{(query || topic !== "All topics") && <button className="text-accent underline underline-offset-4" type="button" onClick={() => { setQuery(""); setTopic("All topics"); }}>Clear filters</button>}</div>
      {filtered.length ? <Stagger key={`${query}:${topic}`} className="border-t border-line" gap={0.025}>{filtered.map((post) => <PostRow key={post.slug} post={post} />)}</Stagger> : <div className="rounded-2xl border border-dashed border-line px-6 py-16 text-center"><h2 className="font-display text-2xl">No matches this time.</h2><p className="mt-3 text-fog">Try a shorter phrase or choose another topic.</p></div>}
    </div>
  );
}
