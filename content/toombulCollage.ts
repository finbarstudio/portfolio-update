// Collage item art + alt text, keyed. Positions live in toombul-collage.json
// (written by the in-page drag editor at /toombul?edit=1). The crest is NOT
// in here — it's rendered locked + centred by Collage.tsx and can't be moved.
export type CollageMeta = { src: string; alt: string };

export const collageMeta: Record<string, CollageMeta> = {
  // kept from the original set
  ball: { src: "/toombul/dither/ball.png", alt: "Cricket ball" },
  cap: { src: "/toombul/dither/cap.png", alt: "A 1928 Australian baggy green cap" },
  trophy: { src: "/toombul/dither/trophy.png", alt: "Engraved two-handled presentation cup" },
  // from public/toombul/touse — club + heritage photography
  team: { src: "/toombul/dither/team.png", alt: "A historic Toombul cricket team photograph" },
  bowler: { src: "/toombul/dither/bowler.png", alt: "A Toombul bowler in the delivery stride" },
  bradman: { src: "/toombul/dither/bradman.png", alt: "Don Bradman walking off, signed photograph" },
  batsman: { src: "/toombul/dither/batsman.png", alt: "A Toombul batsman playing a shot" },
  slasher: { src: "/toombul/dither/slasher.png", alt: "Ken 'Slasher' Mackay, Toombul and Australia" },
  stumps: { src: "/toombul/dither/stumps.png", alt: "Toombul stumps" },
};

export type CollagePos = { key: string; x: number; y: number; w: number; rot: number };
