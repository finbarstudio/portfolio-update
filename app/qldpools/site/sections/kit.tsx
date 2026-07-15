import type { ReactNode } from "react";

/**
 * Shared content kit for the QPI section galleries.
 * Every string here is REAL copy lifted from qldpoolinstalls.com.au (or their
 * Google reviews), so the demo options can be judged on design, not lorem.
 */

export const LOGO_WHITE = "/qldpools/logo-white.png";
export const LOGO_DARK = "/qldpools/logo.png";
export const HERO_SRC = "/qldpools/hero.jpg";

export const TAGLINE = "Queensland's Premium Pool Builders";
export const PHONE = "0423 123 248";
export const PHONE_HREF = "tel:+61423123248";
export const EMAIL = "poolsqld@gmail.com";

export const LICENCES = {
  qbcc: "QBCC Licence #15377435",
  nsw: "NSW Builders Licence #453 712C",
};

export const AREAS = [
  "Brisbane",
  "Gold Coast",
  "Sunshine Coast",
  "Ipswich",
  "Logan",
  "Moreton Bay",
  "Northern NSW",
];

/** Their real photos, already downscaled into public/qldpools/projects. */
export const GALLERY_IMGS = [
  "/qldpools/projects/fibreglass/main.jpg",
  "/qldpools/projects/concrete/main.jpg",
  "/qldpools/projects/family/main.jpg",
  "/qldpools/projects/renovations/main.jpg",
  "/qldpools/projects/after-dark/main.jpg",
  "/qldpools/projects/fibreglass/t1.jpg",
  "/qldpools/projects/concrete/t1.jpg",
  "/qldpools/projects/family/t1.jpg",
  "/qldpools/projects/renovations/t1.jpg",
  "/qldpools/projects/after-dark/t1.jpg",
  "/qldpools/projects/fibreglass/t2.jpg",
  "/qldpools/projects/concrete/t2.jpg",
  "/qldpools/projects/family/t2.jpg",
  "/qldpools/projects/renovations/t2.jpg",
  "/qldpools/projects/after-dark/t2.jpg",
];

/* ── Section 2 · Reviews strip (their Google widget) ───────── */
export const REVIEW_STATS = {
  kicker: "Verified Reviews",
  heading: "What Our Customers Say",
  sub: "Verified Google Reviews from happy pool owners across Queensland & Northern NSW",
  rating: "5.0",
  count: "41 reviews",
  word: "Excellent",
};

/* ── Section 3 · Services ──────────────────────────────────── */
export const SERVICES_INTRO = {
  kicker: "What We Offer",
  heading: "Complete Pool Solutions",
  sub: "From initial concept to final splash, we handle every aspect of your pool project across SE Queensland, with expertise and care.",
};

export const SERVICES = [
  { title: "Design Consultation", body: "Free consultation to understand your vision, assess your space, and create the perfect pool design." },
  { title: "Expert Installation", body: "Our QBCC-licensed team delivers precision installation with minimal disruption to your property across Brisbane, Gold Coast and Sunshine Coast." },
  { title: "Fibreglass Pools", body: "Premium fibreglass pool installation across Queensland. Factory-moulded shells installed in as little as one day, durable, low-maintenance, and stunning." },
  { title: "Concrete Pools", body: "Fully custom pools built to any shape, size, or specification you can imagine." },
  { title: "Pool Renovations", body: "Transform tired, dated pools with resurfacing, retiling, equipment upgrades, and modern makeovers." },
  { title: "Landscaping", body: "Complete backyard transformations including paving, decking, fencing, and tropical gardens." },
  { title: "Custom Colours", body: "Choose from our premium colour range to match your pool perfectly with your home and landscape." },
  { title: "Pool Equipment", body: "Top-quality pumps, filters, heating systems, and automation from leading Australian brands." },
  { title: "Ongoing Support", body: "Lifetime manufacturer's warranty on fibreglass pool shells. QBCC statutory warranty on all workmanship." },
];

