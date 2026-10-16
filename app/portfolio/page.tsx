import PfMedia from "@/components/portfolio/PfMedia";
import PfPhones from "@/components/portfolio/PfPhones";
import PfGlobe from "@/components/portfolio/PfGlobe";
import PfCars from "@/components/portfolio/PfCars";
import PfDeck from "@/components/portfolio/PfDeck";
import PfIndex from "@/components/portfolio/PfIndex";
import { MdArrowOutward, MdArrowUpward } from "@/components/MaterialIcon";
import { FlaskIcon, SOCIALS } from "@/components/social-icons";
import { MARK_SHAPES, MARK_VIEWBOX } from "@/components/brand-mark";
import { PORTFOLIO, CV, UPDATED, PORTFOLIO_PDF, type Media, type Slide } from "@/content/portfolio";
import "./portfolio.css";

/**
 * /portfolio — the PDF portfolio as one scrolling column of pages, each a black
 * 16:9 sheet inset on a dark grey desk, the way a PDF viewer shows one: cover,
 * about, the list of projects, then per project a chapter page, a text page
 * and its media pages, "Other" at the end and a contact page last. Content
 * lives in content/portfolio.ts; this file only draws the pages. Every image
 * and clip loads when the page opens, each with its own thin progress bar
 * (components/portfolio/PfMedia.tsx).
 */

type Chapter = { no: string; name: string; sub: string; id: string };
const pad2 = (n: number) => String(n).padStart(2, "0");

