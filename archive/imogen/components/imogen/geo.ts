import { TH_PATHS, VN_PATHS, KH_PATHS, LA_PATHS } from "./sea-geo";

// Accurate SE Asia outlines traced by Finbar (public/SVG/SE Asia SVG.svg),
// extracted into sea-geo.ts. The artwork lives in this viewBox:
export const VB_W = 92.38;
export const VB_H = 153.26;

// Linear lon/lat → viewBox projection, tuned so the traced coastlines and the
// city pins line up. If pins drift, nudge these four numbers (they're the only
// place the mapping lives).
const LON0 = 97.5;
const LON_SCALE = 7.698; // x = (lon - LON0) * LON_SCALE   → 0..~92
const LAT0 = 23.4;
const LAT_SCALE = 8.61; //  y = (LAT0 - lat) * LAT_SCALE   → 0..~153
export function project(lon: number, lat: number): { x: number; y: number } {
  return { x: (lon - LON0) * LON_SCALE, y: (LAT0 - lat) * LAT_SCALE };
}

export type CountryShape = { id: string; paths: string[]; fill: string };

// Route countries get their accent; Cambodia is muted context (off-route).
export const COUNTRIES: CountryShape[] = [
  { id: "thailand", paths: TH_PATHS, fill: "#d99a3a" },
  { id: "laos", paths: LA_PATHS, fill: "#4fa284" },
  { id: "vietnam", paths: VN_PATHS, fill: "#d9644e" },
  { id: "cambodia", paths: KH_PATHS, fill: "#bfa06a" },
];

// Country labels, placed by lon/lat (projected at render).
export const LABELS: { t: string; lon: number; lat: number; muted?: boolean }[] = [
  { t: "THAILAND", lon: 100.4, lat: 15.6 },
  { t: "LAOS", lon: 102.9, lat: 19.3 },
  { t: "VIETNAM", lon: 108.9, lat: 17.6 },
  { t: "CAMBODIA", lon: 104.5, lat: 12.3, muted: true },
];
