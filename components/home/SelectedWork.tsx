import Link from "next/link";
import { projects, type Project } from "@/content/projects";
import PreviewCycle from "@/components/PreviewCycle";
import PhoneCarousel from "@/components/PhoneCarousel";
import HeroSlideshow from "@/components/HeroSlideshow";
import PdfSlideshowThumb from "@/components/PdfSlideshowThumb";
import ZoomImage from "@/components/ZoomImage";
import { MdArrowForward } from "@/components/MaterialIcon";

/**
 * SelectedWork — the websites, on the home page: big 16:9 thumbnails that
 * click through to their case studies and hover-cycle their section shots.
 * The newest leads at full width when the count is odd, so the two-column
 * grid under it always ends on a full row. The studio site is web-first
 * (the wider design work is at portfolio.finbar.studio); the other thumb
 * types below are kept so a graphic project can be added back by its slug.
 * Edit SELECTED to change the set.
 */
const SELECTED = ["rennen-plus", "lows-design-build", "plated-with-issy", "lola-audio", "kinaya"];

function Thumb({ project, priority }: { project: Project; priority: boolean }) {
  if (project.webShots?.length || project.webThumb) {
    return <PreviewCycle images={project.webShots ?? [project.webThumb!]} alt={`${project.name} website`} />;
  }
  if (project.heroPdf) {
    return <PdfSlideshowThumb pages={project.heroPdf} />;
  }
  if (project.heroPhones) {
    return <PhoneCarousel model={project.heroPhones.model} videos={project.heroPhones.videos} poster={project.heroPhones.poster} fill />;
  }
  if (project.heroSlideshow) {
    return <HeroSlideshow images={project.heroSlideshow} cardAspect={project.slideshowAspect} fill />;
  }
  return (
    <ZoomImage
      src={project.heroImage.src}
      alt={project.heroImage.alt}
      priority={priority}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className="object-cover"
    />
  );
}

export default function SelectedWork() {
  const items = SELECTED.map((slug) => projects.find((p) => p.slug === slug)).filter((p): p is Project => !!p);
  return (
    <section className="px-5 md:px-10 pb-20 md:pb-28" aria-label="Websites">
      <div className="home-selected">
        {items.map((project, i) => (
          <article
            key={project.slug}
            className="home-selected-card group"
            // an odd number of cards: the first spans the grid, so no row is left half empty
            style={i === 0 && items.length % 2 ? { gridColumn: "1 / -1" } : undefined}
          >
            <Link
              href={`/case-studies/${project.slug}`}
              className="block focus-visible:outline-pink focus-visible:outline-2 focus-visible:rounded"
              aria-label={`${project.name} case study`}
            >
              <div className="home-selected-thumb">
                <Thumb project={project} priority={i < 3} />
              </div>
              <div className="flex items-baseline justify-between gap-4 mt-3">
                <h2 className="text-ink font-medium group-hover:text-pink transition-colors" style={{ fontSize: "0.95rem" }}>
                  {project.name}
                </h2>
                <span className="text-ink-soft whitespace-nowrap" style={{ fontSize: "var(--text-small)" }}>
                  {project.categories[0]} · {project.date}
                </span>
              </div>
            </Link>
          </article>
        ))}
      </div>
      <div className="mt-12 md:mt-16 flex justify-center">
        <Link href="/work" className="sticker-pill">
          See all case studies <MdArrowForward size={15} />
        </Link>
      </div>
    </section>
  );
}