/** Their 4-step process (useful for services/why layouts). */
export const PROCESS = [
  { step: "01", title: "Consultation", body: "Free design consultation at your home" },
  { step: "02", title: "Design", body: "3D renders and detailed quote" },
  { step: "03", title: "Installation", body: "Professional pool installation" },
  { step: "04", title: "Enjoy", body: "Your backyard paradise awaits" },
];

/* ── Section 4 · Why choose us ─────────────────────────────── */
export const WHY_INTRO = {
  kicker: "Why Choose Us",
  heading: "The Proof, Not the Pitch",
  sub: "Specific, verifiable reasons SEQ homeowners pick QLD Pool Installs over the other quotes on their kitchen table.",
};

export const REASONS = [
  { title: "Fully Licensed, QBCC & NSW", body: "QBCC Licence #15377435 and NSW Builders Licence #453 712C. Every build is signed off by a licensed builder, fully insured, and compliant with Australian Standard AS 1926 pool safety requirements." },
  { title: "2,500+ Pools Installed", body: "Over 20 years and more than 2,500 completed pool installations across South East Queensland and Northern NSW, fibreglass and concrete, new builds and full renovations." },
  { title: "Fixed-Price Guarantee", body: "The number on your quote is the number you pay. No surprise variations for rock, soil removal, council fees or standard site access, itemised upfront, locked in writing." },
  { title: "We Handle Every Council Approval", body: "Brisbane City, Gold Coast, Sunshine Coast, Logan, Ipswich, Tweed and Byron. We lodge the building application, pool safety certification and Form 16/21 on your behalf." },
  { title: "Genuine Manufacturer Warranties", body: "Structural warranty on fibreglass shells up to 25 years, 10-year structural warranty on concrete builds, and 12-month workmanship warranty on every install, in writing, before you sign." },
];

/* ── Section 5 · Gallery ───────────────────────────────────── */
export const GALLERY_INTRO = {
  kicker: "Our Work",
  heading: "Recent Pool Installations",
  sub: "A glimpse of the pools we have installed across Queensland.",
  cta: "View Full Gallery",
};

/* ── Section 6 · Testimonials (verbatim Google reviews) ────── */
export const TESTIMONIALS_INTRO = {
  kicker: "Testimonials",
  heading: "What Our Customers Say",
  sub: "Hear from the families enjoying their QLD Pool Installs swimming pools.",
};

export const TESTIMONIALS = [
  { quote: "Most efficient builder we could have found. Council approvals expressed. Excavator arrived on a Sunday. Pool delivered on Wednesday and crane on Friday to drop it in the hole. We were swimming in the pool before Xmas day.", name: "Andrew Booth", short: "We were swimming in the pool before Xmas day." },
  { quote: "I couldn't have asked for better service. This was my first time having a pool installed and it was completely stress free. Everything was explained in detail and lots of advice given on next steps and future care.", name: "Sharmaine Garwood", short: "It was completely stress free." },
  { quote: "Soren and his team did an incredible job on the install of our plunge pool. His pricing was a lot better than all the others I spoke to and he turned up exactly when he said he would. We are thrilled with the finish!", name: "Sean S", short: "We are thrilled with the finish!" },
  { quote: "100 percent satisfied. Completely professional. Great communication. Does what they say they will do and at the time scheduled. Was able to answer any questions and always responded to phone calls and texts.", name: "Dion Stubbs", short: "100 percent satisfied. Completely professional." },
  { quote: "From our first contact, he took the time to understand my requirements and offered suitable options. His team was meticulous in their measurements; the job was seamless, and Soren's communication was outstanding.", name: "Cathy W", short: "The job was seamless." },
  { quote: "We had a fibreglass pool installed by Soren and his team. Very happy with the process and the quality. The team were punctual and friendly. Highly recommend for your next pool install!", name: "Manny Kovacs", short: "Punctual, friendly, highly recommend." },
];

/* ── Section 7 · Blog ──────────────────────────────────────── */
export const BLOG_INTRO = {
  kicker: "From the Blog",
  heading: "Latest Pool Insights & Projects",
  sub: "Real project showcases, expert advice, and the latest news from Queensland's trusted pool builders.",
};

