import ProjectShowcase, { Project } from "@/components/foundation-homes/sections/ProjectShowcase";

// Real Foundation Homes projects (from their gallery), strongest images first.
const PROJECTS: Project[] = [
  {
    slug: "amani-palace",
    title: "Amani Palace",
    location: "Sunshine Coast",
    type: "Custom New Home",
    images: [
      "/foundation-homes/projects/amani-palace.webp",
      "/foundation-homes/projects/amani-palace-2.webp",
      "/foundation-homes/projects/amani-palace-3.webp",
    ],
  },
  {
    slug: "watson-residence",
    title: "Watson Residence",
    location: "Doonan",
    award: "MBA Custom Home Winner",
    awardYear: "23",
    type: "Custom New Home",
    images: [
      "/foundation-homes/projects/watson-residence.webp",
      "/foundation-homes/projects/watson-residence-2.webp",
      "/foundation-homes/projects/watson-residence-3.webp",
    ],
  },
  {
    slug: "tern-st",
    title: "Tern Street",
    location: "Sunshine Coast",
    award: "MBA Custom Home Finalist",
    awardYear: "23",
    type: "Custom New Home",
    images: [
      "/foundation-homes/projects/tern-st.webp",
      "/foundation-homes/projects/tern-st-2.webp",
      "/foundation-homes/projects/tern-st-3.webp",
    ],
  },
  {
    slug: "barnes-residence",
    title: "Barnes Residence",
    location: "Buderim",
    type: "Custom New Home",
    images: [
      "/foundation-homes/projects/barnes-residence.webp",
      "/foundation-homes/projects/barnes-residence-2.webp",
      "/foundation-homes/projects/barnes-residence-3.webp",
    ],
  },
  {
    slug: "noosa-dunes",
    title: "Noosa Dunes",
    location: "Noosa",
    award: "MBA Custom Home Winner",
    awardYear: "20",
    type: "Custom New Home",
    images: [
      "/foundation-homes/projects/noosa-dunes.webp",
      "/foundation-homes/projects/noosa-dunes-2.webp",
      "/foundation-homes/projects/noosa-dunes-3.webp",
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
