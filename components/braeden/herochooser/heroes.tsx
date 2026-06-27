/**
 * Hero options, round 2. Finbar rejected the big-headline direction ("i dont
 * like the big font"), so these are image-led with SMALL, restrained type — the
 * photo + the real Braeden logo carry it, mono micro-copy is a quiet accent.
 * Five placements (F–J). Shown at /braeden/site/hero-options; winner → home/Hero.
 */
import BraedenLogoFull from "../BraedenLogoFull";

const IMG = "/braeden/projects";
const AWARDS = "5× House of the Year · National Master Builder of the Year";

/* F — Pure image, small logo lockup low-left. The photo is everything. */
export function HeroF() {
  return (
    <section className="bx-hero" data-tone="dark">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${IMG}/modern-thai.webp`} alt="A Braeden home at Noosa Heads" className="bx-hero-img bx-ken" />
      <div className="bx-scrim-bl" aria-hidden />
      <div className="bx-hero-inner bx-bl">
        <BraedenLogoFull variant="wordmark" className="bx-logo-lg bx-on-img" />
        <p className="ff-mono bx-eyebrow bx-on-img bx-mt">Custom homes · Noosa hinterland · Est. 1996</p>
      </div>
      <span className="ff-mono bx-scrollcue bx-on-img" aria-hidden>Scroll</span>
    </section>
  );
}

/* G — Gallery plate. Full image, a thin caption bar pinned to the bottom. */
export function HeroG() {
  return (
    <section className="bx-hero" data-tone="dark">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${IMG}/peregian.webp`} alt="A Braeden home at Peregian Beach" className="bx-hero-img bx-ken" />
      <div className="bx-scrim-full" aria-hidden />
      <span className="ff-mono bx-scrollcue bx-on-img bx-scroll-top" aria-hidden>Scroll</span>
      <div className="bx-g-bar">
        <BraedenLogoFull variant="wordmark" className="bx-logo-sm bx-on-img" />
        <div className="bx-g-meta">
          <span className="ff-mono bx-eyebrow bx-on-img">Noosa · Est. 1996</span>
          <span className="ff-mono bx-eyebrow bx-on-img">5× House of the Year</span>
          <span className="ff-mono bx-eyebrow bx-on-img">Deal direct with Mick</span>
        </div>
      </div>
    </section>
  );
}

/* H — Centred lockup. Logo + thin rules + a tiny eyebrow, dead centre. */
export function HeroH() {
  return (
    <section className="bx-hero" data-tone="dark">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${IMG}/sunshine-beach.webp`} alt="A Braeden home at Sunshine Beach" className="bx-hero-img bx-ken" />
      <div className="bx-scrim-full" aria-hidden />
      <div className="bx-hero-inner bx-h">
        <span className="bx-rule" aria-hidden />
        <BraedenLogoFull variant="wordmark" className="bx-logo-lg bx-on-img" />
        <p className="ff-mono bx-eyebrow bx-on-img">Award-winning custom homes · Noosa</p>
        <span className="bx-rule" aria-hidden />
      </div>
      <span className="ff-mono bx-scrollcue bx-on-img" aria-hidden>Scroll</span>
    </section>
  );
}

/* I — Split, small type. A quiet white panel, the photo dominant. */
export function HeroI() {
  return (
    <section className="bx-hero bx-split">
      <div className="bx-split-type bx-i-type">
        <BraedenLogoFull variant="wordmark" className="bx-logo-md" />
        <p className="ff-quick bx-i-lead">
          Custom homes built start to finish with Mick Devlin, across Noosa and the Sunshine Coast
          hinterland. Since 1996.
        </p>
        <a href="/braeden/site/projects" className="ff-mono bx-link">See the work →</a>
      </div>
      <div className="bx-split-img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${IMG}/noosa-heads.webp`} alt="A Braeden home on the Sunshine Coast" className="bx-hero-img" />
      </div>
    </section>
  );
}

/* J — Magazine cover. Micro-type anchored to the corners, photo in the middle. */
export function HeroJ() {
  return (
    <section className="bx-hero" data-tone="dark">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${IMG}/coolum.webp`} alt="A Braeden home at Coolum" className="bx-hero-img bx-ken" />
      <div className="bx-scrim-full" aria-hidden />
      <div className="bx-j">
        <BraedenLogoFull variant="wordmark" className="bx-logo-sm bx-on-img bx-j-tl" />
        <span className="ff-mono bx-eyebrow bx-on-img bx-j-tr">Est. 1996</span>
        <span className="ff-mono bx-eyebrow bx-on-img bx-j-bl">Custom homes, Noosa hinterland</span>
        <span className="ff-mono bx-eyebrow bx-on-img bx-j-br">{AWARDS}</span>
      </div>
      <span className="ff-mono bx-scrollcue bx-on-img" aria-hidden>Scroll</span>
    </section>
  );
}

/* K — minimal on white. The ~88vh white-space hero Finbar liked, type stripped
   right back: just the logo + one small caption line, lots of air, no photo. */
export function HeroK() {
  return (
    <section className="bx-hero bx-k">
      <div className="bx-k-inner">
        <BraedenLogoFull variant="wordmark" className="bx-logo-xl bx-k-logo" />
        <p className="ff-mono bx-eyebrow">Custom homes · Noosa hinterland · Est. 1996</p>
      </div>
      <span className="ff-mono bx-scrollcue bx-k-scroll" aria-hidden>Scroll</span>
    </section>
  );
}
