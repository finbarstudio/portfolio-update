import { mediaDeep } from "@/lib/media";

/**
 * Moto Technique demo — ALL page content.
 *
 * Every string, image and link on the demo comes from this file, so the page is
 * a renderer with nothing hard-coded. Reordering `hero` reorders the hero
 * slides and the thumbnails under them; adding a discipline adds a card. This
 * is the shape a CMS would hold, so Kevin can be handed the editor later
 * without the page being rebuilt.
 *
 * COPY RULE: text marked "verbatim" is Kevin's own wording, lifted from
 * mototechnique.com on 18 Sep 2026. Do not rewrite it, correct its punctuation
 * or tidy its capitalisation. Photo credits stay with their photo.
 */

const img = (name: string) => `/media/images/moto-technique/${name}.webp`;

export type HeroSlide = {
  id: string;
  /** The car, as Kevin names it. */
  car: string;
  /** Short line over the photo. Verbatim where possible. */
  line: string;
  image: string;
  /** Photographer, shown small. */
  credit?: string;
};

/**
 * The hero rotation: six frames of the one car, the ex-David Lee Dino 246 GTS
 * Evo that Moto Technique built and that sold for $1,106,000.
 *
 * All six are Moto Technique's own photographs, taken off their site. The
 * auction listing has more angles of the same car, but those were shot for the
 * auction and belong to whoever took them, so they stay off a site we are
 * pitching. Replace this list and the hero is a different car.
 */
export const hero: HeroSlide[] = [
  {
    id: "dino-profile",
    car: "Dino 246 GTS",
    line: "A Ferrari 3.6 litre V8 in a Dino 246 GTS. 400bhp, built in-house.",
    image: img("dino36-profile"),
    credit: "Jayson Fong",
  },
  {
    id: "dino-moving",
    car: "Dino 246 GTS",
    line: "The Moto Technique Dino 3.6 Litre V8 Restomod.",
    image: img("dino36-rear-moving"),
    credit: "Jayson Fong",
  },
  {
    id: "dino-perspex",
    car: "Dino 246 GTS",
    line: "If you're going to drop a 400bhp Ferrari V8 engine into a Dino, its nice to be able to see it.",
    image: img("dino36-perspex"),
    credit: "Jayson Fong",
  },
  {
    id: "dino-rear",
    car: "Dino 246 GTS",
    line: "Snap exhaust system, a tip of the hat to the legendary Dino.",
    image: img("dino36-rear-leafs"),
    credit: "Jayson Fong",
  },
  {
    id: "dino-wheels",
    car: "Dino 246 GTS",
    line: "Fixing-free headlight covers and 17 inch Campagnolo wheels.",
    image: img("dino36-lens-wheels"),
    credit: "Jayson Fong",
  },
  {
    id: "dino-interior",
    car: "Dino 246 GTS",
    line: "Stunning red leather interior to Chairs and Flares specification.",
    image: img("dino36-interior"),
    credit: "Jayson Fong",
  },
];

/** Credentials under the hero line. Real, checkable claims only. */
export const marks = {
  laurel: { mark: "40", body: "Established", label: "1980" },
  /** Verbatim from the home page: "...projects from all over the UK, Europe, Asia and North America." */
  regions: [
    { id: "uk", label: "UK" },
    { id: "eu", label: "Europe" },
    { id: "asia", label: "Asia" },
    { id: "usa", label: "North America" },
  ],
};

/** The Dino sale. Figures supplied by Kevin O'Rourke, 18 Sep 2026. */
export const sale = {
  eyebrow: "Sold at auction",
  price: "$1,106,000",
  headline: "The Dino the factory should have built",
  /** Jay Leno, transcribed from the testimonial card on mototechnique.com. */
  quote:
    "This is as nice a restomod as I've ever seen... It's such a Brilliant Car. This is the car the factory should have built",
  quoteBy: "Jay Leno",
  body: "The ex-David Lee Dino 246 GTS Evo, upgraded by Moto Technique to a 3.6 litre Ferrari V8, sold on Bring a Trailer on 25 June 2026 for $1,106,000.",
  lot: "Lot #248,947",
  image: img("dino36-rear-moving"),
  credit: "Jayson Fong",
  links: [
    { label: "The auction", href: "https://bringatrailer.com/listing/1972-ferrari-dino-246-gts-15/" },
    { label: "Jay Leno's Garage", href: "https://www.youtube.com/watch?v=qnt0DNqJYvM" },
  ],
};

/** Kevin's own words on what a restomod is. Verbatim from /upgrades. */
export const restomod = {
  heading: "Restomods & Upgrades",
  quote:
    "If you could take a classic sports car and improve it in every single way possible, with more power, better handling, superior braking and reliability, whilst retaining all the charm and character of the original.... Why wouldn't you?",
  quoteBy: "Kevin O'Rourke",
  body: [
    "Some of the most beautiful and original sports cars ever produced from the 1950' 60's and 70's are now getting on a bit. Their beauty and originality can never be questioned, but technology has moved on over the past few decades since they were first designed and built.",
    "We can claim to have probably restored more Dino 246's than anyone else in the UK to concours condition and including to Ferrari Classiche standards when requested.",
  ],
  /** The three evo cars, in the order Kevin built them. */
  cars: [
    {
      name: "Dino 246 GTS",
      spec: "Ferrari 3.2 litre V8, 300bhp",
      note: "The prototype. Featured on Petrolicious.",
      image: img("dino32-proto"),
    },
    {
      name: "Dino 246 GTS",
      spec: "Ferrari 3.6 litre V8, 400bhp",
      note: "Built for David Lee, with a perspex engine cover.",
      image: img("dino36-perspex"),
    },
    {
      name: "Ferrari 308 GTB",
      spec: "Ferrari V8 Stage 2, 3.8 litres",
      note: "Power, handling, braking and engine management.",
      image: img("f308-stance"),
    },
  ],
};

