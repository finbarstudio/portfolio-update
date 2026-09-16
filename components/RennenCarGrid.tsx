import { RENNEN_CARS } from "@/content/rennen-cars";

/**
 * RennenCarGrid — the Rennen Plus case study's car-thumbnail wall, built from
 * the site's own isolated thumbnails rather than a contact-sheet screenshot,
 * so it can use the width it has: ten across on a wide screen, four on a
 * phone, and fewer rows as the screen narrows (CSS in globals.css, .rp-cars).
 */
export default function RennenCarGrid() {
  return (
    <div className="rp-cars" role="list" aria-label="A selection of the cars in the Rennen Plus catalogue">
      {RENNEN_CARS.map((c) => (
        <div key={c.slug} className="rp-car" role="listitem">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={c.src} alt={c.label} loading="lazy" decoding="async" width={400} height={200} />
          <span>{c.label}</span>
        </div>
      ))}
    </div>
  );
}
