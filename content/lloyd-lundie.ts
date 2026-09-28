import { mediaDeep } from "@/lib/media";

/**
 * Lloyd Lundie Building Contractors Ltd — private redesign demo, /lloyd-lundie.
 *
 * Every string and photograph on the demo comes from this file. Copy is lifted
 * from the client's own site (Design Work/Lloyd Lundie/source/content.md,
 * ripped 28 Sep 2026) and from facts Finbar supplied directly. Obvious typos
 * are fixed and repetition trimmed, but nothing is invented: no figures,
 * projects, names or claims beyond what the source gives. Testimonials are
 * verbatim (shortened only with "…", company-name spelling only with "[]").
 * British spelling throughout. No em dashes in any rendered string.
 */

const img = (name: string) => `/media/images/lloyd-lundie/${name}.webp`;

export const site = {
  legalName: "Lloyd Lundie Building Contractors Ltd",
  phoneMobile: "07941 633761",
  phoneMobileHref: "tel:+447941633761",
  phoneOffice: "01233 742646",
  phoneOfficeHref: "tel:+441233742646",
  email: "sales@lloydlundie.co.uk",
  facebookHandle: "/lloydlundiebuilding",
  facebookHref: "https://www.facebook.com/lloydlundiebuilding",
};

export const nav = [
  { label: "Services", href: "/lloyd-lundie/services" },
  { label: "Feedback", href: "/lloyd-lundie#feedback" },
  { label: "Contact", href: "/lloyd-lundie#contact" },
];

export const hero = {
  heading: "Home extensions in Medway",
  sub: "Family-run, with over 30 years of experience building extensions, loft conversions and renovations across Kent and the south east.",
  image: img("hero-new-build"),
  imageAlt:
    "A finished new-build home in Medway with cedar timber cladding, dark grey aluminium windows and a gravel driveway",
  cta: { label: "Get a quote", href: "/lloyd-lundie#contact" },
};

/** The story beat: who they are, in their own words, verbatim from /home. */
export const story = {
  paragraph:
    "Lloyd Lundie Building Contractors is a family-run building company providing high-quality home improvements throughout Medway and the surrounding areas of Kent. With over 30 years of experience, our skilled team can manage everything from house extensions and loft conversions to kitchens, bathrooms and complete property renovations. We combine reliable project management, straightforward communication and quality workmanship to create spaces that work better for you and your family.",
  /** Two short mottos used across their old site, verbatim. Presented as company lines, not customer quotes. */
  mottos: ["We always do what we say we will do.", "It's all about you."],
  facts: [
    { value: "30+", label: "Years of experience" },
    { value: "Family-run", label: "Building company" },
    { value: "Medway", label: "Kent and the south east" },
  ],
};

/** Four large single photographs on the home page. Captions describe only what is visibly in the photo. */
export const selectedWork = [
  {
    image: img("rear-extension-exterior"),
    alt: "A finished two storey brick extension with a covered outdoor area, anthracite grey windows and a door, seen on a sunny day",
    caption: "Two storey extension with a covered outdoor area, finished in brick to match the existing house",
  },
  {
    image: img("side-extension-bifolds"),
    alt: "A brick side and rear extension with a run of bi-fold doors, a full-height window and French doors, under a clear blue sky",
    caption: "Rear extension with bi-fold doors and full-height glazing onto the garden",
  },
  {
    image: img("kitchen-island"),
    alt: "An open-plan grey kitchen with a large central island, fitted units and fresh flowers on a side table",
    caption: "Open-plan kitchen with island, part of a new rear extension",
  },
  {
    image: img("bathroom-freestanding-tub"),
    alt: "A marble bathroom with a freestanding bath and a glass walk-in shower",
    caption: "Bathroom with a freestanding bath and walk-in shower",
  },
];

/** The seven services, one line each. Home page links each to its anchor on /services. */
export const services = [
  {
    id: "extensions",
    name: "Extensions",
    oneLiner:
      "Single storey rear extensions, double storey side extensions and orangeries, designed around your home.",
  },
  {
    id: "loft-conversions",
    name: "Loft conversions",
    oneLiner: "Making more of the space you already have.",
  },
  {
    id: "kitchens",
    name: "Kitchens",
    oneLiner: "Design and installation, with our supplier discounts passed on to you.",
  },
  {
    id: "bathrooms",
    name: "Bathrooms",
    oneLiner: "Design and installation, finished to the same standard as the rest of the build.",
  },
  {
    id: "roofing",
    name: "Roofing",
    oneLiner: "Pitched roofs matched to the existing property, and flat roofs in fibreglass, felt or rubber.",
  },
  {
    id: "landscaping",
    name: "Landscaping",
    oneLiner: "Decking, paths and patios that frame a finished extension.",
  },
  {
    id: "bifold-doors",
    name: "Bi-fold doors and roof lanterns",
    oneLiner: "Wide glazing that fills a new room with light and opens it onto the garden.",
  },
];

