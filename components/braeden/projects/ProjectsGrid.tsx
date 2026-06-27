import BlurImage from "../BlurImage";
import { BRAEDEN_PROJECTS } from "./data";
import { PROJECT_LQIP } from "./lqip";

/**
 * Projects listing grid (modelled on Lows): a full-bleed 1 → 2 → 3 column grid
 * with 2px paper gutters. Each card's photo crops up from the bottom on hover
 * (clip-path, no scale) to uncover the title + meta pills sitting behind it; the
 * title and pills then mask-rise on a stagger. Monochrome, Braeden type. Cards
 * aren't links (listing only). On touch the title sits on a gradient, always on.
 * A closing CTA tile keeps the grid ending on a clean cell.
 */
export default function ProjectsGrid() {
  return (
    <div
      className="grid w-full grid-cols-1 gap-[2px] sm:grid-cols-2 lg:grid-cols-3"
      style={{ background: "var(--paper)" }}
    >
      {BRAEDEN_PROJECTS.map((p, i) => {
        const meta = [p.location !== p.title ? p.location : null, p.category, p.award].filter(
          Boolean
        ) as string[];
        return (
          <figure
            key={p.slug}
            className="group relative block h-[86vw] overflow-hidden sm:h-[44vw] lg:h-[72vh]"
            style={{ background: "var(--paper)", margin: 0 }}
          >
            {/* caption sitting behind the image, uncovered as it crops up on hover */}
            <figcaption className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-7 sm:p-9">
              <span className="block overflow-hidden">
                <h2
                  className="ff-mont line-clamp-2 translate-y-full text-2xl font-bold uppercase leading-[1.05] tracking-tight transition-transform duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)] [transition-delay:80ms] group-hover:translate-y-0 sm:text-3xl"
                  style={{ color: "var(--ink)" }}
                >
                  {p.title}
                </h2>
              </span>
              {meta.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {meta.map((m, j) => (
                    <span key={m} className="block overflow-hidden">
                      <span
                        className="brd-pill translate-y-[140%] transition-transform duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0"
                        style={{ color: "var(--ink)", transitionDelay: `${200 + j * 110}ms` }}
                      >
                        {m}
                      </span>
                    </span>
                  ))}
                </div>
              )}
            </figcaption>

            {/* photo on top — blur-up, and crops up from the bottom on hover (gentle
                open, snappier close) to uncover the caption beneath */}
            <BlurImage
              src={p.src}
              lqip={PROJECT_LQIP[p.src.split("/").pop()!.replace(".webp", "")] ?? ""}
              alt={`${p.title}, ${p.location} — a Braeden Constructions home`}
              priority={i < 3}
              className="[clip-path:inset(0_0_0_0)] transition-[clip-path] duration-[320ms] ease-[cubic-bezier(0.4,0,0.1,1)] group-hover:[clip-path:inset(0_0_11rem_0)] group-hover:duration-[520ms] group-hover:ease-[cubic-bezier(0.22,1,0.36,1)]"
            />

            {/* touch: always-on title on a gradient (no hover to reveal the caption) */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 p-5 sm:hidden"
              style={{
                background:
                  "linear-gradient(to top, rgba(18,18,20,0.72), rgba(18,18,20,0.2) 55%, transparent)",
              }}
            >
              <h2
                className="ff-mont line-clamp-2 text-lg font-bold uppercase leading-[1.1] tracking-tight"
                style={{ color: "#fff" }}
              >
                {p.title}
              </h2>
            </div>
          </figure>
        );
      })}

      {/* Closing tile — ends the grid on a clean cell, nudges to a conversation */}
      <a
        href="/braeden/site#contact"
        data-cursor="Enquire"
        className="group flex h-[60vw] flex-col items-center justify-center p-7 text-center sm:h-[44vw] sm:p-9 lg:h-[72vh]"
        style={{ background: "var(--paper-2)", color: "var(--ink)" }}
      >
        <h2
          className="ff-mont text-2xl font-bold uppercase leading-[1.05] tracking-tight sm:text-3xl"
          style={{ color: "var(--ink)" }}
        >
          Have a build in mind?
        </h2>
        <span
          className="eyebrow mt-6 inline-block"
          style={{ borderBottom: "1px solid var(--ink)", paddingBottom: 3 }}
        >
          Deal direct with Mick
        </span>
      </a>
    </div>
  );
}
