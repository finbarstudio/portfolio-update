// The site-wide social card: the generated studio card at /opengraph-image.
//
// Next.js merges the `opengraph-image` file convention into a route's metadata
// ONLY when that route doesn't set its own `openGraph` object. Any page that
// declares `openGraph` (for a custom title/description) REPLACES the root one,
// so the generated card is dropped and `og:image` goes missing — then Facebook
// and Instagram scrape the biggest image on the page (a client screenshot).
// Every page that sets `openGraph` must therefore include this explicitly.
export const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Finbar Studio. Brisbane web and graphic design.",
} as const;
