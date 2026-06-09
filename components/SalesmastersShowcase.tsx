"use client";

/**
 * SalesmastersShowcase — bespoke case study for the Salesmasters sales playbooks.
 * Three sections: the clients / credibility (cover marquee + stats + site link),
 * the playbook itself (interactive page viewer of a full edition), and the
 * bespoke infographics and technique diagrams.
 */

import type { ReactNode } from "react";
import BookViewer from "./BookViewer";

const SITE_URL = "https://salesmasters.com.au";

const PLAYBOOK_PAGES = Array.from({ length: 20 }, (_, i) =>
  `/images/salesmasters/playbook/page-${i + 1}.webp`
);

const LOGOS = [
  "active-medical.svg",
  "bus4x4.svg",
  "alpha-lifecare.svg",
  "siteware-direct.webp",
  "criterion.svg",
  "cutek.webp",
  "all-storage-systems.webp",
  "prescience.webp",
  "connected-platforms.svg",
].map((n) => `/images/salesmasters/logos/${n}`);

const G = "/images/salesmasters/graphics";

const CUTEK_ICONS = ["architects", "consumers", "distributors", "government"].map(
  (n) => `${G}/cutek/${n}.webp`
);
const AM_ICONS = ["handshake", "target", "graph", "star", "bolt", "simple"].map(
  (n) => `${G}/active-medical/icons/${n}.webp`
);

const STATS = [
  { value: "15+", tag: "Playbooks", label: "Across five industries" },
  { value: "12+", tag: "Months", label: "Of repeat work" },
  { value: "~70", tag: "Hours", label: "Per edition" },
];

function SectionHeader({ index, name }: { index: number; name: string }) {
  return (
    <header className="packer-section-header">
      <span className="packer-section-index">{String(index).padStart(2, "0")}</span>
      <h2 className="kinaya-section-name">{name}</h2>
    </header>
  );
}

/* ── Graphics building blocks ──────────────────────────────── */
function Company({ name, caption, children }: { name: string; caption?: string; children: ReactNode }) {
  return (
    <div className="sm-company">
      <p className="sm-company-name">{name}</p>
      {caption && <p className="sm-company-caption">{caption}</p>}
      <div className="sm-co-row">{children}</div>
    </div>
  );
}

function Tile({ src, tall = false, wide = false, icon = false }: { src: string; tall?: boolean; wide?: boolean; icon?: boolean }) {
  return (
    <figure className={`sm-tile${tall ? " sm-tile-tall" : ""}${wide ? " sm-tile-wide" : ""}${icon ? " sm-tile-icon" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" aria-hidden="true" loading="lazy" />
    </figure>
  );
}

export default function SalesmastersShowcase() {
  return (
    <div className="kinaya-showcase">
      {/* 01 — Clients & credibility */}
      <section className="kinaya-section">
        <SectionHeader index={1} name="The Clients" />
        <p className="packer-section-body">
          Salesmasters brought me in to produce bespoke sales playbooks for their
          own clients: established companies across healthcare, manufacturing,
          technology, storage and professional services. Each one was built from
          scratch to that client&apos;s brand, industry and sales process. The
          clearest signal is the repeat work, edition after edition, across more
          than a year.
        </p>

        <div className="outcomes-grid sm-stats">
          {STATS.map((s) => (
            <div key={s.label} className="outcomes-stat">
              <div className="outcomes-value">{s.value}</div>
              <div className="outcomes-delta">{s.tag}</div>
              <div className="outcomes-label">{s.label}</div>
            </div>
          ))}
        </div>

        <a href={SITE_URL} target="_blank" rel="noopener noreferrer" className="packer-link">
          salesmasters.com.au ↗
        </a>

        {/* Client logos, scrolling — grey, colour on hover */}
        <div className="sm-logo-marquee" aria-label="Client logos">
          <div className="sm-logo-track">
            {[...LOGOS, ...LOGOS].map((src, i) => (
              <div key={i} className="sm-logo" aria-hidden={i >= LOGOS.length}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 02 — The playbook */}
      <section className="kinaya-section">
        <SectionHeader index={2} name="The Playbook" />
        <p className="packer-section-body">
          Every edition was the full job, roughly seventy hours each. I read the
          client&apos;s brand guidelines, learned their tone of voice and their
          sales jargon, and pulled content and imagery straight from their own
          site. Then I wrote the playbook end to end (3,000 to 3,500 words),
          always with the salesperson reading it in mind, and structured it into
          ordered chapters with a contents page, bespoke title pages and a
          cohesive layout that ties the whole document together. Delivered as both
          an interactive, distributable PDF and a print edition, with the print
          pre-production managed through to delivery.
        </p>
        {/* Highlight the pages 8–9 spread (cover=0, then 2-3,4-5,6-7,8-9 → index 4). */}
        <BookViewer pages={PLAYBOOK_PAGES} markSpread={4} />
        <p className="sm-excerpt-note">A 20-page excerpt of a full-length sales playbook.</p>
      </section>

      {/* 03 — Infographics & technique diagrams, grouped by client */}
      <section className="kinaya-section">
        <SectionHeader index={3} name="Graphics & Diagrams" />
        <p className="packer-section-body">
          To hold the reader&apos;s attention through dense material, I tied each
          playbook together with custom graphics, all built to the client&apos;s
          brand: bespoke Sales Wheels mapping their process, technique frameworks
          like BANT and STAR drawn as purpose-built diagrams, client-specific
          process maps, and custom icon sets.
        </p>

        {/* Site Ware Direct — wheel, BANT, STAR side by side, all 2-row tall */}
        <Company
          name="Site Ware Direct"
          caption="BANT and STAR technique diagrams and a custom Sales Wheel, styled as fabric swatches — a nod to their industrial workwear manufacturing."
        >
          <div className="sm-co-3up">
            <Tile src={`${G}/site-ware-direct/wheel.webp`} tall />
            <Tile src={`${G}/site-ware-direct/bant.webp`} tall />
            <Tile src={`${G}/site-ware-direct/star.webp`} tall />
          </div>
        </Company>

        {/* Cutek — Sales Wheel (tall) + 2×2 audience icons */}
        <Company name="Cutek" caption="Sales Wheel and a custom audience icon set across their market segments.">
          <Tile src={`${G}/cutek/wheel.webp`} tall />
          <div className="sm-co-2x2">
            {CUTEK_ICONS.map((src) => <Tile key={src} src={src} icon />)}
          </div>
        </Company>

        {/* Bus4x4 — tyre wheel first, then six-point walkround, both tall */}
        <Company name="Bus4x4" caption="The bespoke tyre-wheel illustration and the custom six-point walkround diagram.">
          <Tile src={`${G}/bus4x4/wheel.webp`} tall />
          <Tile src={`${G}/bus4x4/technical.webp`} tall wide />
        </Company>

        {/* Active Medical — Sales Wheel (tall) + 3×2 icon grid */}
        <Company name="Active Medical" caption="Sales Wheel and a bespoke icon set.">
          <Tile src={`${G}/active-medical/wheel.webp`} tall />
          <div className="sm-co-3x2">
            {AM_ICONS.map((src) => <Tile key={src} src={src} icon />)}
          </div>
        </Company>
      </section>
    </div>
  );
}
