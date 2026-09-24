import type { Metadata } from "next";
import VideoPlayer from "@/components/VideoPlayer";
import { MARK_SHAPES, MARK_VIEWBOX } from "@/components/brand-mark";
import { PORTFOLIO, CV, UPDATED, type Media, type Slide } from "@/content/portfolio";
import "./portfolio.css";

/**
 * /portfolio — the PDF portfolio as one scrolling page. Structure after the
 * classic studio deck: cover, résumé page, then per project a title page, a
 * text page and its image pages, "Other" at the end, a contact page last.
 * All content lives in content/portfolio.ts; this file only draws slides.
 */

export const metadata: Metadata = {
  title: { absolute: "Finbar Skitini, Portfolio" },
  description: "Selected works by Finbar Skitini, graphic and digital designer in London.",
  robots: { index: false, follow: true },
};

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

function Asset({ m, eager = false }: { m: Media; eager?: boolean }) {
  if (m.video) {
    return (
      <div className="pf-vid">
        <VideoPlayer src={m.src} eager={eager} style={{ objectFit: m.fit ?? "cover" }} />
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={m.src}
      alt={m.alt ?? ""}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      style={m.fit ? { objectFit: m.fit, objectPosition: m.position } : m.position ? { objectPosition: m.position } : undefined}
    />
  );
}

function Caption({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <p className="pf-caption">
      <b>Above:</b> {text}
    </p>
  );
}

function SlideView({ s, i }: { s: Slide; i: number }) {
  const bg = "bg" in s && s.bg ? ({ "--pf-bg": s.bg } as React.CSSProperties) : undefined;
  switch (s.kind) {
    case "cover":
      return (
        <section className="pf-slide pf-cover is-text">
          <div className="pf-pad">
            <h1 className="pf-display">
              Finbar Skitini<Mark />
              <span className="g">Selected works</span>
            </h1>
            <div className="pf-cover-foot">
              <p className="pf-display pf-grey">2022–2026</p>
              <div className="pf-cover-meta pf-label">
                <p style={{ margin: 0 }}>Email<a className="g" href={`mailto:${CV.email}`}>{CV.email}</a></p>
                <p style={{ margin: 0 }}>Updated<span className="g">{UPDATED.long}</span></p>
              </div>
            </div>
          </div>
        </section>
      );
    case "cv":
      return (
        <section className="pf-slide pf-cv is-text" aria-label="Résumé">
          <div className="pf-pad">
            <div className="pf-cv-left">
              <p className="pf-display">Finbar Skitini</p>
              <div className="pf-cv-bio">
                {CV.bio.map((p) => <p key={p}>{p}</p>)}
              </div>
              <div className="pf-cv-foot pf-small">
                <a href="/cv">Résumé (PDF)</a>
                <span>Updated: {UPDATED.short}</span>
              </div>
            </div>
            <div className="pf-cv-right pf-small">
              <div className="pf-cv-block">
                <h2>Eligibility</h2>
                <p style={{ margin: 0, maxWidth: "17em" }}>{CV.eligibility}</p>
              </div>
              <div className="pf-cv-block">
                <h2>Contact</h2>
                <div className="pf-cv-contact">
                  {CV.contact.map((c) => (
                    <FragmentRow key={c.label} label={c.label} value={c.value} href={c.href} />
                  ))}
                </div>
              </div>
              <div className="pf-cv-block pf-cv-row2">
                <h2>Education</h2>
                {CV.education.map((e) => (
                  <div className="pf-cv-item" key={e.title}>
                    {e.title}
                    {e.lines.map((l) => <span className="in" key={l}>{l}</span>)}
                  </div>
                ))}
              </div>
              <div className="pf-cv-block pf-cv-row2">
                <h2>Experience (In-house &amp; Freelance)</h2>
                {CV.experience.map((g) => (
                  <div key={g.group} style={{ marginBottom: "calc(var(--u) * 1.4)" }}>
                    <span className="pf-cv-sub">{g.group}</span>
                    {g.items.map((it) => (
                      <div className="pf-cv-item" key={it.title + it.lines.join()}>
                        {it.title}
                        {it.lines.map((l) => <span className="in" key={l}>{l}</span>)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      );
    case "title":
      return (
        <section className="pf-slide pf-title is-text" id={s.id}>
          <div className="pf-pad">
            <h2 className="pf-display">
              {s.name}
              <span className="g">{s.category}</span>
            </h2>
            <p className="pf-display pf-grey">{s.year}</p>
          </div>
        </section>
      );
    case "text":
      return (
        <section className="pf-slide pf-text is-text">
          <div className="pf-pad">
            <p className="pf-label">
              {s.name}
              <span className="g">{s.category}</span>
            </p>
            <div className="pf-text-body">
              <p className="pf-body">{s.body}</p>
            </div>
            <div className="pf-meta pf-label">
              {s.meta.map((m) => (
                <p key={m.label} style={{ margin: 0 }}>
                  {m.label}
                  {m.href ? (
                    <a className="g" href={m.href} target="_blank" rel="noopener noreferrer">{m.value}</a>
                  ) : (
                    <span className="g">{m.value}</span>
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
            <p className="pf-label">
              {s.name}
              <span className="g">Client</span>
            </p>
            <div className="pf-text-body">
              <p className="pf-body">&ldquo;{s.quote}&rdquo;</p>
              <p className="pf-label pf-by">{s.by}</p>
            </div>
          </div>
        </section>
      );
    case "media":
      return (
        <section className={`pf-slide pf-media${s.item.fit === "contain" ? " is-contain" : ""}`} style={bg}>
          {s.inset ? (
            <div className="pf-inset">
              <Asset m={s.item} eager={i < 3} />
            </div>
          ) : (
            <Asset m={s.item} eager={i < 3} />
          )}
          <Caption text={s.caption} />
        </section>
      );
    case "grid":
      return (
        <section className="pf-slide pf-media" style={{ ...bg, ...(s.captionColor ? { "--pf-caption": s.captionColor } : {}) } as React.CSSProperties}>
          <div
            className={`pf-grid${s.bleed ? " is-bleed" : ""}${s.cols === 4 ? " is-4" : ""}`}
            style={{ "--cols": s.cols, "--fit": s.fit ?? "cover", "--ratio": s.ratio ?? "1" } as React.CSSProperties}
          >
            {s.items.map((m) => (
              <div key={m.src}>
                <Asset m={m} />
              </div>
            ))}
          </div>
          <Caption text={s.caption} />
        </section>
      );
    case "logo":
      return (
        <section className="pf-slide pf-media" style={{ ...bg, ...(s.captionColor ? { "--pf-caption": s.captionColor } : {}) } as React.CSSProperties}>
          <div className="pf-logo" style={{ "--size": s.size ?? "22cqw" } as React.CSSProperties}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.src} alt={s.alt ?? ""} loading="lazy" decoding="async" />
          </div>
          <Caption text={s.caption} />
        </section>
      );
    case "section":
      return (
        <section className="pf-slide pf-title is-text" id="other">
          <div className="pf-pad">
            <h2 className="pf-display" style={{ maxWidth: "60%" }}>
              {s.title}
              <span className="g">{s.subtitle}</span>
            </h2>
            <p className="pf-display pf-grey">{s.year}</p>
          </div>
        </section>
      );
    case "end":
      return (
        <section className="pf-slide pf-title is-text" id="contact">
          <div className="pf-pad">
            <h2 className="pf-display">
              Thank you
              <span className="g">Contact ↓</span>
            </h2>
            <div className="pf-meta pf-label">
              {CV.contact.map((c) => (
                <p key={c.label} style={{ margin: 0 }}>
                  {c.long}
                  <a className="g" href={c.href}>{c.value}</a>
                </p>
              ))}
            </div>
          </div>
        </section>
      );
  }
}

function FragmentRow({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <>
      <span>{label}:</span>
      <a href={href}>{value}</a>
    </>
  );
}

export default function PortfolioPage() {
  return (
    <main className="pf">
      {PORTFOLIO.map((s, i) => <SlideView key={i} s={s} i={i} />)}
    </main>
  );
}
