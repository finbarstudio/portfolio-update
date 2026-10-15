"use client";

/**
 * The portfolio's contents page (Projects). On a desktop it opens as
 * thumbnails, three across, with a switch in the header row to flip to the
 * list and back. On a phone it is always the list. The PDF prints the
 * thumbnails. Each entry links to its chapter's opening page.
 *
 * The thumbnails are 5:2 crops from each chapter's work, made by
 * scripts/portfolio-thumbs.mjs into public/media/images/portfolio/thumbs/.
 */

import { useState } from "react";
import { media } from "@/lib/media";
import { usePrintJpeg, usePrintView } from "@/components/portfolio/print";

export interface IndexChapter {
  no: string;
  name: string;
  sub: string;
  id: string;
}

function Thumb({ id, name }: { id: string; name: string }) {
  const src = media(`/media/images/portfolio/thumbs/${id}.webp`);
  // the PDF takes a JPEG copy (see usePrintJpeg)
  const print = usePrintView();
  const printed = usePrintJpeg(print ? src : null, 1200);
  const shown = print ? printed : src;
  return shown ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={shown} alt={name} width={1200} height={480} loading="lazy" decoding="async" />
  ) : (
    <span className="pf-thumb-blank" />
  );
}

export default function PfIndex({ chapters, page }: { chapters: IndexChapter[]; page: string }) {
  const [view, setView] = useState<"thumbs" | "list">("thumbs");
  return (
    <section className="pf-slide pf-index is-text" aria-label="Projects" data-view={view}>
      <div className="pf-pad">
        <div className="pf-head pf-mono">
          <span>Projects</span>
          <span />
          <span className="pf-index-switch pf-print-hide" role="group" aria-label="Show the projects as">
            <button type="button" aria-pressed={view === "thumbs"} onClick={() => setView("thumbs")}>
              Thumbnails
            </button>
            <button type="button" aria-pressed={view === "list"} onClick={() => setView("list")}>
              List
            </button>
          </span>
          <span className="pf-soft">{page}</span>
        </div>
        <ol className="pf-thumbs">
          {chapters.map((c) => (
            <li key={c.id}>
              <a href={`#${c.id}`}>
                <Thumb id={c.id} name={c.name} />
                <span className="pf-thumb-cap">
                  <span className="pf-mono pf-soft">{c.no}</span>
                  <span className="n">{c.name}</span>
                  <span className="pf-mono pf-soft">{c.sub}</span>
                </span>
              </a>
            </li>
          ))}
        </ol>
        <ol className="pf-list">
          {chapters.map((c) => (
            <li key={c.id}>
              <a className="pf-cols" href={`#${c.id}`}>
                <span className="pf-mono pf-soft">{c.no}</span>
                <span className="n">{c.name}</span>
                <span className="pf-mono pf-soft">{c.sub}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
