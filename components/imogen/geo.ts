// Stylised-but-recognisable outlines of mainland SE Asia for the /imogen maps.
// Every point is plotted from real lon/lat through ONE projection so the country
// shapes and the city pins (in content/imogen.ts) share the same coordinate
// space and always line up:
//
//   x = 60 + (lon - 98) * 40          (east →)
//   y = 740 - (lat - 9)  * 48.57      (north ↑, so larger lat = smaller y)
//
// viewBox is 0 0 600 800. Shapes are simplified by hand (no geo data in the
// repo) but follow the real coastlines/borders closely enough to read as a map.
// Both RouteMap (the big map) and LocatorMap (the little hostel maps) render
// these, so improving an outline here improves it everywhere.

export const THAILAND =
  "M140,186 L252,303 L340,439 L240,585 L160,521 L108,667 L112,735 L160,842 L76,789 L84,691 L80,570 L80,449 L60,327 L88,240 Z";

export const LAOS =
  "M208,84 L328,89 L320,225 L364,303 L404,376 L400,497 L360,473 L292,410 L244,308 L188,225 L164,162 Z";

export const VIETNAM =
  "M260,89 L340,45 L404,70 L456,133 L408,167 L368,269 L404,327 L468,395 L512,507 L508,594 L464,648 L424,672 L340,759 L320,691 L380,619 L440,555 L440,463 L400,376 L372,322 L312,215 L268,157 Z";

export const CAMBODIA =
  "M240,487 L340,478 L440,483 L420,594 L340,667 L280,662 L260,619 L240,565 Z";

export type CountryShape = { id: string; path: string; fill: string };

// Route countries get their accent; Cambodia is muted context (off-route).
export const COUNTRIES: CountryShape[] = [
  { id: "thailand", path: THAILAND, fill: "#d99a3a" },
  { id: "laos", path: LAOS, fill: "#4fa284" },
  { id: "vietnam", path: VIETNAM, fill: "#d9644e" },
  { id: "cambodia", path: CAMBODIA, fill: "#bfa06a" },
];

export const LABELS: { t: string; x: number; y: number; muted?: boolean }[] = [
  { t: "THAILAND", x: 150, y: 440 },
  { t: "LAOS", x: 276, y: 150 },
  { t: "VIETNAM", x: 352, y: 112 },
  { t: "CAMBODIA", x: 332, y: 565, muted: true },
];

export const VB_W = 600;
export const VB_H = 800;
