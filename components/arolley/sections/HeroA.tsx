/**
 * Hero option A — centred editorial. Pure type on the paper ground, no image:
 * eyebrow, a calm centred Spectral statement, one supporting line, and a quiet
 * scroll cue. Maximum white space.
 */
export default function HeroA() {
  return (
    <section className="frame flex flex-col items-center justify-center text-center relative" style={{ minHeight: "100svh" }}>
      <span className="arl-opt">Hero option A · centred</span>
      <p className="eyebrow">Fourth-generation Sunshine Coast builders</p>
      <h1 className="display" style={{ fontSize: "var(--step-display)", maxWidth: "15ch", marginTop: "clamp(16px,2vw,28px)" }}>
        Homes you&rsquo;ll want to call <span className="display-italic accent">home</span>.
      </h1>
      <p className="lead" style={{ marginTop: "clamp(18px,2.2vw,32px)", maxWidth: "44ch", marginInline: "auto" }}>
        Light-filled, energy-considered homes, built on the Coast since 1968.
      </p>

      <div className="absolute left-1/2 -translate-x-1/2 eyebrow flex items-center gap-2" style={{ bottom: "clamp(28px,5vh,56px)", color: "var(--ink-soft)" }}>
        <span>Scroll</span>
        <span aria-hidden className="relative inline-block overflow-hidden" style={{ width: 1, height: 26, background: "var(--line)" }}>
          <span className="absolute inset-0" style={{ background: "var(--terracotta)", animation: "arlScrollDrop 2.4s ease-in-out infinite" }} />
        </span>
      </div>
    </section>
  );
}
