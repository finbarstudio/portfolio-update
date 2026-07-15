import ProjectShowcase, { Project } from "@/components/david-radic/sections/ProjectShowcase";

// Real David Radic Prestige Homes projects, strongest images first.
const PROJECTS: Project[] = [
  {
    slug: "buccaneer",
    title: "Buccaneer Residence",
    location: "Gold Coast",
    award: "HIA Finalist, Over $2M",
    awardYear: "24",
    type: "Prestige Custom Home",
    images: [
      "/david-radic/projects/buccaneer.webp",
      "/david-radic/projects/buccaneer-2.webp",
      "/david-radic/projects/buccaneer-3.webp",
    ],
  },
  {
    slug: "hope-island-7",
    title: "Hope Island Residence",
    location: "Hope Island",
    type: "Waterfront Home",
    images: [
      "/david-radic/projects/hope-island-7.webp",
      "/david-radic/projects/hope-island-7-2.webp",
      "/david-radic/projects/hope-island-7-3.webp",
    ],
  },
  {
    slug: "sailaway",
    title: "Sailaway",
    location: "Broadbeach Waters",
    type: "Waterfront Home",
    images: [
      "/david-radic/projects/sailaway.webp",
      "/david-radic/projects/sailaway-2.webp",
      "/david-radic/projects/sailaway-3.webp",
    ],
  },
  {
    slug: "river",
    title: "River Residence",
    location: "Mermaid Waters",
    type: "Riverfront Home",
    images: [
      "/david-radic/projects/river.webp",
      "/david-radic/projects/river-2.webp",
      "/david-radic/projects/river-3.webp",
    ],
  },
  {
    slug: "sheridan-park",
    title: "Sheridan Park",
    location: "Hope Island",
    type: "Waterfront Home",
    images: [
      "/david-radic/projects/sheridan-park.webp",
      "/david-radic/projects/sheridan-park-2.webp",
      "/david-radic/projects/sheridan-park-3.webp",
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
