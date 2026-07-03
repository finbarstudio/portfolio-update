// Collage item art + alt text, keyed. Positions live in toombul-collage.json
// (written by the in-page drag editor at /toombul?edit=1). The crest is NOT
// in here — it's rendered locked + centred by Collage.tsx and can't be moved.
export type CollageMeta = { src: string; alt: string };

const d = (f: string) => `/toombul/dither/${f}.png`;

export const collageMeta: Record<string, CollageMeta> = {
  ball: { src: d("ball"), alt: "Cricket ball" },
  cap: { src: d("cap"), alt: "A 1928 Australian baggy green cap" },
  trophy: { src: d("trophy"), alt: "Engraved two-handled presentation cup" },
  ashesurn: { src: d("ashesurn"), alt: "The Ashes urn on its mount" },
  bat: { src: d("bat"), alt: "Cricket bat" },
  gloves: { src: d("gloves"), alt: "Wicket keeping gloves" },
  bails: { src: d("bails"), alt: "Cricket bails" },
  stumps: { src: d("stumps"), alt: "Toombul stumps" },
  card: { src: d("card"), alt: "Wills's cigarette card of Ranjitsinhji, 1901" },
  shield: { src: d("shield"), alt: "The Sheffield Shield, 1894 engraving" },
  arms: { src: d("arms"), alt: "Advance Australia coat of arms" },
  tobyjug: { src: d("tobyjug"), alt: "Don Bradman Toby jug" },
  portrait: { src: d("portrait"), alt: "Victor Trumper at the crease, about 1905" },
  blazer: { src: d("blazer"), alt: "A 1937 striped cricket club blazer" },
  sweater: { src: d("sweater"), alt: "A cable-knit cricket jumper" },
  // public/toombul/touse — club + heritage photography
  team: { src: d("team"), alt: "A historic Toombul cricket team photograph" },
  bowler: { src: d("bowler"), alt: "A Toombul bowler in the delivery stride" },
  bradman: { src: d("bradman"), alt: "Don Bradman walking off, signed photograph" },
  batsman: { src: d("batsman"), alt: "A Toombul batsman playing a shot" },
  slasher: { src: d("slasher"), alt: "Ken 'Slasher' Mackay, Toombul and Australia" },
};

export type CollagePos = { key: string; x: number; y: number; w: number; rot: number };
