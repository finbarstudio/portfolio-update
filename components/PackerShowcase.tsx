"use client";

/**
 * PackerShowcase — bespoke case-study layout for Packer & Associates. The
 * engagement spanned three workstreams over the contract: website management,
 * the capability statement, and ongoing social/editorial content.
 */

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { MacWireframe } from "./Wireframe";
import PdfSlideshowThumb from "./PdfSlideshowThumb";

/* A looping reel that plays while in view, with a play/pause button and a
   stylised pink scrubber. */
function Reel({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const userPaused = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setInView(true); return; }
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Play on enter (unless the user paused it), pause on leave.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (inView && !userPaused.current) el.play().catch(() => {});
    else el.pause();
  }, [inView]);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) { userPaused.current = false; el.play().catch(() => {}); }
    else { userPaused.current = true; el.pause(); }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !el.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    el.currentTime = ratio * el.duration;
    setProgress(ratio);
  };

  return (
    <div className="packer-reel">
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        onClick={toggle}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          if (v.duration) setProgress(v.currentTime / v.duration);
        }}
      />
      <div className="reel-controls">
        <button type="button" onClick={toggle} aria-label={playing ? "Pause" : "Play"} className="reel-btn">
          {playing ? (
            <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
              <rect x="2" y="1.5" width="2.6" height="9" rx="0.6" fill="currentColor" />
              <rect x="7.4" y="1.5" width="2.6" height="9" rx="0.6" fill="currentColor" />
            </svg>
          ) : (
            <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M3 1.8 10 6 3 10.2V1.8Z" fill="currentColor" />
            </svg>
          )}
        </button>
        <div className="reel-track" onClick={seek} role="slider" aria-label="Seek" aria-valuenow={Math.round(progress * 100)} tabIndex={0}>
          <div className="reel-fill" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
    </div>
  );
}

// ModelDisplay is r3f / WebGL → dynamic, SSR-disabled.
const ModelDisplay = dynamic(() => import("./ModelDisplay"), {
  ssr: false,
  loading: () => (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "var(--thumb-bg, #e0e0e0)" }}>
      <MacWireframe />
    </div>
  ),
});

const SITE_URL = "https://packerandassociates.com.au/";

const PDF_PAGES = Array.from({ length: 12 }, (_, i) =>
  `/images/packer-associates/pdf-pages/page-${i}.webp`
);

const SOCIAL = [
  "free-elearn-course",
  "graphic-design",
  "stimula",
  "post-1",
  "post-2",
  "post-3",
].map((n) => `/images/packer-associates/social/${n}.webp`);

const REELS = [
  { src: "/images/packer-associates/reels/compass-reel.webm", poster: "/images/packer-associates/reels/compass-reel.webp" },
  { src: "/images/packer-associates/reels/stimula-reel.webm", poster: "/images/packer-associates/reels/stimula-reel.webp" },
];

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
          The flagship deliverable. A twelve-page digital capability statement,
          written, designed and produced from scratch to present the company and
          its services with clarity.
        </p>
        <div className="packer-pdf">
          <PdfSlideshowThumb pages={PDF_PAGES} hover={false} nav />
        </div>
      </section>

      {/* 02 — Social & Editorial */}
      <section className="kinaya-section">
        <SectionHeader index={2} name="Social & Editorial" />
        <p className="packer-section-body">
          Ongoing content for the company blog and LinkedIn, plus animated logo
          reels for their clients. I wrote and designed posts and built motion
          pieces that kept the brand active, consistent and visible throughout the
          engagement.
        </p>

        {/* Logo reels — square looping showreels */}
        <div className="packer-reels">
          {REELS.map((r) => (
            <Reel key={r.src} src={r.src} poster={r.poster} />
          ))}
        </div>

        {/* Social / blog graphics marquee */}
        <div className="packer-marquee" aria-label="Social and blog graphics">
          <div className="packer-marquee-track">
            {[...SOCIAL, ...SOCIAL].map((src, i) => (
              <div key={i} className="packer-marquee-card" aria-hidden={i >= SOCIAL.length}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 03 — Website */}
      <section className="kinaya-section">
        <SectionHeader index={3} name="Website Management" />
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
    </div>
  );
}
