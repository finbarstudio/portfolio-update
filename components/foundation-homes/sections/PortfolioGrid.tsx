"use client";

import { useState } from "react";
import Image from "next/image";
import ProjectLaurel from "@/components/foundation-homes/ProjectLaurel";

interface Item {
  slug: string;
  title: string;
  location: string;
  categories: string[];
  award?: string; // year mark for the laurel
}

const CATEGORIES = [
  "Custom new homes",
  "Renovations & alterations",
  "Award winners",
];

// Real Foundation Homes projects (from their gallery).
const PROJECTS: Item[] = [
  { slug: "amani-palace", title: "Amani Palace", location: "Sunshine Coast", categories: ["Custom new homes"] },
  { slug: "watson-residence", title: "Watson Residence", location: "Doonan", award: "23", categories: ["Custom new homes", "Award winners"] },
  { slug: "tern-st", title: "Tern Street", location: "Sunshine Coast", award: "23", categories: ["Custom new homes", "Award winners"] },
  { slug: "noosa-dunes", title: "Noosa Dunes", location: "Noosa", award: "20", categories: ["Custom new homes", "Award winners"] },
  { slug: "maleny-house", title: "Maleny House", location: "Maleny", award: "17", categories: ["Custom new homes", "Award winners"] },
  { slug: "eyrie-terrace", title: "Eyrie Terrace", location: "Coolum Beach", award: "21", categories: ["Renovations & alterations", "Award winners"] },
  { slug: "barnes-residence", title: "Barnes Residence", location: "Buderim", categories: ["Custom new homes"] },
  { slug: "persimmon-house", title: "Persimmon House", location: "Sunshine Coast", categories: ["Custom new homes"] },
  { slug: "grandview-drive", title: "Grandview Drive", location: "Coolum", categories: ["Custom new homes"] },
];

// One gallery cell. Holds a shimmer skeleton until its image decodes, then
// cross-fades the photo in — so tiles never pop in as they lazy-load on scroll.
function GridTile({ p, eager }: { p: Item; eager: boolean }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <a
      href="#"
      data-cursor="View Project"
      className="group relative aspect-[4/3] overflow-hidden bg-[var(--ink)] cursor-none"
    >
      <div
        aria-hidden
        className={`ld-skeleton absolute inset-0 transition-opacity duration-500 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
      />
      <Image
        src={`/foundation-homes/projects/${p.slug}.webp`}
        alt={`${p.title}, Foundation Homes`}
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
      {/* Award laurel — bottom right */}
      {p.award !== undefined && (
        <div className="absolute bottom-3 right-3">
          <ProjectLaurel mark={p.award} fill="white" className="w-8" />
        </div>
      )}
      {/* Caption on hover */}
      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <h3 className="violet text-white text-sm" style={{ letterSpacing: "0.1em" }}>
          {p.title.toUpperCase()}
        </h3>
        <p className="text-white/80 text-xs font-light tracking-wide mt-0.5">
          {p.location}
        </p>
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
