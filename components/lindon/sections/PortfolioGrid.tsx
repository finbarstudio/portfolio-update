"use client";

import { useState } from "react";
import Image from "next/image";
import ProjectLaurel from "@/components/lindon/ProjectLaurel";

interface Item {
  slug: string;
  title: string;
  location: string;
  categories: string[];
  award?: string; // year mark for the laurel
}

const CATEGORIES = [
  "Architect designed",
  "Difficult & sloping sites",
  "House raising",
  "Knock down & rebuild",
  "Lindon designed",
  "Renovations",
  "Swimming pools",
];

// NOTE: category assignments are a first-pass best-effort — verify against the
// real project records before going live.
const PROJECTS: Item[] = [
  { slug: "ormuz", title: "Ormuz", location: "New Farm", award: "23", categories: ["Architect designed", "Lindon designed"] },
  { slug: "tranters", title: "Tranters", location: "Bardon", award: "21", categories: ["Knock down & rebuild", "Lindon designed"] },
  { slug: "oriel-road", title: "Oriel Road", location: "Clayfield", categories: ["Renovations", "Architect designed"] },
  { slug: "arbour", title: "Arbour", location: "Brisbane", categories: ["Lindon designed"] },
  { slug: "gordon-street", title: "Gordon Street", location: "Balmoral", categories: ["Renovations", "House raising"] },
  { slug: "bonaventure", title: "Bonaventure", location: "Raby Bay", award: "21", categories: ["Lindon designed", "Swimming pools"] },
  { slug: "sydney-house", title: "Sydney House", location: "Camp Hill", categories: ["Architect designed"] },
  { slug: "sydney-avenue", title: "Sydney Avenue", location: "Camp Hill", categories: ["Architect designed"] },
  { slug: "holland-park", title: "Holland Park", location: "Holland Park", categories: ["Difficult & sloping sites"] },
  { slug: "audrey-street", title: "Audrey Street", location: "Balmoral", categories: ["House raising", "Renovations"] },
  { slug: "arrol-street-2", title: "Arrol Street", location: "Camp Hill", categories: ["Lindon designed"] },
  { slug: "beachcrest-road", title: "Beachcrest Road", location: "Wynnum", categories: ["Lindon designed", "Swimming pools"] },
  { slug: "morehead-avenue", title: "Morehead Avenue", location: "Norman Park", categories: ["Lindon designed"] },
  { slug: "kate-circuit", title: "Kate Circuit", location: "Carindale", categories: ["Lindon designed"] },
  { slug: "norman-park", title: "Norman Park", location: "Norman Park", categories: ["Lindon designed"] },
  { slug: "mcilwraith-ave", title: "McIlwraith Avenue", location: "Norman Park", categories: ["Renovations"] },
  { slug: "counihan", title: "Counihan", location: "Brisbane", categories: ["Lindon designed"] },
  { slug: "captains-court", title: "Captains Court", location: "Raby Bay", categories: ["Lindon designed", "Swimming pools"] },
  { slug: "mariners-court", title: "Mariners Court", location: "Raby Bay", categories: ["Lindon designed", "Swimming pools"] },
  { slug: "chelsea-road", title: "Chelsea Road", location: "Ransome", categories: ["Lindon designed"] },
  { slug: "cabbage-tree-point", title: "Cabbage Tree Point", location: "Gold Coast", categories: ["Difficult & sloping sites", "Lindon designed"] },
  { slug: "castile-street", title: "Castile Street", location: "Indooroopilly", categories: ["Lindon designed"] },
];

export default function PortfolioGrid() {
  const [active, setActive] = useState<string>("All");

  const filtered =
    active === "All"
      ? PROJECTS
      : PROJECTS.filter((p) => p.categories.includes(active));

  // pad to a multiple of 6 (incl. the CTA) so the trailing row is never grey
  const cellCount = filtered.length + 1;
  const fillers = (6 - (cellCount % 6)) % 6;

  const filterClass = (label: string) =>
    `text-[13px] tracking-[0.01em] transition-colors whitespace-nowrap ${
      active === label
        ? "text-[var(--ink)]"
        : "text-[var(--ink)]/40 hover:text-[var(--ink)]/80"
    }`;

  return (
    <div>
      {/* Category filter — Remark */}
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
          <a
            key={p.slug}
            href="#"
            data-cursor="View Project"
            className="group relative aspect-[4/3] overflow-hidden bg-[var(--ink)] cursor-none"
          >
            {/* Eager-load the first two rows (3-up desktop / 2-up mobile) via
                priority so they're preloaded the moment the gallery opens, with
                no lazy pop-in. The rest stay lazy. */}
            <Image
              src={`/lindon/portfolio/${p.slug}.jpg`}
              alt={`${p.title} — Lindon Homes`}
              fill
              quality={82}
              priority={i < 6}
              className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
              sizes="(min-width: 768px) 33vw, 50vw"
            />
            {/* Award laurel — bottom right */}
            {p.award !== undefined && (
              <div className="absolute bottom-3 right-3">
                <ProjectLaurel mark={p.award} fill="white" className="w-8" />
              </div>
            )}
            {/* Secondary header caption — Violet Sans (serif) */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <h3 className="violet text-white text-sm" style={{ letterSpacing: "0.1em" }}>
                {p.title.toUpperCase()}
              </h3>
              <p className="text-white/80 text-xs font-light tracking-wide mt-0.5">
                {p.location}
              </p>
            </div>
          </a>
        ))}

        {/* Contact CTA — white, "GET IN TOUCH", Violet Sans, flashing square on hover */}
        <a
          href="#"
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
