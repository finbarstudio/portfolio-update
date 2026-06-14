/**
 * Store product content.
 *
 * Once Lemon Squeezy is connected (LEMONSQUEEZY_* env vars), the name, price and
 * description come from there. The `fallback` fields below are only used for the
 * "coming soon" state before launch (or if a fetch fails).
 *
 * EDIT the fallback copy to describe the plugin before launch.
 */

export const STORE_PRODUCT = {
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
