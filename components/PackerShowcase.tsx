"use client";

/**
 * PackerShowcase — bespoke case-study layout for Packer & Associates: the
 * capability statement, then the website I looked after across the contract.
 */

import dynamic from "next/dynamic";
import Loader from "./Loader";
import PdfSlideshowThumb from "./PdfSlideshowThumb";
import { MdOpenInNew } from "@/components/MaterialIcon";
import { media } from "@/lib/media";

// ModelDisplay is r3f / WebGL → dynamic, SSR-disabled.
const ModelDisplay = dynamic(() => import("./ModelDisplay"), {
  ssr: false,
  loading: () => (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "transparent" }}>
      <Loader bare />
    </div>
  ),
});

const SITE_URL = "https://packerandassociates.com.au/";

const PDF_PAGES = Array.from({ length: 12 }, (_, i) =>
  media(`/media/images/packer-associates/pdf-pages/page-${i}.webp`)
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
      {/* 01 — Capability Statement */}
      <section className="kinaya-section">
        <SectionHeader index={1} name="Capability Statement" />
        <p className="packer-section-body">
          The document they send to prospective clients. In twelve pages it sets
          out who Packer &amp; Associates are, what they do and who they work
          with, then walks through five client projects, from BHP and Rio Tinto
          to TAFE Queensland. I gathered the content, wrote it and designed it as
          a digital document that goes out in new business conversations and
          from the team&apos;s email signatures.
        </p>
        <div className="packer-pdf">
          <PdfSlideshowThumb pages={PDF_PAGES} hover={false} nav />
        </div>
      </section>

      {/* 02 — Website */}
      <section className="kinaya-section">
        <SectionHeader index={2} name="Website Management" />
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
            Visit the live site <MdOpenInNew size={13} />
          </a>
        )}
        <div className="packer-website-visual">
          <ModelDisplay
            model={media("/media/models/studio-display/display.gltf")}
            video={media("/media/images/packer-associates/3d-model-video.webm")}
            fill
            bare
            hoverable={false}
          />
        </div>
      </section>
    </div>
  );
}
