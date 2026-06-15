import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import type { Metadata } from "next";
import SplineScene from "@/components/SplineScene";
import ModelDisplay from "@/components/ModelDisplay";
import AlbumShowcase from "@/components/AlbumShowcase";
import KinayaShowcase from "@/components/KinayaShowcase";
import PackerShowcase from "@/components/PackerShowcase";
import SalesmastersShowcase from "@/components/SalesmastersShowcase";
import MomentumShowcase from "@/components/MomentumShowcase";
import MediaRows from "@/components/MediaRows";
import Testimonial from "@/components/Testimonial";
import WhatWasDelivered from "@/components/WhatWasDelivered";
import Outcomes from "@/components/Outcomes";
import ClientImage from "@/components/ClientImage";
import VideoPlayer from "@/components/VideoPlayer";
import Reveal from "@/components/Reveal";
import HeroSlideshow from "@/components/HeroSlideshow";
import TikTokEmbed from "@/components/TikTokEmbed";
import PdfSlideshowThumb from "@/components/PdfSlideshowThumb";
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
    `${project.name}: ${project.categories.slice(0, 2).join(" & ")} | Finbar Studio`;
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
  num = false,
}: {
  label: string;
  variant?: "default" | "teal" | "pink" | "skill" | "mustard";
  num?: boolean;
}) {
  const cls = {
    default: "tag tag-default",
    teal: "tag tag-teal",
    pink: "tag tag-pink",
    skill: "tag tag-skill",
    mustard: "tag tag-mustard",
  }[variant];
  return <span className={`${cls}${num ? " tag-num" : ""}`}>{label}</span>;
}

/* Parse an aspect-ratio string ("W/H") to a number; default 16/9. */
function ratioOf(ar?: string): number {
  if (!ar) return 16 / 9;
  const [a, b] = ar.split("/").map(Number);
  return b ? a / b : 16 / 9;
}

/* ─── Case study image — the frame matches the image's OWN aspect ratio, so
   squares stay square and nothing is letterboxed into a white band. The image
   sits on the page (transparent), object-cover fills the exactly-matched frame. */
function CaseImage({
  src,
  alt,
  priority = false,
  aspectRatio = "16/9",
  sizes,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  aspectRatio?: string;
  sizes?: string;
}) {
  return (
    <div
      className="img-wrap"
      style={{ aspectRatio, marginTop: "var(--image-pad)", marginBottom: "var(--image-pad)", maxHeight: "none" }}
    >
      <ClientImage
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes ?? "(max-width: 768px) 100vw, calc(100vw - 224px)"}
        className="object-cover"
      />
    </div>
  );
}

/* ─── Case study media, image or looping video ─────────────── */
function CaseMedia({ img, full = false }: { img: ProjectImage; full?: boolean }) {
  const sizes = full
    ? "(max-width: 768px) 100vw, calc(100vw - 224px)"
    : "(max-width: 768px) 100vw, calc((100vw - 224px) / 2)";
  if (img.video) {
    return (
      <div
        className="img-wrap"
        style={{ aspectRatio: img.aspectRatio ?? "16/9", marginTop: "var(--image-pad)", marginBottom: "var(--image-pad)" }}
      >
        <VideoPlayer src={img.video} poster={img.src} />
      </div>
    );
  }
  return <CaseImage src={img.src} alt={img.alt} aspectRatio={img.aspectRatio ?? "16/9"} sizes={sizes} />;
}

/* Caption under a figure. */
function Caption({ text }: { text: string }) {
  return (
    <figcaption
      className="text-ink-soft font-sans leading-relaxed"
      style={{ fontSize: "var(--text-caption)", marginTop: "-0.5rem", marginBottom: "var(--image-pad)" }}
    >
      {text}
    </figcaption>
  );
}

/* Aspect-aware gallery.
   - A lone image: wide ones (>= 1.3) go full width; squares/portraits sit
     centred at a contained width so they're never stretched or marooned.
   - Multiple images: panoramic ones (>= 1.6) span the full width; everything
     else pairs two-up. Each figure reveals on scroll (GSAP). */
