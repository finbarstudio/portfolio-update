import Link from "next/link";
import { projects, type Project } from "@/content/projects";
import PreviewCycle from "@/components/PreviewCycle";
import PhoneCarousel from "@/components/PhoneCarousel";
import HeroSlideshow from "@/components/HeroSlideshow";
import PdfSlideshowThumb from "@/components/PdfSlideshowThumb";
import ZoomImage from "@/components/ZoomImage";
import { MdArrowForward } from "@/components/MaterialIcon";

/**
 * SelectedWork — the home page's six best pieces in a two-column grid, each a
 * big 16:9 thumbnail that clicks through to its case study. Web projects
 * hover-cycle their section shots; the graphic projects use their own moving
 * thumbs (the TMYR phone carousel, the Salesmasters slideshow, the Packer
 * capability statement paging through). Order is editorial, Rennen Plus first,
 * Lola Audio last. Edit SELECTED to
 * change the set.
 */
const SELECTED = ["rennen-plus", "lows-design-build", "tmyr", "salesmasters", "packer-associates", "lola-audio"];

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
    <section className="px-5 md:px-10 pb-20 md:pb-28" aria-label="Selected work">
      <div className="home-selected">
        {items.map((project, i) => (
          <article key={project.slug} className="home-selected-card group">
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
