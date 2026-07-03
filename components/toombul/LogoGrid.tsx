import Reveal from "@/components/toombul/Reveal";

// Section three: the new identity system — six lockups/colourways of the
// Bulls mark on a clean white 3x2 grid (2x3 on phones), hairline rules.
const MARKS = [1, 2, 3, 4, 5, 6].map((n) => ({
  src: `/toombul/SVG/${n}.svg`,
  alt: `Toombul Bulls mark, variation ${n}`,
}));

export default function LogoGrid() {
  return (
    <section id="three" className="tc-logogrid">
      {MARKS.map((m, i) => (
        <Reveal key={m.src} className="tc-logocell" delay={i * 70}>
          <img src={m.src} alt={m.alt} loading="lazy" draggable={false} />
        </Reveal>
      ))}
    </section>
  );
}
