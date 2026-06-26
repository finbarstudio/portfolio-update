/**
 * Image-led hero: a full-bleed project photo carries it (imagery first). The
 * story stays brief, an eyebrow, a short Spectral statement, one heritage line.
 * Depth lives on the About page and the heritage strip below, not here.
 * data-tone="dark" flips the nav to paper over the image.
 */
export default function Hero() {
  return (
    <section data-tone="dark" className="relative w-full" style={{ height: "100svh", minHeight: 560 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/a-rolley/projects/lake-house.webp"
        alt="A Rolley & Sons custom home on the Sunshine Coast"
        className="absolute inset-0 w-full h-full object-cover"
        fetchPriority="high"
      />
      {/* Scrims for AA-legible type: a bottom-weighted vertical gradient anchors
          the headline + lead, a left gradient anchors the left-aligned column,
          and a light top wash keeps the nav legible. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(18,15,11,0.86) 0%, rgba(18,15,11,0.52) 28%, rgba(18,15,11,0.20) 55%, rgba(18,15,11,0.40) 100%)" }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "linear-gradient(to right, rgba(18,15,11,0.50) 0%, rgba(18,15,11,0.12) 42%, rgba(18,15,11,0) 70%)" }}
      />

      <div className="absolute inset-0 frame flex flex-col justify-end" style={{ paddingBottom: "clamp(40px,7vh,96px)", color: "var(--paper)" }}>
        <div className="wrap w-full">
          <p className="eyebrow" style={{ color: "rgba(244,241,234,0.82)" }}>
            Sunshine Coast Custom Homes <span style={{ color: "var(--paper)" }}>·</span> Est. 1968
          </p>
          <h1 className="display" style={{ color: "var(--paper)", fontSize: "var(--step-display)", marginTop: "clamp(14px,1.6vw,22px)", maxWidth: "15ch" }}>
            Homes you will want to call <span className="display-italic">home</span>.
          </h1>
          <p className="lead" style={{ color: "rgba(244,241,234,0.86)", marginTop: "clamp(16px,2vw,26px)", maxWidth: "40ch" }}>
            Fourth-generation family builders, on the Coast since 1968.
          </p>
        </div>
      </div>

      <div className="absolute right-[var(--gutter)] bottom-[clamp(40px,7vh,96px)] eyebrow flex items-center gap-2" style={{ color: "rgba(244,241,234,0.8)" }}>
        <span>Scroll</span>
        <span aria-hidden className="relative inline-block overflow-hidden" style={{ width: 1, height: 28, background: "rgba(244,241,234,0.5)" }}>
          <span className="absolute inset-0" style={{ background: "var(--paper)", animation: "arlScrollDrop 2.4s ease-in-out infinite" }} />
        </span>
      </div>
    </section>
  );
}
