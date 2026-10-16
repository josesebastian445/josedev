import type { PostSummary } from "./cms-types";

const topics = (post: PostSummary) => new Set([post.tag, ...(post.tags ?? [])].map((tag) => tag.toLowerCase()));

export function filterPosts(posts: PostSummary[], query: string, topic: string) {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return posts.filter((post) => {
    const text = [post.title, post.excerpt, post.tag, ...(post.tags ?? [])].join(" ").toLowerCase();
    return (topic === "All topics" || post.tag === topic) && words.every((word) => text.includes(word));
  });
}

export function relatedPosts(current: PostSummary, posts: PostSummary[], limit = 3) {
  const currentTopics = topics(current);
  return posts.filter((post) => post.slug !== current.slug).map((post) => ({
    post,
    score: [...topics(post)].filter((tag) => currentTopics.has(tag)).length + (post.tag === current.tag ? 2 : 0),
  })).sort((a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date) || a.post.slug.localeCompare(b.post.slug))
    .slice(0, limit).map(({ post }) => post);
}
