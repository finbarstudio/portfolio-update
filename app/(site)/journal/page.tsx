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
const AUTHOR = "Finbar Skitini";

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
  const [featured, ...rest] = posts;
  const cover = featured ? urlForImage(featured.coverImage) : null;

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
      <div className="jr-index">
        <header className="jr-index-head">
          <h1 className="jr-index-title">Journal</h1>
        </header>

        {!featured ? (
          <p className="jr-empty">First entry coming soon.</p>
        ) : (
          <>
            {/* Most recent post: a central 50/50 card — cover on the left, the
                title/description centred in the space on the right, the date and
                byline settled at the bottom. */}
            <Link href={`/journal/${featured.slug}`} className="jr-featured" aria-label={featured.title}>
              <div className="jr-featured-img">
                {cover && (
                  <Image
                    src={cover.width(900).height(1100).quality(78).url()}
                    alt={featured.coverImage?.alt ?? ""}
                    fill
                    sizes="(max-width: 720px) 100vw, 540px"
                    priority
                  />
                )}
              </div>
              <div className="jr-featured-text">
                <div className="jr-featured-head">
                  <h2 className="jr-featured-title">{featured.title}</h2>
                  {featured.excerpt && <p className="jr-featured-desc">{featured.excerpt}</p>}
                </div>
                <div className="jr-featured-meta">
                  <p className="jr-featured-date">{formatDate(featured.publishedAt)}</p>
                  <p className="jr-featured-author">by {AUTHOR}</p>
                </div>
              </div>
            </Link>

            {rest.length > 0 && (
              <ul className="jr-more">
                {rest.map((p) => (
                  <li key={p._id}>
                    <Link href={`/journal/${p.slug}`} className="jr-more-link">
                      <span className="jr-more-title">{p.title}</span>
                      <span className="jr-more-date">{formatDate(p.publishedAt)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </>
  );
}
