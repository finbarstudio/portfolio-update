import type { Section } from "./kit";
import { optionsFooter2 } from "./options/footer2";
import { optionsCta2 } from "./options/cta2";
import { optionsFaq2 } from "./options/faq2";
import { optionsBlog2 } from "./options/blog2";
import { optionsTestimonials2 } from "./options/testimonials2";
import { optionsGallery2 } from "./options/gallery2";
import { optionsReviews2 } from "./options/reviews2";
import { optionsReviews } from "./options/reviews";
import { optionsServices } from "./options/services";
import { optionsServices2 } from "./options/services2";
import { optionsWhy } from "./options/why";
import { optionsWhyGrid } from "./options/why-grid";
import { optionsWhy2 } from "./options/why2";
import { optionsGallery } from "./options/gallery";
import { optionsTestimonials } from "./options/testimonials";
import { optionsBlog } from "./options/blog";
import { optionsFaq } from "./options/faq";
import { optionsCta } from "./options/cta";
import { optionsFooter } from "./options/footer";

/**
 * The section galleries, in the order the sections appear on their real home
 * page (qldpoolinstalls.com.au). Each slug gets its own picking route.
 */
export type Gallery = { slug: string; label: string; blurb: string; options: Section[] };

export const GALLERIES: Gallery[] = [
  { slug: "reviews", label: "Reviews strip", blurb: "The Google trust band under the hero (26-45 = wilder one-viewport set)", options: [...optionsReviews, ...optionsReviews2] },
  // 1-25 the safe first set; 26-45 the "go crazy" second batch, arches,
  // colonnades, marquees, fans, all locked to one 100vh viewport.
  { slug: "services", label: "Services", blurb: "Complete Pool Solutions, 9 services (26-45 = wilder one-viewport set)", options: [...optionsServices, ...optionsServices2] },
  // 1-25 the first set; 26-35 the horizontal-grid follow-up (big text + icons,
  // less scroll) Finbar asked for after reviewing 3 and 7; 36-55 the "go
  // crazy" second batch (monuments, seals, plinths, dials), one viewport.
  { slug: "why", label: "Why choose us", blurb: "The Proof, Not the Pitch (26-35 = horizontal grid, 36-55 = wilder one-viewport set)", options: [...optionsWhy, ...optionsWhyGrid, ...optionsWhy2] },
  { slug: "gallery", label: "Gallery", blurb: "Recent Pool Installations (26-45 = wilder one-viewport set)", options: [...optionsGallery, ...optionsGallery2] },
  { slug: "testimonials", label: "Testimonials", blurb: "What Our Customers Say (26-45 = wilder one-viewport set)", options: [...optionsTestimonials, ...optionsTestimonials2] },
  { slug: "blog", label: "Blog", blurb: "Latest Pool Insights & Projects (26-45 = wilder one-viewport set)", options: [...optionsBlog, ...optionsBlog2] },
  { slug: "faq", label: "FAQ", blurb: "Frequently Asked Questions, 8 Q&As (26-45 = wilder one-viewport set)", options: [...optionsFaq, ...optionsFaq2] },
  { slug: "cta", label: "Contact CTA", blurb: "Ready to Start Your Pool Project? (26-45 = wilder one-viewport set)", options: [...optionsCta, ...optionsCta2] },
  { slug: "footer", label: "Footer", blurb: "The site footer (26-45 = wilder one-viewport set)", options: [...optionsFooter, ...optionsFooter2] },
];

export const getGallery = (slug: string) => GALLERIES.find((g) => g.slug === slug);
