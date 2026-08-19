import { ImageResponse } from "next/og";
import { getPost, formatDate, POSTS } from "@/content/posts";

export const alt = "Article by Jose Sebastian";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#05060a",
          padding: 72,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: -260,
            left: -120,
            width: 760,
            height: 760,
            borderRadius: 9999,
            background:
              "radial-gradient(circle at 50% 50%, rgba(200,255,46,0.20), rgba(5,6,10,0) 64%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 9999,
                background: "#c8ff2e",
                display: "flex",
              }}
            />
            <div style={{ color: "#e8e9ee", fontSize: 24, letterSpacing: -0.5, display: "flex" }}>
              JOSE<span style={{ color: "#8b8fa3" }}>.SEBASTIAN</span>
            </div>
          </div>
          <div
            style={{
              color: "#c8ff2e",
              fontSize: 20,
              letterSpacing: 3,
              border: "1px solid rgba(200,255,46,0.4)",
              borderRadius: 9999,
              padding: "10px 22px",
              display: "flex",
            }}
          >
            {(post?.tag ?? "WRITING").toUpperCase()}
          </div>
        </div>

        <div
          style={{
            color: "#e8e9ee",
            fontSize: post && post.title.length > 46 ? 62 : 74,
            lineHeight: 1.08,
            letterSpacing: -2.4,
            display: "flex",
            maxWidth: 1000,
          }}
        >
          {post?.title ?? "Writing"}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#8b8fa3",
            fontSize: 24,
            borderTop: "1px solid #1e2230",
            paddingTop: 28,
          }}
        >
          <span>{post ? formatDate(post.date) : ""}</span>
          <span>{post ? `${post.readingMinutes} min read` : ""}</span>
        </div>
      </div>
    ),
    size
  );
}
