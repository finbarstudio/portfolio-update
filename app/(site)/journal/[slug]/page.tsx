import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { jsonLdHtml } from "@/lib/json-ld";
import { sanityFetch } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";
import { POST_QUERY, POSTS_QUERY } from "@/sanity/queries";
import type { Post, PostListItem } from "@/sanity/types";
import PortableBody from "@/components/journal/PortableBody";
import JournalFeed from "@/components/journal/JournalFeed";
import "../journal.css";

/**
 * One dynamic route serving BOTH a post and a tag, because /journal/<post-slug>
 * and /journal/<tag> share the same URL space. Resolution order: if the slug
 * matches a published post, render the post; otherwise if it matches a tag
 * (slugified), render that tag's journal feed; otherwise 404. New tags in
 * Sanity get their own page automatically (generateStaticParams + on-demand).
 */

const SITE_URL = "https://www.finbar.studio";
const AUTHOR = "Finbar Skitini";

const slugifyTag = (t: string) =>
  t.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// The original (display) tag whose slug matches, or null if no tag matches.
function tagNameForSlug(posts: PostListItem[], slug: string): string | null {
  for (const p of posts) for (const t of p.tags ?? []) if (slugifyTag(t) === slug) return t;
  return null;
}

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
}

export const revalidate = 86400;

export async function generateStaticParams() {
  const posts = (await sanityFetch<PostListItem[]>(POSTS_QUERY)) ?? [];
  const slugs = new Set<string>();
  for (const p of posts) {
    if (p.slug) slugs.add(p.slug);
    for (const t of p.tags ?? []) { const s = slugifyTag(t); if (s) slugs.add(s); }
  }
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanityFetch<Post>(POST_QUERY, { slug });
  if (post) {
    const title = post.seo?.title ?? post.title;
    const description = post.seo?.description ?? post.excerpt ?? undefined;
    const cover = urlForImage(post.coverImage);
    // Force a static JPG: GIF covers preview as a frozen/inconsistent frame on
    // Facebook + LinkedIn. A flat 1200x630 JPG previews reliably everywhere.
    const ogImage = cover ? cover.width(1200).height(630).quality(82).format("jpg").url() : undefined;
    return {
      title,
      description,
      alternates: { canonical: `/journal/${post.slug}` },
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/journal/${post.slug}`,
        type: "article",
        publishedTime: post.publishedAt,
        ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
      },
      twitter: { card: "summary_large_image", title, description },
    };
  }
  // Tag page.
  const all = (await sanityFetch<PostListItem[]>(POSTS_QUERY)) ?? [];
  const tagName = tagNameForSlug(all, slug);
  if (tagName) {
    return {
      title: tagName,
      description: `Journal posts tagged ${tagName}, from Finbar Studio — a Brisbane web designer.`,
      alternates: { canonical: `/journal/${slug}` },
      openGraph: {
        title: `${tagName} — Journal | Finbar Studio`,
        description: `Journal posts tagged ${tagName}.`,
        url: `${SITE_URL}/journal/${slug}`,
        type: "website",
      },
    };
  }
  return {};
}

export default async function JournalSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await sanityFetch<Post>(POST_QUERY, { slug });

  // ── Tag page: the slug isn't a post, so treat it as a tag ──────────────────
  if (!post) {
    const all = (await sanityFetch<PostListItem[]>(POSTS_QUERY)) ?? [];
    const tagName = tagNameForSlug(all, slug);
    if (!tagName) notFound();
    const tagPosts = all.filter((p) => (p.tags ?? []).some((t) => slugifyTag(t) === slug));
    const tagJsonLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${SITE_URL}/journal/${slug}#page`,
      url: `${SITE_URL}/journal/${slug}`,
      name: `${tagName} — Finbar Studio Journal`,
      isPartOf: { "@id": `${SITE_URL}/journal#blog` },
      inLanguage: "en-AU",
      hasPart: tagPosts.slice(0, 20).map((p) => ({
        "@type": "BlogPosting",
        headline: p.title,
        url: `${SITE_URL}/journal/${p.slug}`,
        datePublished: p.publishedAt,
      })),
    };
    return (
      <>
        <script id="ld-journal-tag" type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(tagJsonLd) }} />
        <JournalFeed title={tagName} posts={tagPosts} emptyLabel={`No posts tagged ${tagName} yet.`} />
      </>
    );
  }

  // ── Post page ──────────────────────────────────────────────────────────────
  const cover = urlForImage(post.coverImage);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${SITE_URL}/journal/${post.slug}#post`,
    headline: post.title,
    description: post.excerpt,
    url: `${SITE_URL}/journal/${post.slug}`,
    datePublished: post.publishedAt,
    dateModified: post._updatedAt,
    inLanguage: "en-AU",
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#studio` },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/journal/${post.slug}` },
    ...(cover ? { image: cover.width(1200).height(630).url() } : {}),
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Journal", item: `${SITE_URL}/journal` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}/journal/${post.slug}` },
    ],
  };

  return (
    <>
      <script id="ld-post" type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(jsonLd) }} />
      <script id="ld-post-crumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(breadcrumb) }} />
      <div className="jr-post">
        {/* Sticky left margin: a plain "Back" plus a small info panel that stays
            put while the article scrolls. */}
        <aside className="jr-rail">
          <Link href="/journal" className="jr-rail-back">Back</Link>
          <dl className="jr-rail-info">
            <div className="jr-rail-row jr-rail-title">
              <dt>Title</dt>
              <dd>{post.title}</dd>
            </div>
            <div className="jr-rail-row">
              <dt>Date</dt>
              <dd>{formatDate(post.publishedAt)}</dd>
            </div>
            <div className="jr-rail-row">
              <dt>Author</dt>
              <dd>{AUTHOR}</dd>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="jr-rail-row">
                <dt>Tags</dt>
                <dd>
                  {post.tags.map((t, i) => (
                    <span key={t}>
                      {/* Every tag links to its own /journal/<tag> page. */}
                      <Link href={`/journal/${slugifyTag(t)}`} className="u-underline">{t}</Link>
                      {i < post.tags!.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </aside>

        <article className="jr-article">
          <h1 className="jr-title">{post.title}</h1>
          {post.excerpt && <p className="jr-lede">{post.excerpt}</p>}
          {cover && (
            <div className="jr-hero">
              <Image
                src={cover.width(1600).height(900).quality(82).url()}
                alt={post.coverImage?.alt ?? ""}
                width={1600}
                height={900}
                sizes="(max-width: 820px) 100vw, 820px"
                priority
              />
            </div>
          )}
          {post.body && post.body.length > 0 && <PortableBody value={post.body} />}
        </article>
      </div>
    </>
  );
}