function Gallery({ images, cols }: { images: ProjectImage[]; cols?: number }) {
  // Forced even grid (e.g. a row of small posters): 2-up on mobile, N-up on desktop.
  if (cols) {
    return (
      <div className="gallery-cols" style={{ ["--g-cols" as string]: cols }}>
        {images.map((img, i) => (
          <Reveal as="figure" key={i} y={20} delay={(i % cols) * 0.05} className="min-w-0">
            <CaseMedia img={img} full={false} />
            {img.caption && <Caption text={img.caption} />}
          </Reveal>
        ))}
      </div>
    );
  }
  if (images.length === 1) {
    const img = images[0];
    const wide = ratioOf(img.aspectRatio) >= 1.3;
    return (
      <Reveal as="figure" y={24} className={wide ? "" : "mx-auto w-full max-w-xl"}>
        <CaseMedia img={img} full={wide} />
        {img.caption && <Caption text={img.caption} />}
      </Reveal>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
      {images.map((img, i) => {
        const full = ratioOf(img.aspectRatio) >= 1.6;
        return (
          <Reveal as="figure" key={i} y={24} delay={(i % 2) * 0.06} className={full ? "md:col-span-2" : "min-w-0"}>
            <CaseMedia img={img} full={full} />
            {img.caption && <Caption text={img.caption} />}
          </Reveal>
        );
      })}
    </div>
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

/* ─── Visual body ──────────────────────────────────────────── */
function VisualBody({ project }: { project: Project }) {
  if (project.images.length === 0) return null;
  return (
    <div className="py-4">
      <Gallery images={project.images} />
    </div>
  );
}

/* ─── Depth sections — an editorial run of heading + body + gallery, each
   block revealing on scroll. The heading is a pink mono eyebrow. ─── */
function DepthSections({ sections }: { sections: DepthSection[] }) {
  return (
    <div className="py-8">
      <div className="space-y-16 md:space-y-24">
        {sections.map((section, i) => (
          <Reveal as="section" key={i} y={28}>
            <h3 className="mono-heading text-pink mb-3">{section.heading}</h3>
            <p className="text-ink leading-relaxed mb-2 max-w-2xl" style={{ fontSize: "var(--text-body)" }}>
              {section.body}
            </p>
            {section.images.length > 0 && <Gallery images={section.images} cols={section.cols} />}
          </Reveal>
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
              <Tag key={skill} label={skill} variant="skill" />
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
          href="/work"
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

  const pageUrl = `${SITE_URL}/case-studies/${project.slug}`;

  const creativeWorkJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${pageUrl}#work`,
    name: project.name,
    headline: `${project.name}: ${project.categories.join(", ")}`,
    description: project.oneLiner,
    dateCreated: project.date,
    genre: project.categories,
    creator: { "@id": `${SITE_URL}/#person` },
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#person` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
    keywords: [...project.categories, ...project.skills].join(", "),
    url: pageUrl,
    mainEntityOfPage: pageUrl,
    image: project.heroImage?.src
      ? `${SITE_URL}${project.heroImage.src}`
      : undefined,
    inLanguage: "en-AU",
  };

  // Breadcrumb trail so Google can render Home › Work › <Project> in results.
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: project.name, item: pageUrl },
    ],
  };

  return (
    <article className="px-5 md:px-10 pt-8 md:pt-12 pb-8">
      <Script
        id={`ld-${project.slug}`}
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkJsonLd) }}
      />
      <Script
        id={`ld-breadcrumb-${project.slug}`}
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
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
            className="font-bold text-ink leading-[1.02]"
            style={{ fontSize: "var(--text-display)", letterSpacing: "-0.01em" }}
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
          <Tag label={project.date} variant="teal" num />
          {project.isConcept && <Tag label="CONCEPT" variant="pink" />}
        </div>
      </header>

      {/* TikTok-led intro: the live profile embed beside the headline metrics. */}
      {project.tiktok && (
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-12 md:mb-16">
          <div className="tiktok-frame">
            <TikTokEmbed username={project.tiktok} />
          </div>
          {project.outcomes && (
            <div className="grid grid-cols-3 gap-x-6 gap-y-8">
              {project.outcomes.stats.map((s) => (
                <div key={s.label} className="outcomes-stat">
                  <div className="outcomes-value">{s.value}</div>
                  {s.delta && <div className="outcomes-delta">{s.delta}</div>}
                  <div className="outcomes-label">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Hero + body. heroAlbums uses a bespoke editorial showcase (no mockup,
          no standard image grid). mediaRows handles its own layout. Otherwise
          the standard hero + visual body + depth chain. */}
      {project.slug === "kinaya" ? (
        <KinayaShowcase />
      ) : project.slug === "packer-associates" ? (
        <PackerShowcase />
      ) : project.slug === "salesmasters" ? (
        <SalesmastersShowcase />
      ) : project.slug === "momentum-mentoring" ? (
        <MomentumShowcase />
      ) : project.heroAlbums ? (
        <AlbumShowcase images={project.images.map(({ src, alt }) => ({ src, alt }))} />
      ) : project.mediaRows && project.mediaRows.length > 0 ? (
        <div className="mb-8"><MediaRows rows={project.mediaRows} /></div>
      ) : (
        <>
          <div className="mb-8">
            {project.heroModel ? (
              <ModelDisplay {...project.heroModel} aspectRatio="16/9" bare hoverable={false} />
            ) : project.heroSlideshow ? (
              <HeroSlideshow images={project.heroSlideshow} cardAspect={project.slideshowAspect} aspectRatio="5/2" />
            ) : project.heroSpline ? (
              <SplineScene scene={project.heroSpline} />
            ) : project.heroVideo ? (
              <div className="img-wrap" style={{ aspectRatio: "16/9", maxHeight: "72vh" }}>
                <VideoPlayer src={project.heroVideo} poster={project.heroImage.src} />
              </div>
            ) : (
              <div className="img-wrap" style={{ aspectRatio: "16/9", maxHeight: "72vh" }}>
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
        <div className="py-8">
          <p className="mono-label text-ink-soft mb-4">{project.pdfSlideshow.title}</p>
          <div className="packer-pdf">
            <PdfSlideshowThumb pages={project.pdfSlideshow.pages} hover={false} nav />
          </div>
        </div>
      )}

      {/* Bottom info block — same layout for every case study:
          testimonial (feature) -> outcomes / deliverables -> project facts. */}
      {project.testimonial && (
        <Testimonial quote={project.testimonial.quote} author={project.testimonial.author} />
      )}

      {/* Outcomes render at the bottom, unless they've been hoisted to the
          TikTok intro block at the top. */}
      {project.outcomes && !project.tiktok && (
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
