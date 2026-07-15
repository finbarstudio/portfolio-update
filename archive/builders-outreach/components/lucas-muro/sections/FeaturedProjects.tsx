import ProjectShowcase, { Project } from "@/components/lucas-muro/sections/ProjectShowcase";

// Real Lucas Muro shoots (from lucasmuro.com.au gallery pages) — four of the
// strongest galleries, client + region in the subtitle.
const PROJECTS: Project[] = [
  {
    slug: "whistle-lane",
    title: "Whistle Lane",
    subtitle: "Immackulate Homes · Sunshine Coast",
    credit: "One of 5 shoots for Immackulate Homes",
    images: [
      "/lucas-muro/projects/whistle-lane.webp",
      "/lucas-muro/projects/whistle-lane-2.webp",
      "/lucas-muro/projects/whistle-lane-3.webp",
    ],
  },
  {
    slug: "norman-park",
    title: "Norman Park House",
    subtitle: "Koda Design · Brisbane",
    images: [
      "/lucas-muro/projects/norman-park.webp",
      "/lucas-muro/projects/norman-park-2.webp",
      "/lucas-muro/projects/norman-park-3.webp",
    ],
  },
  {
    slug: "lake-weyba",
    title: "Lake Weyba",
    subtitle: "Aboda Design Group · Noosa",
    images: [
      "/lucas-muro/projects/lake-weyba.webp",
      "/lucas-muro/projects/lake-weyba-2.webp",
      "/lucas-muro/projects/lake-weyba-3.webp",
    ],
  },
  {
    slug: "gallery-house",
    title: "Gallery House",
    subtitle: "Dayne Lawrie Constructions",
    images: [
      "/lucas-muro/projects/gallery-house.webp",
      "/lucas-muro/projects/gallery-house-2.webp",
      "/lucas-muro/projects/gallery-house-3.webp",
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
