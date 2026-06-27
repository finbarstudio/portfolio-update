/**
 * Braeden projects — the real photographed homes (10), faithful to what's known:
 * the five from the homepage showcase carry their real titles + awards; the rest
 * are named by their location (real Braeden builds across Noosa and the Sunshine
 * Coast). No invented stories — the listing grid only needs image + place + type.
 */
export type BraedenProject = {
  slug: string;
  title: string;
  location: string;
  category: string;
  award?: string;
  src: string;
};

const P = "/braeden/projects";

export const BRAEDEN_PROJECTS: BraedenProject[] = [
  { slug: "modern-thai-house", title: "Modern Thai House", location: "Noosa Heads", category: "Custom home", award: "House of the Year", src: `${P}/modern-thai.webp` },
  { slug: "riverside", title: "Riverside", location: "Noosaville", category: "Custom home", award: "Best Individual Home", src: `${P}/noosaville.webp` },
  { slug: "peregian", title: "Peregian", location: "Peregian Beach", category: "Custom home", src: `${P}/peregian.webp` },
  { slug: "river-haven", title: "River Haven", location: "Noosa", category: "Custom home", src: `${P}/river-haven.webp` },
  { slug: "sunrise-beach", title: "Sunrise Beach", location: "Sunrise Beach", category: "Custom home", src: `${P}/sunrise-beach.webp` },
  { slug: "noosa-heads", title: "Noosa Heads", location: "Sunshine Coast", category: "Custom home", src: `${P}/noosa-heads.webp` },
  { slug: "coolum", title: "Coolum", location: "Coolum Beach", category: "Custom home", src: `${P}/coolum.webp` },
  { slug: "sunshine-beach", title: "Sunshine Beach", location: "Sunshine Coast", category: "Custom home", src: `${P}/sunshine-beach.webp` },
  { slug: "cooroy-mountain", title: "Cooroy Mountain", location: "Noosa hinterland", category: "Custom home", src: `${P}/cooroy-mountain.webp` },
  { slug: "tinbeerwah", title: "Tinbeerwah", location: "Noosa hinterland", category: "Custom home", src: `${P}/tinbeerwah.webp` },
];
