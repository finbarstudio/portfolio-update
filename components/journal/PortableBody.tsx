import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { urlForImage } from "@/sanity/image";
import type { CoverImage } from "@/sanity/types";
import Caption from "./Caption";

/**
 * Renders a post's Portable Text body into the studio's four-colour system.
 * Block-level rhythm lives in journal.css (.jr-prose); this maps each node to
 * the right token/class:
 *   h2 → brand-dark section title, h3 → ink, p → ink body, blockquote → the
 *   canonical .quote-box treatment, links → pink, images → next/image (Vercel-
 *   cached) with an ink-soft caption. Alt text is required on images (a11y).
 */

function BodyImage({ value }: { value: CoverImage }) {
  const b = urlForImage(value);
  if (!b) return null;
  const src = b.width(1600).quality(82).url();
  return (
    <figure className="jr-figure">
      {/* Sized to the article measure; height auto via the 16/9-ish intrinsic. */}
      <Image
        src={src}
        alt={value.alt ?? ""}
        width={1600}
        height={1000}
        sizes="(max-width: 760px) 100vw, 720px"
        className="jr-figure-img"
      />
      {value.caption && (
        <figcaption className="jr-caption">
          <Caption text={value.caption} />
        </figcaption>
      )}
    </figure>
  );
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="jr-p">{children}</p>,
    h2: ({ children }) => <h2 className="jr-h2 display-brand">{children}</h2>,
    h3: ({ children }) => <h3 className="jr-h3">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="quote-box jr-quote">
        <span aria-hidden="true" className="quote-box-mark">&ldquo;</span>
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="jr-ul">{children}</ul>,
    number: ({ children }) => <ol className="jr-ol">{children}</ol>,
  },
  marks: {
    link: ({ children, value }) => {
      // Scheme allowlist: CMS-authored hrefs only ever render as http(s),
      // relative, hash or mailto links — anything else (javascript:, data:)
      // falls back to plain text.
      const raw = value?.href ?? "#";
      const safe = /^(https?:\/\/|\/|#|mailto:)/i.test(raw);
      if (!safe) return <>{children}</>;
      const href = raw;
      const external = /^https?:\/\//.test(href);
      return external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="jr-link">{children}</a>
      ) : (
        <Link href={href} className="jr-link">{children}</Link>
      );
    },
  },
  types: {
    image: ({ value }) => <BodyImage value={value as CoverImage} />,
  },
};

export default function PortableBody({ value }: { value: PortableTextBlock[] }) {
  return (
    <div className="jr-prose">
      <PortableText value={value} components={components} />
    </div>
  );
}
