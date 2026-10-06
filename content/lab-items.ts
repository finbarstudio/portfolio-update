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
  /** 3:4 tile: a short looping clip (stays dark until it plays) or a still. */
  video?: string;
  image?: string;
  added: string; // YYYY-MM-DD
}

const RAW_ITEMS: LabItem[] = [
  {
    id: 5,
    name: "Motion presets",
    line: "Fifty looping layouts for your media",
    href: "/motion",
    video: "/media/lab/motion/tile.mp4",
    added: "2026-10-06",
  },
  {
    id: 4,
    name: "Pathway maker",
    line: "A brand tool for Share to Buy",
    href: "/pathway",
    video: "/media/lab/pathway/tile.mp4",
    added: "2026-10-01",
  },
  {
    id: 3,
    name: "Lindon Homes",
    line: "A builder's site, demo build",
    href: "https://www.finbar.studio/lindon",
    video: "/media/lab/lindon/tile.mp4",
    added: "2026-09-30",
  },
  {
    id: 2,
    name: "Moto Technique",
    line: "A restoration workshop, demo build",
    href: "https://www.finbar.studio/mt",
    video: "/media/lab/moto-technique/tile.mp4",
    added: "2026-09-30",
  },
  {
    id: 1,
    name: "GemFest",
    line: "Scroll the constellation",
    href: "/gemfest",
    video: "/media/lab/gemfest/hero-web.mp4",
    added: "2026-09-30",
  },
];

export const LAB_ITEMS: LabItem[] = RAW_ITEMS.map((item) => ({
  ...item,
  video: item.video && media(item.video),
  image: item.image && media(item.image),
}));
