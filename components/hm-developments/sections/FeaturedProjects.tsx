import ProjectShowcase, { Project } from "@/components/hm-developments/sections/ProjectShowcase";

// Real HM Developments projects, strongest imagery first.
const PROJECTS: Project[] = [
  {
    slug: "cove-corsica",
    title: "Corsica Residences",
    location: "The Cove, Pelican Waters",
    type: "36 Premium Apartments",
    images: ["/hm-developments/projects/cove-corsica.webp"],
  },
  {
    slug: "cove-terraces",
    title: "The Terrace Collection",
    location: "The Cove, Pelican Waters",
    type: "15 Architectural Terrace Homes",
    images: ["/hm-developments/projects/cove-terraces.webp"],
  },
  {
    slug: "salt-on-taylor",
    title: "Salt on Taylor",
    location: "Golden Beach",
    type: "Beachside Townhomes",
    images: ["/hm-developments/projects/salt-on-taylor.webp"],
  },
  {
    slug: "sage-on-bower",
    title: "Sage on Bower",
    location: "Caloundra",
    type: "Townhomes",
    images: ["/hm-developments/projects/sage-on-bower.webp"],
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
