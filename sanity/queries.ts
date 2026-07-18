/**
 * GROQ for the Journal. Published, non-draft posts only (a public dataset never
 * returns drafts to an unauthenticated reader anyway; the path() guard is belt
 * and braces). Newest first.
 */

export const POSTS_QUERY = `*[
  _type == "post" && defined(slug.current) && !(_id in path("drafts.**"))
] | order(publishedAt desc){
  _id, title, "slug": slug.current, publishedAt, excerpt, coverImage, tags
}`;

export const POST_QUERY = `*[
  _type == "post" && slug.current == $slug && !(_id in path("drafts.**"))
][0]{
  _id, title, "slug": slug.current, publishedAt, _updatedAt, excerpt,
  coverImage, body, tags, seo
}`;

export const POST_SLUGS_QUERY = `*[
  _type == "post" && defined(slug.current) && !(_id in path("drafts.**"))
]{ "slug": slug.current, _updatedAt }`;
