"use client";

/**
 * KinayaShowcase — bespoke case-study layout for KinAya. Four distinct sections,
 * each with an editorial section header (index + large title): logo development
 * row, colour palette (interactive accordion swatches), final identity (gradient
 * mark + alternates), and the website (3D Mac mockup + brief + live link).
 */

import dynamic from "next/dynamic";
import Loader from "./Loader";
import { MdOpenInNew } from "@/components/MaterialIcon";
import { media } from "@/lib/media";

// ModelDisplay is r3f / WebGL → dynamic, SSR-disabled, identical to the home card.
const ModelDisplay = dynamic(() => import("./ModelDisplay"), {
  ssr: false,
  loading: () => (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "transparent" }}>
      <Loader bare />
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
  media("/media/images/kinaya/logo-development/asset-30.png"),
  media("/media/images/kinaya/logo-development/asset-31.png"),
  media("/media/images/kinaya/logo-development/asset-32.png"),
  media("/media/images/kinaya/logo-development/asset-35.png"),
  media("/media/images/kinaya/logo-development/asset-37.png"),
  media("/media/images/kinaya/logo-development/asset-38.png"),
];

const PALETTE = [
  { hex: "#2F4858", text: "#FFFFFF" },
  { hex: "#E94E77", text: "#FFFFFF" },
  { hex: "#FF8AA2", text: "#FFFFFF" },
  { hex: "#FFE6EB", text: "#2F4858" },
];

const FINAL_GRADIENT = media("/media/images/kinaya/final-logos/logo-gradient.svg");
const FINAL_ALTERNATES = [
  { src: media("/media/images/kinaya/final-logos/logo-pink.svg") },
  { src: media("/media/images/kinaya/final-logos/logo-grey.svg") },
  // Lightest pink is a dark-mode mark — show it on a dark card.
  { src: media("/media/images/kinaya/final-logos/logo-lightest-pink.svg"), dark: true },
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
          A full brand identity built from the ground up: logomark, logotype,
          colour system and guidelines, balancing warmth with the trust an NDIS
          audience needs.
        </p>

        <p className="kinaya-sub">Logo Development</p>
        {/* Columns come from .kinaya-logo-dev so the mobile media query can reflow
            the row; no inline grid override (it would beat the breakpoint). */}
        <div className="kinaya-logo-dev">
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
          href="/go/kinaya"
          target="_blank"
          rel="noopener noreferrer"
          className="packer-link"
        >
          kinaya.com.au <MdOpenInNew size={13} />
        </a>
        <div className="packer-website-visual">
          <ModelDisplay
            model={media("/media/models/studio-display/display.gltf")}
            video={media("/media/images/kinaya/accessibility.webm")}
            fill
            bare
            hoverable={false}
          />
        </div>
      </section>
    </div>
  );
}
