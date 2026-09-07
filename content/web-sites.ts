/** web.finbar — the catalogue. Newest first is automatic (sorted by id, descending).
 *  To add a site: take a 1440×810 screenshot, save it as a .webp under public/web/,
 *  add an entry with the next id. Nothing else to touch. */
export type WebSite = {
  id: number; // catalogue number, shown under the tile
  name: string;
  url: string; // where the tile links (opens in a new tab)
  image: string; // /web/<file>.webp or any /images path, 1440×810
  credit?: string; // e.g. "Design + development: Finbar Studio"
  added: string; // YYYY-MM-DD
};

export const PER_PAGE = 12;

export const WEB_SITES: WebSite[] = [
  {
    id: 4,
    name: "Rennen Plus",
    url: "https://www.rennenplus.com.au",
    image: "/images/web/rennen-1.webp",
    credit: "Design + development: Finbar Studio",
    added: "2026-09-04",
  },
  {
    id: 3,
    name: "Lows Design + Build",
    url: "https://www.lowsdesignandbuild.com",
    image: "/images/web/lows-1.webp",
    credit: "Design + development: Finbar Studio",
    added: "2026-09-04",
  },
  {
    id: 2,
    name: "Lola Audio",
    url: "https://www.lola-audio.com",
    image: "/images/web/lola-1.webp",
    credit: "Design + development: Finbar Studio",
    added: "2026-09-04",
  },
  {
    id: 1,
    name: "KinAya",
    url: "https://kinaya.com.au",
    image: "/images/web/kinaya-1.webp",
    credit: "Design + development: Finbar Studio",
    added: "2026-09-04",
  },
];
