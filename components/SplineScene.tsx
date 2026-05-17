"use client";

import Spline from "@splinetool/react-spline/next";

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
