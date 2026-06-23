import ProjectShowcase from "@/components/ojpippin/sections/ProjectShowcase";
import { featuredProjects } from "@/components/ojpippin/lib/content";

export default function FeaturedProjects() {
  return (
    <div>
      {featuredProjects.map((p, i) => (
        <ProjectShowcase key={p.slug} project={p} index={i} />
      ))}
    </div>
  );
}
