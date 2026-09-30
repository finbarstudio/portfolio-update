import ProjectShowcase, { Project } from "@/components/lindon/sections/ProjectShowcase";
import { media } from "@/lib/media";

const PROJECTS: Project[] = [
  {
    slug: "holland-park",
    title: "Holland Park",
    location: "Holland Park",
    type: "Sloping Site / Custom Build",
    images: [
      media("/media/images/lindon/projects/holland-park/main.webp"),
      media("/media/images/lindon/projects/holland-park/t1.webp"),
      media("/media/images/lindon/projects/holland-park/t2.webp"),
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
      media("/media/images/lindon/projects/tranters/main.webp"),
      media("/media/images/lindon/projects/tranters/t1.webp"),
      media("/media/images/lindon/projects/tranters/t2.webp"),
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
      media("/media/images/lindon/projects/bonaventure/main.webp"),
      media("/media/images/lindon/projects/bonaventure/t1.webp"),
      media("/media/images/lindon/projects/bonaventure/t2.webp"),
    ],
  },
  {
    slug: "sydney-house",
    title: "Sydney House",
    location: "Camp Hill",
    award: "HIA Finalist",
    type: "Architect Designed",
    images: [
      media("/media/images/lindon/projects/sydney-house/main.webp"),
      media("/media/images/lindon/projects/sydney-house/t1.webp"),
      media("/media/images/lindon/projects/sydney-house/t2.webp"),
    ],
  },
  {
    slug: "oriel-road",
    title: "Oriel Road",
    location: "Clayfield",
    type: "Major Renovation",
    images: [
      media("/media/images/lindon/projects/oriel-road/main.webp"),
      media("/media/images/lindon/projects/oriel-road/t1.webp"),
      media("/media/images/lindon/projects/oriel-road/t2.webp"),
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
