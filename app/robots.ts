import type { MetadataRoute } from "next";
import { headers } from "next/headers";

const WWW = "https://www.finbar.studio";
const WEB = "https://web.finbar.studio";

/**
 * Host-aware robots. web.finbar lives on its own subdomain (served from this
 * same app via proxy.ts), and search engines treat a subdomain as a separate
 * site, so it gets its OWN robots.txt pointing at its own sitemap.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host")?.split(":")[0].toLowerCase() || "";
  const base = host.startsWith("web.") ? WEB : WWW;
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/downloads/"] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
