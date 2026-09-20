import { mediaDeep } from "@/lib/media";

/**
 * Moto Technique demo — ALL page content.
 *
 * Every string, image and link on the demo comes from this file, so the page is
 * a renderer with nothing hard-coded. Reordering `hero` reorders the hero
 * photographs; adding a discipline adds a card. This
 * is the shape a CMS would hold, so Kevin can be handed the editor later
 * without the page being rebuilt.
 *
 * COPY RULE: text marked "verbatim" is Kevin's own wording, lifted from
 * mototechnique.com on 18 Sep 2026. Do not rewrite it, correct its punctuation
 * or tidy its capitalisation. Photo credits stay with their photo.
 */

const img = (name: string) => `/media/images/moto-technique/${name}.webp`;

/**
 * Where links go for now. Only the home page exists, so every link that would
 * lead to another page of the site lands on one holding page instead of on
 * their old site or on a 404. Each item keeps the address of the page it will
 * become as `source`, so the full build has them. Links that already have a
 * real destination are left alone: phone, email, maps, Instagram, the auction
 * and the film.
 */
const SOON = "/mt/soon";

export type HeroSlide = {
  id: string;
  /** The car, as Kevin names it. */
  car: string;
  /** Short line over the photo. Verbatim where possible. */
  line: string;
  image: string;
  /** The same photograph at 1600px, for phones and ordinary screens. */
  imageSm: string;
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
    imageSm: img("dino36-profile-1600"),
    credit: "Jayson Fong",
  },
  {
    id: "dino-moving",
    car: "Dino 246 GTS",
    line: "The Moto Technique Dino 3.6 Litre V8 Restomod.",
    image: img("dino36-rear-moving"),
    imageSm: img("dino36-rear-moving-1600"),
    credit: "Jayson Fong",
  },
  {
    id: "dino-perspex",
    car: "Dino 246 GTS",
    line: "If you're going to drop a 400bhp Ferrari V8 engine into a Dino, its nice to be able to see it.",
    image: img("dino36-perspex"),
    imageSm: img("dino36-perspex-1600"),
    credit: "Jayson Fong",
  },
  {
    id: "dino-rear",
    car: "Dino 246 GTS",
    line: "Snap exhaust system, a tip of the hat to the legendary Dino.",
    image: img("dino36-rear-leafs"),
    imageSm: img("dino36-rear-leafs-1600"),
    credit: "Jayson Fong",
  },
  {
    id: "dino-wheels",
    car: "Dino 246 GTS",
    line: "Fixing-free headlight covers and 17 inch Campagnolo wheels.",
    image: img("dino36-lens-wheels"),
    imageSm: img("dino36-lens-wheels-1600"),
    credit: "Jayson Fong",
  },
  {
    id: "dino-interior",
    car: "Dino 246 GTS",
    line: "Stunning red leather interior to Chairs and Flares specification.",
    image: img("dino36-interior"),
    imageSm: img("dino36-interior-1600"),
    credit: "Jayson Fong",
  },
];

/**
 * The name of the car, set in the middle of the hero over every frame.
 *
 * Finbar's artwork of the Dino script (Design Work/Mototechnique/Dino
 * Wordmark.png). It is a picture, not type, so the real size is recorded here
 * and the page can hold its space before it loads. `normal` is the relief map
 * that lets it render as a metal badge; both files come from
 * Tools/make-dino-badge.py. Swap the car in `hero` and this is the other thing
 * to swap, or set it to null to have no name at all.
 */
export const heroMark: {
  image: string;
  normal: string;
  /** How the metal is finished: "silver" (chrome, rim keeps its colour) or "brass". */
  finish: "silver" | "brass";
  alt: string;
  width: number;
  height: number;
} | null = {
  image: img("dino-wordmark"),
  normal: img("dino-wordmark-normal"),
  finish: "brass",
  alt: "Dino",
  width: 1732,
  height: 541,
};

/** Credentials under the hero line. Real, checkable claims only. */
export const marks = {
  laurel: { mark: "40", unit: "Years", body: "Established", label: "1980" },
  /** Verbatim from the home page: "...projects from all over the UK, Europe, Asia and North America." */
  regions: [
    { id: "uk", label: "UK" },
    { id: "eu", label: "Europe" },
    { id: "asia", label: "Asia" },
    { id: "usa", label: "North America" },
  ],
};

