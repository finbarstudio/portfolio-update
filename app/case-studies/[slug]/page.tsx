import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import type { Metadata } from "next";
import SplineScene from "@/components/SplineScene";
import ModelDisplay from "@/components/ModelDisplay";
import AlbumShowcase from "@/components/AlbumShowcase";
import KinayaShowcase from "@/components/KinayaShowcase";
import PackerShowcase from "@/components/PackerShowcase";
import Testimonial from "@/components/Testimonial";
import WhatWasDelivered from "@/components/WhatWasDelivered";
import Outcomes from "@/components/Outcomes";
import ClientImage from "@/components/ClientImage";
import VideoPlayer from "@/components/VideoPlayer";
import PDFSlideshow from "@/components/PDFSlideshow";
import {
  projects,
  type Project,
  type DepthSection,
  type ProjectImage,
  type MediaRow as MediaRowType,
} from "@/content/projects";

const SITE_URL = "https://www.finbar.studio";

/* Static params */
export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

/* Metadata */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  const url = `/case-studies/${project.slug}`;
  const ogImage = project.heroImage?.src;
  // Match the indexed title/description pattern: "Name — Descriptor | Finbar Studio".
  // Per-project SEO copy (in projects.ts) preserves the exact text Google already
  // ranks for the migrated slugs; everything else falls back to a clean default.
  const seoTitle =
    project.seo?.title ??
    `${project.name} — ${project.categories.slice(0, 2).join(" & ")} | Finbar Studio`;
  const seoDescription = project.seo?.description ?? project.oneLiner;
  return {
    title: { absolute: seoTitle },
    description: seoDescription,
    alternates: { canonical: url },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url,
      type: "article",
      images: ogImage ? [{ url: ogImage, alt: project.heroImage.alt }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

/* ─── Tag pill ─────────────────────────────────────────────── */
function Tag({
  label,
  variant = "default",
}: {
  label: string;
  variant?: "default" | "teal" | "pink";
}) {
  const cls = { default: "tag tag-default", teal: "tag tag-teal", pink: "tag tag-pink" }[variant];
  return <span className={cls}>{label}</span>;
}

/* ─── Case study image, padded, max-height constrained ─────── */
function CaseImage({
  src,
  alt,
  priority = false,
  sizes = "(max-width: 768px) 100vw, calc(100vw - 224px)",
  aspectRatio = "16/9",
  halfWidth = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  aspectRatio?: string;
  halfWidth?: boolean;
}) {
  return (
    <div
      className="img-wrap"
      style={{
        aspectRatio,
        marginTop: "var(--image-pad)",
        marginBottom: "var(--image-pad)",
        background: "white",
      }}
    >
      <ClientImage
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={halfWidth ? "(max-width: 768px) 100vw, calc((100vw - 224px) / 2)" : sizes}
        className="object-contain"
      />
    </div>
  );
}

/* ─── Case study media, image or looping video ─────────────── */
function CaseMedia({ img, halfWidth = false }: { img: ProjectImage; halfWidth?: boolean }) {
  if (img.video) {
    return (
      <div
        className="img-wrap"
        style={{ aspectRatio: "1/1", marginTop: "var(--image-pad)", marginBottom: "var(--image-pad)", background: "white" }}
      >
        <VideoPlayer src={img.video} poster={img.src} />
      </div>
    );
  }
  return (
    <CaseImage
      src={img.src}
      alt={img.alt}
      halfWidth={halfWidth}
      aspectRatio={img.aspectRatio ?? "16/9"}
    />
  );
}

/* ─── Summary block ────────────────────────────────────────── */
function SummaryBlock({ project }: { project: Project }) {
  const items = [
    { label: "ROLE", value: project.role },
    { label: "PROBLEM", value: project.problem },
    { label: "OUTCOME", value: project.outcome },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 py-10 md:py-14 text-left">
      {items.map(({ label, value }) => (
        <div key={label} className="max-w-prose">
          <p className="mono-label text-ink-soft mb-2">{label}</p>
          <p className="text-ink leading-relaxed" style={{ fontSize: "var(--text-small)" }}>{value}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── Media rows ──────────────────────────────────────────────
   All tiles from every row live in a single CSS grid with one set of
   column definitions (repeat(N, 1fr)). Same column count for both rows
   guarantees pixel-perfect alignment — col N in row 1 sits exactly above
   col N in row 2, and the gap between rows matches the gap between cols.

   Mobile shows a smaller, larger-scale sample (2 of each row) so the work
   reads at a usable size; desktop shows the full set.
   ───────────────────────────────────────────────────────────── */
function MediaGrid({
  rows,
  count,
  className,
  sizes,
}: {
  rows: MediaRowType[];
  count: number;
  className: string;
  sizes: string;
}) {
  return (
    <div
      className={className}
      style={{
        gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows.length}, auto)`,
      }}
    >
      {rows.flatMap((row, ri) => {
        const items = (row.videos ?? row.images ?? []).slice(0, count);
        return items.map((src, i) => (
          <div
            key={`${ri}-${i}`}
            style={{
              aspectRatio: row.ratio,
              background: "white",
              overflow: "hidden",
              gridColumn: i + 1,
              gridRow: ri + 1,
            }}
          >
            {row.videos ? (
              <VideoPlayer src={src} />
            ) : (
              <ClientImage src={src} alt={row.alt ?? ""} fill sizes={sizes} className="object-cover" />
            )}
          </div>
        ));
      })}
    </div>
  );
}

function MediaRows({ rows }: { rows: MediaRowType[] }) {
  const maxCount = Math.max(...rows.map((r) => (r.videos ?? r.images ?? []).length));
  if (maxCount === 0) return null;
  const mobileCount = Math.min(2, maxCount);

  return (
    <div className="py-2">
      {/* Mobile: a couple of each, large */}
      <MediaGrid rows={rows} count={mobileCount} className="grid gap-2.5 md:hidden" sizes="50vw" />
      {/* Desktop: the full set */}
      <MediaGrid rows={rows} count={maxCount} className="hidden md:grid gap-3" sizes="14vw" />
    </div>
  );
}

/* ─── Visual body ──────────────────────────────────────────── */
function VisualBody({ project }: { project: Project }) {
  if (project.images.length === 0) return null;
  return (
    <div className="py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        {project.images.map((img, i) => (
          <figure
            key={i}
            className={i === 0 && project.images.length >= 3 ? "md:col-span-2" : ""}
          >
            <CaseMedia img={img} halfWidth={!(i === 0 && project.images.length >= 3)} />
            {img.caption && (
              <figcaption className="text-ink-soft font-sans leading-relaxed" style={{ fontSize: "var(--text-caption)", marginTop: "-0.5rem", marginBottom: "var(--image-pad)" }}>
                {img.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </div>
  );
}

/* ─── Depth section (Featured only) ───────────────────────── */
function DepthSections({ sections }: { sections: DepthSection[] }) {
  return (
    <div className="py-8">
      <div className="space-y-16">
        {sections.map((section, i) => (
          <div key={i}>
            <h3 className="mono-heading text-ink mb-4">{section.heading}</h3>
            <p className="text-ink leading-relaxed mb-2 max-w-2xl" style={{ fontSize: "var(--text-small)" }}>
              {section.body}
            </p>
            {section.images.length > 0 && (
              <div className={`grid gap-x-6 ${section.images.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
                {section.images.map((img, j) => (
                  <figure key={j}>
                    <CaseMedia img={img} halfWidth={section.images.length > 1} />
                    {img.caption && (
                      <figcaption className="text-ink-soft font-sans leading-relaxed" style={{ fontSize: "var(--text-caption)", marginTop: "-0.5rem", marginBottom: "var(--image-pad)" }}>
                        {img.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Footer: Skills | Company | Open for work + clean back link ─── */
function FooterMeta({ project }: { project: Project }) {
  const showCompany = Boolean(project.liveUrl || project.companyUrl);
  return (
    <>
      <div
        className={`grid grid-cols-1 ${showCompany ? "md:grid-cols-3" : "md:grid-cols-2"} gap-10 md:gap-6 py-8 border-t border-line text-center md:text-left`}
      >
        {/* Col 1: Skills */}
        <div>
          <p className="mono-label text-ink-soft mb-3">SKILLS</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            {project.skills.map((skill) => (
              <Tag key={skill} label={skill} />
            ))}
          </div>
        </div>

        {/* Col 2: Company (+ optional live link). Hidden entirely when no link exists. */}
        {showCompany && (
          <div>
            <p className="mono-label text-ink-soft mb-3">
              {project.liveUrl && project.companyUrl ? "LINKS" : project.liveUrl ? "LIVE SITE" : "COMPANY"}
            </p>
            <div className="space-y-1.5">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-mono text-teal hover:text-pink transition-colors break-words"
                  style={{ fontSize: "var(--text-small)" }}
                >
                  {project.liveUrl.replace(/^https?:\/\//, "")} ↗
                </a>
              )}
              {project.companyUrl && project.companyUrl !== project.liveUrl && (
                <a
                  href={project.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-mono text-teal hover:text-pink transition-colors break-words"
                  style={{ fontSize: "var(--text-small)" }}
                >
                  {project.companyUrl.replace(/^https?:\/\//, "")} ↗
                </a>
              )}
            </div>
          </div>
        )}

        {/* Col 3: Open for work */}
        <div>
          <p className="mono-label text-ink-soft mb-3">OPEN FOR WORK</p>
          <a
            href="mailto:finbar@finbar.studio"
            className="font-sans font-medium text-ink hover:text-pink transition-colors link-wipe break-words"
            style={{ fontSize: "var(--text-h3)" }}
          >
            finbar@finbar.studio
          </a>
        </div>
      </div>

      {/* Clean back link — black Archivo, uppercase, tracked. Centred on mobile.
          Generous tap target via py. */}
      <div className="pt-6 pb-8 text-center md:text-left">
        <Link
          href="/"
          className="inline-flex items-center min-h-[44px] py-2 font-sans font-bold uppercase text-ink hover:text-pink transition-colors"
          style={{ fontSize: "0.875rem", letterSpacing: "0.16em" }}
        >
          Back to Work
        </Link>
      </div>
    </>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) notFound();

  const creativeWorkJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: project.oneLiner,
    dateCreated: project.date,
    creator: {
      "@type": "Person",
      name: "Finbar Skitini",
      url: SITE_URL,
    },
    keywords: [...project.categories, ...project.skills].join(", "),
    url: `${SITE_URL}/case-studies/${project.slug}`,
    image: project.heroImage?.src
      ? `${SITE_URL}${project.heroImage.src}`
      : undefined,
    inLanguage: "en-AU",
  };

  return (
    <article className="px-5 md:px-10 pt-8 md:pt-12 pb-8">
      <Script
        id={`ld-${project.slug}`}
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkJsonLd) }}
      />
      {/* Header — mobile: stacked + centred. Desktop: logo+title left, tags right, bottom-aligned. */}
      <header className="flex flex-col items-center text-center gap-5 mb-8 md:flex-row md:flex-wrap md:items-end md:justify-between md:text-left md:gap-x-6 md:gap-y-4 md:mb-6">
        <div className="min-w-0 max-w-full">
          {project.logo && (
            <div className="mb-4 flex justify-center md:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.logo}
                alt=""
                aria-hidden="true"
                style={{ height: 28, width: "auto", objectFit: "contain", display: "block" }}
              />
            </div>
          )}
          <h1
            className="font-sans font-bold uppercase text-ink leading-[1.02]"
            style={{ fontSize: "var(--text-display)", letterSpacing: "0.03em" }}
          >
            {project.name}
          </h1>
        </div>

        {/* Tags — mobile: centred wrap. Desktop: right-aligned brick-wrap, ragged left.
            Equal gap both axes; each tag keeps its own intrinsic text padding. */}
        <div className="flex flex-wrap justify-center md:justify-end items-end gap-2 max-w-full md:max-w-[45%]">
          {project.categories.map((cat) => (
            <Tag key={cat} label={cat} />
          ))}
          <Tag label={project.date} variant="teal" />
          {project.isConcept && <Tag label="CONCEPT" variant="pink" />}
        </div>
      </header>

      {/* Hero + body. heroAlbums uses a bespoke editorial showcase (no mockup,
          no standard image grid). mediaRows handles its own layout. Otherwise
          the standard hero + visual body + depth chain. */}
      {project.slug === "kinaya" ? (
        <KinayaShowcase />
      ) : project.slug === "packer-associates" ? (
        <PackerShowcase />
      ) : project.heroAlbums ? (
        <AlbumShowcase images={project.images.map(({ src, alt }) => ({ src, alt }))} />
      ) : project.mediaRows && project.mediaRows.length > 0 ? (
        <div className="mb-8"><MediaRows rows={project.mediaRows} /></div>
      ) : (
        <>
          <div className="mb-8">
            {project.heroModel ? (
              <ModelDisplay {...project.heroModel} aspectRatio="16/9" hoverable={false} />
            ) : project.heroSpline ? (
              <SplineScene scene={project.heroSpline} />
            ) : project.heroVideo ? (
              <div className="img-wrap" style={{ aspectRatio: "16/9", maxHeight: "72vh", background: "white" }}>
                <VideoPlayer src={project.heroVideo} poster={project.heroImage.src} />
              </div>
            ) : (
              <div className="img-wrap" style={{ aspectRatio: "16/9", maxHeight: "72vh", background: "white" }}>
                <ClientImage
                  src={project.heroImage.src}
                  alt={project.heroImage.alt}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, calc(100vw - 224px)"
                  className="object-contain"
                />
              </div>
            )}
          </div>
          <VisualBody project={project} />
          {project.hasDepth && project.depth && project.depth.length > 0 && (
            <DepthSections sections={project.depth} />
          )}
        </>
      )}

      {project.pdfSlideshow && (
        <PDFSlideshow
          title={project.pdfSlideshow.title}
          pages={project.pdfSlideshow.pages}
        />
      )}

      {/* Bottom info block — same layout for every case study:
          testimonial (feature) -> outcomes / deliverables -> project facts. */}
      {project.testimonial && (
        <Testimonial quote={project.testimonial.quote} author={project.testimonial.author} />
      )}

      {project.outcomes && (
        <Outcomes
          intro={project.outcomes.intro}
          subtitle={project.outcomes.subtitle}
          stats={project.outcomes.stats}
          source={project.outcomes.source}
        />
      )}

      {project.delivered && project.delivered.length > 0 && (
        <WhatWasDelivered items={project.delivered} />
      )}

      <SummaryBlock project={project} />

      <FooterMeta project={project} />
    </article>
  );
}
