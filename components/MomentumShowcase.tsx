"use client";

/**
 * MomentumShowcase — bespoke case-study layout for Momentum Mentoring, using the
 * same styling as the Packer / KinAya pages (numbered headers, body copy, pink
 * link, rounded visual frame).
 */

import dynamic from "next/dynamic";
import Loader from "./Loader";

const ModelDisplay = dynamic(() => import("./ModelDisplay"), {
  ssr: false,
  loading: () => (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "var(--thumb-bg, #e0e0e0)" }}>
      <Loader />
    </div>
  ),
});

export default function MomentumShowcase() {
  return (
    <div className="kinaya-showcase">
      {/* 01 — Brand & Website */}
      <section className="kinaya-section">
        <header className="packer-section-header">
          <span className="packer-section-index">01</span>
          <h2 className="kinaya-section-name">Brand &amp; Website</h2>
        </header>
        <p className="packer-section-body">
          Brand identity and a Framer website for an NDIS mentoring provider. The
          goal was something warm and human that still felt empowering, never
          clinical. Designed and built end to end, ready for the team to run
          themselves.
        </p>
        <a
          href="https://momentummentoring.co"
          target="_blank"
          rel="noopener noreferrer"
          className="packer-link"
        >
          momentummentoring.co ↗
        </a>
        <div className="packer-website-visual">
          <ModelDisplay
            model="/models/studio-display/display.gltf"
            video="/images/momentum-mentoring/screen.mp4"
            fill
            bare
            hoverable={false}
          />
        </div>
      </section>
    </div>
  );
}
