"use client";

/**
 * KinayaShowcase — bespoke case-study layout for KinAya. Four distinct sections,
 * each with an editorial section header (index + large title): logo development
 * row, colour palette (interactive accordion swatches), final identity (gradient
 * mark + alternates), and the website (3D Mac mockup + brief + live link).
 */

import dynamic from "next/dynamic";
import { MacWireframe } from "./Wireframe";

// ModelDisplay is r3f / WebGL → dynamic, SSR-disabled, identical to the home card.
const ModelDisplay = dynamic(() => import("./ModelDisplay"), {
  ssr: false,
  loading: () => (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "var(--thumb-bg, #e0e0e0)" }}>
      <MacWireframe />
    </div>
  ),
});

/* ── Numbered section header (Packer style) ──────────────── */
function SectionHeader({ index, name }: { index: number; name: string }) {
  return (
    <header className="packer-section-header">
      <span className="packer-section-index">{String(index).padStart(2, "0")}</span>
      <h2 className="kinaya-section-name">{name}</h2>
    </header>
  );
}

/* ── Assets ───────────────────────────────────────────────── */
const LOGO_DEV = [
  "/images/kinaya/Logo%20Development/Asset%2030.png",
  "/images/kinaya/Logo%20Development/Asset%2031.png",
  "/images/kinaya/Logo%20Development/Asset%2032.png",
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
  { src: "/images/kinaya/Final%20Logos/Logo%20Pink.svg" },
  { src: "/images/kinaya/Final%20Logos/Logo%20Grey.svg" },
  // Lightest pink is a dark-mode mark — show it on a dark card.
  { src: "/images/kinaya/Final%20Logos/Logo%20Lightest%20Pink.svg", dark: true },
];

function MoonIcon() {
  return (
    <svg className="kinaya-alt-moon" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M13.5 9.5A5.5 5.5 0 0 1 6.5 2.5a5.5 5.5 0 1 0 7 7Z" fill="currentColor" />
    </svg>
  );
}


export default function KinayaShowcase() {
  return (
    <div className="kinaya-showcase">
      {/* 01 — Brand Identity */}
      <section className="kinaya-section">
        <SectionHeader index={1} name="Brand Identity" />
        <p className="packer-section-body">
          A full brand identity built from the ground up — logomark, logotype,
          colour system and guidelines — balancing warmth with the trust an NDIS
          audience needs.
        </p>

        <p className="kinaya-sub">Logo Development</p>
        <div
          className="kinaya-logo-dev"
          style={{ gridTemplateColumns: `repeat(${LOGO_DEV.length}, 1fr)` }}
        >
          {LOGO_DEV.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="" aria-hidden="true" />
          ))}
        </div>

        <p className="kinaya-sub">Colour Palette</p>
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

        <p className="kinaya-sub">Final Identity</p>
        <div className="kinaya-final">
          <div className="kinaya-final-main">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={FINAL_GRADIENT} alt="KinAya logo, gradient" />
          </div>
          <div className="kinaya-final-alts">
            {FINAL_ALTERNATES.map((a) => (
              <figure key={a.src} className={`kinaya-alt${a.dark ? " kinaya-alt-dark" : ""}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.src} alt="" aria-hidden="true" />
                {a.dark && <MoonIcon />}
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 02 — Website */}
      <section className="kinaya-section">
        <SectionHeader index={2} name="Website" />
        <p className="packer-section-body">
          Six-page Framer site, built for handover. CMS collections drive the
          repeating content (services, team, posts) so the KinAya team can
          publish without touching code. Built accessibility-first, with a custom
          site-wide text resizer that persists across sessions, alongside semantic
          HTML, focus states, and contrast tuned to the brand palette. SEO basics
          in place from launch: per-page metadata, Open Graph, clean URLs.
        </p>
        <a
          href="https://www.kinaya.com.au/"
          target="_blank"
          rel="noopener noreferrer"
          className="packer-link"
        >
          kinaya.com.au ↗
        </a>
        <div className="packer-website-visual">
          <ModelDisplay
            model="/models/studio-display/display.gltf"
            video="/images/kinaya/accessibility.webm"
            fill
            hoverable={false}
          />
        </div>
      </section>
    </div>
  );
}
