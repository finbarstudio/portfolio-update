import Reveal from "@/components/toombul/Reveal";
import { legacyLead, legacyNames, legacyStats } from "@/content/toombul";

export default function Legacy() {
  return (
    <section className="tc-section" id="legacy">
      <div className="tc-wrap">
        <Reveal>
          <span className="tc-eyebrow">A club built on history</span>
          <h2 className="tc-section-title" style={{ marginTop: 10 }}>
            Since 1882, still going strong
          </h2>
          <p className="tc-legacy-lead" style={{ marginTop: 18 }}>{legacyLead}</p>
        </Reveal>

        <Reveal delay={80}>
          <div className="tc-legacy-stats">
            {legacyStats.map((s) => (
              <div className="tc-stat" key={s.label}>
                <div className="tc-stat-value">{s.value}</div>
                <div className="tc-stat-label">{s.label}</div>
                <div className="tc-stat-detail">{s.detail}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="tc-legacy-names">
            {legacyNames.map((n) => (
              <div className="tc-legacy-name" key={n.name}>
                <div className="tc-legacy-name-name">{n.name}</div>
                <div className="tc-legacy-name-note">{n.note}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