/**
 * Full copy + one photo per service, for the services page. Sourced from the
 * client's Extensions, Kitchens, Bathrooms, Roof and Landscaping pages
 * (content.md). The client's Loft Conversions and Bi-fold Doors pages had no
 * body copy at all, only a heading, so those two sections use only the
 * established company facts (family-run, 30+ years, areas covered) rather
 * than inventing anything service-specific.
 */
type ServiceDetail = {
  id: string;
  name: string;
  intro: string[];
  whyPoints: string[];
  image: string;
  imageAlt: string;
};

export const serviceDetails: ServiceDetail[] = [
  {
    id: "extensions",
    name: "Extensions",
    intro: [
      "Lloyd Lundie Building Contractors Ltd is based in Medway and Maidstone, and covers all parts of Kent and the south east. We transform properties into dream homes by listening to and understanding our clients' needs and making their dreams a reality.",
      "We understand that our clients have a budget, and we offer great advice to solve issues, add more space and achieve your dream within it. The possibilities are endless: that dream kitchen, dining room, family day room, playroom, home office, gym, bedroom with en suite, or even a complete annexe. Our single storey rear extensions are perfect if you want a big family room or social room that opens onto the garden with elegant bi-folding doors.",
      "We can work with you to design your extension, tailored to your details and individually designed to match the style of your home. We'll work with you to decide on the size, shape, windows, doors and all the finishing touches. Roof lanterns, bi-folding doors and glazing give you an almost infinite number of possibilities.",
    ],
    whyPoints: [
      "Over 30 years of experience delivering beautiful extensions.",
      "We always do what we say we will do.",
      "We love what we do, and always try to over deliver.",
      "To us, it's all about you, turning your property into your dream home.",
      "A ten year guarantee on all our work.",
      "Friendly, reliable, trustworthy and honest.",
      "Our price promise: we may be beaten on price, but never on quality or care, and we promise to complete every project on time and on budget.",
    ],
    image: img("rear-extension-patio"),
    imageAlt:
      "A finished brick rear extension with bi-fold and French doors opening onto a new paved patio",
  },
  {
    id: "loft-conversions",
    name: "Loft conversions",
    intro: [
      "Loft conversions are one of the ways we help you make more of the home you already have, alongside house extensions, kitchens, bathrooms and complete property renovations.",
      "As with every project, over 30 years we've kept it simple: we manage the work, communicate clearly and always do what we say we will do. It's all about you.",
    ],
    whyPoints: [],
    image: img("loft-dormer-extension"),
    imageAlt: "A dormer loft conversion above a ground floor extension with a full run of bi-fold doors",
  },
  {
    id: "kitchens",
    name: "Kitchens",
    intro: [
      "Ask your kitchen fitter to provide you with a work schedule, so you know what's happening day to day and which trades or deliveries to expect and when.",
      "Find out if you'll lose the use of your kitchen sink during the install, how long for, and whether you'll have access to a temporary one. We always keep a working kitchen in operation, because we know how important that is.",
      "Lloyd Lundie Building Contractors Ltd have accounts at all the top kitchen suppliers local to the Medway and Maidstone area. We get great discounts, and we pass our full discount on to every client who chooses us for their home improvements.",
    ],
    whyPoints: [],
    image: img("kitchen-ovens-island"),
    imageAlt: "A pale fitted kitchen with a wall of built-in ovens and an island with a sink, under pendant lighting",
  },
  {
    id: "bathrooms",
    name: "Bathrooms",
    intro: [
      "Lloyd Lundie Building Contractors, based in Medway and Maidstone, can arrange the design and installation of high quality bathrooms throughout Kent. Our aim is always to match the same high standard as the rest of the build.",
      "We pride ourselves on delivering exceptional service from design through to installation, and have provided stylish, functional bathrooms to properties across Medway, Maidstone and Kent. We're confident you'll love what we do, because we understand the project is all about you, and our aim is always to make your dreams come true.",
    ],
    whyPoints: [],
    image: img("bathroom-black-vanity"),
    imageAlt: "A marble bathroom with a gloss black vanity unit, wall-mounted basin and backlit mirror",
  },
  {
    id: "roofing",
    name: "Roofing",
    intro: [
      "Lloyd Lundie Building Contractors in Medway, Kent have over 30 years' experience in roofing, covering Medway, Maidstone and Kent. All our new roofs are installed by highly trained roofing specialists, so you know every roof we install is to the highest standard.",
      "Our new extension roofs are always matched to the existing property, and where that isn't possible we make sure the colour matches to create a seamless look. Our flat roofs are also to the highest standard, and we can cover most types: fibreglass, traditional three layer felt and rubberised coverings.",
    ],
    whyPoints: [],
    image: img("roof-lantern-dining"),
    imageAlt: "A roof lantern above a rear extension with bi-fold doors, seen from outside the finished house",
  },
  {
    id: "landscaping",
    name: "Landscaping",
    intro: [
      "For many years, Lloyd Lundie Building Contractors have carried out landscaping across Medway, Maidstone and the surrounding towns of Kent.",
      "Landscaping is a great way to frame your house attractively, especially after a recently finished extension. It's a lovely way to finish a project and makes the garden more appealing, so you'll want to spend more time in it with friends and family, which in turn adds value to the property.",
      "A beautiful garden with decking, paved walkways and patios can turn a plain lawn into an attractive, seasonal entertaining space with sun trap corners.",
    ],
    whyPoints: [],
    image: img("patio-pergola"),
    imageAlt: "A landscaped stone patio with a timber pergola, potted plants and a lawn beyond",
  },
  {
    id: "bifold-doors",
    name: "Bi-fold doors and roof lanterns",
    intro: [
      "Bi-folding doors and roof lanterns are part of how we open up an extension: wide glazing that floods a new kitchen, dining or family room with light and leads straight out to the garden.",
      "We fit them as part of our extensions and renovations across Medway, Maidstone and Kent.",
    ],
    whyPoints: [],
    image: img("living-room-bifolds-herringbone"),
    imageAlt: "A living room with a full run of bi-fold doors onto the garden and a herringbone timber floor",
  },
];

