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
  stumps: { src: d("stumps"), alt: "Toombul stumps" },
  card: { src: d("card"), alt: "Vintage cricket cigarette card" },
  shield: { src: d("shield"), alt: "The Sheffield Shield, 1894 engraving" },
  arms: { src: d("arms"), alt: "Advance Australia coat of arms" },
  blazer: { src: d("blazer"), alt: "A 1937 striped cricket club blazer" },
  sweater: { src: d("sweater"), alt: "A cable-knit cricket jumper" },
  // public/toombul/touse — club photography (Toombul / Queensland)
  bowler: { src: d("bowler"), alt: "A Toombul bowler in the delivery stride" },
  bradman: { src: d("bradman"), alt: "Toombul and Australia players walking off, from the club's history" },
  batsman: { src: d("batsman"), alt: "A Toombul batsman playing a shot" },
  slasher: { src: d("slasher"), alt: "Ken 'Slasher' Mackay, Toombul and Australia" },
  // Queensland / Toombul players + the Gabba
  tallon: { src: d("tallon"), alt: "Don Tallon, Toombul and Australia wicket-keeper" },
  billbrown: { src: d("billbrown"), alt: "Bill Brown, Toombul and Australia" },
  mccool: { src: d("mccool"), alt: "Colin McCool, Toombul and Australia" },
  grout: { src: d("grout"), alt: "Wally Grout, Toombul and Australia wicket-keeper" },
  oxenham: { src: d("oxenham"), alt: "Ron Oxenham, Toombul and Queensland" },
  hornibrook: { src: d("hornibrook"), alt: "Percy Hornibrook, Queensland and Australia" },
  mcdermott: { src: d("mcdermott"), alt: "Craig McDermott, Queensland and Australia" },
  healy: { src: d("healy"), alt: "Ian Healy, Queensland and Australia" },
  harris: { src: d("harris"), alt: "Ryan Harris, Queensland and Australia" },
  khawaja: { src: d("khawaja"), alt: "Usman Khawaja, Queensland and Australia" },
  marnus: { src: d("marnus"), alt: "Marnus Labuschagne, Queensland and Australia" },
  lynn: { src: d("lynn"), alt: "Chris Lynn, Queensland and Toombul junior" },
  renshaw: { src: d("renshaw"), alt: "Matthew Renshaw, Toombul junior, Queensland and Australia" },
  carseldine: { src: d("carseldine"), alt: "Lee Carseldine batting for the Queensland Bulls at the Gabba" },
  gabba: { src: d("gabba"), alt: "The Woolloongabba cricket ground grandstand, 1907" },
};

export type CollagePos = { key: string; x: number; y: number; w: number; rot: number };