/** The logomark, with the studio's centre-out pulse (.mark-pulse in globals.css). */
function Mark() {
  return (
    <span className="pf-end-mark mark-pulse" aria-hidden="true">
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

function Item({ m, style, group }: { m: Media; style?: React.CSSProperties; group?: string }) {
  return (
    <div
      className={`pf-item${m.frame === false ? "" : " is-framed"}${m.mobile ? " has-phone" : ""}${m.phoneBox ? " has-box" : ""}`}
      style={{ aspectRatio: `${m.w} / ${m.h}`, "--r": (m.w / m.h).toFixed(4), ...(m.mobile ? { "--r-phone": (m.mobile.w / m.mobile.h).toFixed(4) } : null), ...(m.phoneBox ? { "--r-box": (m.phoneBox.w / m.phoneBox.h).toFixed(4), "--fill": m.phoneBox.fill } : null), ...(m.scale ? { "--k": m.scale } : null), ...style } as React.CSSProperties}
    >
      {m.cars ? <PfCars /> : m.phones ? <PfPhones /> : m.globe ? <PfGlobe /> : <PfMedia src={m.src} light={m.light} mobile={m.mobile?.src} mobileLight={m.mobile?.light} video={m.video} sound={m.sound} alt={m.alt} w={m.w} h={m.h} group={group} />}
      {m.overlay ? (
        // the file's own frame, drawn the way the picture is (cover, centred), so the overlay lands on the same spot of the picture
        <div className="pf-overlay" aria-hidden={m.overlay.alt ? undefined : true}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={m.overlay.src}
            alt={m.overlay.alt ?? ""}
            style={{ left: `${m.overlay.x}%`, top: `${m.overlay.y}%`, width: `${m.overlay.w}%` }}
            decoding="async"
          />
        </div>
      ) : null}
    </div>
  );
}

/**
 * The name on the cover, kerned by hand. At this size and this tight a
 * tracking the face's own spacing leaves the pairs uneven: upright stems
 * (IN, NB, NI) sit a clear, even distance apart, while a pair with an arm, a
 * leg or a diagonal is judged by its closest point, and those came out
 * anywhere from touching (AR) to loose (SK). Each value is an extra gap after
 * the first letter of the pair, in em, on top of the tracking; they bring every
 * closest point to about the same distance. Measured from the glyph outlines
 * of Host Grotesk Bold, then set by eye.
 */
const KERN: Record<string, number> = {
  // upright against upright: left only a little wider than the pairs below.
  // Opened further (0.008) they stood three times as far apart as the T's bar
  // from its neighbours, so NI read loose and TI read pinched (7 Oct 2026).
  IN: -0.01,
  NB: -0.01,
  NI: -0.01,
  // closest points evened out; the T's bar is given room either side
  FI: 0.01,
  BA: 0.002,
  AR: 0.014,
  SK: -0.012,
  KI: 0.008,
  IT: 0.008,
  TI: 0.008,
};
function Kerned({ text }: { text: string }) {
  const up = text.toUpperCase();
  return (
    <span aria-hidden="true">
      {[...text].map((ch, i) => {
        const k = KERN[up.slice(i, i + 2)];
        return (
          <span key={i} style={k ? { marginRight: `${k}em` } : undefined}>
            {ch}
          </span>
        );
      })}
    </span>
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

function SlideView({ s, chap, page, chapters }: { s: Slide; chap?: Chapter; page: string; chapters: Chapter[] }) {
  switch (s.kind) {
    case "cover":
      return (
        <section className="pf-slide pf-cover is-text" id="cover">
          <div className="pf-pad">
            <div className="pf-head pf-mono">
              <span>Portfolio</span>
              <span>Selected works</span>
              <span>Graphic and digital designer<br /><span className="pf-soft">London</span></span>
              <span><a href={`mailto:${CV.email}`}>{CV.email}</a><br /><span className="pf-soft">Updated {UPDATED.long}</span></span>
            </div>
            {/* one line, centred on the page: the first name on the left margin, the second on the right */}
            <h1 className="pf-poster" aria-label="Finbar Skitini">
              <span className="pf-name-l"><Kerned text="Finbar" /></span>
              <span className="pf-name-r"><Kerned text="Skitini" /></span>
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
                    <Parts list={e.lines} />
                  </div>
                ))}
              </div>
              <div className="pf-cv-block">
                <h2 className="pf-mono pf-brand">Experience</h2>
                {CV.experience.flatMap((g) => g.items.map((it) => ({ ...it, group: g.group }))).map((it) => (
                  <div className="pf-cv-item pf-copy" key={it.title + it.lines.join()}>
                    {it.title}
                    <Parts list={[...it.lines, it.group]} />
                  </div>
                ))}
              </div>
            </div>
            <div className="pf-cv-foot pf-mono">
              {/* absolute, so the link still works inside the printed PDF */}
              <a href="https://www.finbar.studio/cv">Résumé (PDF) ↓</a>
              {PORTFOLIO_PDF ? <a className="pf-print-hide" href="/portfolio.pdf" download>Portfolio (PDF) ↓</a> : null}
              <span className="pf-soft">Updated {UPDATED.short}</span>
              {/* where it is best seen, and that phones get lighter files (content/portfolio.ts: forPhones) */}
              <p className="pf-phone-note pf-print-hide">
                <span>Best seen on a desktop on wifi. On a phone, this portfolio loads lighter versions of the videos and images so it is kind to mobile data.</span>
              </p>
            </div>
          </div>
        </section>
      );
    case "index":
      return <PfIndex chapters={chapters} page={page} />;
    case "grid":
      return (
        <section className="pf-slide pf-media pf-gridslide">
          <Run chap={chap} page={page} />
          <div className="pf-grid" style={{ "--cols": s.cols, "--rows": s.rows } as React.CSSProperties}>
            <div className="pf-grid-in">
              {s.cells.map((m) => (
                <Item key={m.src} m={m} group={chap?.id} style={{ gridColumn: `${m.c} / span ${m.cs}`, gridRow: `${m.r} / span ${m.rs}` }} />
              ))}
            </div>
          </div>
          {s.caption ? (
            <p className="pf-caption pf-mono">
              <span>{s.caption}</span>
            </p>
          ) : null}
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
              <span />
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
            {/* the key numbers on the left, the links on the right, along the foot of the page */}
            <div className="pf-text-foot">
              {s.stats ? (
                <dl className="pf-stats">
                  {s.stats.map((st) => (
                    <div key={st.label} className="pf-stat">
                      <dt className="pf-mono pf-soft">{st.label}</dt>
                      <dd>{st.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              <div className="pf-cols pf-meta">
                {s.meta.map((m) => (
                  <p key={m.label} className="pf-mono pf-soft">
                    {m.label}
                    {m.href ? (
                      <a className="v" href={m.href} target="_blank" rel="noopener noreferrer">{m.value}<MdArrowOutward className="pf-arrow" /></a>
                    ) : (
                      <span className="v">{m.value}</span>
                    )}
                  </p>
                ))}
              </div>
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
      // Stacked pages (`per` to a row) are sized so the widest row and all the
      // rows together both fit the media box; everything else is one row.
      const lines: Media[][] = [];
      for (let i = 0; i < s.items.length; i += s.per ?? s.items.length) lines.push(s.items.slice(i, i + (s.per ?? s.items.length)));
      const ratio = Math.max(...lines.map((line) => line.reduce((a, m) => a + m.w / m.h, 0)));
      const n = s.per ?? s.items.length;
      const down = lines.length;
      const h = `min(calc((var(--H) - ${down - 1} * var(--G)) / ${down}), calc((var(--W) - ${n - 1} * var(--G)) / ${ratio.toFixed(4)}))`;
      return (
        <section
          className={`pf-slide pf-media${n === 4 ? " is-4" : ""}${s.bleed === true ? " is-bleed" : s.bleed === "desktop" ? " is-dbleed" : ""}${s.phoneBleed ? " is-pbleed" : ""}${s.ink ? " has-ink" : ""}`}
          style={s.ink || s.ground ? ({ ...(s.ink ? { "--bleed-ink": s.ink } : null), ...(s.ground ? { "--ground": s.ground } : null) } as React.CSSProperties) : undefined}
        >
          <Run chap={chap} page={page} />
          <div className={`pf-row${s.per ? " is-stack" : ""}`} style={{ "--h": h } as React.CSSProperties}>
            {s.per
              ? lines.map((line) => (
                  <div className="pf-row-line" key={line[0].src}>
                    {line.map((m) => <Item key={m.src} m={m} group={chap?.id} />)}
                  </div>
                ))
              : s.items.map((m) => <Item key={m.src} m={m} group={chap?.id} />)}
          </div>
          {s.caption ? (
            <p className="pf-caption pf-mono">
              {/* .pf-cc: over a full-bleed piece it reads like closed captions, on a black box */}
              <span className="pf-cc">
                <span>{s.caption}</span>
                {s.link ? (
                  <a className="pf-caption-link" href={s.link.href} target="_blank" rel="noopener noreferrer">
                    {s.link.label}<MdArrowOutward className="pf-arrow" />
                  </a>
                ) : null}
              </span>
            </p>
          ) : null}
        </section>
      );
    }
    case "covers":
      return (
        <section className="pf-slide pf-media pf-coverslide">
          <Run chap={chap} page={page} />
          <div className="pf-covers" style={{ "--n": Math.ceil(s.items.length / 2) } as React.CSSProperties}>
            {s.items.map((m) => <Item key={m.src} m={m} group={chap?.id} />)}
          </div>
          {s.caption ? (
            <p className="pf-caption pf-mono">
              <span>{s.caption}</span>
            </p>
          ) : null}
        </section>
      );
    case "deck":
      return (
        <section className="pf-slide pf-media pf-deckslide">
          <Run chap={chap} page={page} />
          <PfDeck name={s.name} pages={s.pages} thumbs={s.thumbs} />
          {s.caption ? (
            <p className="pf-caption pf-mono">
              <span>{s.caption}</span>
            </p>
          ) : null}
        </section>
      );
    case "logo":
      return (
        <section className={`pf-slide pf-logoslide${s.dark ? " is-dark" : ""}`} style={s.bg ? ({ "--ground": s.bg } as React.CSSProperties) : undefined}>
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
            {/* as the cover: one line, centred on the page, "Thank" on the left
                margin and "You" on the right, the logomark pulsing in the middle */}
            <h2 className="pf-poster" aria-label="Thank you">
              <span className="pf-name-l"><Kerned text="Thank" /></span>
              <Mark />
              <span className="pf-name-r"><Kerned text="You" /></span>
            </h2>
            {/* the foot: back to the cover, and the socials and the lab, small */}
            <div className="pf-end-foot pf-mono">
              <a className="pf-to-top" href="#cover">
                Back to top<MdArrowUpward className="pf-arrow" />
              </a>
              <span className="pf-end-icons">
                {SOCIALS.map((s) => (
                  <a key={s.href} className="pf-end-icon" href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                    {s.icon}
                  </a>
                ))}
                <a className="pf-end-icon" href="https://lab.finbar.studio/" target="_blank" rel="noopener noreferrer" aria-label="Lab, experiments">
                  <FlaskIcon />
                </a>
              </span>
            </div>
          </div>
        </section>
      );
  }
}

/** A secondary line made of comma-separated parts. Each part stays whole, so
 *  the line only ever wraps after a comma, never inside a role or a date. */
function Parts({ list }: { list: string[] }) {
  return (
    <span className="in">
      {list.map((part, i) => (
        <span key={part} className="pf-part">
          {part}
          {i < list.length - 1 ? ", " : ""}
        </span>
      ))}
    </span>
  );
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
  const chapters: Chapter[] = [];
  for (const s of PORTFOLIO) {
    if (s.kind === "title") chapters.push({ no: pad2(chapters.length + 1), name: s.name, sub: s.category, id: s.id });
    if (s.kind === "section") chapters.push({ no: pad2(chapters.length + 1), name: s.title, sub: s.subtitle, id: "other" });
  }
  let n = -1;
  return (
    <main className="pf">
      {PORTFOLIO.map((s, i) => {
        if (s.kind === "title" || s.kind === "section") n += 1;
        return <SlideView key={i} s={s} chap={n >= 0 ? chapters[n] : undefined} page={`${pad2(i + 1)}/${total}`} chapters={chapters} />;
      })}
    </main>
  );
}
