// The monument hero. Hybrid lockup: LT Remark Black carries the caps, and a
// few glyphs swap into the crest's classical serif italic (the TDCC monogram
// voice) — modern club, 1882 bones. Glyph picks: the I in SINCE and the
// middle 88 in 1882.
export default function Hero() {
  return (
    <section className="tc-hero" id="top">
      <img src="/toombul/hero.webp" alt="Toombul Premier Cricket action at Oxenham Park" className="tc-hero-img" />
      <div className="tc-hero-scrim" aria-hidden="true" />
      <div className="tc-hero-body">
        <span className="tc-hero-eyebrow">The oldest Premier Cricket club in Queensland</span>
        <h1 className="tc-hero-monument">
          S<span className="tc-g-serif">i</span>nce
          <br />
          1<span className="tc-g-serif">88</span>2
        </h1>
      </div>
    </section>
  );
}
