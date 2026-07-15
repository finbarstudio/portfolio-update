import ProjectShowcase, { Project } from "@/components/mbc-prestige/sections/ProjectShowcase";

// Real MBC Prestige developments, flagship first.
const PROJECTS: Project[] = [
  {
    slug: "kalani",
    title: "Kalani",
    location: "Noosaville · Gympie Terrace",
    type: "3 Riverfront Residences",
    images: [
      "/mbc-prestige/projects/kalani.webp",
      "/mbc-prestige/projects/kalani-2.webp",
    ],
  },
  {
    slug: "sails",
    title: "Sails",
    location: "Sunshine Beach",
    type: "Whole-Floor Apartments",
    images: [
      "/mbc-prestige/projects/sails.webp",
      "/mbc-prestige/projects/sails-2.webp",
    ],
  },
  {
    slug: "oceane",
    title: "Océane",
    location: "Coolum Beach",
    type: "Beachside Apartments",
    images: ["/mbc-prestige/projects/oceane.webp"],
  },
  {
    slug: "botanica",
    title: "Botanica",
    location: "Valdora",
    type: "Acreage Land Release",
    images: ["/mbc-prestige/projects/botanica.webp"],
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
