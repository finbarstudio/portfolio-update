/** web.finbar — the catalogue. Newest first is automatic (sorted by id, descending).
 *
 *  To add a site: export the Instagram post frame at 1080×1440 (3:4), drop it
 *  under public/web/ as a .webp (the still) and, if it's a clip, a .webm plus
 *  an .mp4 fallback for older Safari. Add an entry with the next id. Nothing
 *  else to touch. Quick recipe from an exports folder:
 *
 *    ffmpeg -i 1.mp4 -an -vf scale=810:1080 -c:v libvpx-vp9 -crf 36 -b:v 0 dirt.webm
 *    ffmpeg -i 1.mp4 -an -vf scale=810:1080 -c:v libx264 -crf 25 -movflags +faststart dirt.mp4
 *    ffmpeg -ss 0.1 -i 1.mp4 -frames:v 1 -vf scale=810:1080 poster.png && cwebp -q 82 poster.png -o dirt.webp
 */
export type WebSite = {
  id: number; // catalogue number, shown under the tile
  name: string;
  url: string; // where the tile links (opens in a new tab)
  image: string; // /web/<file>.webp, 1080×1440 (3:4); doubles as the poster for clips
  video?: { webm: string; mp4?: string }; // optional looping clip, same 3:4 frame
  credit?: string; // shown in grey under the name, e.g. "Design Dirt. Built with Framer."
  added: string; // YYYY-MM-DD
};

export const PER_PAGE = 12;

export const WEB_SITES: WebSite[] = [
  {
    id: 1,
    name: "Dirt",
    url: "https://dirtverse.co",
    image: "/web/dirt.webp",
    video: { webm: "/web/dirt.webm", mp4: "/web/dirt.mp4" },
    credit: "Design Dirt. Development Bart Ocieczek, Michał Kielar. Built with Framer.",
    added: "2026-09-07",
  },
];
