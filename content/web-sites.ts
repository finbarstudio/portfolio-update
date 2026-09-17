/** web.finbar — the catalogue. Newest first is automatic (sorted by id, descending).
 *
 *  To add a site: export the Instagram post frame at 1080×1440 (3:4), drop it
 *  under public/web/ as a .webp (the still) and, if it's a clip, a .webm plus
 *  an .mp4 fallback for older Safari. Add an entry with the next id. Nothing
 *  else to touch. Quick recipe from an exports folder:
 *
 *    (clips are forward-then-reversed so the loop never jumps)
 *    PP='[0:v]scale=810:1080,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0[v]'
 *    ffmpeg -i 1.mp4 -filter_complex "$PP" -map "[v]" -an -c:v libvpx-vp9 -crf 36 -b:v 0 dirt.webm
 *    ffmpeg -i 1.mp4 -filter_complex "$PP" -map "[v]" -an -c:v libx264 -crf 25 -movflags +faststart dirt.mp4
 *    ffmpeg -ss 0.1 -i 1.mp4 -frames:v 1 -vf scale=810:1080 poster.png && cwebp -q 82 poster.png -o dirt.webp
 */
export type Credit = { name: string; url?: string }; // url = Instagram or site, optional

export type WebSite = {
  id: number; // catalogue number, shown under the tile
  name: string;
  url: string; // where the tile links (opens in a new tab)
  image: string; // /web/<file>.webp, 1080×1440 (3:4); doubles as the poster for clips
  video?: { webm: string; mp4?: string }; // optional looping clip, same 3:4 frame
  credits?: { design?: Credit[]; development?: Credit[]; built?: Credit[] }; // three lines under the name, names linked
  added: string; // YYYY-MM-DD
};

export const PER_PAGE = 12;

export const WEB_SITES: WebSite[] = [
  {
    id: 4,
    name: "Area",
    url: "https://www.area.tech",
    image: "/web/area.webp",
    video: { webm: "/web/area.webm", mp4: "/web/area.mp4" },
    credits: {
      design: [
        { name: "Area", url: "https://instagram.com/area.tech" },
        { name: "Timothy Luke", url: "https://instagram.com/tmthy.luke" },
      ],
      development: [{ name: "Area", url: "https://instagram.com/area.tech" }],
      built: [{ name: "Next.js", url: "https://nextjs.org" }],
    },
    added: "2026-09-17",
  },
  {
    id: 3,
    name: "CLOU architects",
    url: "https://www.clouarchitects.com",
    image: "/web/clou.webp",
    video: { webm: "/web/clou.webm", mp4: "/web/clou.mp4" },
    credits: {
      design: [{ name: "Unseen Studio", url: "https://instagram.com/uns__nstudio" }],
      development: [{ name: "Unseen Studio", url: "https://instagram.com/uns__nstudio" }],
    },
    added: "2026-09-09",
  },
  {
    id: 2,
    name: "Podium",
    url: "https://podium.global",
    image: "/web/podium.webp",
    video: { webm: "/web/podium.webm", mp4: "/web/podium.mp4" },
    credits: {
      design: [{ name: "San Rita", url: "https://instagram.com/sanrita.atelier" }],
      development: [{ name: "San Rita", url: "https://instagram.com/sanrita.atelier" }],
      built: [{ name: "Next.js", url: "https://nextjs.org" }],
    },
    added: "2026-09-08",
  },
  {
    id: 1,
    name: "Dirt",
    url: "https://dirtverse.co",
    image: "/web/dirt.webp",
    video: { webm: "/web/dirt.webm", mp4: "/web/dirt.mp4" },
    credits: {
      design: [{ name: "Dirt", url: "https://instagram.com/dirtverse" }],
      development: [
        { name: "Bart Ocieczek", url: "https://instagram.com/bartocieczek" },
        { name: "Michał Kielar", url: "https://instagram.com/michall.kielar" },
      ],
      built: [{ name: "Framer", url: "https://www.framer.com" }],
    },
    added: "2026-09-07",
  },
];
