/**
 * Five image-led hero options for Braeden, each a different layout + display
 * face (none of them Montserrat, which Finbar didn't want). Monochrome, real
 * content, drawn from reference patterns: cinematic full-bleed, editorial split,
 * giant type-over-image, a gallery frame, and a kinetic marquee. Presented on
 * /braeden/site/hero-options for him to pick; the winner moves into the homepage.
 */

const IMG = "/braeden/projects";

const AWARDS = "5× House of the Year · National Master Builder of the Year";

/* A — Cinematic full-bleed. One image, a low-left elegant serif statement,
   mono eyebrow, scroll cue. Reference: architecture-studio / Cereal. Fraunces. */
export function HeroA() {
  return (
    <section className="bx-hero" data-tone="dark">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${IMG}/modern-thai.webp`} alt="A Braeden home at Noosa Heads" className="bx-hero-img bx-ken" />
      <div className="bx-scrim-bl" aria-hidden />
      <div className="bx-hero-inner bx-bl">
        <p className="ff-mono bx-eyebrow bx-on-img">Noosa hinterland · Est. 1996</p>
        <h1 className="ff-fraunces bx-a-title">Homes built start to finish.</h1>
        <a href="/braeden/site/projects" className="ff-mono bx-link bx-on-img">View the work →</a>
      </div>
      <span className="ff-mono bx-scrollcue bx-on-img" aria-hidden>Scroll</span>
    </section>
  );
}

/* B — Editorial split. Type on a white half, a tall image on the other.
   Reference: land-book editorial / fashion. Cormorant. */
export function HeroB() {
  return (
    <section className="bx-hero bx-split">
      <div className="bx-split-type">
        <p className="ff-mono bx-eyebrow">Award-winning custom homes</p>
        <h1 className="ff-cormorant bx-b-title">Thirty years on the Noosa coast.</h1>
        <p className="ff-quick bx-b-lead">
          Custom homes built start to finish with Mick Devlin, from the hard hinterland blocks to
          the beachfront. Since 1996.
        </p>
        <a href="/braeden/site/projects" className="ff-mono bx-link">See the projects →</a>
      </div>
      <div className="bx-split-img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${IMG}/peregian.webp`} alt="A Braeden home at Peregian Beach" className="bx-hero-img" />
      </div>
    </section>
  );
}

/* C — Giant type over image. A full photo, a dark scrim, a huge grotesk line
   across the bottom. Reference: awwwards / supahero bold type. Archivo. */
export function HeroC() {
  return (
    <section className="bx-hero" data-tone="dark">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${IMG}/sunrise-beach.webp`} alt="A Braeden home at Sunrise Beach" className="bx-hero-img bx-ken" />
      <div className="bx-scrim-full" aria-hidden />
      <div className="bx-hero-inner bx-c">
        <p className="ff-mono bx-eyebrow bx-on-img">Braeden Constructions · Noosa</p>
        <h1 className="ff-archivo bx-c-title">CUSTOM<br />HOMES</h1>
        <p className="ff-mono bx-c-awards bx-on-img">{AWARDS}</p>
      </div>
      <span className="ff-mono bx-scrollcue bx-on-img" aria-hidden>Scroll</span>
    </section>
  );
}

/* D — Gallery frame. An inset image within generous margins, quiet mono lockup
   above and below, lots of white. Reference: godly / minimal portfolio. Grotesk. */
export function HeroD() {
  return (
    <section className="bx-hero bx-frame">
      <div className="bx-frame-top">
        <p className="ff-mono bx-eyebrow">Braeden Constructions</p>
        <p className="ff-mono bx-eyebrow">Custom homes · Noosa</p>
      </div>
      <div className="bx-frame-img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${IMG}/noosa-heads.webp`} alt="A Braeden home on the Sunshine Coast" className="bx-hero-img" />
      </div>
      <div className="bx-frame-bottom">
        <h1 className="ff-grotesk bx-d-title">Built start to finish.</h1>
        <p className="ff-mono bx-eyebrow bx-dim">{AWARDS}</p>
      </div>
    </section>
  );
}

/* E — Kinetic marquee. A full image, a centred ruled lockup, and a scrolling
   strip of the places they build. Reference: codrops / gsap kinetic. Poppins. */
const MARQUEE = ["Noosa Heads", "Noosaville", "Peregian", "Sunrise Beach", "Sunshine Beach", "Coolum", "Cooroy Mountain", "Tinbeerwah"];
export function HeroE() {
  const row = [...MARQUEE, ...MARQUEE];
  return (
    <section className="bx-hero" data-tone="dark">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${IMG}/coolum.webp`} alt="A Braeden home at Coolum" className="bx-hero-img bx-ken" />
      <div className="bx-scrim-full" aria-hidden />
      <div className="bx-hero-inner bx-e">
        <span className="bx-rule" aria-hidden />
        <p className="ff-mono bx-eyebrow bx-on-img">Est. 1996 · Noosa hinterland</p>
        <h1 className="ff-poppins bx-e-title">Custom homes, built to last.</h1>
        <span className="bx-rule" aria-hidden />
      </div>
      <div className="bx-marquee" aria-hidden>
        <div className="bx-marquee-row">
          {row.map((m, i) => (
            <span key={i} className="ff-mono bx-marquee-item bx-on-img">
              {m}<span className="bx-marquee-dot" aria-hidden>·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
