// Hero collage: the Toombul crest centred, ringed by bitmapped cricket
// paraphernalia — Bradman walking off (from the club's own history page),
// a 1928 baggy green, the Ashes urn (1921), ball, bat, keeper's gloves,
// stumps, and the Advance Australia arms. Every item halftone-dithered and
// gradient-mapped to the crest's red -> yellow.
const ITEMS = [
  { src: "/toombul/dither/bradman.png", alt: "Don Bradman walking off, signed photograph", cls: "tc-para--bradman" },
  { src: "/toombul/dither/urn.png", alt: "The Ashes urn, 1921", cls: "tc-para--urn" },
  { src: "/toombul/dither/cap.png", alt: "A 1928 Australian baggy green cap", cls: "tc-para--cap" },
  { src: "/toombul/dither/ball.png", alt: "Cricket ball", cls: "tc-para--ball" },
  { src: "/toombul/dither/bat.png", alt: "Cricket bat", cls: "tc-para--bat" },
  { src: "/toombul/dither/gloves.png", alt: "Wicket keeping gloves", cls: "tc-para--gloves" },
  { src: "/toombul/dither/stumps.png", alt: "Cricket stumps", cls: "tc-para--stumps" },
  { src: "/toombul/dither/arms.png", alt: "Advance Australia coat of arms", cls: "tc-para--arms" },
];

export default function Hero() {
  return (
    <section id="one" className="tc-collage">
      {ITEMS.map((item) => (
        <img key={item.src} src={item.src} alt={item.alt} className={`tc-para ${item.cls}`} loading="eager" />
      ))}
      <img src="/toombul/logo.svg" alt="Toombul District Cricket Club crest" className="tc-collage-crest" />
    </section>
  );
}
