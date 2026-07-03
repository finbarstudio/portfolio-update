// Hero collage: the Toombul crest centred, ringed by bitmapped cricket
// paraphernalia — every item Floyd-Steinberg dithered and gradient-mapped
// to the crest's red -> yellow. Slotted layout tuned on a 1440x900 rig.
// Sources: Bradman signed photo (club history page), 1928 baggy green +
// Advance Australia arms, 1921 Ashes urn, Victor Trumper c1905, Wills's
// "Ranji" cigarette card (1901), 1894 Sheffield Shield engraving, Bradman
// Toby jug, presentation cup, ball, bat, keeper's gloves, stumps (Wikimedia).
const ITEMS = [
  { src: "/toombul/dither/ball.png", alt: "Cricket ball", cls: "tc-para--ball" },
  { src: "/toombul/dither/card.png", alt: "Wills's cigarette card of Ranjitsinhji, 1901", cls: "tc-para--card" },
  { src: "/toombul/dither/stumps.png", alt: "Cricket stumps", cls: "tc-para--stumps" },
  { src: "/toombul/dither/cap.png", alt: "A 1928 Australian baggy green cap", cls: "tc-para--cap" },
  { src: "/toombul/dither/shield.png", alt: "The Sheffield Shield, 1894 engraving", cls: "tc-para--shield" },
  { src: "/toombul/dither/urn.png", alt: "The Ashes urn, photographed 1921", cls: "tc-para--urn" },
  { src: "/toombul/dither/portrait.png", alt: "Victor Trumper at the crease, about 1905", cls: "tc-para--portrait" },
  { src: "/toombul/dither/trophy.png", alt: "Engraved presentation cup", cls: "tc-para--trophy" },
  { src: "/toombul/dither/arms.png", alt: "Advance Australia coat of arms", cls: "tc-para--arms" },
  { src: "/toombul/dither/bat.png", alt: "Cricket bat", cls: "tc-para--bat" },
  { src: "/toombul/dither/gloves.png", alt: "Wicket keeping gloves", cls: "tc-para--gloves" },
  { src: "/toombul/dither/tobyjug.png", alt: "Don Bradman Toby jug", cls: "tc-para--tobyjug" },
  { src: "/toombul/dither/bradman.png", alt: "Don Bradman walking off, signed photograph", cls: "tc-para--bradman" },
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
