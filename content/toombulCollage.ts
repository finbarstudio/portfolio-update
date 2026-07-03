// Collage item art + alt text, keyed. Positions live in toombul-collage.json
// (written by the in-page drag editor at /toombul?edit=1). `raw` items keep
// full colour and no pixelation (the crest); everything else is the dithered art.
export type CollageMeta = { src: string; alt: string; raw?: boolean; z?: number };

export const collageMeta: Record<string, CollageMeta> = {
  crest: { src: "/toombul/logo.svg", alt: "Toombul District Cricket Club crest", raw: true, z: 3 },
  ball: { src: "/toombul/dither/ball.png", alt: "Cricket ball" },
  card: { src: "/toombul/dither/card.png", alt: "Wills's cigarette card of Ranjitsinhji, 1901" },
  stumps: { src: "/toombul/dither/stumps.png", alt: "Cricket stumps" },
  cap: { src: "/toombul/dither/cap.png", alt: "A 1928 Australian baggy green cap" },
  shield: { src: "/toombul/dither/shield.png", alt: "The Sheffield Shield, 1894 engraving" },
  urn: { src: "/toombul/dither/urn.png", alt: "The Ashes urn, photographed 1921" },
  portrait: { src: "/toombul/dither/portrait.png", alt: "Victor Trumper at the crease, about 1905" },
  trophy: { src: "/toombul/dither/trophy.png", alt: "Engraved presentation cup" },
  arms: { src: "/toombul/dither/arms.png", alt: "Advance Australia coat of arms" },
  bat: { src: "/toombul/dither/bat.png", alt: "Cricket bat" },
  gloves: { src: "/toombul/dither/gloves.png", alt: "Wicket keeping gloves" },
  tobyjug: { src: "/toombul/dither/tobyjug.png", alt: "Don Bradman Toby jug" },
  bradman: { src: "/toombul/dither/bradman.png", alt: "Don Bradman walking off, signed photograph" },
};

export type CollagePos = { key: string; x: number; y: number; w: number; rot: number };
