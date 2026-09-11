import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0E14",
          color: "#C9A063",
          borderRadius: "36px",
          border: "4px solid #D6127E",
          fontSize: 100,
          fontWeight: 800,
          fontFamily: "sans-serif",
        }}
      >
        إ
      </div>
    ),
    {
      ...size,
    }
  );
}