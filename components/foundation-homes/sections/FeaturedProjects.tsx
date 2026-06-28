import ProjectShowcase, { Project } from "@/components/foundation-homes/sections/ProjectShowcase";

// Real Foundation Homes projects (from their gallery), strongest images first.
const PROJECTS: Project[] = [
  {
    slug: "amani-palace",
    title: "Amani Palace",
    location: "Sunshine Coast",
    type: "Custom New Home",
    images: ["/foundation-homes/projects/amani-palace.webp"],
  },
  {
    slug: "watson-residence",
    title: "Watson Residence",
    location: "Doonan",
    award: "MBA Custom Home Winner",
    awardYear: "23",
    type: "Custom New Home",
    images: ["/foundation-homes/projects/watson-residence.webp"],
  },
  {
    slug: "tern-st",
    title: "Tern Street",
    location: "Sunshine Coast",
    award: "MBA Custom Home Finalist",
    awardYear: "23",
    type: "Custom New Home",
    images: ["/foundation-homes/projects/tern-st.webp"],
  },
  {
    slug: "barnes-residence",
    title: "Barnes Residence",
    location: "Buderim",
    type: "Custom New Home",
    images: ["/foundation-homes/projects/barnes-residence.webp"],
  },
  {
    slug: "noosa-dunes",
    title: "Noosa Dunes",
    location: "Noosa",
    award: "MBA Custom Home Winner",
    awardYear: "20",
    type: "Custom New Home",
    images: ["/foundation-homes/projects/noosa-dunes.webp"],
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
