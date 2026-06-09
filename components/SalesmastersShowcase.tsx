"use client";

/**
 * SalesmastersShowcase — bespoke case study for the Salesmasters sales playbooks.
 * Three sections: the clients / credibility (cover marquee + stats + site link),
 * the playbook itself (interactive page viewer of a full edition), and the
 * bespoke infographics and technique diagrams.
 */

import PdfSlideshowThumb from "./PdfSlideshowThumb";

const SITE_URL = "https://salesmasters.com.au";

const PLAYBOOK_PAGES = Array.from({ length: 20 }, (_, i) =>
  `/images/salesmasters/opt/page-${i + 1}.webp`
);

const COVERS = [
  "cover-bus4x4",
  "cover-alpha",
  "cover-siteware",
  "cover-playbook",
].map((n) => `/images/salesmasters/opt/${n}.webp`);

const WHEELS = [
  { src: "/images/salesmasters/opt/wheel-active-medical.webp", label: "Active Medical" },
  { src: "/images/salesmasters/opt/wheel-cutek.webp", label: "Cutek" },
];

const DIAGRAMS = [
  { src: "/images/salesmasters/opt/bant.webp", label: "BANT qualification" },
  { src: "/images/salesmasters/opt/star.webp", label: "STAR method" },
  { src: "/images/salesmasters/opt/technical.webp", label: "Bus4x4 six-point walkround" },
];

const ICONS = ["handshake", "star_", "bolt", "graph", "simple", "target"].map(
  (n) => `/images/salesmasters/opt/icon-${n}.webp`
);

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

        {/* Bespoke covers, scrolling — client-branded credibility */}
        <div className="sm-cover-marquee" aria-label="Bespoke playbook covers">
          <div className="sm-cover-track">
            {[...COVERS, ...COVERS, ...COVERS].map((src, i) => (
              <div key={i} className="sm-cover" aria-hidden={i >= COVERS.length}>
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
        <div className="sm-playbook">
          <PdfSlideshowThumb pages={PLAYBOOK_PAGES} hover={false} nav />
        </div>
      </section>

      {/* 03 — Infographics & technique diagrams */}
      <section className="kinaya-section">
        <SectionHeader index={3} name="Graphics & Diagrams" />
        <p className="packer-section-body">
          To hold the reader&apos;s attention through dense material, I tied each
          playbook together with custom graphics: a bespoke Sales Wheel mapping the
          client&apos;s process, technique frameworks like BANT and STAR drawn as
          purpose-built diagrams, and client-specific process maps, such as the
          six-point walkround I illustrated for Bus4x4&apos;s van sales system.
          Custom icon sets carry the visual language across each edition.
        </p>

        <div className="sm-wheels">
          {WHEELS.map((w) => (
            <figure key={w.src} className="sm-figure sm-figure-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={w.src} alt={`Sales Wheel, ${w.label}`} loading="lazy" />
            </figure>
          ))}
        </div>

        <div className="sm-diagrams">
          {DIAGRAMS.map((d) => (
            <figure key={d.src} className="sm-figure">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={d.src} alt={d.label} loading="lazy" />
            </figure>
          ))}
        </div>

        <div className="sm-icons" aria-label="Custom icon set">
          {ICONS.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="" aria-hidden="true" loading="lazy" />
          ))}
        </div>
      </section>
    </div>
  );
}
