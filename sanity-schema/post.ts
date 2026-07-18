/**
 * The Journal `post` schema. Copy this verbatim into your NEW Sanity Studio
 * project (schemaTypes/post.ts) and register it in schemaTypes/index.ts.
 * The website reads exactly these field names — don't rename them.
 *
 * NOTE: this file lives in the website repo only as the source of truth to copy
 * from. It is NOT imported by the site (the site is read-only against Sanity)
 * and is excluded from the Next build.
 */
import { defineType, defineField, defineArrayMember } from "sanity";

export const post = defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      description: "One or two sentences. Shows on the index and as the search / social description.",
      type: "text",
      rows: 3,
      validation: (r) => r.max(260),
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "string", validation: (r) => r.required() }),
        defineField({ name: "caption", title: "Caption", type: "string" }),
      ],
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading", value: "h2" },
            { title: "Subheading", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [{ name: "href", type: "url", title: "URL", validation: (r: any) => r.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }) }],
              },
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt text", type: "string", validation: (r) => r.required() }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "seo",
      title: "SEO overrides (optional)",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "title", title: "Search title", type: "string" }),
        defineField({ name: "description", title: "Search description", type: "text", rows: 2 }),
      ],
    }),
  ],
  orderings: [
    { title: "Newest", name: "newest", by: [{ field: "publishedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "publishedAt", media: "coverImage" },
  },
});
