"use client";

import dynamic from "next/dynamic";

// Use the regular (non-Next) Spline with ssr:false, the /next variant only
// accepts CDN URLs and silently fails on local /public/*.splinecode paths.
// Loading fallback matches the container bg so there's no flash on mount.
const Spline = dynamic(
  () => import("@splinetool/react-spline"),
  {
    ssr: false,
    loading: () => (
      <div style={{ position: "absolute", inset: 0, background: "var(--bg)" }} />
    ),
  }
);

// Renders a Spline scene filling a 16/9 container.
// Used as the hero on case study pages and featured home-page cards.
export default function SplineScene({ scene, style }: { scene: string; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        aspectRatio: "16/9",
        maxHeight: "72vh",
        overflow: "hidden",
        position: "relative",
        background: "var(--bg)",
        ...style,
      }}
    >
      <Spline
        scene={scene}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
    </div>
  );
}
