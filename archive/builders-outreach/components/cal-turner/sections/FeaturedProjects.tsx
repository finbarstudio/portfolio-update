import ProjectShowcase, { Project } from "@/components/cal-turner/sections/ProjectShowcase";

// Real Cal Turner Architects projects (from calturnerarchitects.com.au),
// built + photographed work first.
const PROJECTS: Project[] = [
  {
    slug: "peregian",
    title: "Peregian House",
    subtitle: "Peregian Beach · Completed",
    credit: "Built by Foundation Homes · Photography Alanna Jayne McTiernan",
    images: [
      "/cal-turner/projects/peregian.webp",
      "/cal-turner/projects/peregian-2.webp",
      "/cal-turner/projects/peregian-3.webp",
    ],
  },
  {
    slug: "bardon",
    title: "Bardon House",
    subtitle: "Bardon · Completed",
    images: [
      "/cal-turner/projects/bardon.webp",
      "/cal-turner/projects/bardon-2.webp",
      "/cal-turner/projects/bardon-3.webp",
    ],
  },
  {
    slug: "rose",
    title: "Rose Residence",
    subtitle: "Completed",
    images: [
      "/cal-turner/projects/rose.webp",
      "/cal-turner/projects/rose-2.webp",
      "/cal-turner/projects/rose-3.webp",
    ],
  },
  {
    slug: "laurel",
    title: "Laurel House",
    subtitle: "Completed",
    images: [
      "/cal-turner/projects/laurel.webp",
      "/cal-turner/projects/laurel-2.webp",
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
