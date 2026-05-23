"use client";

import Link from "next/link";
import { Project } from "@/content/projects";
import ClientImage from "@/components/ClientImage";
import SplineScene from "@/components/SplineScene";
import ModelDisplay from "@/components/ModelDisplay";
import PhoneCarousel from "@/components/PhoneCarousel";
import MagazineCarousel from "@/components/MagazineCarousel";

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

/* ─── Client logo (if present) ───────────────────────────── */
function CardLogo({ project }: { project: Project }) {
  if (!project.logo) return null;
  return (
    <div className="mb-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={project.logo}
        alt=""
        aria-hidden="true"
        style={{ height: 18, width: "auto", objectFit: "contain", display: "block" }}
      />
    </div>
  );
}

/* ─── Image wrapper ──────────────────────────────────────── */
function CardImage({
  src,
  alt,
  priority = false,
  sizes,
  aspectRatio = "3/2",
  fill = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  sizes: string;
  aspectRatio?: string;
  fill?: boolean;
}) {
  return (
    <div
      className="img-wrap card-thumb"
      style={fill
        ? { height: "100%", marginBottom: "var(--image-pad)", background: "white" }
        : { aspectRatio, maxHeight: "72vh", marginBottom: "var(--image-pad)", background: "white" }}
    >
      <ClientImage
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}


/* ─── Featured card (full-width) ─────────────────────────── */
export function FeaturedCard({ project, index }: { project: Project; index: number }) {
  return (
    <article
      className="card-animate col-span-12 group"
      style={{ animationDelay: `${index * 0.07}s`, height: "75vh", display: "flex", flexDirection: "column" }}
    >
      <Link
        href={`/work/${project.slug}`}
        className="flex flex-col h-full focus-visible:outline-pink focus-visible:outline-2 focus-visible:rounded"
        aria-label={`View case study: ${project.name}`}
      >
        {/* Thumbnail — grows to fill remaining height */}
        <div className="card-thumb" style={{ flex: 1, minHeight: 0, marginBottom: "var(--image-pad)", position: "relative" }}>
          {project.heroPhones ? (
            <PhoneCarousel
              model={project.heroPhones.model}
              videos={project.heroPhones.videos}
              poster={project.heroPhones.poster}
              fill
            />
          ) : project.heroMagazine ? (
            <MagazineCarousel pages={project.heroMagazine.pages} fill />
          ) : project.heroModel ? (
            <ModelDisplay
              model={project.heroModel.model}
              video={project.heroModel.video}
              poster={project.heroModel.poster}
              fill
            />
          ) : project.heroSpline ? (
            <div style={{ height: "100%", pointerEvents: "none" }}>
              <SplineScene scene={project.heroSpline} style={{ aspectRatio: undefined, maxHeight: "none", height: "100%" }} />
            </div>
          ) : (
            <CardImage
              src={project.heroImage.src}
              alt={project.heroImage.alt}
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, calc(100vw - 224px)"
              fill
            />
          )}
        </div>

        <div className="pb-8">
          <CardLogo project={project} />
          <div className="flex items-start justify-between gap-4 mb-3">
            <h2 className="mono-heading text-ink group-hover:text-pink transition-colors" style={{ fontSize: "0.8125rem" }}>
              {project.name}
            </h2>
            <span className="mono-label text-ink-soft whitespace-nowrap mt-px">{project.date}</span>
          </div>
          <TagRow project={project} />
          <div className="flex items-end justify-between gap-4 mt-3">
            <p className="text-ink-soft leading-relaxed max-w-2xl" style={{ fontSize: "var(--text-small)" }}>
              {project.oneLiner}
            </p>
            <span className="mono-label text-pink shrink-0 group-hover:translate-x-1 transition-transform">→</span>
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
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      <Link
        href={`/work/${project.slug}`}
        className="block focus-visible:outline-pink focus-visible:outline-2 focus-visible:rounded"
        aria-label={`View case study: ${project.name}`}
      >
        {project.heroMagazine ? (
          <div className="card-thumb" style={{ marginBottom: "var(--image-pad)" }}>
            <MagazineCarousel pages={project.heroMagazine.pages} aspectRatio="3/2" />
          </div>
        ) : project.heroModel ? (
          <div className="card-thumb" style={{ marginBottom: "var(--image-pad)" }}>
            <ModelDisplay
              model={project.heroModel.model}
              video={project.heroModel.video}
              poster={project.heroModel.poster}
              aspectRatio="3/2"
            />
          </div>
        ) : (
          <CardImage
            src={project.heroImage.src}
            alt={project.heroImage.alt}
            sizes="(max-width: 640px) 100vw, calc((100vw - 224px) / 2)"
          />
        )}

        <div className="pb-6">
          <CardLogo project={project} />
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <h2 className="mono-heading text-ink group-hover:text-pink transition-colors">
              {project.name}
            </h2>
            <span className="mono-label text-ink-soft whitespace-nowrap mt-px" style={{ fontSize: "0.625rem" }}>{project.date}</span>
          </div>
          <TagRow project={project} />
          <div className="flex items-end justify-between gap-3 mt-2.5">
            <p className="text-ink-soft leading-relaxed line-clamp-2" style={{ fontSize: "var(--text-caption)" }}>
              {project.oneLiner}
            </p>
            <span className="mono-label text-pink shrink-0 group-hover:translate-x-0.5 transition-transform" style={{ fontSize: "0.625rem" }}>→</span>
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
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      <Link
        href={`/work/${project.slug}`}
        className="block focus-visible:outline-pink focus-visible:outline-2 focus-visible:rounded"
        aria-label={`View ${project.name}`}
      >
        {project.heroModel ? (
          <div className="card-thumb" style={{ marginBottom: "var(--image-pad)" }}>
            <ModelDisplay
              model={project.heroModel.model}
              video={project.heroModel.video}
              poster={project.heroModel.poster}
              aspectRatio="3/2"
            />
          </div>
        ) : (
          <CardImage
            src={project.heroImage.src}
            alt={project.heroImage.alt}
            sizes="(max-width: 640px) 100vw, calc((100vw - 224px) / 2)"
          />
        )}

        <div className="pb-5">
          <CardLogo project={project} />
          <div className="flex items-start justify-between gap-3 mb-2">
            <h2 className="mono-label text-ink group-hover:text-pink transition-colors">{project.name}</h2>
            <span className="mono-label text-ink-soft whitespace-nowrap" style={{ fontSize: "0.5625rem" }}>{project.date}</span>
          </div>
          <TagRow project={project} />
          <div className="mt-2 flex items-center justify-between gap-3">
            {project.liveUrl && (
              <span className="mono-label text-teal" style={{ fontSize: "0.625rem" }}>
                LIVE ↗
              </span>
            )}
            <span className="mono-label text-pink shrink-0 group-hover:translate-x-0.5 transition-transform ml-auto" style={{ fontSize: "0.625rem" }}>→</span>
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
