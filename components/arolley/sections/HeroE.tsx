/**
 * Hero option E — framed plate. A quiet centred statement sits inside a thin
 * clay keyline, like a matted print, with corner registration ticks and a
 * small meta footer along the inside of the frame. Deep paper margin all
 * around. Archival, gallery-grade restraint. No photo.
 */
export default function HeroE() {
  const ticks = [
    { top: -1, left: -1, borderTop: "1px solid var(--terracotta)", borderLeft: "1px solid var(--terracotta)" },
    { top: -1, right: -1, borderTop: "1px solid var(--terracotta)", borderRight: "1px solid var(--terracotta)" },
    { bottom: -1, left: -1, borderBottom: "1px solid var(--terracotta)", borderLeft: "1px solid var(--terracotta)" },
    { bottom: -1, right: -1, borderBottom: "1px solid var(--terracotta)", borderRight: "1px solid var(--terracotta)" },
  ];
  return (
    <section className="relative" style={{ minHeight: "100svh" }}>
      <span className="arl-opt">Hero option E · framed plate</span>
      <div className="plate" style={{ padding: "clamp(28px,4vw,56px)" }}>
        {ticks.map((t, i) => (
          <span key={i} className="plate-tick" style={t as React.CSSProperties} aria-hidden />
        ))}

        <p className="eyebrow">Fourth-generation Sunshine Coast builders</p>
        <h1 className="display" style={{ fontSize: "clamp(30px,4.6vw,72px)", maxWidth: "15ch", marginTop: "clamp(16px,2vw,28px)" }}>
          Homes you&rsquo;ll want to call <span className="display-italic accent">home</span>.
        </h1>
        <p className="lead" style={{ marginTop: "clamp(16px,2vw,28px)", maxWidth: "42ch", marginInline: "auto" }}>
          Light-filled, energy-considered homes, built on the Coast since 1968.
        </p>

        <div
          className="absolute flex flex-wrap items-center justify-center"
          style={{ left: "clamp(20px,3vw,48px)", right: "clamp(20px,3vw,48px)", bottom: "clamp(16px,2vw,28px)", gap: "clamp(12px,1.4vw,22px)" }}
        >
          {["Noosa Hinterland", "Est. 1968", "Master Builders QLD"].map((m, i) => (
            <span key={m} className="eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: "clamp(12px,1.4vw,22px)" }}>
              {i > 0 && <span className="accent" aria-hidden>&middot;</span>}
              {m}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
