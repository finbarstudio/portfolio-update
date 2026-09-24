import type { Metadata } from "next";
import VideoPlayer from "@/components/VideoPlayer";
import { MARK_SHAPES, MARK_VIEWBOX } from "@/components/brand-mark";
import { PORTFOLIO, CV, UPDATED, type Media, type Slide } from "@/content/portfolio";
import "./portfolio.css";

/**
 * /portfolio — the PDF portfolio as one scrolling page: cover, about, then per
 * project a chapter page, a text page and its media pages, "Other" at the end
 * and a contact page last. Content lives in content/portfolio.ts; this file
 * only draws the pages. Media is always inset at its true proportions (see
 * portfolio.css), never full bleed, never cropped.
 */

export const metadata: Metadata = {
  title: { absolute: "Finbar Skitini, Portfolio" },
  description: "Selected works by Finbar Skitini, graphic and digital designer in London.",
  robots: { index: false, follow: true },
};

type Chapter = { no: string; name: string };
const pad2 = (n: number) => String(n).padStart(2, "0");

function Mark() {
  return (
    <span className="pf-mark" aria-hidden="true">
      <svg viewBox={MARK_VIEWBOX}>
        {MARK_SHAPES.map((s, i) => {
          if (s.tag === "polygon") return <polygon key={i} points={s.points} fill={s.fill} />;
          if (s.tag === "circle") return <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={s.fill} />;
          return <path key={i} d={s.d} fill={s.fill} />;
        })}
      </svg>
    </span>
  );
}

function Item({ m, eager }: { m: Media; eager: boolean }) {
  return (
    <div className={`pf-item${m.frame === false ? "" : " is-framed"}`} style={{ aspectRatio: `${m.w} / ${m.h}`, "--r": (m.w / m.h).toFixed(4) } as React.CSSProperties}>
      {m.video ? (
        <div className="pf-vid">
          <VideoPlayer src={m.src} eager={eager} style={{ objectFit: "contain" }} />
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={m.src} alt={m.alt ?? ""} width={m.w} height={m.h} loading={eager ? "eager" : "lazy"} decoding="async" />
      )}
    </div>
  );
}

/** The running line on a media page: chapter left, page number right. */
function Run({ chap, page }: { chap?: Chapter; page: string }) {
  return (
    <div className="pf-run pf-mono">
      <span>{chap ? `${chap.no}  ${chap.name}` : ""}</span>
      <span className="pf-soft">{page}</span>
    </div>
  );
}