/** The six disciplines, with Kevin's own captions. All verbatim. */
export const disciplines = [
  {
    name: "Restomods & Upgrades",
    caption:
      "Ferrari 308 GTB with full ground-up Restomod and upgraded Ferrari V8 (Stage 2) Engine by Moto Technique.",
    image: img("f308-hero"),
    credit: "Jayson Fong",
  },
  {
    name: "Mechanical",
    caption:
      "Ferrari V8 Engine 3.8 litres (Stage 2) with MOTEC ECU. More Power, More Torque and Reliability as standard.",
    image: img("v8-38-engine"),
  },
  {
    name: "Bodywork",
    caption: "Mercedes 300SL Gullwing - Full ground-up restoration to Concours Winning standard",
    image: img("gullwing-ext"),
  },
  {
    name: "Paintwork",
    caption: "Ferrari Dino 246 GTS Finished in flawless Candy Apple Red. Totally stunning",
    image: img("dino-candy-red"),
  },
  {
    name: "Interior trim",
    caption: "Ferrari 250 TDF Trimmed in Connolly Leather",
    image: img("trim-tdf"),
  },
  {
    name: "Hi-Tech",
    caption: "Ferrari F40LM/GTE Upgraded to 720BHP",
    image: img("f40lm-720"),
  },
];

/** The workshop beat. Verbatim from /about-us and /home. */
export const workshop = {
  heading: "Everything under one roof",
  body: [
    "Established in 1980 and celebrating 40 years in business in 2020, Moto Technique are at the forefront of classic and sports car restoration and engineering excellence with an international reputation for quality work and innovation.",
    "With all work being carried out in-house and under one roof, the highly skilled team of artisan panel beaters, paint sprayers, fitters, mechanics and Hi-tech technicians married to the incredible experience and knowledge gained over many decades makes Moto Technique the one stop shop that you can trust to give your classic sports car the restoration or repair it deserves.",
  ],
  image: img("workshop"),
  credit: "Jayson Fong",
  portrait: img("kevin-250-enzo"),
  portraitCaption: "Kevin O'Rourke, founder and owner of Moto Technique Limited.",
};

/**
 * Testimonials. Transcribed from the quote cards on /testimonials, which are
 * pictures with the words baked in, so nobody can search or select them today.
 */
export const testimonials = [
  {
    quote:
      "It's very rare in life that you can find somebody who can turn your dreams and aspirations into reality.... the sheer skill and technical know how at Moto Technique is staggering, with a 'Can Do' attitude... they listen very carefully, and then find a way to always exceed expectations",
    by: "Mark Cody",
    context: "Iso Grifo Mk2",
    image: img("iso-glory"),
    credit: "Jayson Fong",
  },
  {
    quote:
      "My 250 SWB went into Moto Technique as a lovable wreck, and emerged 12 months later as the beautiful eye watering gem of a Ferrari that it is today. The skill and craftsmanship of everyone at Moto Technique beggars belief... Just THE BEST",
    by: "Alan Cosby",
    context: "Ferrari 250 GT SWB",
    image: img("swb-workshop"),
    credit: "Rupert Phillips",
  },
  {
    quote: "With a motor car of this magnitude, the best in the business were called upon to work their magic",
    by: "Robert Coucher",
    context: "Octane magazine, on the Ferrari 250 GTO",
    image: img("gto-restored"),
  },
  {
    quote: "A unique spec boosted power to 720bhp and a top speed of 230mph... like riding a firework",
    by: "Richard Meaden",
    context: "Evo magazine, on the Ferrari F40LM / GTE",
    image: img("f40lm-anglesey"),
  },
];

/** Contact details, verbatim from /contact-us. */
export const contact = {
  name: "Moto Technique Limited",
  address: ["141 Molsey Avenue", "West Molesey", "KT8 2RY", "Surrey", "United Kingdom"],
  phone: "+44 (0) 208 941 3510",
  phoneHref: "tel:+442089413510",
  email: "kevin@mototechnique.com",
  instagram: "https://www.instagram.com/mototechnique/",
  image: img("contact-dino"),
  credit: "V12 Enterprises",
};

/** Site-wide strings. */
export const site = {
  name: "Moto Technique",
  /** Verbatim, the cover page's line. */
  tagline: "Restorations, renovations, restomods, repairs and automotive engineering",
  /** Verbatim, the home page h1. */
  h1: "Classic and Sports Car Restoration Specialists",
  established: "Est. 1980",
  nav: [
    { label: "Work", href: "#work" },
    { label: "Restomods", href: "#restomods" },
    { label: "Workshop", href: "#workshop" },
    { label: "Contact", href: "#contact" },
  ],
};

const content = mediaDeep({
  hero,
  marks,
  sale,
  restomod,
  disciplines,
  workshop,
  testimonials,
  contact,
  site,
});

export default content;
