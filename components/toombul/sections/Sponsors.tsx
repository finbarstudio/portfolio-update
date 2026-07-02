import Reveal from "@/components/toombul/Reveal";
import { sponsors } from "@/content/toombul";

export default function Sponsors() {
  return (
    <section className="tc-section tc-section--panel">
      <div className="tc-wrap">
        <Reveal>
          <span className="tc-eyebrow">Our Valued Sponsors</span>
          <h2 className="tc-section-title" style={{ marginTop: 10 }}>
            Supporting the heart of Toombul cricket
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <div className="tc-sponsors-row">
            {sponsors.map((s) => (
              <div className="tc-sponsor-cell" key={s.name}>
                <img src={s.logo} alt={s.name} loading="lazy" />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
