// The monument hero. Hybrid lockup: SINCE runs entirely in LT Remark;
// the numerals sit in Archivo bold for a cleaner, harder 1882.
export default function Hero() {
  return (
    <section className="tc-hero" id="top">
      <img src="/toombul/hero.webp" alt="Toombul Premier Cricket action at Oxenham Park" className="tc-hero-img" />
      <div className="tc-hero-scrim" aria-hidden="true" />
      <div className="tc-hero-body">
        <span className="tc-hero-eyebrow">The oldest Premier Cricket club in Queensland</span>
        <h1 className="tc-hero-monument">
          Since
          <br />
          <span className="tc-g-num">1882</span>
        </h1>
      </div>
    </section>
  );
}
