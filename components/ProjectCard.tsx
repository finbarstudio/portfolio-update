"use client";

import Link from "next/link";
import { Project } from "@/content/projects";
import ZoomImage from "@/components/ZoomImage";
import SplineScene from "@/components/SplineScene";
import ModelDisplay from "@/components/ModelDisplay";
import PhoneCarousel from "@/components/PhoneCarousel";
import MagazineCarousel from "@/components/MagazineCarousel";
import HeroSlideshow from "@/components/HeroSlideshow";
import AlbumRow from "@/components/AlbumRow";
import PdfSlideshowThumb from "@/components/PdfSlideshowThumb";

/* ─── Tag pill ────────────────────────────────────────────── */
function Tag({
  label,
  variant = "default",
}: {
  label: string;
  variant?: "default" | "teal" | "pink";
}) {
  const cls = {
    default: "tag tag-default",
    teal: "tag tag-teal",
    pink: "tag tag-pink",
  }[variant];
  return <span className={cls}>{label}</span>;
}

/* ─── Shared tag row ─────────────────────────────────────── */
function TagRow({ project }: { project: Project }) {
  const hasNDIS = project.categories.includes("NDIS");
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {project.categories.map((cat) => (
        <Tag key={cat} label={cat} />
      ))}
      {project.isConcept && <Tag label="CONCEPT" variant="pink" />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {hasNDIS && <img src="/images/ndis-logo.png" alt="NDIS" style={{ height: 16, width: "auto", objectFit: "contain", opacity: 0.8 }} />}
    </div>
  );
}

/* ─── Featured card (full-width) ─────────────────────────── */
export function FeaturedCard({ project, index }: { project: Project; index: number }) {
  return (
    <article
      className="card-animate col-span-12 group"
      style={{ animationDelay: `${index * 0.03}s`, height: "75vh", display: "flex", flexDirection: "column" }}
    >
      <Link
        href={`/case-studies/${project.slug}`}
        className="flex flex-col h-full focus-visible:outline-pink focus-visible:outline-2 focus-visible:rounded"
        aria-label={`View case study: ${project.name}`}
      >
        {/* Thumbnail — grows to fill remaining height. On hover the revealed
            text steals from it; the slow reveal lets the mockup ease down to
            fit (brief over-size/clip during the transition is intentional). */}
        <div className="card-thumb" style={{ flex: 1, minHeight: 0, marginBottom: "var(--image-pad)", position: "relative" }}>
          {project.heroPhones ? (
            <PhoneCarousel
              model={project.heroPhones.model}
              videos={project.heroPhones.videos}
              poster={project.heroPhones.poster}
              fill
            />
          ) : project.heroAlbums ? (
            <AlbumRow images={project.heroAlbums.images} fill />
          ) : project.heroMagazine ? (
            <MagazineCarousel pages={project.heroMagazine.pages} fill />
          ) : project.heroModel ? (
            <ModelDisplay {...project.heroModel} fill />
          ) : project.heroSpline ? (
            <div style={{ height: "100%", pointerEvents: "none" }}>
              <SplineScene scene={project.heroSpline} style={{ aspectRatio: undefined, maxHeight: "none", height: "100%" }} />
            </div>
          ) : (
            <ZoomImage
              src={project.heroImage.src}
              alt={project.heroImage.alt}
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, calc(100vw - 224px)"
            />
          )}
        </div>

        <div className="pb-8">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h2 className="mono-heading text-ink group-hover:text-pink transition-colors" style={{ fontSize: "0.8125rem" }}>
              {project.name}
            </h2>
            <span className="mono-label text-ink-soft whitespace-nowrap mt-px">{project.date}</span>
          </div>
          <div className="hover-reveal">
            <div className="space-y-3">
              <TagRow project={project} />
              <p className="text-ink-soft leading-relaxed max-w-2xl" style={{ fontSize: "var(--text-small)" }}>
                {project.oneLiner}
              </p>
            </div>
          </div>
        </div>
      </Link>

    </article>
  );
}

