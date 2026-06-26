/**
 * Hero option C — display-led with a suburb marquee. A large left-aligned
 * Spectral statement up top, then a slow horizontal marquee of the service-area
 * suburbs along the bottom for a quietly dynamic, typographic hero. No image.
 */
const SUBURBS = ["Noosa", "Noosaville", "Sunshine Beach", "Sunrise Beach", "Peregian Beach", "Coolum", "Cooroy", "Tinbeerwah", "Buderim"];

export default function HeroC() {
  const strip = [...SUBURBS, ...SUBURBS];
  return (
    <section className="relative flex flex-col" style={{ minHeight: "100svh" }}>
      <span className="arl-opt">Hero option C · display + marquee</span>
      <div className="frame flex-1 flex flex-col justify-center" style={{ paddingTop: "clamp(96px,12vh,140px)" }}>
        <div className="wrap w-full">
          <p className="eyebrow">Fourth-generation Sunshine Coast builders</p>
          <h1 className="display" style={{ fontSize: "clamp(36px, 6.6vw, 104px)", maxWidth: "14ch", marginTop: "clamp(16px,2vw,28px)", lineHeight: 1.0 }}>
            Homes you&rsquo;ll want to call <span className="display-italic accent">home</span>.
          </h1>
          <p className="lead" style={{ marginTop: "clamp(18px,2.2vw,30px)", maxWidth: "44ch" }}>
            Built on the Sunshine Coast since 1968.
          </p>
        </div>
      </div>

      <div style={{ borderTop: "1px solid var(--line)", overflow: "hidden", paddingBlock: "clamp(16px,1.8vw,26px)" }}>
        <div className="arl-marquee" style={{ display: "inline-flex", whiteSpace: "nowrap", animation: "arlMarquee 36s linear infinite", willChange: "transform" }}>
          {strip.map((s, i) => (
            <span key={i} className="display" style={{ fontSize: "clamp(22px,2.6vw,38px)", color: "var(--ink-soft)", display: "inline-flex", alignItems: "center" }}>
              {s}
              <span aria-hidden style={{ color: "var(--terracotta)", margin: "0 clamp(26px,3.4vw,56px)" }}>&middot;</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
