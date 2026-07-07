import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        color: "#fafafa",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: 72, fontWeight: 600 }}>next-template</div>
      <div style={{ fontSize: 28, color: "#a1a1aa", marginTop: 16 }}>
        Next.js, auth, Postgres, and Docker — pre-wired
      </div>
    </div>,
    { ...size }
  );
}
