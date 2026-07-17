// Norths Devils collage item art + alt text. Positions live in
// norths-collage.json (drag editor at /norths-devils?edit=1). The crest is
// rendered locked + centred by the Collage component and isn't in here.
export type CollageMeta = { src: string; alt: string };

const d = (f: string) => `/norths-devils/dither/${f}.png`;

export const collageMeta: Record<string, CollageMeta> = {
  // "hero" rides top z: the premiership-winning side with the trophy
  hero: { src: d("hero"), alt: "Norths Devils players lifting the premiership trophy" },
  run: { src: d("run"), alt: "A Devils player running the ball" },
  celebration: { src: d("celebration"), alt: "Devils players celebrating a try together" },
  try: { src: d("try"), alt: "A Devils player breaking away with the ball" },
  embrace: { src: d("embrace"), alt: "Junior Devils players in action" },
  studio1: { src: d("studio1"), alt: "A Norths Devils player in the current jersey" },
  ahearn: { src: d("ahearn"), alt: "Jack Ahearn, Norths Devils" },
  flack: { src: d("flack"), alt: "James Flack, Norths Devils" },
  hist1920s: { src: d("hist1920s"), alt: "A Norths player in the 1920s, from the club's history" },
  hist1934: { src: d("hist1934"), alt: "A Queensland rugby league player in action, about 1934" },
  paten: { src: d("paten"), alt: "Billy Paten in a hooped jersey and cap, about 1924" },
  lineup: { src: d("lineup"), alt: "The Devils lined up arm in arm before kick-off" },
  highfive: { src: d("highfive"), alt: "Devils players trading high fives after a win" },
  tackle: { src: d("tackle"), alt: "A tackle in a Devils match at Bishop Park" },
  mates: { src: d("mates"), alt: "Devils teammates laughing together after the game" },
  ball: { src: d("ball"), alt: "A laced vintage leather rugby ball" },
  boot: { src: d("boot"), alt: "A vintage leather football boot" },
};

export type CollagePos = { key: string; x: number; y: number; w: number; rot: number };
