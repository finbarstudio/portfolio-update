/**
 * Store product content.
 *
 * `handle` must match the product's handle in Shopify (Products → your product →
 * the end of its URL). Set SHOPIFY_PRODUCT_HANDLE in env to override without a
 * code change.
 *
 * The `fallback` fields are only used for the "coming soon" state before Shopify
 * is connected (or if a fetch fails). Once the store is live, the title, price,
 * description and image all come from Shopify — edit them there, not here.
 *
 * EDIT the fallback copy below to describe the plugin before launch.
 */

export const STORE_PRODUCT = {
  handle: process.env.SHOPIFY_PRODUCT_HANDLE ?? "photoshop-plugin",

  fallback: {
    name: "Photoshop Plugin",
    tagline: "A studio tool for Photoshop",
    // EDIT: a couple of plain sentences about what the plugin does.
    blurb:
      "A Photoshop plugin built in the studio, drawn from real client work. Full details and pricing are on the way.",
    priceLabel: "", // e.g. "$29" — leave blank to hide until live
    image: "/images/store/plugin.webp", // optional preview image (ok if missing)
    features: [
      // EDIT: a few short feature lines.
      "Works with recent versions of Photoshop",
      "One-time purchase, instant download",
      "Free updates",
    ],
  },
};
