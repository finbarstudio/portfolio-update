"use client";

/**
 * The portfolio's contents page (Projects). On a desktop it opens as
 * thumbnails, three across, with a switch in the header row to flip to the
 * list and back. On a phone it is always the list. The PDF prints the
 * thumbnails. Each entry links to its chapter's opening page.
 *
 * The thumbnails are 5:2 crops from each chapter's work, made by
 * scripts/portfolio-thumbs.mjs into public/media/images/portfolio/thumbs/.
 * Most of them move: a short loop of the chapter's own clip (<id>.webm, its
 * still as the poster), playing only while it is on screen; Plated with Issy
 * is its live globe, turning on its own. The PDF prints the stills.
 */

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { media } from "@/lib/media";
import { usePrintJpeg, usePrintView } from "@/components/portfolio/print";

// three.js only runs in the browser
const PfGlobe = dynamic(() => import("@/components/portfolio/PfGlobe"), { ssr: false });

/** the chapters whose thumbnail is a loop (thumbs/<id>.webm) */
const CLIPS = new Set(["lola", "rennen-plus", "lows", "share-to-buy", "london-home-show"]);
/** the chapter whose thumbnail is its live globe */
const GLOBE = "plated";

/** A thumbnail loop: muted, playing only while on screen (and again on coming back to the tab). */
function Clip({ src, poster, name }: { src: string; poster: string; name: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    let seen = false;
    const play = () => {
      v.muted = true;
      v.play().catch(() => {});
    };
    const io = new IntersectionObserver(([e]) => {
      seen = e.isIntersecting;
      if (seen) play();
      else v.pause();
    });
    io.observe(v);
    const back = () => document.visibilityState === "visible" && seen && play();
    document.addEventListener("visibilitychange", back);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", back);
    };
  }, []);
  return <video ref={ref} src={src} poster={poster} muted loop playsInline preload="none" aria-label={name} />;
}

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
  if (!print && id === GLOBE) return <PfGlobe thumb />;
  if (!print && CLIPS.has(id)) return <Clip src={media(`/media/images/portfolio/thumbs/${id}.webm`)} poster={src} name={name} />;
  const shown = print ? printed : src;
  return shown ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={shown} alt={name} width={1200} height={480} loading="lazy" decoding="async" />
  ) : null;
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
                <span className="pf-thumb-media">
                  <Thumb id={c.id} name={c.name} />
                </span>
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
