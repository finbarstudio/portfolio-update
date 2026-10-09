/** lab.finbar.studio — things made and not (yet) published anywhere else.
 *
 *  To add a piece: give it a route under app/lab/<slug>/page.tsx, put its media
 *  under public/media/lab/<slug>/ (lowercase kebab-case, WebP for stills), then
 *  add an entry here with the next id. Newest first is automatic (id, descending).
 */
import { media } from "@/lib/media";

export interface LabItem {
  id: number; // catalogue number, shown under the tile
  name: string;
  line: string; // one short line under the name
  /** clean path on the lab host (proxy.ts rewrites it to /lab/...), or a full
   *  URL for a piece that lives on the studio site */
  href: string;
  /** 3:4 tile. Every tile is a still (Finbar, 8 Oct 2026: no motion in the lab grid); `video` is kept for the type only. */
  video?: string;
  image?: string;
  added: string; // YYYY-MM-DD
}

const RAW_ITEMS: LabItem[] = [
  {
    id: 6,
    name: "Email check",
    line: "What breaks in which inbox",
    href: "/email",
    image: "/media/lab/email/tile.webp",
    added: "2026-10-07",
  },
  {
    id: 5,
    name: "Motion presets",
    line: "Fifty looping layouts for your media",
    href: "/motion",
    image: "/media/lab/motion/tile.webp",
    added: "2026-10-06",
  },
  {
    id: 4,
    name: "Pathway maker",
    line: "A brand tool for Share to Buy",
    href: "/pathway",
    image: "/media/lab/pathway/tile.webp",
    added: "2026-10-01",
  },
  {
    id: 3,
    name: "Lindon Homes",
    line: "A builder's site, demo build",
    href: "https://www.finbar.studio/lindon",
    image: "/media/lab/lindon/tile.webp",
    added: "2026-09-30",
  },
  {
    id: 2,
    name: "Moto Technique",
    line: "A restoration workshop, demo build",
    href: "https://www.finbar.studio/mt",
    image: "/media/lab/moto-technique/tile.webp",
    added: "2026-09-30",
  },
  {
    id: 1,
    name: "GemFest",
    line: "Scroll the constellation",
    href: "/gemfest",
    image: "/media/lab/gemfest/tile.webp",
    added: "2026-09-30",
  },
];

export const LAB_ITEMS: LabItem[] = RAW_ITEMS.map((item) => ({
  ...item,
  video: item.video && media(item.video),
  image: item.image && media(item.image),
}));
