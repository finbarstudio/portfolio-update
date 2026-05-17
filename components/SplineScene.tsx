"use client";

import dynamic from "next/dynamic";

// Use the regular (non-Next) Spline with ssr:false — the /next variant only
// accepts CDN URLs and silently fails on local /public/*.splinecode paths.
const Spline = dynamic(() => import("@splinetool/react-spline"), { ssr: false });

// Renders a Spline scene filling a 16/9 container.
// Used as the hero on case study pages and featured home-page cards.
export default function SplineScene({ scene }: { scene: string }) {
  return (
    <div
      style={{
        aspectRatio: "16/9",
        maxHeight: "72vh",
        overflow: "hidden",
        position: "relative",
        background: "var(--bg)",
      }}
    >
      <Spline
        scene={scene}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
    </div>
  );
}
