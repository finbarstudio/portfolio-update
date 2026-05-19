import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";

const SITE_URL = "https://finbar.studio";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`,        lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/about`,   lastModified: now, changeFrequency: "yearly",  priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "yearly",  priority: 0.8 },
  ];

  // Only projects with a real case study page get indexed (gallery tier has no page)
  const projectRoutes: MetadataRoute.Sitemap = projects
    .filter((p) => p.tier !== "gallery")
    .map((p) => ({
      url: `${SITE_URL}/work/${p.slug}`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.7,
    }));

  return [...staticRoutes, ...projectRoutes];
}
