import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import GalleryChrome from "@/components/qldpools/GalleryChrome";
import { GALLERIES, getGallery } from "../registry";

// One picking gallery per home-page section. Private + noindex, reachable by
// URL only. Every option renders at its natural height with a number label;
// the chrome tracks and jumps between them.
export function generateStaticParams() {
  return GALLERIES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const g = getGallery(slug);
  return {
    title: { absolute: g ? `${g.label} options · QLD Pool Installs` : "Section options" },
    robots: { index: false, follow: false },
    alternates: { canonical: undefined },
  };
}

const frameStyle: CSSProperties = {
  contentVisibility: "auto",
  containIntrinsicSize: "100vw 700px",
} as CSSProperties;

export default async function SectionGallery({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const g = getGallery(slug);
  if (!g) notFound();

  return (
    <div className="bg-white">
      <GalleryChrome total={g.options.length} selector=".qpi-sec-frame" />

      <header className="px-6 md:px-14 py-10 border-b border-black/10">
        <p className="qpi-caps text-[var(--qpi-blue)] text-[10px] mb-3">
          Section options · {g.options.length}
        </p>
        <h1
          className="qpi-display"
          style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", lineHeight: 1.1 }}
        >
          {g.label}
        </h1>
        <p className="text-[var(--qpi-ink)]/60 mt-2" style={{ fontSize: "0.95rem" }}>
          {g.blurb}
        </p>
        <nav className="mt-6 flex flex-wrap gap-x-4 gap-y-2" aria-label="Other section galleries">
          {GALLERIES.map((o) => (
            <Link
              key={o.slug}
              href={`/qldpools/site/sections/${o.slug}`}
              className={`qpi-caps text-[10px] ${
                o.slug === g.slug
                  ? "text-[var(--qpi-blue)]"
                  : "text-[var(--qpi-ink)]/45 hover:text-[var(--qpi-ink)]"
              }`}
            >
              {o.label}
            </Link>
          ))}
        </nav>
      </header>

      {g.options.map((o, i) => (
        <div
          key={`${g.slug}-${i}`}
          data-index={i}
          className="qpi-sec-frame relative border-b border-black/10"
          style={frameStyle}
        >
          {o.node}
          <div className="absolute top-4 left-4 z-50 rounded bg-black/60 text-white text-[11px] px-2.5 py-1 backdrop-blur pointer-events-none">
            {String(i + 1).padStart(3, "0")} · {g.label} · {o.name}
          </div>
        </div>
      ))}
    </div>
  );
}
