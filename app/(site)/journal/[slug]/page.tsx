import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { jsonLdHtml } from "@/lib/json-ld";
import { sanityFetch } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";
import { POST_QUERY, POST_SLUGS_QUERY } from "@/sanity/queries";
import type { Post } from "@/sanity/types";
import PortableBody from "@/components/journal/PortableBody";
import { MdArrowBack } from "@/components/MaterialIcon";
import "../journal.css";

const SITE_URL = "https://www.finbar.studio";

export const revalidate = 86400;

export async function generateStaticParams() {
  const slugs = (await sanityFetch<{ slug: string }[]>(POST_SLUGS_QUERY)) ?? [];
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanityFetch<Post>(POST_QUERY, { slug });
  if (!post) return {};
  const title = post.seo?.title ?? post.title;
  const description = post.seo?.description ?? post.excerpt ?? undefined;
  const cover = urlForImage(post.coverImage);
  const ogImage = cover ? cover.width(1200).height(630).quality(82).url() : undefined;
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

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
}

export default async function JournalPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await sanityFetch<Post>(POST_QUERY, { slug });
  if (!post) notFound();

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
      <div className="jr-wrap">
        <article className="jr-article">
          <Link href="/journal" className="mono-label text-ink-soft u-underline jr-back inline-flex items-center gap-1">
            <MdArrowBack size={14} /> Journal
          </Link>
          <p className="jr-meta">{formatDate(post.publishedAt)}</p>
          <h1 className="jr-title" style={{ marginTop: "0.5rem" }}>{post.title}</h1>
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
