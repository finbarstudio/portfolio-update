"use client";

/**
 * SalesmastersShowcase — bespoke case study for the Salesmasters sales playbooks.
 * Three sections: the clients / credibility (cover marquee + stats + site link),
 * the playbook itself (interactive page viewer of a full edition), and the
 * bespoke infographics and technique diagrams.
 */

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

// Graphics grouped by client — one row each.
const COMPANIES = [
  {
    name: "Site Ware Direct",
    caption:
      "BANT and STAR technique diagrams and a custom Sales Wheel, styled as fabric swatches — a nod to their industrial workwear manufacturing.",
    items: [`${G}/site-ware-direct/bant.webp`, `${G}/site-ware-direct/star.webp`, `${G}/site-ware-direct/wheel.webp`],
  },
  {
    name: "Cutek",
    caption: "Sales Wheel and a custom audience icon set across their market segments.",
    items: [
      `${G}/cutek/wheel.webp`,
      `${G}/cutek/architects.webp`,
      `${G}/cutek/consumers.webp`,
      `${G}/cutek/distributors.webp`,
      `${G}/cutek/government.webp`,
      `${G}/cutek/manufacturers.webp`,
    ],
  },
  {
    name: "Bus4x4",
    caption: "The six-point walkround diagram, the source vehicle renders it was built from, and the custom tyre illustration.",
    items: [
      `${G}/bus4x4/technical.webp`,
      `${G}/bus4x4/orig-rear.webp`,
      `${G}/bus4x4/orig-cargo.webp`,
      `${G}/bus4x4/orig-driver.webp`,
      `${G}/bus4x4/orig-full-boot.webp`,
      `${G}/bus4x4/orig-full-hood.webp`,
      `${G}/bus4x4/wheel.webp`,
    ],
  },
  {
    name: "Active Medical",
    caption: "Sales Wheel and a bespoke icon set.",
    items: [
      `${G}/active-medical/wheel.webp`,
      ...["handshake", "star", "bolt", "graph", "simple", "target"].map((n) => `${G}/active-medical/icons/${n}.webp`),
    ],
  },
];

const STATS = [
  { value: "15+", label: "Playbooks delivered" },
  { value: "12+", label: "Months of repeat work" },
  { value: "~70", label: "Hours per edition" },
];

function SectionHeader({ index, name }: { index: number; name: string }) {
  return (
    <header className="packer-section-header">
      <span className="packer-section-index">{String(index).padStart(2, "0")}</span>
      <h2 className="kinaya-section-name">{name}</h2>
    </header>
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

        <div className="sm-stats">
          {STATS.map((s) => (
            <div key={s.label} className="sm-stat">
              <div className="sm-stat-value">{s.value}</div>
              <div className="sm-stat-label">{s.label}</div>
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
        <BookViewer pages={PLAYBOOK_PAGES} />
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

        {COMPANIES.map((co) => (
          <div key={co.name} className="sm-company">
            <p className="sm-company-name">{co.name}</p>
            {co.caption && <p className="sm-company-caption">{co.caption}</p>}
            <div className="sm-company-items">
              {co.items.map((src) => (
                <figure key={src} className="sm-company-item">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" aria-hidden="true" loading="lazy" />
                </figure>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
