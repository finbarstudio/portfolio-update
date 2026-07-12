"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Project } from "@/content/projects";
import ZoomImage from "@/components/ZoomImage";
import SplineScene from "@/components/SplineScene";
import ModelDisplay from "@/components/ModelDisplay";
import CardThumb from "@/components/CardThumb";
import WebThumb from "@/components/WebThumb";
import PhoneCarousel from "@/components/PhoneCarousel";
import MagazineCarousel from "@/components/MagazineCarousel";
import HeroSlideshow from "@/components/HeroSlideshow";
import AlbumThumb from "@/components/AlbumThumb";
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

/* ─── Masked reveal item — inner slides up out of an overflow-hidden mask.
   Its box height is always reserved (transform doesn't affect layout), so the
   thumbnail never resizes; the reveal + stagger live in globals.css. ── */
function HrItem({ children, block = false, className = "" }: { children: ReactNode; block?: boolean; className?: string }) {
  const Outer = block ? "div" : "span";
  const Inner = block ? "div" : "span";
  return (
    <Outer className={`hr-item ${className}`}>
      <Inner className="hr-inner">{children}</Inner>
    </Outer>
  );
}

/* ─── Shared tag row (each pill masked + staggered on reveal) ─────────────── */
function TagRow({ project }: { project: Project }) {
  return (
    <div className="hr-tags flex flex-wrap items-center gap-1.5">
      {project.categories.map((cat) => (
        <HrItem key={cat} className="hr-item-tag"><Tag label={cat} /></HrItem>
      ))}
      {project.isConcept && <HrItem className="hr-item-tag"><Tag label="CONCEPT" variant="pink" /></HrItem>}
      {project.isHobby && <HrItem className="hr-item-tag"><Tag label="Hobby project" variant="pink" /></HrItem>}
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
        <CardThumb style={{ flex: 1, minHeight: 0, marginBottom: "var(--image-pad)" }}>
          {project.heroPhones ? (
            <PhoneCarousel
              model={project.heroPhones.model}
              videos={project.heroPhones.videos}
              poster={project.heroPhones.poster}
              fill
            />
          ) : project.heroAlbums ? (
            <AlbumThumb images={project.heroAlbums.images} />
          ) : project.heroMagazine ? (
            <MagazineCarousel pages={project.heroMagazine.pages} fill />
          ) : project.heroModel ? (
            <ModelDisplay {...project.heroModel} fill bare />
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
        </CardThumb>

        <div className="pb-8">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h2 className="mono-heading text-ink group-hover:text-pink transition-colors" style={{ fontSize: "0.8125rem" }}>
              {project.name}
            </h2>
            <span className="meta-mono text-ink-soft whitespace-nowrap mt-px" style={{ fontSize: "0.625rem" }}>{project.date}</span>
          </div>
          <div className="hover-reveal">
            <div className="space-y-3">
              <TagRow project={project} />
              <HrItem block className="hr-line">
                <p className="text-ink-soft leading-relaxed max-w-2xl" style={{ fontSize: "var(--text-small)" }}>
                  {project.oneLiner}
                </p>
              </HrItem>
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
        <CardThumb style={{ flex: 1, minHeight: 0, marginBottom: "var(--image-pad)" }}>
          {project.cardLogo ? (
            <div className="card-logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.cardLogo} alt={`${project.name} logo`} />
            </div>
          ) : project.heroPdf ? (
            <PdfSlideshowThumb pages={project.heroPdf} />
          ) : project.heroPhones ? (
            <PhoneCarousel model={project.heroPhones.model} videos={project.heroPhones.videos} poster={project.heroPhones.poster} fill />
          ) : project.heroSlideshow ? (
            <HeroSlideshow images={project.heroSlideshow} cardAspect={project.slideshowAspect} fill />
          ) : project.heroAlbums ? (
            <AlbumThumb images={project.heroAlbums.images} />
          ) : project.heroMagazine ? (
            <MagazineCarousel pages={project.heroMagazine.pages} fill />
          ) : project.heroModel ? (
            <ModelDisplay {...project.heroModel} fill bare />
          ) : (
            <ZoomImage
              src={project.heroImage.src}
              alt={project.heroImage.alt}
              sizes="(max-width: 640px) 100vw, calc((100vw - 224px) / 2)"
              className="object-cover"
            />
          )}
        </CardThumb>

        <div className="pb-6">
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <h2 className="mono-heading text-ink group-hover:text-pink transition-colors">
              {project.name}
            </h2>
            <span className="meta-mono text-ink-soft whitespace-nowrap mt-px" style={{ fontSize: "0.625rem" }}>{project.date}</span>
          </div>
          <div className="hover-reveal">
            <div className="space-y-2.5">
              <TagRow project={project} />
              <HrItem block className="hr-line">
                <p className="text-ink-soft leading-relaxed line-clamp-2" style={{ fontSize: "var(--text-caption)" }}>
                  {project.oneLiner}
                </p>
              </HrItem>
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
        <CardThumb style={{ flex: 1, minHeight: 0, marginBottom: "var(--image-pad)" }}>
          {project.cardStack ? (
            <div className="card-stack" aria-hidden="true">
              {project.cardStack.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={src} src={src} alt="" loading="lazy" />
              ))}
            </div>
          ) : project.heroPdf ? (
            <PdfSlideshowThumb pages={project.heroPdf} />
          ) : project.heroSlideshow ? (
            <HeroSlideshow images={project.heroSlideshow} cardAspect={project.slideshowAspect} fill />
          ) : project.heroModel ? (
            <ModelDisplay {...project.heroModel} fill bare />
          ) : (
            <ZoomImage
              src={project.heroImage.src}
              alt={project.heroImage.alt}
              sizes="(max-width: 640px) 100vw, calc((100vw - 224px) / 2)"
              className="object-cover"
            />
          )}
        </CardThumb>

        <div className="pb-6">
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <h2 className="mono-heading text-ink group-hover:text-pink transition-colors">{project.name}</h2>
            <span className="meta-mono text-ink-soft whitespace-nowrap mt-px" style={{ fontSize: "0.625rem" }}>{project.date}</span>
          </div>
          <div className="hover-reveal">
            <div className="space-y-2.5">
              <TagRow project={project} />
              {project.liveUrl && (
                <HrItem block className="hr-line">
                  <span className="mono-label text-teal block" style={{ fontSize: "0.625rem" }}>
                    LIVE ↗
                  </span>
                </HrItem>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

/* ─── Default export, picks the right variant ────────────── */
/* ─── Web card — 16:9 site preview, matching the home page website list ─── */
export function WebCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className="card-animate col-span-12 sm:col-span-6 group relative" style={{ animationDelay: `${index * 0.03}s` }}>
      <Link
        href={`/case-studies/${project.slug}`}
        className="block focus-visible:outline-pink focus-visible:outline-2 focus-visible:rounded"
        aria-label={`View case study: ${project.name}`}
      >
        {/* 16:9 like the home preview, so the full site screenshot shows uncropped */}
        <CardThumb style={{ aspectRatio: "16 / 9", marginBottom: "var(--image-pad)" }}>
          <WebThumb src={project.webThumb!} alt={`${project.name} website`} />
        </CardThumb>
        <div className="pb-6">
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <h2 className="mono-heading text-ink group-hover:text-pink transition-colors">
              {project.name}
            </h2>
            <span className="meta-mono text-ink-soft whitespace-nowrap mt-px" style={{ fontSize: "0.625rem" }}>{project.date}</span>
          </div>
          <div className="hover-reveal">
            <div className="space-y-2.5">
              <TagRow project={project} />
              <HrItem block className="hr-line">
                <p className="text-ink-soft leading-relaxed line-clamp-2" style={{ fontSize: "var(--text-caption)" }}>
                  {project.oneLiner}
                </p>
              </HrItem>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  if (project.webThumb)            return <WebCard project={project} index={index} />;
  if (project.tier === "featured") return <FeaturedCard project={project} index={index} />;
  if (project.tier === "full")     return <FullCard project={project} index={index} />;
  return <GalleryCard project={project} index={index} />;
}
