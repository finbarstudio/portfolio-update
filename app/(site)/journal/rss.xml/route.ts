import { sanityFetch } from "@/sanity/client";
import { POSTS_QUERY } from "@/sanity/queries";
import type { PostListItem } from "@/sanity/types";

// RSS 2.0 feed for the Journal, served at /journal/rss.xml. Rebuilt at most
// daily (and on the publish webhook, since it reads the same tagged fetch).
const SITE_URL = "https://www.finbar.studio";
export const revalidate = 86400;

function esc(s = "") {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function GET() {
  const posts = (await sanityFetch<PostListItem[]>(POSTS_QUERY)) ?? [];
  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE_URL}/journal/${p.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/journal/${p.slug}</guid>${
        p.publishedAt ? `\n      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>` : ""
      }${p.excerpt ? `\n      <description>${esc(p.excerpt)}</description>` : ""}
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Finbar Studio — Journal</title>
    <link>${SITE_URL}/journal</link>
    <description>Notes on web design, branding and building for the web.</description>
    <language>en-AU</language>
    <atom:link href="${SITE_URL}/journal/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
