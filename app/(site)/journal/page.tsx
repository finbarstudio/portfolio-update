import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { jsonLdHtml } from "@/lib/json-ld";
import { sanityFetch } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";
import { POSTS_QUERY } from "@/sanity/queries";
import type { PostListItem } from "@/sanity/types";
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

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
}

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
      <div className="jr-wrap">
        <header className="jr-index-head">
          <p className="mono-label text-ink-soft">Journal</p>
          <h1 className="home-display-sm" style={{ marginTop: "0.5rem" }}>Thoughts, notes and work in progress</h1>
          <p className="jr-index-lede">
            Occasional writing on web design, branding and building for the web.
          </p>
        </header>

        {posts.length === 0 ? (
          <p className="jr-empty">No posts yet. Check back soon.</p>
        ) : (
          <div className="jr-list">
            {posts.map((post) => {
              const cover = urlForImage(post.coverImage);
              return (
                <article key={post._id} className="jr-card">
                  <Link href={`/journal/${post.slug}`} className="jr-card-cover" aria-label={post.title}>
                    {cover && (
                      <Image
                        src={cover.width(600).height(400).quality(75).url()}
                        alt={post.coverImage?.alt ?? ""}
                        width={600}
                        height={400}
                        sizes="(max-width: 720px) 100vw, 300px"
                      />
                    )}
                  </Link>
                  <div className="jr-card-body">
                    <p className="jr-meta">{formatDate(post.publishedAt)}</p>
                    <Link href={`/journal/${post.slug}`}>
                      <h2 className="jr-card-title" style={{ marginTop: "0.4rem" }}>{post.title}</h2>
                    </Link>
                    {post.excerpt && <p className="jr-card-excerpt">{post.excerpt}</p>}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
