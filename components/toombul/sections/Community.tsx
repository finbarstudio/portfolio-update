import Reveal from "@/components/toombul/Reveal";
import { philosophy } from "@/content/toombul";

export default function Community() {
  return (
    <section className="tc-community">
      <Reveal className="tc-community-copy">
        <span className="tc-eyebrow" style={{ color: "var(--gold)" }}>
          {philosophy.eyebrow}
        </span>
        <p className="tc-community-lead">{philosophy.lead}</p>
        <p className="tc-community-sub">{philosophy.sub}</p>
      </Reveal>
      <div className="tc-community-img-wrap">
        <img
          src="/toombul/community.webp"
          alt="Toombul members and families gathered for a club social event"
          className="tc-community-img"
          loading="lazy"
        />
      </div>
    </section>
  );
}
