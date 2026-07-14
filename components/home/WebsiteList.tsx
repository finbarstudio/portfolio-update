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
                  <div className="md:col-span-4 flex flex-col gap-5">
                    <p className="text-ink-soft leading-relaxed" style={{ fontSize: "clamp(0.95rem, 1.2vw, 1.1rem)" }}>
                      {w.bio}
                    </p>
                    {w.quote && (
                      <figure className="m-0 border-l-2 border-pink pl-4">
                        <blockquote className="text-ink leading-relaxed" style={{ fontSize: "clamp(0.95rem, 1.2vw, 1.1rem)" }}>
                          &ldquo;{w.quote.text}&rdquo;
                        </blockquote>
                        <figcaption className="mono-label text-ink-soft mt-2">{w.quote.author}</figcaption>
                      </figure>
                    )}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                      <a
                        href={w.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mono-label text-pink hover:underline"
                        tabIndex={isOpen ? 0 : -1}
                      >
                        Visit {domain} &#8599;
                      </a>
                      {w.caseStudy && (
                        <a
                          href={w.caseStudy}
                          className="mono-label text-ink hover:text-pink transition-colors"
                          tabIndex={isOpen ? 0 : -1}
                        >
                          Case study &rarr;
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
