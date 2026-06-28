import ProjectShowcase, { Project } from "@/components/resolve-construction/sections/ProjectShowcase";

// Real Resolve Construction projects (award-winning), strongest images first.
const PROJECTS: Project[] = [
  {
    slug: "neu-burleigh",
    title: "Neu Burleigh",
    location: "Burleigh Waters",
    award: "MBA Individual Home Winner",
    awardYear: "24",
    type: "Prestige Waterfront Home",
    images: ["/resolve-construction/projects/neu-burleigh.webp"],
  },
  {
    slug: "villa-franco",
    title: "Villa Franco",
    location: "Broadbeach Waters",
    award: "MBA Individual Home Winner",
    awardYear: "25",
    type: "Prestige Custom Home",
    images: ["/resolve-construction/projects/villa-franco.webp"],
  },
  {
    slug: "sovereign-house",
    title: "The Sovereign House",
    location: "Coomera Waters",
    award: "MBA Custom Home Winner",
    awardYear: "22",
    type: "Custom Waterfront Home",
    images: ["/resolve-construction/projects/sovereign-house.webp"],
  },
  {
    slug: "lowry-farmhouse",
    title: "The Lowry Farmhouse",
    location: "Neranwood",
    award: "MBA Best Use of Sloping Sites",
    awardYear: "25",
    type: "Hinterland Custom Home",
    images: ["/resolve-construction/projects/lowry-farmhouse.webp"],
  },
  {
    slug: "montego-hills",
    title: "Montego Hills",
    location: "Ormeau",
    award: "MBA Custom Home Winner",
    awardYear: "21",
    type: "Custom Home",
    images: ["/resolve-construction/projects/montego-hills.webp"],
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
