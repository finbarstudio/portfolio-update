import Reveal from "@/components/toombul/Reveal";
import { getInvolved } from "@/content/toombul";

export default function GetInvolved() {
  return (
    <section className="tc-section">
      <div className="tc-wrap">
        <Reveal>
          <span className="tc-eyebrow">Join the club</span>
          <h2 className="tc-section-title" style={{ marginTop: 10 }}>
            Ready to play?
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <div className="tc-involved-grid">
            {getInvolved.map((item) => (
              <div className="tc-involved-card" key={item.label}>
                <div className="tc-involved-label">{item.label}</div>
                <div className="tc-involved-body">{item.body}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
