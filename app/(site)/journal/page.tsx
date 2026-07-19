import type { Metadata } from "next";
import { jsonLdHtml } from "@/lib/json-ld";
import { sanityFetch } from "@/sanity/client";
import { POSTS_QUERY } from "@/sanity/queries";
import type { PostListItem } from "@/sanity/types";
import JournalFeed from "@/components/journal/JournalFeed";
import "./journal.css";

const SITE_URL = "https://www.finbar.studio";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Notes on web design, branding and building for the web, from Finbar Studio, a Brisbane web designer working across Australia and the UK.",
  alternates: { canonical: "/journal" },
  openGraph: {
    title: "Journal | Finbar Studio",
    description: "Notes on web design, branding and building for the web.",
    url: `${SITE_URL}/journal`,
    type: "website",
  },
};

// Refetch at most daily even if a publish webhook is missed; the webhook
// (revalidateTag "post") is the real freshness path.
export const revalidate = 86400;

export default async function JournalPage() {
  const posts = (await sanityFetch<PostListItem[]>(POSTS_QUERY)) ?? [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/journal#blog`,
    url: `${SITE_URL}/journal`,
    name: "Finbar Studio Journal",
    inLanguage: "en-AU",
    publisher: { "@id": `${SITE_URL}/#studio` },
    blogPost: posts.slice(0, 20).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${SITE_URL}/journal/${p.slug}`,
      datePublished: p.publishedAt,
    })),
  };

  return (
    <>
      {/* Plain inline script (not next/script) so the schema is in the server
          HTML for crawlers — next/script injects post-hydration. */}
      <script id="ld-journal" type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(jsonLd) }} />
      <JournalFeed title="Journal" posts={posts} emptyLabel="First entry coming soon." />
    </>
  );
}
