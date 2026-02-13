import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "72px",
          background: "#0f172a",
          color: "#f8fafc",
          fontFamily: "Arial, sans-serif",
          gap: "20px",
        }}
      >
        <div style={{ fontSize: 34, opacity: 0.9 }}>Hero4Job</div>
        <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.05 }}>
          Build a professional Hero CV
        </div>
        <div style={{ fontSize: 34, opacity: 0.85 }}>
          Edit sections, preview instantly, export as PDF.
        </div>
      </div>
    ),
    size,
  );
}
