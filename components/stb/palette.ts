/**
 * Share to Buy colours and the background + line pairings the guidelines allow
 * (Brand colour palette combinations, p.16, and the Live palette, p.48).
 * Edit the COMBOS lists to add or remove a pairing.
 */

export const C = {
  pink: "#FF0066",
  midnight: "#0A0A33",
  maroon: "#3F001D",
  rose: "#FFF5F5",
  violet: "#B5AEF5",
  violetTint: "#A9A1ED",
  yellow: "#FFEDA6",
  yellowTint: "#F5E298",
  powder: "#FFA7DC",
  powderTint: "#F598D3",
  // Share to Buy Live
  mint: "#A2E8D0",
  blue: "#ACE1F3",
  yellow50: "#FFF6D2",
  violet50: "#DAD6FA",
  powder50: "#FFD3ED",
  mint50: "#D1F4E8",
  blue50: "#D6F0F9",
} as const;

/** The Live gradient: the five category colours at 100%, no 50% tints. */
export const GRADIENT = [C.mint, C.blue, C.violet, C.powder, C.yellow];

export interface Combo {
  name: string;
  bg: string;
  /** A colour, or "gradient" for the Live mix. */
  line: string;
}

const pair = (a: string, an: string, b: string, bn: string): Combo[] => [
  { name: `${bn} on ${an}`, bg: a, line: b },
  { name: `${an} on ${bn}`, bg: b, line: a },
];

export const BRANDS = {
  stb: {
    label: "Share to Buy",
    combos: [
      ...pair(C.pink, "Pink", C.maroon, "Dark Maroon"),
      ...pair(C.pink, "Pink", C.rose, "Rose White"),
      ...pair(C.midnight, "Midnight Blue", C.rose, "Rose White"),
      ...pair(C.midnight, "Midnight Blue", C.violet, "Pale Violet"),
      ...pair(C.violet, "Pale Violet", C.rose, "Rose White"),
      { name: "Pale Violet Tint on Pale Violet", bg: C.violet, line: C.violetTint },
      ...pair(C.yellow, "Pastel Yellow", C.rose, "Rose White"),
      { name: "Pastel Yellow Tint on Pastel Yellow", bg: C.yellow, line: C.yellowTint },
      ...pair(C.powder, "Powder Pink", C.rose, "Rose White"),
      { name: "Powder Pink Tint on Powder Pink", bg: C.powder, line: C.powderTint },
    ] as Combo[],
  },
  live: {
    label: "Share to Buy Live",
    combos: [
      { name: "Gradient on Midnight Blue", bg: C.midnight, line: "gradient" },
      { name: "Gradient on Rose White", bg: C.rose, line: "gradient" },
      ...pair(C.midnight, "Midnight Blue", C.yellow, "Pastel Yellow"),
      ...pair(C.midnight, "Midnight Blue", C.violet, "Pale Violet"),
      ...pair(C.midnight, "Midnight Blue", C.powder, "Powder Pink"),
      ...pair(C.midnight, "Midnight Blue", C.mint, "Mint Green"),
      ...pair(C.midnight, "Midnight Blue", C.blue, "Cool Blue"),
      { name: "Pastel Yellow on its 50%", bg: C.yellow50, line: C.yellow },
      { name: "Pale Violet on its 50%", bg: C.violet50, line: C.violet },
      { name: "Powder Pink on its 50%", bg: C.powder50, line: C.powder },
      { name: "Mint Green on its 50%", bg: C.mint50, line: C.mint },
      { name: "Cool Blue on its 50%", bg: C.blue50, line: C.blue },
    ] as Combo[],
  },
};

export type BrandKey = keyof typeof BRANDS;

/**
 * Ticker text colours. Nobody picks a colour by hand: each line colour offers
 * only the choices the guidelines show (ticker tape, p.53), and the first is
 * the default. Two colours means each repeat of the text takes the next one.
 */
export interface TextPreset {
  name: string;
  colours: string[];
}

export function textPresets(line: string): TextPreset[] {
  if (line !== "gradient" && isDark(line)) {
    return [
      { name: "Pastel Yellow", colours: [C.yellow] },
      { name: "Rose White", colours: [C.rose] },
      { name: "Rose White and Pastel Yellow", colours: [C.rose, C.yellow] },
    ];
  }
  // Pink only reads on Pastel Yellow; every other light line takes Midnight Blue.
  if (line === C.yellow) {
    return [
      { name: "Midnight Blue", colours: [C.midnight] },
      { name: "Pink", colours: [C.pink] },
      { name: "Pink and Midnight Blue", colours: [C.pink, C.midnight] },
    ];
  }
  return [{ name: "Midnight Blue", colours: [C.midnight] }];
}

export function isDark(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255) < 110;
}
