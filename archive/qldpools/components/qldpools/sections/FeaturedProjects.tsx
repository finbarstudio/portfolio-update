import ProjectShowcase, { Showcase } from "@/components/qldpools/sections/ProjectShowcase";

/* The featured work — category showcases built from the client's own photos
   (pulled from qldpoolinstalls.com.au). Locations reflect their real service
   areas; swap any pairing that doesn't match the actual job. */
const SHOWCASES: Showcase[] = [
  {
    slug: "fibreglass",
    title: "Fibreglass Pools",
    location: "Brisbane",
    badge: "In the ground in weeks, not months",
    type: "7–9m Family Pool · New Install",
    images: [
      "/qldpools/projects/fibreglass/main.jpg",
      "/qldpools/projects/fibreglass/t1.jpg",
      "/qldpools/projects/fibreglass/t2.jpg",
    ],
  },
  {
    slug: "concrete",
    title: "Concrete Pools",
    location: "Gold Coast",
    type: "Custom Design & Build",
    images: [
      "/qldpools/projects/concrete/main.jpg",
      "/qldpools/projects/concrete/t1.jpg",
      "/qldpools/projects/concrete/t2.jpg",
    ],
  },
  {
    slug: "family",
    title: "Family Pools",
    location: "Springfield Lakes",
    badge: "Safety ledges · integrated lighting",
    type: "Fibreglass · Estate Blocks",
    images: [
      "/qldpools/projects/family/main.jpg",
      "/qldpools/projects/family/t1.jpg",
      "/qldpools/projects/family/t2.jpg",
    ],
  },
  {
    slug: "renovations",
    title: "Renovations",
    location: "Brisbane",
    type: "Resurface · Repave · Re-equip",
    images: [
      "/qldpools/projects/renovations/main.jpg",
      "/qldpools/projects/renovations/t1.jpg",
      "/qldpools/projects/renovations/t2.jpg",
    ],
  },
  {
    slug: "after-dark",
    title: "After Dark",
    location: "Sunshine Coast",
    badge: "Lighting & water features",
    type: "Evening Swims",
    images: [
      "/qldpools/projects/after-dark/main.jpg",
      "/qldpools/projects/after-dark/t1.jpg",
      "/qldpools/projects/after-dark/t2.jpg",
    ],
  },
];

export default function FeaturedProjects() {
  return (
    <div>
      {SHOWCASES.map((s, i) => (
        <ProjectShowcase key={s.slug} showcase={s} index={i} reveal={i === 0} />
      ))}
    </div>
  );
}