/* ─── Full card (half-width) ─────────────────────────────── */
export function FullCard({ project, index }: { project: Project; index: number }) {
  return (
    <article
      className="card-animate col-span-12 sm:col-span-6 group relative"
      style={{ animationDelay: `${index * 0.03}s`, height: "60vh", display: "flex", flexDirection: "column" }}
    >
      <Link
        href={`/case-studies/${project.slug}`}
        className="flex flex-col h-full focus-visible:outline-pink focus-visible:outline-2 focus-visible:rounded"
        aria-label={`View case study: ${project.name}`}
      >
        {/* Thumbnail — flex:1 so revealed text steals from it, not extends card */}
        <div className="card-thumb" style={{ flex: 1, minHeight: 0, marginBottom: "var(--image-pad)", position: "relative" }}>
          {project.heroPdf ? (
            <PdfSlideshowThumb pages={project.heroPdf} />
          ) : project.heroPhones ? (
            <PhoneCarousel model={project.heroPhones.model} videos={project.heroPhones.videos} poster={project.heroPhones.poster} fill />
          ) : project.heroAlbums ? (
            <AlbumRow images={project.heroAlbums.images} fill />
          ) : project.heroSlideshow ? (
            <HeroSlideshow images={project.heroSlideshow} fill />
          ) : project.heroMagazine ? (
            <MagazineCarousel pages={project.heroMagazine.pages} fill />
          ) : project.heroModel ? (
            <ModelDisplay {...project.heroModel} fill />
          ) : (
            <ZoomImage
              src={project.heroImage.src}
              alt={project.heroImage.alt}
              sizes="(max-width: 640px) 100vw, calc((100vw - 224px) / 2)"
              className="object-cover"
            />
          )}
        </div>

        <div className="pb-6">
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <h2 className="mono-heading text-ink group-hover:text-pink transition-colors">
              {project.name}
            </h2>
            <span className="mono-label text-ink-soft whitespace-nowrap mt-px" style={{ fontSize: "0.625rem" }}>{project.date}</span>
          </div>
          <div className="hover-reveal">
            <div className="space-y-2.5">
              <TagRow project={project} />
              <p className="text-ink-soft leading-relaxed line-clamp-2" style={{ fontSize: "var(--text-caption)" }}>
                {project.oneLiner}
              </p>
            </div>
          </div>
        </div>
      </Link>

    </article>
  );
}

/* ─── Gallery card (half-width, links to case study) ────── */
export function GalleryCard({ project, index }: { project: Project; index: number }) {
  return (
    <article
      className="card-animate col-span-12 sm:col-span-6 group relative"
      style={{ animationDelay: `${index * 0.03}s`, height: "60vh", display: "flex", flexDirection: "column" }}
    >
      <Link
        href={`/case-studies/${project.slug}`}
        className="flex flex-col h-full focus-visible:outline-pink focus-visible:outline-2 focus-visible:rounded"
        aria-label={`View ${project.name}`}
      >
        {/* Thumbnail — flex:1 so revealed text steals from it */}
        <div className="card-thumb" style={{ flex: 1, minHeight: 0, marginBottom: "var(--image-pad)", position: "relative" }}>
          {project.heroPdf ? (
            <PdfSlideshowThumb pages={project.heroPdf} />
          ) : project.heroSlideshow ? (
            <HeroSlideshow images={project.heroSlideshow} fill />
          ) : project.heroModel ? (
            <ModelDisplay {...project.heroModel} fill />
          ) : (
            <ZoomImage
              src={project.heroImage.src}
              alt={project.heroImage.alt}
              sizes="(max-width: 640px) 100vw, calc((100vw - 224px) / 2)"
              className="object-cover"
            />
          )}
        </div>

        <div className="pb-6">
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <h2 className="mono-heading text-ink group-hover:text-pink transition-colors">{project.name}</h2>
            <span className="mono-label text-ink-soft whitespace-nowrap mt-px" style={{ fontSize: "0.625rem" }}>{project.date}</span>
          </div>
          <div className="hover-reveal">
            <div className="space-y-2.5">
              <TagRow project={project} />
              {project.liveUrl && (
                <span className="mono-label text-teal block" style={{ fontSize: "0.625rem" }}>
                  LIVE ↗
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

/* ─── Default export, picks the right variant ────────────── */
export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  if (project.tier === "featured") return <FeaturedCard project={project} index={index} />;
  if (project.tier === "full")     return <FullCard project={project} index={index} />;
  return <GalleryCard project={project} index={index} />;
}
