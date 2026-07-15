import ProjectShowcase, { Project } from "@/components/hm-developments/sections/ProjectShowcase";

// Real HM Developments projects, strongest imagery first.
const PROJECTS: Project[] = [
  {
    slug: "cove-corsica",
    title: "Corsica Residences",
    location: "The Cove, Pelican Waters",
    type: "36 Premium Apartments",
    images: [
      "/hm-developments/projects/cove-corsica.webp",
      "/hm-developments/projects/cove-corsica-2.webp",
      "/hm-developments/projects/cove-corsica-3.webp",
    ],
  },
  {
    slug: "cove-terraces",
    title: "The Terrace Collection",
    location: "The Cove, Pelican Waters",
    type: "15 Architectural Terrace Homes",
    images: [
      "/hm-developments/projects/cove-terraces.webp",
      "/hm-developments/projects/cove-terraces-2.webp",
      "/hm-developments/projects/cove-terraces-3.webp",
    ],
  },
  {
    slug: "salt-on-taylor",
    title: "Salt on Taylor",
    location: "Golden Beach",
    type: "Beachside Townhomes",
    images: [
      "/hm-developments/projects/salt-on-taylor.webp",
      "/hm-developments/projects/salt-on-taylor-2.webp",
      "/hm-developments/projects/salt-on-taylor-3.webp",
    ],
  },
  {
    slug: "sage-on-bower",
    title: "Sage on Bower",
    location: "Caloundra",
    type: "Townhomes",
    images: [
      "/hm-developments/projects/sage-on-bower.webp",
      "/hm-developments/projects/sage-on-bower-2.webp",
      "/hm-developments/projects/sage-on-bower-3.webp",
    ],
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
