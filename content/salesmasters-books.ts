import type { BookletBook } from "@/components/portfolio/PfBooklet";

/**
 * The Salesmasters playbooks, every page, for the booklet on the Salesmasters
 * case study (components/portfolio/PfBooklet.tsx). Pages are page-01.webp …
 * under public/media/images/portfolio/salesmasters/<slug>/, with small copies
 * in thumbs/. An odd page count means the back cover was exported facing the
 * last inside page; a blank leaf ("") goes in before it so the book still
 * closes on its back cover. Stars are page numbers in the FILES, from 1.
 */
function book(name: string, slug: string, count: number, stars?: number[]): BookletBook {
  const file = (i: number) => `page-${String(i + 1).padStart(2, "0")}.webp`;
  const order = Array.from({ length: count }, (_, i) => i);
  if (count % 2) order.splice(count - 1, 0, -1);
  return {
    name,
    pages: order.map((i) => (i < 0 ? "" : `/media/images/portfolio/salesmasters/${slug}/${file(i)}`)),
    thumbs: order.map((i) => (i < 0 ? "" : `/media/images/portfolio/salesmasters/${slug}/thumbs/${file(i)}`)),
    stars: stars?.map((n) => (n > count - 1 && count % 2 ? n + 1 : n)),
  };
}

export const SALESMASTERS_BOOKS: BookletBook[] = [
  book("Site Ware Direct", "site-ware-direct", 67, [1, 6, 8, 21, 23, 46, 67]),
  book("Alpha Lifecare", "alpha-lifecare", 68, [1, 6, 9, 23, 42, 55, 68]),
  book("Prescience", "prescience", 65, [1, 7, 8, 11, 21, 36, 56, 65]),
  book("Connected Platforms", "connected-platforms", 55, [1, 2, 6, 19, 49, 55]),
  book("Criterion", "criterion", 61, [1, 4, 6, 18, 30, 55, 61]),
  book("Active Medical", "active-medical", 58, [1, 6, 8, 17, 18, 41, 58]),
  book("Cutek", "cutek", 88, [1, 2, 6, 26, 37, 84, 88]),
  book("Bus4x4", "bus4x4", 62, [1, 5, 6, 8, 32, 40, 62]),
  book("All Storage Systems", "all-storage-systems", 77, [1, 2, 6, 13, 20, 53, 63, 77]),
];
