import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { projects } from "@/content/projects";

const WWW = "https://www.finbar.studio";
const SANDBOX = "https://sandbox.finbar.studio";

/**
 * Host-aware sitemap. On sandbox.finbar.studio it lists the Sandbox's own
 * indexable pages (the landing + the section indexes); the individual tools and
 * embeds are noindex so they're intentionally excluded. On www it lists the
 * portfolio. (Search engines treat the subdomain as a separate site.)
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const host = (await headers()).get("host")?.split(":")[0].toLowerCase() || "";

  if (host.startsWith("sandbox.")) {
    return [
      { url: `${SANDBOX}/`,        lastModified: now, changeFrequency: "weekly",  priority: 1 },
      { url: `${SANDBOX}/tools`,   lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
      { url: `${SANDBOX}/mockups`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
      { url: `${SANDBOX}/library`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ];
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${WWW}/`,               lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${WWW}/work`,           lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${WWW}/web-design`,     lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${WWW}/graphic-design`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${WWW}/about`,          lastModified: now, changeFrequency: "yearly",  priority: 0.8 },
    { url: `${WWW}/store`,          lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${WWW}/privacy`,        lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];

  // Every non-hidden project has a real /case-studies/<slug> page.
  const projectRoutes: MetadataRoute.Sitemap = projects
    .filter((p) => !p.hidden)
    .map((p) => ({
      url: `${WWW}/case-studies/${p.slug}`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.7,
    }));

  return [...staticRoutes, ...projectRoutes];
}
