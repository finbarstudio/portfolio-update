"use client";

import { useState } from "react";
import Image from "next/image";

interface Item {
  slug: string;
  title: string;
  location: string;
  categories: string[];
}

const CATEGORIES = ["Architects & designers", "Builders", "Commercial"];

// Real Lucas Muro galleries (from lucasmuro.com.au), client names as published
// on his own client list.
const PROJECTS: Item[] = [
  { slug: "whistle-lane", title: "Whistle Lane", location: "Immackulate Homes · Sunshine Coast", categories: ["Builders"] },
  { slug: "norman-park", title: "Norman Park House", location: "Koda Design · Brisbane", categories: ["Architects & designers"] },
  { slug: "lake-weyba", title: "Lake Weyba", location: "Aboda Design Group · Noosa", categories: ["Architects & designers"] },
  { slug: "gallery-house", title: "Gallery House", location: "Dayne Lawrie Constructions", categories: ["Builders"] },
  { slug: "mitchs-house", title: "Mitch's House", location: "Immackulate Homes · Sunshine Coast", categories: ["Builders"] },
  { slug: "cotton-tree", title: "Cotton Tree", location: "Aboda Design Group · Sunshine Coast", categories: ["Architects & designers"] },
  { slug: "yaroomba", title: "Yaroomba", location: "Aboda Design Group · Sunshine Coast", categories: ["Architects & designers"] },
  { slug: "agnes-water", title: "Agnes Water", location: "Aboda Design Group", categories: ["Architects & designers"] },
  { slug: "holland-park", title: "Holland Park", location: "Koda Design · Brisbane", categories: ["Architects & designers"] },
  { slug: "hassell", title: "Hassell Studio", location: "", categories: ["Commercial"] },
  { slug: "graya", title: "Graya Construction", location: "", categories: ["Builders"] },
  { slug: "pjh", title: "PJH Constructions", location: "", categories: ["Builders"] },
  { slug: "suncity", title: "SunCity Homes", location: "", categories: ["Builders"] },
  { slug: "newport", title: "McCarthy Homes", location: "Newport", categories: ["Builders"] },
  { slug: "chris-clout", title: "Chris Clout Design", location: "", categories: ["Architects & designers"] },
  { slug: "fendi", title: "Fendi", location: "", categories: ["Commercial"] },
];

// One gallery cell. Holds a shimmer skeleton until its image decodes, then
// cross-fades the photo in — so tiles never pop in as they lazy-load on scroll.
function GridTile({ p, eager }: { p: Item; eager: boolean }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <a
      href="#"
      data-cursor="View Gallery"
      className="group relative aspect-[4/3] overflow-hidden bg-[var(--ink)] cursor-none"
    >
      <div
        aria-hidden
        className={`ld-skeleton absolute inset-0 transition-opacity duration-500 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
      />
      <Image
        src={`/lucas-muro/projects/${p.slug}.webp`}
        alt={`${p.title}, photographed by Lucas Muro`}
        fill
        quality={82}
        priority={eager}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        style={{ transition: "opacity 0.6s ease-out, scale 1.2s ease-out, transform 1.2s ease-out" }}
        className={`object-cover group-hover:scale-[1.04] ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        sizes="(min-width: 768px) 33vw, 50vw"
      />
      {/* Caption on hover */}
      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <h3 className="violet text-white text-sm" style={{ letterSpacing: "0.1em" }}>
          {p.title.toUpperCase()}
        </h3>
        {p.location && (
          <p className="text-white/80 text-xs font-light tracking-wide mt-0.5">
            {p.location}
          </p>
        )}
      </div>
    </a>
  );
}

export default function PortfolioGrid() {
  const [active, setActive] = useState<string>("All");

  const filtered =
    active === "All"
      ? PROJECTS
      : PROJECTS.filter((p) => p.categories.includes(active));

  // pad to a multiple of 3 (incl. the CTA) so the trailing row is never grey
  const cellCount = filtered.length + 1;
  const fillers = (3 - (cellCount % 3)) % 3;

  const filterClass = (label: string) =>
    `text-[13px] tracking-[0.01em] transition-colors whitespace-nowrap ${
      active === label
        ? "text-[var(--ink)]"
        : "text-[var(--ink)]/40 hover:text-[var(--ink)]/80"
    }`;

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-8 py-6">
        <button onClick={() => setActive("All")} className={filterClass("All")}>
          All
        </button>
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setActive(c)} className={filterClass(c)}>
            {c}
          </button>
        ))}
      </div>

      {/* Grid — white gaps (match the page bg) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-white">
        {filtered.map((p, i) => (
          <GridTile key={p.slug} p={p} eager={i < 6} />
        ))}

        {/* Contact CTA */}
        <a
          href="mailto:info@lucasmuro.com.au"
          className="group relative aspect-[4/3] bg-white flex items-center justify-center gap-3 cursor-pointer"
        >
          <span
            className="w-2 h-2 bg-[var(--black)] opacity-0 group-hover:opacity-100 group-hover:animate-[ld-blink_0.6s_steps(1,end)_infinite]"
          />
          <span
            className="violet uppercase text-[var(--ink)] group-hover:text-[var(--black)] text-lg md:text-xl transition-colors"
            style={{ letterSpacing: "0.12em" }}
          >
            Get in touch
          </span>
        </a>

        {/* White fillers so the gallery end matches the site bg */}
        {Array.from({ length: fillers }).map((_, i) => (
          <div key={`filler-${i}`} className="aspect-[4/3] bg-white" />
        ))}
      </div>
    </div>
  );
}
