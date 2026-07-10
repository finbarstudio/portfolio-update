import Link from "next/link";
import { projects } from "@/content/projects";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import HomeIntro from "@/components/HomeIntro";
import InlineIcon from "@/components/InlineIcon";
import MaskReveal from "@/components/MaskReveal";

// 1:1 copy of the home page (app/(site)/page.tsx) for the redesign sandbox.
// JSON-LD + SEO metadata deliberately stripped: this page is noindex and only
// exists to iterate on the skin (see redesign.css). Keep the section structure
// in sync with the real home page when it changes.

const SELECTED = ["tmyr", "salesmasters", "palmsmotel"];

function Disciplines() {
  return (
    <section id="hero" className="home-disciplines px-5 md:px-10" aria-label="What I do">
      <MaskReveal as="h2" className="home-disc" aria-label="Brand, digital, print, social, web, editorial and whatever else your heart desires">
        {"Brand "}
        <InlineIcon char="✌" className="home-disc-icon" />
        {" Digital "}
        <InlineIcon char="🖧" className="home-disc-icon" />
        {" Print "}
        <InlineIcon char="📦" className="home-disc-icon" />
        {" Social "}
        <InlineIcon char="👪" className="home-disc-icon" />
        {" Web "}
        <InlineIcon char="🏄" className="home-disc-icon" />
        {" Editorial "}
        <span className="home-disc-pink">and</span>
        {" whatever else your heart "}
        <InlineIcon char="🂱" className="home-disc-icon" />
        {" desires"}
      </MaskReveal>
    </section>
  );
}

function SelectedWork() {
  const picks = SELECTED.map((slug) => projects.find((p) => p.slug === slug)).filter(Boolean) as typeof projects;
  let i = 0;
  return (
    <Reveal section as="section" id="top-work" className="home-section no-rule px-5 md:px-10" aria-label="Selected work">
      <div className="grid grid-cols-12 gap-x-8 gap-y-20 md:gap-y-28">
        {picks.map((project) => (
          <ProjectCard key={project.slug} project={project} index={i++} />
        ))}
      </div>
    </Reveal>
  );
}

const CAP_PILLS: { name: string; href: string }[] = [
  { name: "Graphic design", href: "/graphic-design" },
  { name: "Brand identity", href: "/work?filter=brand" },
  { name: "Editorial & print", href: "/work?filter=editorial" },
  { name: "Web design", href: "/web-design" },
  { name: "Creative direction", href: "/work?filter=art" },
  { name: "Motion graphics", href: "/work?filter=motion" },
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
        finbar✶studio. Brisbane graphic design &amp; web design studio — redesign sandbox
      </h1>
      <HomeIntro />
      <Disciplines />
      <div id="nav-reveal-sentinel" aria-hidden="true" />
      <SelectedWork />
      <Capabilities />
    </>
  );
}
