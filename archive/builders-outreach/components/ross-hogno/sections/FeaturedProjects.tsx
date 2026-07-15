import ProjectShowcase, { Project } from "@/components/ross-hogno/sections/ProjectShowcase";

// Real Ross Hogno Constructions projects, strongest images first.
const PROJECTS: Project[] = [
  {
    slug: "highfields",
    title: "Highfields",
    location: "Highfields",
    award: "MBA Best Use of Sloping Sites",
    awardYear: "25",
    type: "Custom Home",
    images: [
      "/ross-hogno/projects/highfields.webp",
      "/ross-hogno/projects/highfields-2.webp",
      "/ross-hogno/projects/highfields-3.webp",
    ],
  },
  {
    slug: "escarpment-ave",
    title: "Escarpment Avenue",
    location: "East Toowoomba",
    type: "Custom Home",
    images: [
      "/ross-hogno/projects/escarpment-ave.webp",
      "/ross-hogno/projects/escarpment-ave-2.webp",
      "/ross-hogno/projects/escarpment-ave-3.webp",
    ],
  },
  {
    slug: "meringandan",
    title: "Meringandan",
    location: "Meringandan",
    type: "Custom Home",
    images: [
      "/ross-hogno/projects/meringandan.webp",
      "/ross-hogno/projects/meringandan-2.webp",
      "/ross-hogno/projects/meringandan-3.webp",
    ],
  },
  {
    slug: "kooroongah",
    title: "Kooroongah",
    location: "Toowoomba",
    type: "Custom Home",
    images: [
      "/ross-hogno/projects/kooroongah.webp",
      "/ross-hogno/projects/kooroongah-2.webp",
      "/ross-hogno/projects/kooroongah-3.webp",
    ],
  },
  {
    slug: "preston",
    title: "Preston",
    location: "Preston",
    type: "Custom Home",
    images: [
      "/ross-hogno/projects/preston.webp",
      "/ross-hogno/projects/preston-2.webp",
      "/ross-hogno/projects/preston-3.webp",
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
