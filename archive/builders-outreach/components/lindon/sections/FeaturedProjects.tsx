import ProjectShowcase, { Project } from "@/components/lindon/sections/ProjectShowcase";

const PROJECTS: Project[] = [
  {
    slug: "holland-park",
    title: "Holland Park",
    location: "Holland Park",
    type: "Sloping Site / Custom Build",
    images: [
      "/lindon/projects/holland-park/main.jpg",
      "/lindon/projects/holland-park/t1.jpg",
      "/lindon/projects/holland-park/t2.jpg",
    ],
  },
  {
    slug: "tranters",
    title: "Tranters",
    location: "Bardon",
    award: "HIA Winner",
    awardYear: "21",
    type: "Knock Down Rebuild",
    images: [
      "/lindon/projects/tranters/main.jpg",
      "/lindon/projects/tranters/t1.jpg",
      "/lindon/projects/tranters/t2.jpg",
    ],
  },
  {
    slug: "bonaventure",
    title: "Bonaventure",
    location: "Raby Bay",
    award: "HIA Finalist",
    awardYear: "21",
    type: "Custom Design & Build",
    images: [
      "/lindon/projects/bonaventure/main.jpg",
      "/lindon/projects/bonaventure/t1.jpg",
      "/lindon/projects/bonaventure/t2.jpg",
    ],
  },
  {
    slug: "sydney-house",
    title: "Sydney House",
    location: "Camp Hill",
    award: "HIA Finalist",
    type: "Architect Designed",
    images: [
      "/lindon/projects/sydney-house/main.webp",
      "/lindon/projects/sydney-house/t1.webp",
      "/lindon/projects/sydney-house/t2.webp",
    ],
  },
  {
    slug: "oriel-road",
    title: "Oriel Road",
    location: "Clayfield",
    type: "Major Renovation",
    images: [
      "/lindon/projects/oriel-road/main.jpg",
      "/lindon/projects/oriel-road/t1.jpg",
      "/lindon/projects/oriel-road/t2.jpg",
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
