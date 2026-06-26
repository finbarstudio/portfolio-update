/**
 * Hero option A — bento ledger. A modular tile grid that reads like a spec
 * sheet of provenance: a large headline tile, two heritage stat tiles, a
 * charcoal "regions" tile, and a start-a-project tile. No photo — the tiles
 * and palette do the work. (Grid placement lives in a-rolley-site.css .bento.)
 */
export default function HeroA() {
  return (
    <section className="frame flex flex-col relative" style={{ minHeight: "100svh", paddingTop: "clamp(96px,12vh,140px)", paddingBottom: "clamp(28px,4vh,56px)" }}>
      <span className="arl-opt">Hero option A · bento</span>
      <div className="wrap bento w-full md:flex-1">
          <div className="tile t-head" style={{ justifyContent: "space-between" }}>
            <p className="eyebrow">Fourth-generation Sunshine Coast builders</p>
            <h1 className="display" style={{ fontSize: "clamp(30px,3.6vw,58px)", maxWidth: "15ch" }}>
              Homes you&rsquo;ll want to call <span className="display-italic accent">home</span>.
            </h1>
          </div>

          <div className="tile t-s1" style={{ background: "var(--paper-2)", justifyContent: "flex-end" }}>
            <span className="display" style={{ fontSize: "clamp(34px,3.4vw,56px)", lineHeight: 1 }}>1968</span>
            <span className="eyebrow" style={{ marginTop: "0.7em" }}>On the Coast since</span>
          </div>
          <div className="tile t-s2" style={{ background: "var(--paper-2)", justifyContent: "flex-end" }}>
            <span className="display" style={{ fontSize: "clamp(34px,3.4vw,56px)", lineHeight: 1 }}>4</span>
            <span className="eyebrow" style={{ marginTop: "0.7em" }}>Generations of builders</span>
          </div>

          <div className="tile t-lead" style={{ justifyContent: "space-between" }}>
            <p className="lead" style={{ fontSize: "clamp(15px,1.1vw,18px)" }}>Light-filled, energy-considered homes, built to last.</p>
            <a href="#work" className="eyebrow" data-cursor="View" style={{ color: "var(--ink)" }}>Our homes &rarr;</a>
          </div>

          <div className="tile t-place" style={{ background: "var(--ink)", color: "var(--paper)", justifyContent: "flex-end" }}>
            <span className="eyebrow" style={{ color: "var(--paper)", opacity: 0.7 }}>Building across</span>
            <span style={{ fontFamily: "var(--font-arolley-display), Georgia, serif", fontWeight: 300, fontSize: "clamp(18px,1.5vw,24px)", lineHeight: 1.2, marginTop: "0.5em" }}>
              Noosa, Peregian &amp; the hinterland
            </span>
          </div>

          <div className="tile t-meta" style={{ justifyContent: "space-between" }}>
            <span className="eyebrow">Start a project</span>
            <a href="#contact" className="display-italic accent" data-cursor="Enquire" style={{ fontSize: "clamp(20px,1.7vw,28px)" }}>Let&rsquo;s talk &rarr;</a>
          </div>
      </div>
    </section>
  );
}
