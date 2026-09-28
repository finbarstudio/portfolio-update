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


export const hero = {
  image: img("hero-new-build"),
  imageAlt:
    "A finished new-build home in Medway with cedar timber cladding, dark grey aluminium windows and a gravel driveway",
  /** The laurel under the wordmark: over 30 years (their home page). */
  laurel: { mark: "30", unit: "Years" },
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

/** The seven services, one line each. */
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
  hero,
  story,
  selectedWork,
  services,
  testimonials,
  areas,
  contact,
  footer,
});

export default content;
