import type { PortableTextBlock } from "@portabletext/react";

/** A cover/inline image with the alt+caption our schema attaches. */
export interface CoverImage {
  asset?: { _ref: string };
  alt?: string;
  caption?: string;
}

export interface PostListItem {
  _id: string;
  title: string;
  slug: string;
  publishedAt?: string;
  excerpt?: string;
  coverImage?: CoverImage;
  tags?: string[];
}

export interface Post extends PostListItem {
  _updatedAt?: string;
  body?: PortableTextBlock[];
  seo?: { title?: string; description?: string };
}
