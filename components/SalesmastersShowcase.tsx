"use client";

/**
 * SalesmastersShowcase — bespoke case study for the Salesmasters sales playbooks.
 * Three sections: the clients / credibility (cover marquee + stats + site link),
 * the playbooks themselves (every page of nine editions, to pick up and read in
 * 3D: components/portfolio/PfBooklet.tsx), and one client's diagrams.
 */

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { MdOpenInNew } from "@/components/MaterialIcon";
import { media } from "@/lib/media";
import { SALESMASTERS_BOOKS } from "@/content/salesmasters-books";

const SITE_URL = "https://salesmasters.com.au";

// three.js and the page images: client only, and only fetched with this page
const PfBooklet = dynamic(() => import("./portfolio/PfBooklet"), { ssr: false });

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
].map((n) => media(`/media/images/salesmasters/logos/${n}`));

const G = "/media/images/salesmasters/graphics";

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

function Tile({ src, tall = false }: { src: string; tall?: boolean }) {
  return (
    <figure className={`sm-tile${tall ? " sm-tile-tall" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={media(src)} alt="" aria-hidden="true" loading="lazy" />
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
          Salesmasters brought me in to produce custom sales playbooks for their
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
          salesmasters.com.au <MdOpenInNew size={13} />
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
          ordered chapters with a contents page, custom title pages and a
          cohesive layout that ties the whole document together. Delivered as both
          an interactive, distributable PDF and a print edition, with the print
          pre-production managed through to delivery.
        </p>
        <div className="sm-booklet">
          <PfBooklet books={SALESMASTERS_BOOKS} />
        </div>
        <p className="sm-excerpt-note">
          Nine playbooks, every page. Pick one, then click or drag a page to turn it. Spreads lays the whole book out at once.
        </p>
      </section>

      {/* 03 — Infographics & technique diagrams, grouped by client */}
      <section className="kinaya-section">
        <SectionHeader index={3} name="Graphics & Diagrams" />
        <p className="packer-section-body">
          To hold the reader&apos;s attention through dense material, I tied each
          playbook together with custom graphics, all built to the client&apos;s
          brand: custom Sales Wheels that map their process, technique frameworks
          like BANT and STAR drawn as purpose-built diagrams, client-specific
          process maps, and custom icon sets. Here is one set, from the Site
          Ware Direct playbook.
        </p>

        {/* Site Ware Direct — wheel, BANT, STAR side by side, all 2-row tall */}
        <Company
          name="Site Ware Direct"
          caption="BANT and STAR technique diagrams and a custom Sales Wheel, styled as fabric swatches, a nod to their industrial workwear manufacturing."
        >
          <div className="sm-co-3up">
            <Tile src={`${G}/site-ware-direct/wheel.webp`} tall />
            <Tile src={`${G}/site-ware-direct/bant.webp`} tall />
            <Tile src={`${G}/site-ware-direct/star.webp`} tall />
          </div>
        </Company>
      </section>
    </div>
  );
}
