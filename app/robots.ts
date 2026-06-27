import type { MetadataRoute } from "next";
import { headers } from "next/headers";

const WWW = "https://www.finbar.studio";
const SANDBOX = "https://sandbox.finbar.studio";

/**
 * Host-aware robots. The Sandbox lives on its own subdomain (served from this
 * same app via proxy.ts), and search engines treat a subdomain as a separate
 * site — so sandbox.finbar.studio gets its OWN robots.txt pointing at its own
 * sitemap, rather than the www one. The noindex tool/embed pages are left
 * crawlable on purpose so bots can read their `noindex` meta.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host")?.split(":")[0].toLowerCase() || "";
  const base = host.startsWith("sandbox.") ? SANDBOX : WWW;
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
