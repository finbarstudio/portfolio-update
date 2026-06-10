import type { MetadataRoute } from "next";

/**
 * Web App Manifest. Lets the site be installed/saved to a home screen and gives
 * Android/Chrome a name, theme colour and icon set. Next.js auto-links this from
 * every page as `manifest.webmanifest`. Icons reference the generated PNG icon
 * routes (app/icon.tsx, app/apple-icon.tsx).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "finbar✶studio — Finbar Skitini",
    short_name: "finbar✶studio",
    description:
      "Brisbane-based graphic designer and Framer developer. Brand identity, web, publication and motion design.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAF8",
    theme_color: "#FAFAF8",
    lang: "en-AU",
    categories: ["design", "portfolio", "business"],
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
