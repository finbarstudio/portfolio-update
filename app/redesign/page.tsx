import Link from "next/link";
import { projects } from "@/content/projects";
import Reveal from "@/components/Reveal";
import HomeIntro from "@/components/HomeIntro";
import InlineIcon from "@/components/InlineIcon";
import MaskReveal from "@/components/MaskReveal";

// 1:1 copy of the home page (app/(site)/page.tsx) for the redesign sandbox.
// JSON-LD + SEO metadata deliberately stripped: this page is noindex and only
// exists to iterate on the skin (see redesign.css). Keep the section structure
// in sync with the real home page when it changes.

// Web-first featured roster: Lows first, then KinAya, in a simple 3-col grid.
// Thumbnails are real scroll-throughs of the LIVE sites (recorded headless,
// public/redesign/*-scroll.mp4), recessed into the card at their full 16:10
// aspect. More web builds slot in here as they ship; the rest stays on /work.
const SELECTED: { slug: string; video: string }[] = [
  { slug: "lows-design-build", video: "/redesign/lows-scroll.mp4" },
  { slug: "kinaya", video: "/redesign/kinaya-scroll.mp4" },
  { slug: "momentum-mentoring", video: "/redesign/momentum-scroll.mp4" },
];

/* Minimal grid card: a looping scroll capture of the live site, recessed
   inside the card (full frame visible, screen-like hairline around the video)
   with just the name + year underneath. Skin hover = card border tint. */
function MiniCard({
  project,
  video,
  index,
}: {
  project: (typeof projects)[number];
  video: string;
  index: number;
}) {
  return (
    <article className="card-animate col-span-12 sm:col-span-4 group" style={{ animationDelay: `${index * 0.03}s` }}>
      <Link
        href={`/case-studies/${project.slug}`}
        className="block focus-visible:outline-pink focus-visible:outline-2 focus-visible:rounded"
        aria-label={`View case study: ${project.name}`}
      >
        {/* Card matches the recording's 16:10, so the full video IS the thumb. */}
        <div className="card-thumb relative overflow-hidden" style={{ aspectRatio: "16 / 10" }}>
          <video
            src={video}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={`Scrolling preview of the ${project.name} website`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="flex items-start justify-between gap-4 mt-3">
          <h2 className="mono-heading text-ink group-hover:text-pink transition-colors" style={{ fontSize: "0.8125rem" }}>
            {project.name}
          </h2>
          <span className="meta-mono text-ink-soft whitespace-nowrap mt-px" style={{ fontSize: "0.625rem" }}>
            {project.date}
          </span>
        </div>
      </Link>
    </article>
  );
}

function Disciplines() {
  return (
    <section id="hero" className="home-disciplines px-5 md:px-10" aria-label="What I do">
      <MaskReveal as="h2" className="home-disc" aria-label="Web, digital, brand, print, social, editorial, but mainly web">
        {"Web "}
        <InlineIcon char="🏄" className="home-disc-icon" />
        {" Digital "}
        <InlineIcon char="🖧" className="home-disc-icon" />
        {" Brand "}
        <InlineIcon char="✌" className="home-disc-icon" />
        {" Print "}
        <InlineIcon char="📦" className="home-disc-icon" />
        {" Social "}
        <InlineIcon char="👪" className="home-disc-icon" />
        {" Editorial "}
        {"... "}
        <span className="home-disc-pink">but mainly web</span>
      </MaskReveal>
    </section>
  );
}

function SelectedWork() {
  return (
    <Reveal section as="section" id="top-work" className="home-section no-rule px-5 md:px-10" aria-label="Selected work">
      <div className="grid grid-cols-12 gap-x-8 gap-y-12">
        {SELECTED.map((pick, i) => {
          const project = projects.find((p) => p.slug === pick.slug);
          return project ? <MiniCard key={pick.slug} project={project} video={pick.video} index={i} /> : null;
        })}
      </div>
    </Reveal>
  );
}

// Web leads; the design capabilities stay (graphic design roles are still on
// the table), they just follow.
const CAP_PILLS: { name: string; href: string }[] = [
  { name: "Web design & development", href: "/web-design" },
  { name: "Brand identity", href: "/work?filter=brand" },
  { name: "Graphic design", href: "/graphic-design" },
  { name: "Motion graphics", href: "/work?filter=motion" },
  { name: "Editorial & print", href: "/work?filter=editorial" },
  { name: "Creative direction", href: "/work?filter=art" },
];

function Capabilities() {
  return (
    <section className="home-disciplines px-5 md:px-10" aria-labelledby="services-title">
      <div className="home-cap">
        <h2 id="services-title" className="home-cap-title">How I help businesses</h2>
        <div className="home-disc home-cap-wrap">
          {CAP_PILLS.map((c) => (
            <Link key={c.name} href={c.href} className="home-cap-pill">
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function RedesignHomePage() {
  return (
    <>
      <h1 className="sr-only">
        finbar✶studio. Brisbane web design &amp; development studio (redesign sandbox)
      </h1>
      <HomeIntro />
      <Disciplines />
      <div id="nav-reveal-sentinel" aria-hidden="true" />
      <SelectedWork />
      <Capabilities />
    </>
  );
}
