import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  projects,
  getCaseStudyProjects,
  type Project,
  type DepthSection,
} from "@/content/projects";

/* ─── Static params ────────────────────────────────────────── */
export async function generateStaticParams() {
  return getCaseStudyProjects().map((p) => ({ slug: p.slug }));
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

/* ─── Tag pill ────────────────────────────────────────────────*/
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

/* ─── Hero image ───────────────────────────────────────────── */
function HeroImage({ project }: { project: Project }) {
  return (
    <div className="relative w-full overflow-hidden bg-line" style={{ aspectRatio: "16/9" }}>
      <Image
        src={project.heroImage.src}
        alt={project.heroImage.alt}
        fill
        priority
        sizes="(max-width: 768px) 100vw, calc(100vw - 224px)"
        className="object-cover"
      />
    </div>
  );
}

/* ─── Meta row ─────────────────────────────────────────────── */
function MetaRow({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap items-center gap-2 py-5 border-b border-line">
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-b border-line">
      {items.map(({ label, value }) => (
        <div key={label}>
          <p className="mono-label text-ink-soft mb-2">{label}</p>
          <p className="text-sm text-ink leading-relaxed">{value}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── Skills row ───────────────────────────────────────────── */
function SkillsRow({ project }: { project: Project }) {
  return (
    <div className="py-6 border-b border-line">
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
  return (
    <div className="py-10 border-b border-line">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {project.images.map((img, i) => (
          <figure
            key={i}
            className={`${
              i === 0 && project.images.length >= 3 ? "md:col-span-2" : ""
            }`}
          >
            <div className="relative w-full overflow-hidden bg-line" style={{ aspectRatio: "16/9" }}>
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 100vw, calc((100vw - 224px) / 2)"
                className="object-cover"
              />
            </div>
            {img.caption && (
              <figcaption className="mt-2 text-xs text-ink-soft font-sans leading-relaxed">
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
    <div className="py-10 border-b border-line">
      <p className="mono-label text-ink-soft mb-8 border-b border-line pb-3">
        PROCESS &amp; DETAIL
      </p>
      <div className="space-y-16">
        {sections.map((section, i) => (
          <div key={i}>
            <h3 className="mono-heading text-ink mb-4">{section.heading}</h3>
            <p className="text-sm text-ink leading-relaxed mb-6 max-w-2xl">
              {section.body}
            </p>
            {section.images.length > 0 && (
              <div
                className={`grid gap-5 ${
                  section.images.length === 1
                    ? "grid-cols-1"
                    : "grid-cols-1 md:grid-cols-2"
                }`}
              >
                {section.images.map((img, j) => (
                  <figure key={j}>
                    <div
                      className="relative w-full overflow-hidden bg-line"
                      style={{ aspectRatio: "16/9" }}
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, calc((100vw - 224px) / 2)"
                        className="object-cover"
                      />
                    </div>
                    {img.caption && (
                      <figcaption className="mt-2 text-xs text-ink-soft font-sans leading-relaxed">
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
          className="font-sans text-lg font-medium text-ink hover:text-pink transition-colors"
        >
          finbar@finbar.studio
        </a>
      </div>
      <Link
        href="/#work"
        className="mono-label text-ink-soft hover:text-pink transition-colors"
      >
        ← BACK TO WORK
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

  if (!project || project.tier === "gallery") {
    notFound();
  }

  return (
    <article className="px-6 md:px-10">
      {/* Back link */}
      <div className="py-5 border-b border-line">
        <Link
          href="/#work"
          className="mono-label text-ink-soft hover:text-pink transition-colors"
        >
          ← WORK
        </Link>
      </div>

      {/* Hero */}
      <div className="pt-8 pb-5 border-b border-line">
        <p className="mono-label text-ink-soft mb-3">{project.oneLiner}</p>
        <h1 className="font-mono font-bold text-[clamp(1.25rem,3vw,2rem)] tracking-[0.06em] uppercase text-ink">
          {project.name}
        </h1>
      </div>

      <HeroImage project={project} />
      <MetaRow project={project} />
      <SummaryBlock project={project} />
      <SkillsRow project={project} />
      <VisualBody project={project} />

      {/* Optional depth — Featured projects only */}
      {project.hasDepth && project.depth && project.depth.length > 0 && (
        <DepthSections sections={project.depth} />
      )}

      {/* Live URL if present */}
      {project.liveUrl && (
        <div className="py-6 border-b border-line">
          <p className="mono-label text-ink-soft mb-2">LIVE SITE</p>
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-mono text-teal hover:text-pink transition-colors"
          >
            {project.liveUrl} ↗
          </a>
        </div>
      )}

      <FooterCTA />
    </article>
  );
}
