"use client";

/**
 * PackerShowcase — bespoke case-study layout for Packer & Associates. The
 * engagement spanned three workstreams over the contract: website management,
 * the capability statement, and ongoing social/editorial content.
 */

import dynamic from "next/dynamic";
import Loader from "./Loader";
import PdfSlideshowThumb from "./PdfSlideshowThumb";

// ModelDisplay is r3f / WebGL → dynamic, SSR-disabled.
const ModelDisplay = dynamic(() => import("./ModelDisplay"), {
  ssr: false,
  loading: () => (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "var(--color-bg)" }}>
      <Loader size={28} />
    </div>
  ),
});

// Live Packer & Associates site. Fill in when confirmed; the link only renders
// when set.
const SITE_URL = "";

const PDF_PAGES = Array.from({ length: 12 }, (_, i) =>
  `/images/packer-associates/pdf-pages/page-${i}.webp`
);

function SectionHeader({ index, name }: { index: number; name: string }) {
  return (
    <header className="packer-section-header">
      <span className="packer-section-index">{String(index).padStart(2, "0")}</span>
      <h2 className="kinaya-section-name">{name}</h2>
    </header>
  );
}

export default function PackerShowcase() {
  return (
    <div className="kinaya-showcase">
      {/* 01 — Website */}
      <section className="kinaya-section">
        <SectionHeader index={1} name="Website Management" />
        <p className="packer-section-body">
          I ran and maintained the Packer &amp; Associates website across the
          contract: content updates, new pages, layout work and general upkeep,
          keeping the site current and on brand as the business grew.
        </p>
        {SITE_URL && (
          <a
            href={SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="packer-link"
          >
            Visit the live site ↗
          </a>
        )}
        <div className="packer-website-visual">
          <ModelDisplay
            model="/models/studio-display/display.gltf"
            video="/images/packer-associates/3D%20Model%20Video.webm"
            fill
            hoverable={false}
          />
        </div>
      </section>

      {/* 02 — Capability Statement */}
      <section className="kinaya-section">
        <SectionHeader index={2} name="Capability Statement" />
        <p className="packer-section-body">
          The flagship deliverable. A twelve-page digital capability statement,
          written, designed and produced from scratch to present the company and
          its services with clarity.
        </p>
        <div className="packer-pdf">
          <PdfSlideshowThumb pages={PDF_PAGES} />
        </div>
      </section>

      {/* 03 — Social & Editorial */}
      <section className="kinaya-section">
        <SectionHeader index={3} name="Social & Editorial" />
        <p className="packer-section-body">
          Ongoing content for the company blog and LinkedIn. I wrote and designed
          posts that kept the brand active, consistent and visible to its audience
          throughout the engagement.
        </p>
        <ul className="packer-pills" aria-label="Channels">
          <li>Blog articles</li>
          <li>LinkedIn posts</li>
          <li>Social graphics</li>
          <li>Editorial design</li>
          <li>Brand consistency</li>
        </ul>
      </section>
    </div>
  );
}
