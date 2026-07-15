import type { Section } from "./kit";
import { optionsReviews } from "./options/reviews";
import { optionsServices } from "./options/services";
import { optionsWhy } from "./options/why";
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
  { slug: "reviews", label: "Reviews strip", blurb: "The Google trust band under the hero", options: optionsReviews },
  { slug: "services", label: "Services", blurb: "Complete Pool Solutions, 9 services", options: optionsServices },
  { slug: "why", label: "Why choose us", blurb: "The Proof, Not the Pitch, 5 reasons", options: optionsWhy },
  { slug: "gallery", label: "Gallery", blurb: "Recent Pool Installations", options: optionsGallery },
  { slug: "testimonials", label: "Testimonials", blurb: "What Our Customers Say", options: optionsTestimonials },
  { slug: "blog", label: "Blog", blurb: "Latest Pool Insights & Projects", options: optionsBlog },
  { slug: "faq", label: "FAQ", blurb: "Frequently Asked Questions, 8 Q&As", options: optionsFaq },
  { slug: "cta", label: "Contact CTA", blurb: "Ready to Start Your Pool Project?", options: optionsCta },
  { slug: "footer", label: "Footer", blurb: "The site footer", options: optionsFooter },
];

export const getGallery = (slug: string) => GALLERIES.find((g) => g.slug === slug);
