import Image from "next/image";
import Link from "next/link";
import { Project } from "@/content/projects";

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
  return (
    <div className="flex flex-wrap gap-1.5">
      {project.categories.map((cat) => (
        <Tag key={cat} label={cat} />
      ))}
      {project.isConcept && <Tag label="CONCEPT" variant="pink" />}
    </div>
  );
}

/* ─── Image wrapper — applies --image-pad and caps height ────
   Wraps every card image. Height is limited to 72vh so no
   single image dominates the viewport.
   ─────────────────────────────────────────────────────────── */
function CardImage({
  src,
  alt,
  priority = false,
  sizes,
  aspectRatio = "3/2",
  title,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  sizes: string;
  aspectRatio?: string;
  title?: string;
}) {
  return (
    <div style={{ marginBottom: "var(--image-pad)" }}>
      <div
        className="os-window md:group-hover:translate-x-[-1px] md:group-hover:translate-y-[-1px] transition-transform"
      >
        {title && (
          <div className="os-titlebar hidden md:flex">
            <span className="os-titlebar-btn" aria-hidden="true" />
            <span className="os-titlebar-title">{title}</span>
            <span className="os-titlebar-btn" aria-hidden="true" />
          </div>
        )}
        <div
          className="img-wrap"
          style={{ aspectRatio, maxHeight: "72vh" }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Featured card (full-width) ─────────────────────────── */
export function FeaturedCard({ project, index }: { project: Project; index: number }) {
  return (
    <article
      className="card-animate col-span-12 group"
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      <Link
        href={`/work/${project.slug}`}
        className="block focus-visible:outline-pink focus-visible:outline-2 focus-visible:rounded"
        aria-label={`View case study: ${project.name}`}
      >
        <CardImage
          src={project.heroImage.src}
          alt={project.heroImage.alt}
          priority={index === 0}
          sizes="(max-width: 768px) 100vw, calc(100vw - 224px)"
          aspectRatio="16/9"
          title={`${project.name}.PROJ`}
        />

        <div className="pb-8">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h2 className="mono-heading text-ink group-hover:text-pink transition-colors" style={{ fontSize: "0.8125rem" }}>
              {project.name}
            </h2>
            <span className="mono-label text-ink-soft whitespace-nowrap mt-px">{project.date}</span>
          </div>
          <TagRow project={project} />
          <p className="mt-3 text-ink-soft leading-relaxed max-w-2xl" style={{ fontSize: "var(--text-small)" }}>
            {project.oneLiner}
          </p>
          <p className="mt-4 mono-label text-pink">VIEW CASE STUDY →</p>
        </div>
      </Link>
    </article>
  );
}

/* ─── Full / Gallery card (2-col) ────────────────────────── */
export function FullCard({ project, index }: { project: Project; index: number }) {
  return (
    <article
      className="card-animate col-span-12 sm:col-span-6 group"
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      <Link
        href={`/work/${project.slug}`}
        className="block focus-visible:outline-pink focus-visible:outline-2 focus-visible:rounded"
        aria-label={`View case study: ${project.name}`}
      >
        <CardImage
          src={project.heroImage.src}
          alt={project.heroImage.alt}
          sizes="(max-width: 640px) 100vw, calc((100vw - 224px) / 2)"
          title={`${project.name}`}
        />

        <div className="pb-6">
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <h2 className="mono-heading text-ink group-hover:text-pink transition-colors">
              {project.name}
            </h2>
            <span className="mono-label text-ink-soft whitespace-nowrap mt-px" style={{ fontSize: "0.625rem" }}>{project.date}</span>
          </div>
          <TagRow project={project} />
          <p className="mt-2.5 text-ink-soft leading-relaxed line-clamp-2" style={{ fontSize: "var(--text-caption)" }}>
            {project.oneLiner}
          </p>
          <p className="mt-3 mono-label text-pink">VIEW →</p>
        </div>
      </Link>
    </article>
  );
}

/* ─── Gallery card (2-col, no link) ─────────────────────── */
export function GalleryCard({ project, index }: { project: Project; index: number }) {
  return (
    <article
      className="card-animate col-span-12 sm:col-span-6 group"
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      <CardImage
        src={project.heroImage.src}
        alt={project.heroImage.alt}
        sizes="(max-width: 640px) 100vw, calc((100vw - 224px) / 2)"
      />

      <div className="pb-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h2 className="mono-label text-ink">{project.name}</h2>
          <span className="mono-label text-ink-soft whitespace-nowrap" style={{ fontSize: "0.5625rem" }}>{project.date}</span>
        </div>
        <TagRow project={project} />
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 mono-label text-teal hover:text-pink transition-colors link-wipe inline-block"
            style={{ fontSize: "0.625rem" }}
            aria-label={`Visit ${project.name} live site`}
          >
            LIVE SITE ↗
          </a>
        )}
      </div>
    </article>
  );
}

/* ─── Default export — picks the right variant ────────────── */
export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  if (project.tier === "featured") return <FeaturedCard project={project} index={index} />;
  if (project.tier === "full")     return <FullCard project={project} index={index} />;
  return <GalleryCard project={project} index={index} />;
}
