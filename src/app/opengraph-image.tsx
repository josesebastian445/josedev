import { ImageResponse } from "next/og";

export const alt = "Jose Sebastian — Web Developer & Interface Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
            top: -200,
            right: -160,
            width: 720,
            height: 720,
            borderRadius: 9999,
            background:
              "radial-gradient(circle at 40% 40%, rgba(107,91,255,0.55), rgba(5,6,10,0) 62%)",
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
          <div style={{ color: "#e8e9ee", fontSize: 26, letterSpacing: -0.5, display: "flex" }}>
            JOSE<span style={{ color: "#8b8fa3" }}>.SEBASTIAN</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#e8e9ee",
              fontSize: 84,
              lineHeight: 1.02,
              letterSpacing: -3,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>I build websites</span>
            <span style={{ color: "#8b8fa3" }}>people actually remember.</span>
          </div>
          <div
            style={{
              marginTop: 34,
              height: 5,
              width: 190,
              background: "#c8ff2e",
              display: "flex",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#8b8fa3",
            fontSize: 24,
          }}
        >
          <span>Web developer &amp; interface engineer</span>
          <span>Next.js · TypeScript · WebGL</span>
        </div>
      </div>
    ),
    size
  );
}
