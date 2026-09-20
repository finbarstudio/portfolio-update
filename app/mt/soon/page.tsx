import type { Metadata } from "next";
import content from "@/content/moto-technique";

/**
 * Where every link on the demo lands for now: one screen, no scrolling, saying
 * that page is still to be built and who is building it. It shares the /mt
 * shell (fonts, stylesheet) but none of the home page's furniture.
 */
export const metadata: Metadata = {
  title: { absolute: "To be built | Moto Technique" },
  robots: { index: false, follow: false },
};

export default function MotoTechniqueSoon() {
  const { soon, site } = content;
  return (
    <main className="mt-soon" data-tone="light">
      <a href={site.home} className="mt-soon-back">
        {site.name}
      </a>

      <div className="mt-soon-say">
        <h1 className="mt-title">{soon.heading}</h1>
        <p>{soon.body}</p>
      </div>

      <address className="mt-soon-studio">
        <span className="mt-eyebrow">{soon.by}</span>
        <a href={`mailto:${soon.email}`}>{soon.email}</a>
        <a href={soon.phoneHref}>{soon.phone}</a>
        <a href={soon.web.href}>{soon.web.label}</a>
      </address>
    </main>
  );
}
