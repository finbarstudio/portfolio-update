/**
 * Hero option D — wordmark lockup. Treats the family name as the asset: the
 * name set huge in Spectral as the focal point, one descriptor line beneath,
 * and a thin meta row along a bottom rule. The heritage flex a 4th-generation
 * builder actually owns. No photo.
 */
export default function HeroD() {
  return (
    <section className="frame flex flex-col items-center justify-center text-center relative" style={{ minHeight: "100svh" }}>
      <span className="arl-opt">Hero option D · wordmark</span>

      <p className="eyebrow">Builders of fine Sunshine Coast homes since 1968</p>
      <h1 className="display" style={{ fontSize: "clamp(40px,7.2vw,116px)", lineHeight: 0.98, marginTop: "clamp(18px,2.4vw,34px)" }}>
        A Rolley <span className="display-italic accent">&amp; Sons</span>
      </h1>
      <p className="lead" style={{ marginTop: "clamp(20px,2.4vw,32px)", maxWidth: "40ch", marginInline: "auto" }}>
        Light-filled homes you&rsquo;ll want to call home.
      </p>

      <div
        className="absolute flex flex-wrap items-center justify-center"
        style={{ left: "var(--gutter)", right: "var(--gutter)", bottom: "clamp(28px,5vh,56px)", gap: "clamp(12px,1.4vw,22px)", borderTop: "1px solid var(--line)", paddingTop: "clamp(14px,1.6vw,22px)" }}
      >
        {["Noosa Hinterland", "Established 1968", "Master Builders QLD"].map((m, i) => (
          <span key={m} className="eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: "clamp(12px,1.4vw,22px)" }}>
            {i > 0 && <span className="accent" aria-hidden>&middot;</span>}
            {m}
          </span>
        ))}
      </div>
    </section>
  );
}
