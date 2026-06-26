/**
 * Hero option C — two-tone diptych. The viewport splits into a warm-paper
 * panel (headline) and a charcoal-ink panel (positioning + CTA), divided by a
 * thin clay seam. The split itself shows off the palette — timber-warm against
 * ink — which is a quiet builder metaphor. Stacks on mobile.
 */
export default function HeroC() {
  return (
    <section className="relative flex flex-col md:flex-row" style={{ minHeight: "100svh" }}>
      <span className="arl-opt">Hero option C · diptych</span>

      {/* Paper panel */}
      <div
        className="flex flex-col justify-end"
        style={{
          flexBasis: "58%", background: "var(--paper)",
          padding: "clamp(96px,12vh,150px) clamp(20px,4vw,72px) clamp(48px,7vh,96px)",
          borderRight: "1px solid var(--terracotta)",
        }}
      >
        <p className="eyebrow">Fourth-generation Sunshine Coast builders</p>
        <h1 className="display" style={{ fontSize: "clamp(34px,4.4vw,72px)", maxWidth: "13ch", marginTop: "clamp(16px,2vw,26px)" }}>
          Homes you&rsquo;ll want to call <span className="display-italic accent">home</span>.
        </h1>
      </div>

      {/* Charcoal panel */}
      <div
        className="flex flex-col justify-end"
        style={{
          flexBasis: "42%", background: "var(--ink)", color: "var(--paper)",
          padding: "clamp(40px,7vh,96px) clamp(20px,4vw,64px) clamp(48px,7vh,96px)",
        }}
      >
        <p style={{ fontFamily: "var(--font-arolley-display), Georgia, serif", fontWeight: 300, fontSize: "clamp(20px,1.8vw,30px)", lineHeight: 1.4, maxWidth: "26ch" }}>
          Light-filled, energy-considered homes that sit easily in the subtropics, built to last.
        </p>
        <div style={{ marginTop: "clamp(28px,4vw,52px)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "1rem", borderTop: "1px solid color-mix(in srgb, var(--paper) 22%, transparent)", paddingTop: "clamp(16px,2vw,24px)" }}>
          <span className="eyebrow" style={{ color: "var(--paper)", opacity: 0.7 }}>On the Coast since 1968</span>
          <a href="#contact" data-cursor="Enquire" className="eyebrow" style={{ color: "var(--terracotta)", borderBottom: "1px solid var(--terracotta)", paddingBottom: 3 }}>Start a project &rarr;</a>
        </div>
      </div>
    </section>
  );
}
