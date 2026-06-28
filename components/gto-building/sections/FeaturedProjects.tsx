import ProjectShowcase, { Project } from "@/components/gto-building/sections/ProjectShowcase";

// Real GTO Building projects (architect-designed Sunshine Coast homes).
const PROJECTS: Project[] = [
  {
    slug: "panorama",
    title: "Panorama House",
    location: "Doonan",
    award: "MBA Best Use of Steel Frame",
    type: "Bark Design Architects",
    images: ["/gto-building/projects/panorama.webp"],
  },
  {
    slug: "tristania",
    title: "Tristania Beach House",
    location: "Marcus Beach",
    type: "Bark Design Architects",
    images: ["/gto-building/projects/tristania.webp"],
  },
  {
    slug: "tallgum",
    title: "Tallgum House",
    location: "Doonan",
    type: "Georgina Price Design",
    images: ["/gto-building/projects/tallgum.webp"],
  },
];

export default function FeaturedProjects() {
  return (
    <div>
      {PROJECTS.map((p, i) => (
        <ProjectShowcase key={p.slug} project={p} index={i} reveal={i === 0} />
      ))}
    </div>
  );
}
