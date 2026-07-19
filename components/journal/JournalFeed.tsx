import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/sanity/image";
import type { PostListItem } from "@/sanity/types";

// The shared journal layout: a big serif title, the most recent post as a
// central 50/50 card, then the rest as a quiet list. Used by the index
// (title "Journal") and by every tag page (title = the tag).
const AUTHOR = "Finbar Skitini";

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
}

export default function JournalFeed({
  title,
  posts,
  emptyLabel = "Nothing here yet.",
}: {
  title: string;
  posts: PostListItem[];
  emptyLabel?: string;
}) {
  const [featured, ...rest] = posts;
  const cover = featured ? urlForImage(featured.coverImage) : null;

  return (
    <div className="jr-index">
      <header className="jr-index-head">
        <h1 className="jr-index-title">{title}</h1>
      </header>

      {!featured ? (
        <p className="jr-empty">{emptyLabel}</p>
      ) : (
        <>
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
                <span className="jr-featured-more">Read more</span>
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
  );
}
