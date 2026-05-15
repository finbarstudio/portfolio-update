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

/* ─── Featured card (full-width, large image) ─────────────── */
export function FeaturedCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
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
        {/* Image */}
        <div className="relative w-full overflow-hidden bg-line" style={{ aspectRatio: "16/9" }}>
          <Image
            src={project.heroImage.src}
            alt={project.heroImage.alt}
            fill
            sizes="(max-width: 768px) 100vw, calc(100vw - 224px)"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
            priority={index === 0}
          />
        </div>

        {/* Card info */}
        <div className="pt-5 pb-8 border-b border-line">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h2 className="mono-heading text-ink group-hover:text-pink transition-colors text-sm">
              {project.name}
            </h2>
            <span className="mono-label text-ink-soft whitespace-nowrap mt-px">{project.date}</span>
          </div>
          <TagRow project={project} />
          <p className="mt-3 text-sm text-ink-soft leading-relaxed max-w-2xl">
            {project.oneLiner}
          </p>
          <p className="mt-4 mono-label text-pink">
            VIEW CASE STUDY →
          </p>
        </div>
      </Link>
    </article>
  );
}

/* ─── Full card (half-width, medium image) ────────────────── */
export function FullCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
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
        {/* Image */}
        <div className="relative w-full overflow-hidden bg-line" style={{ aspectRatio: "3/2" }}>
          <Image
            src={project.heroImage.src}
            alt={project.heroImage.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, calc((100vw - 224px) / 2)"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </div>

        {/* Card info */}
        <div className="pt-4 pb-6 border-b border-line">
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <h2 className="mono-heading text-ink group-hover:text-pink transition-colors">
              {project.name}
            </h2>
            <span className="mono-label text-ink-soft whitespace-nowrap mt-px text-[10px]">{project.date}</span>
          </div>
          <TagRow project={project} />
          <p className="mt-2.5 text-xs text-ink-soft leading-relaxed line-clamp-2">
            {project.oneLiner}
          </p>
          <p className="mt-3 mono-label text-pink text-[10px]">VIEW →</p>
        </div>
      </Link>
    </article>
  );
}

/* ─── Gallery card (no link, compact) ────────────────────── */
export function GalleryCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <article
      className="card-animate col-span-12 sm:col-span-6 lg:col-span-4 group"
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      {/* Image */}
      <div className="relative w-full overflow-hidden bg-line" style={{ aspectRatio: "3/2" }}>
        <Image
          src={project.heroImage.src}
          alt={project.heroImage.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, calc((100vw - 224px) / 3)"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      </div>

      {/* Card info */}
      <div className="pt-3.5 pb-5 border-b border-line">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h2 className="mono-label text-ink">{project.name}</h2>
          <span className="mono-label text-ink-soft whitespace-nowrap text-[9px]">{project.date}</span>
        </div>
        <TagRow project={project} />
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 mono-label text-teal text-[10px] hover:text-pink transition-colors"
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
export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  if (project.tier === "featured") return <FeaturedCard project={project} index={index} />;
  if (project.tier === "full") return <FullCard project={project} index={index} />;
  return <GalleryCard project={project} index={index} />;
}