export const POSTS = [
  { tag: "Project", title: "Fibreglass Pool Installation in Redland Bay, 5m x 4m Plunge Pool Project", body: "A behind-the-scenes look at our recent 5m x 4m fibreglass pool installation in Redland Bay, Queensland.", img: GALLERY_IMGS[0] },
  { tag: "Guide", title: "How Much Does a Pool Cost in Brisbane? 2026 Complete Guide", body: "Real 2026 pool prices in Brisbane. Fibreglass pools from $40,000 and concrete pools from $45,000 fully installed.", img: GALLERY_IMGS[1] },
  { tag: "Guide", title: "Fibreglass vs Concrete Pools: Which is Right for South East Queensland?", body: "Comparing fibreglass and concrete pools for Queensland homeowners. Real pricing, installation times and maintenance costs.", img: GALLERY_IMGS[2] },
  { tag: "Guide", title: "Best Pool Shapes for Your Backyard: A Complete Guide", body: "From kidney to rectangular, plunge to lap pools, find the perfect pool shape for your Brisbane or Gold Coast backyard.", img: GALLERY_IMGS[3] },
];

/* ── Section 8 · FAQ (their real questions + answers) ───────── */
export const FAQ_INTRO = {
  heading: "Frequently Asked Questions",
  sub: "Get answers to common questions about pool installation, costs, and our services in Queensland.",
};

export const FAQS = [
  { q: "How long does it take to install a fibreglass pool?", a: "A typical fibreglass pool installation takes 2 to 4 weeks from excavation to completion. This includes site preparation, pool shell delivery and placement, plumbing, electrical work, and finishing touches like paving and fencing." },
  { q: "What is the cost of a fibreglass pool in Queensland?", a: "Fibreglass pool costs in Queensland typically range from $35,000 to $75,000 depending on pool size, shape, site conditions, and additional features such as heating, lighting, and landscaping." },
  { q: "Do you offer a warranty on pool installations?", a: "Lifetime manufacturer's warranty on fibreglass pool shells. QBCC statutory warranty on all workmanship." },
  { q: "What areas are pools installed across in Queensland?", a: "Pool installation is available across South East Queensland including Brisbane, Gold Coast, Sunshine Coast, Ipswich, Logan, Moreton Bay, and Northern NSW." },
  { q: "How much space do I need for a pool?", a: "Generally, at least 1 to 2 metres clearance around the pool is required for council regulations and access. Pool models range from 4 metres to over 12 metres in length to suit various yard sizes." },
  { q: "Are fibreglass pools better than concrete pools?", a: "Both pool types have advantages. Fibreglass pools offer faster installation, lower maintenance, smooth non-porous surfaces, and excellent durability. Concrete pools offer unlimited customisation in shape and size." },
  { q: "Do I need council approval for a pool?", a: "Yes, swimming pool installations in Queensland require council approval and must comply with pool safety regulations under the Building Act 1975 and the Queensland Development Code MP 3.4." },
  { q: "Can an existing pool be renovated?", a: "Yes. Pool renovations include resurfacing, retiling, equipment upgrades, and complete makeovers. Both cosmetic updates and structural repairs are commonly undertaken." },
];

/* ── Section 9 · Contact CTA ───────────────────────────────── */
export const CTA = {
  kicker: "Get in Touch",
  heading: "Ready to Start Your Pool Project?",
  sub: "Request your free, no-obligation quote today. Our team will visit your property, discuss your vision, and give you a fixed price in writing.",
  button: "Request Free Quote",
  fields: ["Name", "Phone", "Email", "Suburb"],
};

/* ── Section 10 · Footer ───────────────────────────────────── */
export const FOOTER = {
  blurb: "Creating stunning swimming pools for Queensland families since 2004.",
  warranty: "Lifetime manufacturer's warranty on fibreglass pool shells. QBCC statutory structural warranty on all workmanship.",
  nav: ["Pool Range", "Concrete Pools", "Renovations", "Gallery", "Reviews", "Blog"],
};

/** One design option: a short name + the section node. */
export type Section = { name: string; node: ReactNode };
