import { ImageResponse } from "next/og";
import { getProject, PROJECTS } from "@/content/projects";

export const alt = "Case study by Jose Sebastian";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  const [from, to] = project?.art ?? ["#6b5bff", "#0b0d16"];

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
        {/* Satori only understands the `circle at X% Y%` radial form — the
            `120% 100% at ...` syntax silently renders as nothing. */}
        <div
          style={{
            position: "absolute",
            top: -260,
            right: -200,
            width: 900,
            height: 900,
            borderRadius: 9999,
            background: `radial-gradient(circle at 45% 45%, ${from}, rgba(5,6,10,0) 58%)`,
            display: "flex",
          }}
        />

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

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#c8ff2e", fontSize: 22, letterSpacing: 4, display: "flex" }}>
            {(project?.client ?? "CASE STUDY").toUpperCase()} · {project?.year ?? ""}
          </div>
          <div
            style={{
              color: "#ffffff",
              fontSize: 92,
              lineHeight: 1.0,
              letterSpacing: -3,
              marginTop: 18,
              display: "flex",
            }}
          >
            {project?.title ?? "Case study"}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 56,
            borderTop: "1px solid rgba(232,233,238,0.18)",
            paddingTop: 30,
          }}
        >
          {(project?.results ?? []).slice(0, 3).map((r) => (
            <div key={r.label} style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ color: "#ffffff", fontSize: 46, letterSpacing: -1.5 }}>
                {r.value}
              </span>
              <span style={{ color: "rgba(232,233,238,0.7)", fontSize: 20, marginTop: 6 }}>
                {r.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
