"use client";

import { useState } from "react";
import PreviewCycle from "@/components/PreviewCycle";

/* WebsiteList — the shipped-sites index. Full-width rows; clicking a row
   expands it in place to a short bio, a visit link and a strip of screens.
   One open at a time; height animates via CSS grid rows. */

export type Website = {
  slug: string;
  name: string;
  url: string;
  year: string;
  bio: string;
  images: string[];
  /** /case-studies route, when one exists */
  caseStudy?: string;
  /** Short verbatim pull-quote (ellipsis for cuts, [] for inferred words). */
  quote?: { text: string; author: string };
};

export default function WebsiteList({ sites }: { sites: Website[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="border-b border-line">
      {sites.map((w) => {
        const isOpen = open === w.slug;
        const domain = w.url.replace(/^https?:\/\/(www\.)?/, "");
        return (
          <article key={w.slug} className="border-t border-line">
            {/* Heading wraps the button (the valid accordion pattern — a
                heading inside a button fails the button content model). */}
            <h2 className="m-0">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : w.slug)}
                aria-expanded={isOpen}
                aria-controls={`site-${w.slug}`}
                className="w-full flex items-baseline justify-between gap-6 py-6 md:py-8 text-left group"
              >
                <span
                  className={`home-hero-display transition-colors ${isOpen ? "text-pink" : "text-ink group-hover:text-pink"}`}
                  style={{ fontSize: "clamp(1.8rem, 4vw, 3.4rem)" }}
                >
                  {w.name}
                </span>
                <span className="flex items-baseline gap-5 shrink-0">
                  <span className="mono-label text-ink-soft hidden sm:inline">{domain}</span>
                  <span className="meta-mono text-ink-soft" style={{ fontSize: "0.6875rem" }}>{w.year}</span>
                </span>
              </button>
            </h2>

            <div
              id={`site-${w.slug}`}
              className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-6 pb-10 md:pb-14">
                  <div className="md:col-span-4 flex flex-col gap-8">
                    <p className="text-ink-soft leading-relaxed" style={{ fontSize: "clamp(0.95rem, 1.2vw, 1.1rem)" }}>
                      {w.bio}
                    </p>
                    {w.quote && (
                      <figure className="m-0">
                        {/* Canonical .quote-box token (globals.css): outlined box,
                            serif mark breaking the top border, name outside. */}
                        <div className="quote-box">
                          <span aria-hidden="true" className="quote-box-mark">
                            &ldquo;
                          </span>
                          <blockquote className="text-ink leading-relaxed" style={{ fontSize: "clamp(0.95rem, 1.2vw, 1.1rem)" }}>
                            {w.quote.text}
                          </blockquote>
                        </div>
                        <figcaption className="mono-label text-ink-soft mt-3 text-center">&mdash; {w.quote.author}</figcaption>
                      </figure>
                    )}
                    <div className="flex flex-col items-center gap-2.5 pt-1">
                      <a
                        href={w.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sticker-pill"
                        tabIndex={isOpen ? 0 : -1}
                      >
                        <span>{domain}</span>
                        {/* Material Symbols "open_in_new" (inline, no icon font). */}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                        </svg>
                      </a>
                      {w.caseStudy && (
                        <a
                          href={w.caseStudy}
                          className="sticker-pill is-pink"
                          tabIndex={isOpen ? 0 : -1}
                        >
                          Case study
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-8">
                    {/* Thumb: hover cycles the notable-section shots, click opens the case study. */}
                    <a
                      href={w.caseStudy ?? w.url}
                      aria-label={w.caseStudy ? `${w.name} case study` : `Visit ${w.name}`}
                      tabIndex={isOpen ? 0 : -1}
                      className="block relative overflow-hidden border border-line focus-visible:outline-pink focus-visible:outline-2"
                      style={{ borderRadius: "4px", aspectRatio: "16 / 9" }}
                    >
                      <PreviewCycle images={w.images} alt={`${w.name} website`} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
