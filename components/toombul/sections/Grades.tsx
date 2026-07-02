import { grades } from "@/content/toombul";

export default function Grades() {
  return (
    <section id="grades">
      {grades.map((g) => (
        <div className="tc-grade-band" key={g.key}>
          <img src={g.image} alt={g.alt} className="tc-grade-img" loading="lazy" />
          <div className="tc-grade-scrim" aria-hidden="true" />
          <div className="tc-grade-body">
            <span className="tc-grade-index">{g.age}</span>
            <h3 className="tc-grade-title">{g.label}</h3>
            <p className="tc-grade-desc">{g.description}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