/** Verbatim testimonials, name as given. Long ones shortened only with "…"; "Lundy" in Simon's fixed to the company name in brackets. */
export const testimonials = [
  {
    quote: "The best ever, conservatories built to a very high standard.",
    name: "Katie Donaldson",
  },
  {
    quote:
      "Lloyd and his team built us a large single storey extension and a patio. Excellent quality throughout and Lloyd and his guys were great to deal with. Highly recommended.",
    name: "Tracey Larson",
  },
  {
    quote:
      "We had a double storey side extension and an Orangerie built by Lloyd Lundie and their work exceeded any expectations we had. Top class workmanship!! Would highly recommend.",
    name: "Debbie Baker",
  },
  {
    quote:
      "If you are looking for an honest, reliable building firm who will guide you through a project with the same care and attention to detail that you would take if you could do it yourself, then I can highly recommend Lloyd [Lundie]… We are really pleased with the finished rooms and the whole experience has been as smooth as we could ever have hoped for.",
    name: "Simon Damerell",
  },
  {
    quote:
      "We had a single storey extension built, a new kitchen created, and the bathroom relocated into our old kitchen… The final build is of excellent quality and looks fantastic, much better than we could have imagined! … We highly recommend that if you are planning a building project that you contact Lloyd Lundie for quotes.",
    name: "Susan Griffiths",
  },
];

export const areas = [
  "Medway",
  "Gillingham",
  "Rainham",
  "Chatham",
  "Rochester",
  "Strood",
  "Maidstone",
  "Ashford",
  "Canterbury",
  "Thanet",
  "Whitstable",
];

export const contact = {
  intro:
    "If you have any questions or enquiries, don't hesitate to get in touch using the details below, or send us the form.",
  pricesNote:
    "We provide clear, competitive quotations based on the work your project genuinely requires. Our team takes the time to understand your plans, explain the available options and recommend practical solutions that suit your property and budget. With Lloyd Lundie Building Contractors, you'll receive quality workmanship, honest pricing and no unnecessary extras.",
  formNote: "This is a demo form. Nothing is sent when you submit it.",
  thanks: "Thanks, this is a demo form, nothing was sent.",
};

export const footer = {
  credit: { label: "Demo by FINBARSTUDIO", href: "https://www.finbar.studio" },
};

const content = mediaDeep({
  site,
  nav,
  hero,
  story,
  selectedWork,
  services,
  serviceDetails,
  testimonials,
  areas,
  contact,
  footer,
});

export default content;
