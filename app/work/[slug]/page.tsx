import { notFound } from "next/navigation";
import Link from "next/link";
import SplineScene from "@/components/SplineScene";
import ClientImage from "@/components/ClientImage";
import VideoPlayer from "@/components/VideoPlayer";
import PDFSlideshow from "@/components/PDFSlideshow";
import {
  projects,
  type Project,
  type DepthSection,
  type ProjectImage,
} from "@/content/projects";

/* ─── Static params ────────────────────────────────────────── */
export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

/* ─── Metadata ─────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.name} — finbar✶studio`,
    description: project.oneLiner,
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

/* ─── Case study image — padded, max-height constrained ─────── */
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

/* ─── Case study media — image or looping video ─────────────── */
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
  return <CaseImage src={img.src} alt={img.alt} halfWidth={halfWidth} />;
}

/* ─── Meta row ─────────────────────────────────────────────── */
function MetaRow({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap items-center gap-2 py-5">
      {project.categories.map((cat) => (
        <Tag key={cat} label={cat} />
      ))}
      <Tag label={project.date} variant="teal" />
      {project.isConcept && <Tag label="CONCEPT" variant="pink" />}
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
      {items.map(({ label, value }) => (
        <div key={label}>
          <p className="mono-label text-ink-soft mb-2">{label}</p>
          <p className="text-ink leading-relaxed" style={{ fontSize: "var(--text-small)" }}>{value}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── Skills row ───────────────────────────────────────────── */
function SkillsRow({ project }: { project: Project }) {
  return (
    <div className="py-6">
      <p className="mono-label text-ink-soft mb-3">SKILLS</p>
      <div className="flex flex-wrap gap-2">
        {project.skills.map((skill) => (
          <Tag key={skill} label={skill} />
        ))}
      </div>
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
      <p className="mono-label text-ink-soft mb-8 pb-3">
        PROCESS &amp; DETAIL
      </p>
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

/* ─── Footer CTA ───────────────────────────────────────────── */
function FooterCTA() {
  return (
    <div className="py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
      <div>
        <p className="mono-label text-ink-soft mb-1">Open for work</p>
        <a
          href="mailto:finbar@finbar.studio"
          className="font-sans font-medium text-ink hover:text-pink transition-colors link-wipe"
          style={{ fontSize: "var(--text-h3)" }}
        >
          finbar@finbar.studio
        </a>
      </div>
      {/* Use "/" not "/#work" so returning home starts at the top */}
      <Link
        href="/"
        className="mono-label text-ink-soft hover:text-pink transition-colors"
      >
        [ ← BACK TO /WORK ]
      </Link>
    </div>
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

  return (
    <article className="px-5 md:px-10 py-4 md:py-6">
      {/* Breadcrumb / path */}
      <div className="terminal-line mb-4">
        <span className="ps1">»</span>{" "}
        <Link href="/" className="text-ink-soft hover:text-pink transition-colors underline-offset-2 hover:underline">
          /work
        </Link>
        <span className="text-ink-soft"> / </span>
        <span className="text-ink">{project.slug}</span>
      </div>

      {/* Header + live site link */}
      <div className="pt-2 pb-2">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h1
            className="font-sans font-bold uppercase text-ink cursor-blink"
            style={{ fontSize: "var(--text-h1)", letterSpacing: "0.04em", lineHeight: 1.1 }}
          >
            {project.name}
          </h1>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mono-label text-teal hover:text-pink transition-colors shrink-0 mt-1"
            >
              LIVE ↗
            </a>
          )}
        </div>
        <p className="mono-label text-ink-soft pb-5">
          {project.oneLiner}
        </p>
      </div>

      {/* Hero — Spline, looping video, or static image */}
      <div className="mb-8">
        {project.heroSpline ? (
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

      <MetaRow project={project} />
      <SummaryBlock project={project} />
      <SkillsRow project={project} />
      <VisualBody project={project} />

      {project.hasDepth && project.depth && project.depth.length > 0 && (
        <DepthSections sections={project.depth} />
      )}

      {project.pdfSlideshow && (
        <PDFSlideshow
          title={project.pdfSlideshow.title}
          pages={project.pdfSlideshow.pages}
        />
      )}

      {/* Links row — live site and/or company site */}
      {(project.liveUrl || project.companyUrl) && (
        <div className="flex flex-wrap gap-10 py-6">
          {project.liveUrl && (
            <div>
              <p className="mono-label text-ink-soft mb-2">LIVE SITE</p>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-teal hover:text-pink transition-colors"
                style={{ fontSize: "var(--text-small)" }}
              >
                {project.liveUrl} ↗
              </a>
            </div>
          )}
          {project.companyUrl && project.companyUrl !== project.liveUrl && (
            <div>
              <p className="mono-label text-ink-soft mb-2">COMPANY</p>
              <a
                href={project.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-teal hover:text-pink transition-colors"
                style={{ fontSize: "var(--text-small)" }}
              >
                {project.companyUrl} ↗
              </a>
            </div>
          )}
        </div>
      )}

      <FooterCTA />
    </article>
  );
}