/**
 * The Dino's story: the white half of the split hero.
 *
 * Laid out as an editorial spread, not a column of paragraphs, so the content
 * is held in the shapes the layout needs. Nothing is reworded to fit:
 *   - The sale figures are Kevin's own (18 Sep 2026).
 *   - Both quotes are VERBATIM. Each is split in two only so the layout can set
 *     the last words large: read `lead` then `punch` and you have the original
 *     sentence, in order, nothing dropped. Jay Leno's is from the testimonial
 *     card on mototechnique.com; Kevin's is from the Dino 3.6 V8 upgrade page.
 *   - Every figure and detail is from that same upgrade page. If a number
 *     cannot be pointed at on their site, it does not belong here. "in excess
 *     of" is their wording for the top speed and stays attached to it.
 */
export const sale = {
  eyebrow: "Sold at auction",
  price: "$1,106,000",
  facts: [
    { label: "Sold on", value: "Bring a Trailer" },
    { label: "Date", value: "25 June 2026" },
    { label: "Lot", value: "#248,947" },
  ],
  car: "The ex-David Lee Dino 246 GTS Evo",
  quote: {
    lead: "This is as nice a restomod as I've ever seen... It's such a Brilliant Car.",
    punch: "This is the car the factory should have built",
    by: "Jay Leno",
  },
  /** Full bleed, edge to edge of the panel. Order is the order on the page. */
  gallery: [
    { image: img("dino36-engine"), alt: "The 3.6 litre Ferrari V8 in the Dino's engine bay" },
    { image: img("dino36-perspex-lid"), alt: "The perspex engine cover" },
    { image: img("dino36-lens-wheels"), alt: "Perspex headlight cover and 17 inch Campagnolo wheel" },
    { image: img("dino36-interior"), alt: "Red leather interior, Chairs and Flares specification" },
  ],
  figures: [
    { value: "400", unit: "bhp", note: "Ferrari V8, developed and built in-house" },
    { value: "3.6", unit: "litres", note: "A Ferrari 2.9 V8, bored and stroked" },
    { value: "170", unit: "mph", note: "Top speed, in excess of" },
  ],
  spec: [
    { label: "Gearbox", value: "Ferrari 328" },
    { label: "Management", value: "MoTeC ECU, mapped hot or cold" },
    { label: "Wheels", value: "Original Campagnolo, 3D scanned and recast to 17 inch" },
    { label: "Brakes", value: "Bigger brakes and callipers" },
  ],
  detailsTitle: "The details",
  details: [
    "Fared-in perspex headlight covers with invisible fixings.",
    "A Snap four exhaust system, a tip of the hat to the legendary Dino.",
    "Adjustable suspension, electric power steering, hydraulic clutch.",
    "Air conditioning and iPod connectivity.",
  ],
  closing: {
    lead: "This Dino Evolution Restomod is not just about numbers like bhp, 0-60 and top speed, its about the driving experience, its about the car communicating with the driver and giving feedback through the seat and the steering. It has modern capabilities in terms of power, handling and reliability,",
    punch: "but above all, It has a soul.",
    by: "Kevin O'Rourke",
  },
  links: [
    { label: "The auction", href: "https://bringatrailer.com/listing/1972-ferrari-dino-246-gts-15/" },
    { label: "Jay Leno's Garage", href: "https://www.youtube.com/watch?v=qnt0DNqJYvM" },
  ],
};

/**
 * Why Moto Technique. The title, the claim, then three figures that back it.
 *
 * Every figure is theirs and can be pointed at on mototechnique.com:
 *   1000s  /hitech: "Having restored or repaired literally thousands of classic
 *          and exotic sports cars over the last four decades"
 *   120    /paintwork: "a combined accumulative experience of nearly 120 years
 *          of repainting high end classic and exotic supercars"
 *   $1.1M  the Dino sale, Kevin's own figures (25 Jun 2026, Bring a Trailer)
 * Only one of the three is about the Dino, on purpose: the hero already is.
 * Their words are kept as claims ("thousands", "nearly") and never sharpened
 * into a count nobody could check.
 */
