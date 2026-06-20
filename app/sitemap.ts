import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";

const SITE_URL = "https://www.finbar.studio";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`,              lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/work`,          lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/web-design`,    lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/graphic-design`,lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/about`,         lastModified: now, changeFrequency: "yearly",  priority: 0.8 },
    { url: `${SITE_URL}/store`,   lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];

  // Every non-hidden project has a real /case-studies/<slug> page (generateStaticParams
  // builds them all, and gallery cards link to them), so index them all but the hidden ones.
  const projectRoutes: MetadataRoute.Sitemap = projects
    .filter((p) => !p.hidden)
    .map((p) => ({
      url: `${SITE_URL}/case-studies/${p.slug}`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.7,
    }));

  return [...staticRoutes, ...projectRoutes];
}
