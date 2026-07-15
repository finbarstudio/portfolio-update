import type { Metadata } from "next";
import type { CSSProperties } from "react";
import GalleryChrome from "@/components/qldpools/GalleryChrome";
import type { Hero } from "./kit";
import { familyA } from "./families/a";
import { familyB } from "./families/b";
import { familyC } from "./families/c";
import { familyD } from "./families/d";
import { familyE } from "./families/e";
import { familyF } from "./families/f";

// Private hero-picking gallery for the QPI demo. Every option renders full
// viewport, stacked, with a number label; the chrome tracks + jumps between
// them. noindex — reachable only by URL.
export const metadata: Metadata = {
  title: { absolute: "Hero options · QLD Pool Installs" },
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

const GROUPS: { label: string; heroes: Hero[] }[] = [
  { label: "Minimal", heroes: familyA },
  { label: "Cinematic", heroes: familyB },
  { label: "Split", heroes: familyC },
  { label: "Type", heroes: familyD },
  { label: "Treatment", heroes: familyE },
  { label: "Brand", heroes: familyF },
];

const frameStyle: CSSProperties = {
  contentVisibility: "auto",
  containIntrinsicSize: "100vw 100vh",
} as CSSProperties;

export default function HeroGallery() {
  const flat = GROUPS.flatMap((g) => g.heroes.map((h) => ({ ...h, group: g.label })));
  return (
    <div className="bg-white">
      <GalleryChrome total={flat.length} selector=".qpi-hero-frame" />
      {flat.map((h, i) => (
        <div
          key={i}
          data-index={i}
          className="qpi-hero-frame relative h-svh w-full border-b border-black/10"
          style={frameStyle}
        >
          {h.node}
          <div className="absolute top-4 left-4 z-50 rounded bg-black/60 text-white text-[11px] px-2.5 py-1 backdrop-blur pointer-events-none">
            {String(i + 1).padStart(3, "0")} · {h.group} · {h.name}
          </div>
        </div>
      ))}
    </div>
  );
}