export const why = {
  title: "Why Moto Technique",
  heading: ["One workshop.", "Every discipline."],
  body: "Established in 1980, Moto Technique are at the forefront of classic and sports car restoration and engineering excellence, with an international reputation for quality work and innovation. Every discipline is carried out in-house and under one roof, by artisan panel beaters, paint sprayers, fitters, mechanics and Hi-tech technicians.",
  cta: { label: "See the projects", href: SOON },
  figures: [
    { value: "1000s", label: "Classic and exotic sports cars restored or repaired, over four decades" },
    { value: "120", label: "Years of combined experience in the paintshop, nearly" },
    { value: "$1.1M", label: "Dino 246 GTS Evo, built here, sold at auction in 2026" },
  ],
};

/**
 * The services wheel: four disciplines round a circle with Hi-Tech at its hub.
 *
 * The shape is the argument. Their site lists these as five separate pages, so
 * nothing says they are one operation; drawn as quarters of a single circle,
 * the fact that one workshop does all of it is the first thing you see, and
 * Hi-Tech sits in the middle because it touches all four.
 *
 * Quarters run clockwise from the top right, which is also where each one's
 * info box comes out. `image` is the photograph their own site uses for that
 * discipline. `blurb` is VERBATIM from that service's own page on
 * mototechnique.com: a whole sentence, or the main clause of one, with their
 * spelling and capitals kept. `href` is that page, so the wheel already goes somewhere.
 */
export const services = {
  title: "Services",
  quarters: [
    {
      id: "bodywork",
      name: "Bodywork",
      href: SOON,
      source: "https://www.mototechnique.com/bodywork",
      image: img("gullwing-ext"),
      blurb:
        "Tubular chassis’s with lightweight aluminium body panels, monocoque chassis’s, Carbon tubs, steel panels, fibreglass, Carbon, Kevlar, welding, riveting, bonding…. the list is endless.",
    },
    {
      id: "paintwork",
      name: "Paintwork",
      href: SOON,
      source: "https://www.mototechnique.com/paintwork",
      image: img("dino-candy-red"),
      blurb:
        "Moto Technique can boast a combined accumulative experience of nearly 120 years of repainting high end classic and exotic supercars.",
    },
    {
      id: "mechanical",
      name: "Mechanical",
      href: SOON,
      source: "https://www.mototechnique.com/mechanical",
      image: img("v8-38-engine"),
      blurb:
        "Rebuilding, servicing and upgrading classic and modern engines, using traditional and modern methods to the highest standards possible is the goal of the Moto Technique engineers.",
    },
    {
      id: "trim",
      name: "Interior trim",
      href: SOON,
      source: "https://www.mototechnique.com/trim",
      image: img("trim-tdf"),
      blurb:
        "All the interior trim work that comes to Moto Technique is carried out by the award winning O’Rourke Coachtrimmers who are respected by many people in the trade as being one of the very best, if not THE best coach trimmers in the World.",
    },
  ],
  hub: {
    id: "hitech",
    name: "Hi-Tech",
    href: SOON,
    source: "https://www.mototechnique.com/hitech",
    // Finbar's pick: the 250 GTO on the digital alignment jig, from their GTO page.
    image: img("gto-jig-richard"),
    blurb:
      "Advancements in car restoration technology has happened in every single stage of the process, from paint and body materials to electronic scanning and alignment and most interestingly in engine management systems and reliability.",
  },
};

/**
 * The shelf: eight projects, stood side by side like books.
 *
 * Their site has nine project pages. The Dino 3.6 is the hero, so these are the
 * other eight. `name` is the page's own title and `line` is VERBATIM from that
 * page (their spelling and capitals kept). The Miura page has no words on it at
 * all, so it has no line here either: a gap is better than an invented caption.
 * `href` is their page. Note the Iso Grifo really does live at a URL that says
 * F40: that is a slip on their site, copied faithfully so the link works.
 *
 * The first one stands open when the section arrives. Reorder the list and the
 * shelf reorders; it lays itself out for however many there are. `focus` is
 * optional: the part of the photograph to keep in view (CSS object-position).
 */