function SlideView({ s, i, chap, page }: { s: Slide; i: number; chap?: Chapter; page: string }) {
  switch (s.kind) {
    case "cover":
      return (
        <section className="pf-slide pf-cover is-text">
          <div className="pf-pad">
            <div className="pf-head pf-mono">
              <span>Portfolio</span>
              <span>Selected works<br /><span className="pf-soft">2022–2026</span></span>
              <span>Graphic and digital designer<br /><span className="pf-soft">London</span></span>
              <span><a href={`mailto:${CV.email}`}>{CV.email}</a><br /><span className="pf-soft">Updated {UPDATED.long}</span></span>
            </div>
            <h1 className="pf-poster">
              Finbar
              <br />
              Skitini<Mark />
            </h1>
          </div>
        </section>
      );
    case "cv":
      return (
        <section className="pf-slide pf-cv is-text" aria-label="About">
          <div className="pf-pad">
            <div className="pf-head pf-mono">
              <span>About</span>
              <span />
              <span>Finbar Skitini</span>
              <span className="pf-soft">{page}</span>
            </div>
            <div className="pf-cols pf-cv-grid">
              <div className="pf-cv-bio">
                {CV.bio.map((p) => <p key={p}>{p}</p>)}
              </div>
              <div className="pf-cv-block">
                <h2 className="pf-mono pf-brand">Eligibility</h2>
                <p className="pf-copy">{CV.eligibility}</p>
              </div>
              <div className="pf-cv-block">
                <h2 className="pf-mono pf-brand">Contact</h2>
                <div className="pf-cv-contact pf-copy">
                  {CV.contact.map((c) => (
                    <Row key={c.label} label={c.long} value={c.value} href={c.href} />
                  ))}
                </div>
              </div>
              <div className="pf-cv-block">
                <h2 className="pf-mono pf-brand">Education</h2>
                {CV.education.map((e) => (
                  <div className="pf-cv-item pf-copy" key={e.title}>
                    {e.title}
                    <span className="in">{e.lines.join(", ")}</span>
                  </div>
                ))}
              </div>
              <div className="pf-cv-block">
                <h2 className="pf-mono pf-brand">Experience</h2>
                {CV.experience.flatMap((g) => g.items.map((it) => ({ ...it, group: g.group }))).map((it) => (
                  <div className="pf-cv-item pf-copy" key={it.title + it.lines.join()}>
                    {it.title}
                    <span className="in">{[...it.lines, it.group].join(", ")}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pf-cv-foot pf-mono">
              <a href="/cv">Résumé (PDF) ↓</a>
              <span className="pf-soft">Updated {UPDATED.short}</span>
            </div>
          </div>
        </section>
      );
    case "title":
    case "section": {
      const name = s.kind === "title" ? s.name : s.title;
      const sub = s.kind === "title" ? s.category : s.subtitle;
      return (
        <section className="pf-slide pf-title is-text" id={s.kind === "title" ? s.id : "other"}>
          <div className="pf-pad">
            <div className="pf-head pf-mono">
              <span>{chap?.no}</span>
              <span />
              <span />
              <span>{s.year}</span>
            </div>
            <h2 className="pf-display" style={s.kind === "section" ? { maxWidth: "11em" } : undefined}>
              {name}
              <span className="b">{sub}</span>
            </h2>
          </div>
        </section>
      );
    }
    case "text":
      return (
        <section className="pf-slide pf-text is-text">
          <div className="pf-pad">
            <div className="pf-head pf-mono">
              <span>{chap?.no}</span>
              <span>{s.name}</span>
              <span className="pf-soft">{s.category}</span>
              <span className="pf-soft">{page}</span>
            </div>
            <div className="pf-text-body">
              <p className="pf-body">{s.body}</p>
            </div>
            <div className="pf-cols pf-meta">
              {s.meta.map((m) => (
                <p key={m.label} className="pf-mono pf-soft">
                  {m.label}
                  {m.href ? (
                    <a className="v" href={m.href} target="_blank" rel="noopener noreferrer">{m.value}</a>
                  ) : (
                    <span className="v">{m.value}</span>
                  )}
                </p>
              ))}
            </div>
          </div>
        </section>
      );
    case "quote":
      return (
        <section className="pf-slide pf-text pf-quote is-text">
          <div className="pf-pad">
            <div className="pf-head pf-mono">
              <span>{chap?.no}</span>
              <span>{s.name}</span>
              <span className="pf-soft">Client</span>
              <span className="pf-soft">{page}</span>
            </div>
            <div className="pf-text-body">
              <p className="pf-body"><span className="q">“</span>{s.quote}<span className="q">”</span></p>
            </div>
            <p className="pf-mono">{s.by}</p>
          </div>
        </section>
      );
    case "media": {
      const ratio = s.items.reduce((a, m) => a + m.w / m.h, 0);
      const n = s.items.length;
      const h = `min(var(--H), calc((var(--W) - ${n - 1} * var(--G)) / ${ratio.toFixed(4)}))`;
      return (
        <section className={`pf-slide pf-media${n === 4 ? " is-4" : ""}`}>
          <Run chap={chap} page={page} />
          <div className="pf-row" style={{ "--h": h } as React.CSSProperties}>
            {s.items.map((m) => <Item key={m.src} m={m} eager={i < 4} />)}
          </div>
          {s.caption ? (
            <p className="pf-caption pf-mono">
              <b>Above</b>
              <span>{s.caption}</span>
            </p>
          ) : null}
        </section>
      );
    }
    case "logo":
      return (
        <section className="pf-slide pf-logoslide" style={s.bg ? ({ "--ground": s.bg } as React.CSSProperties) : undefined}>
          <Run chap={chap} page={page} />
          <div className="pf-logo" style={{ "--size": s.size ?? "30cqw" } as React.CSSProperties}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.src} alt={s.alt ?? ""} loading="lazy" decoding="async" />
          </div>
        </section>
      );
    case "end":
      return (
        <section className="pf-slide pf-end is-text" id="contact">
          <div className="pf-pad">
            <div className="pf-head pf-mono">
              {CV.contact.map((c) => (
                <span key={c.label}>
                  {c.long}
                  <br />
                  <a className="pf-soft" href={c.href}>{c.value}</a>
                </span>
              ))}
              <span className="pf-soft">{page}</span>
            </div>
            <h2 className="pf-poster">
              Thank
              <br />
              you<Mark />
            </h2>
          </div>
        </section>
      );
  }
}

function Row({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <>
      <span className="pf-soft">{label}</span>
      <a href={href}>{value}</a>
    </>
  );
}

export default function PortfolioPage() {
  const total = PORTFOLIO.length;
  let chapter: Chapter | undefined;
  let count = 0;
  return (
    <main className="pf">
      {PORTFOLIO.map((s, i) => {
        if (s.kind === "title" || s.kind === "section") {
          count += 1;
          chapter = { no: pad2(count), name: s.kind === "title" ? s.name : s.title };
        }
        return <SlideView key={i} s={s} i={i} chap={chapter} page={`${pad2(i + 1)}/${total}`} />;
      })}
    </main>
  );
}
