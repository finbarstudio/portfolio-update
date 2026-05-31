"use client";

/**
 * KinayaShowcase — bespoke case-study layout for KinAya. Four distinct sections,
 * each with an editorial section header (index + large title): logo development
 * row, colour palette (interactive accordion swatches), final identity (gradient
 * mark + alternates), and the website (3D Mac mockup + brief + live link).
 */

import dynamic from "next/dynamic";
import Loader from "./Loader";

// ModelDisplay is r3f / WebGL → dynamic, SSR-disabled, identical to the home card.
const ModelDisplay = dynamic(() => import("./ModelDisplay"), {
  ssr: false,
  loading: () => (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "var(--color-bg)" }}>
      <Loader size={28} />
    </div>
  ),
});

/* ── Editorial section header ─────────────────────────────── */
function SectionHeader({ index, total, name }: { index: number; total: number; name: string }) {
  return (
    <header className="kinaya-section-header">
      <span className="kinaya-section-index">
        {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
      <h2 className="kinaya-section-name">{name}</h2>
    </header>
  );
}

/* ── Assets ───────────────────────────────────────────────── */
const LOGO_DEV = [
  "/images/kinaya/Logo%20Development/Asset%2030.png",
  "/images/kinaya/Logo%20Development/Asset%2031.png",
  "/images/kinaya/Logo%20Development/Asset%2032.png",
  "/images/kinaya/Logo%20Development/Asset%2034.png",
  "/images/kinaya/Logo%20Development/Asset%2035.png",
  "/images/kinaya/Logo%20Development/Asset%2037.png",
  "/images/kinaya/Logo%20Development/Asset%2038.png",
];

const PALETTE = [
  { hex: "#2F4858", text: "#FFFFFF" },
  { hex: "#E94E77", text: "#FFFFFF" },
  { hex: "#FF8AA2", text: "#FFFFFF" },
  { hex: "#FFE6EB", text: "#2F4858" },
];

const FINAL_GRADIENT = "/images/kinaya/Final%20Logos/Logo%20Gradient.svg";
const FINAL_ALTERNATES = [
  "/images/kinaya/Final%20Logos/Logo%20Pink.svg",
  "/images/kinaya/Final%20Logos/Logo%20Grey.svg",
  "/images/kinaya/Final%20Logos/Logo%20Lightest%20Pink.svg",
];

const TOTAL = 4;

export default function KinayaShowcase() {
  return (
    <div className="kinaya-showcase">
      {/* 01 — Logo Development */}
      <section className="kinaya-section">
        <SectionHeader index={1} total={TOTAL} name="Logo Development" />
        <div className="kinaya-logo-dev">
          {LOGO_DEV.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="" aria-hidden="true" />
          ))}
        </div>
      </section>

      {/* 02 — Colour Palette */}
      <section className="kinaya-section">
        <SectionHeader index={2} total={TOTAL} name="Colour Palette" />
        <div className="kinaya-palette">
          {PALETTE.map((c) => (
            <div
              key={c.hex}
              className="kinaya-swatch"
              style={{ background: c.hex, color: c.text }}
            >
              <span className="kinaya-swatch-hex">{c.hex}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 03 — Final Identity */}
      <section className="kinaya-section">
        <SectionHeader index={3} total={TOTAL} name="Final Identity" />
        <div className="kinaya-final">
          <div className="kinaya-final-main">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={FINAL_GRADIENT} alt="KinAya logo, gradient" />
          </div>
          <div className="kinaya-final-alts">
            {FINAL_ALTERNATES.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={src} src={src} alt="" aria-hidden="true" />
            ))}
          </div>
        </div>
      </section>

      {/* 04 — Website */}
      <section className="kinaya-section">
        <SectionHeader index={4} total={TOTAL} name="Website" />
        <div className="kinaya-website">
          <p className="kinaya-website-body">
            Six-page Framer site, built for handover. CMS collections drive the
            repeating content (services, team, posts) so the KinAya team can
            publish without touching code. Built accessibility-first — a custom
            site-wide text resizer persists across sessions, alongside semantic
            HTML, focus states, and contrast tuned to the brand palette. SEO
            basics in place from launch: per-page metadata, Open Graph, clean
            URLs.
          </p>
          <a
            href="https://www.kinaya.com.au/"
            target="_blank"
            rel="noopener noreferrer"
            className="kinaya-website-link"
          >
            kinaya.com.au ↗
          </a>
          <div className="kinaya-website-visual">
            <ModelDisplay
              model="/models/studio-display/display.gltf"
              video="/images/kinaya/accessibility.webm"
              fill
              hoverable={false}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