export const projects = {
  title: "Projects",
  items: [
    {
      id: "gto",
      name: "Ferrari 250 GTO",
      line: "Ferrari 250 GTO Complete “Step by Step” body restoration by MOTO TECHNIQUE",
      // The finished car at Goodwood. It is a portrait and the car is low in the
      // frame, so `focus` keeps the car in the slice, not the house behind it.
      // NOTE: 816px wide is all their site has of it, so it softens on a very
      // large screen. A bigger original from Kevin would fix that.
      image: img("gto-goodwood"),
      focus: "50% 80%",
      href: SOON,
      source: "https://www.mototechnique.com/ferrari-250-gto",
    },
    {
      id: "f40",
      name: "Ferrari F40LM / GTE",
      line: "Ferrari F40LM/GTE Upgraded to 720BHP",
      image: img("f40lm-anglesey"),
      href: SOON,
      source: "https://www.mototechnique.com/ferrari-f40lm-gte-1",
    },
    {
      id: "gullwing",
      name: "Mercedes 300SL Gullwing",
      line: "Mercedes 300SL Gullwing Restored to absolute perfection by Moto Technique",
      image: img("gullwing-restored"),
      href: SOON,
      source: "https://www.mototechnique.com/mercedes-300sl-gullwing",
    },
    {
      id: "f308",
      name: "Ferrari 308 GTB",
      line: "A unique spec Ferrari 308 Restomond by Moto Technique fitted with a Ferrari V8 (Stage 2) Engine and many other bespoke features.",
      image: img("f308-hero"),
      href: SOON,
      source: "https://www.mototechnique.com/308-gtb-restomod",
    },
    {
      id: "miura",
      name: "Lamborghini Miura P400",
      line: "",
      image: img("miura-roadster"),
      href: SOON,
      source: "https://www.mototechnique.com/lamborghini-miurap400",
    },
    {
      id: "iso",
      name: "Iso Grifo Mk2",
      line: "Iso Grifo Mk2 - Ground-up restoration to award winning standards by MOTO TECHNIQUE",
      image: img("iso-hero"),
      href: SOON,
      source: "https://www.mototechnique.com/ferrari-f40lm-gte",
    },
    {
      id: "dino32",
      name: "Dino 246 GTS 3.2 V8",
      line: "Dino 246 GTS - Upgraded to Ferrari V8 300bhp engine with handling and braking to match.",
      image: img("dino32-road"),
      href: SOON,
      source: "https://www.mototechnique.com/dino-246-gts-upgrade-32-v8",
    },
    {
      id: "isetta",
      name: "BMW Isetta 300",
      line: "BMW Isetta 300 or Ferrari 250 GTO, they all receive the same care and attention at Moto Technique.",
      image: img("isetta-pub"),
      href: SOON,
      source: "https://www.mototechnique.com/bmw-isetta-300",
    },
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
  /** Their full address, as their contact page has it. Used by the bar's window. */
  address: ["141 Molsey Avenue", "West Molesey", "KT8 2RY", "Surrey", "United Kingdom"],
  /** The same address on two lines, for the footer, where five short lines made a ragged column. */
  addressShort: ["141 Molsey Avenue, West Molesey", "Surrey KT8 2RY"],
  phone: "+44 (0) 208 941 3510",
  phoneHref: "tel:+442089413510",
  email: "kevin@mototechnique.com",
  instagram: "https://www.instagram.com/mototechnique/",
  /** The published business address, as a search, so it opens in whichever maps app the visitor uses. */
  maps: "https://www.google.com/maps/search/?api=1&query=Moto+Technique+141+Molesey+Avenue+West+Molesey+KT8+2RY",
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
  home: "/mt",
  /** The side menu. The pages behind these are not built yet (see SOON). */
  nav: [
    { label: "Services", href: SOON },
    { label: "Projects", href: SOON },
    { label: "Testimonials", href: SOON },
    { label: "Workshop", href: SOON },
    { label: "Contact", href: SOON },
  ],
};

/** The holding page every unbuilt link lands on. The details are the studio's, not the client's. */
export const soon = {
  heading: "To be built",
  body: "This page is part of the full build. The home page is the demonstration.",
  by: "Design and build by Finbar Studio",
  email: "finbar@finbar.studio",
  phone: "+44 7876 492551",
  phoneHref: "tel:+447876492551",
  web: { label: "www.finbar.studio", href: "https://www.finbar.studio" },
};

const content = mediaDeep({
  soon,
  hero,
  heroMark,
  marks,
  why,
  services,
  projects,
  sale,
  restomod,
  disciplines,
  workshop,
  testimonials,
  contact,
  site,
});

export default content;
