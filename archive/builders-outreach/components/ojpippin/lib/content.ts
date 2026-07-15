/*
   OJ Pippin Homes site content.
   Sourced and re-voiced from ojpippin.com.au for a concept build.
*/

export const company = {
  name: "OJ Pippin Homes",
  wordmark: "OJ PIPPIN",
  established: 1994,
  years: 30,
  homesBuilt: 1000,
  qbcc: "1209968",
  phone: "07 3889 7775",
  phoneHref: "tel:+61738897775",
  email: "info@ojpippin.com.au",
  region: "Brisbane and South East Queensland",
  regions: "Brisbane, Moreton Bay, Ipswich, Logan and the Redlands",
  address: {
    line1: "Building 6, 205 Leitchs Rd",
    line2: "Brendale, Queensland 4500",
  },
  hours: [
    { days: "Monday to Friday", time: "10am to 4pm" },
    { days: "Saturday and Sunday", time: "10am to 3pm" },
    { days: "Head office", time: "By appointment" },
  ],
  socials: [
    { label: "Instagram", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "Pinterest", href: "#" },
    { label: "LinkedIn", href: "#" },
  ],
};

/* The heritage hook the hero leads with */
export const heritage = {
  since: "Building since",
  year: "1994",
  line: "Thirty years of homes across Brisbane, Moreton Bay, Ipswich, Logan and the Redlands.",
};

/* Heritage over award-flaunting */
export const manifesto = {
  eyebrow: "Since 1994",
  lines: ["Thirty years of building", "across South East Queensland."],
  body:
    "We're a family-run Brisbane builder with a simple way of working. All-inclusive pricing, designs that bend to the way you live, and not a line of fine print to read twice. A thousand homes on, the standard hasn't moved.",
  stats: [
    { value: 30, suffix: "", label: "Years building" },
    { value: 1000, suffix: "+", label: "Homes handed over" },
    { value: 100, suffix: "%", label: "Fixed-price contracts" },
  ],
};

export interface Design {
  name: string;
  facade: string;
  beds: number;
  baths: number;
  cars: number;
  size: string;
  image: string;
  note: string;
}

export const designs: Design[] = [
  {
    name: "Thames",
    facade: "Windsor facade",
    beds: 5,
    baths: 4,
    cars: 2,
    size: "450m²",
    image: "/oj-pippin/homes/design-thames.jpg",
    note: "Our flagship plan. Five bedrooms, dual living, and a kitchen big enough to gather the whole family around.",
  },
  {
    name: "Willow",
    facade: "Scandi facade",
    beds: 4,
    baths: 2,
    cars: 2,
    size: "273m²",
    image: "/oj-pippin/homes/design-willow.jpg",
    note: "Light, low and unhurried. The Willow reads small from the street and lives large inside.",
  },
  {
    name: "Ava",
    facade: "Monaco facade",
    beds: 5,
    baths: 4,
    cars: 2,
    size: "390m²",
    image: "/oj-pippin/homes/design-ava.jpg",
    note: "Generous proportions behind a clean Monaco front. Our most-requested five-bedroom plan.",
  },
  {
    name: "Shelby",
    facade: "Long Beach facade",
    beds: 4,
    baths: 2,
    cars: 2,
    size: "310m²",
    image: "/oj-pippin/homes/design-shelby.jpg",
    note: "An easy, coastal four-bedder that suits a corner block as well as a quiet street.",
  },
];

/* Short list shown in the design index */
export const designIndex = [
  { name: "Bree", beds: 4, baths: 2 },
  { name: "Willow", beds: 4, baths: 2.5 },
  { name: "Airlie", beds: 4, baths: 2 },
  { name: "Freedom", beds: 4, baths: 2 },
  { name: "Ridge", beds: 5, baths: 2.5 },
  { name: "Thames", beds: 5, baths: 4 },
  { name: "Ava", beds: 5, baths: 4 },
  { name: "Shelby", beds: 4, baths: 2 },
];

export interface FeaturedProject {
  slug: string;
  title: string;
  location: string;
  type: string;
  images: string[]; // 3 views, first is the cover
}

/* The three full-bleed projects on the home page */
export const featuredProjects: FeaturedProject[] = [
  {
    slug: "thames",
    title: "Thames",
    location: "Windsor",
    type: "Custom family home",
    images: [
      "/oj-pippin/homes/design-thames.jpg",
      "/oj-pippin/homes/interior-living.jpg",
      "/oj-pippin/homes/interior-kitchen.jpg",
    ],
  },
  {
    slug: "monaco",
    title: "Monaco",
    location: "Brendale",
    type: "Turn-key build",
    images: [
      "/oj-pippin/homes/facade-monaco.jpg",
      "/oj-pippin/homes/interior-bath.jpg",
      "/oj-pippin/homes/photo-real.jpg",
    ],
  },
  {
    slug: "willow",
    title: "Willow",
    location: "North Lakes",
    type: "Scandi facade",
    images: [
      "/oj-pippin/homes/design-willow.jpg",
      "/oj-pippin/homes/design-scandi.jpg",
      "/oj-pippin/homes/design-ava.jpg",
    ],
  },
];

export interface Service {
  num: string;
  title: string;
  desc: string;
}

export const services: Service[] = [
  {
    num: "01",
    title: "Custom Homes",
    desc: "A home drawn around your life from a blank page. Our design team works with you from first sketch to handover, on one contract.",
  },
  {
    num: "02",
    title: "House & Land Packages",
    desc: "A finished design matched to the right block, priced as one figure. The simplest way into a brand-new home.",
  },
  {
    num: "03",
    title: "Knockdown & Rebuild",
    desc: "Keep the street you love, lose the house that no longer fits. We manage demolition through to keys, start to finish.",
  },
  {
    num: "04",
    title: "Sloping & Challenging Sites",
    desc: "Split levels, narrow lots, awkward falls. The blocks other builders pass on are the ones we know best.",
  },
  {
    num: "05",
    title: "Dual Living",
    desc: "Room for family on both sides of a wall. Separate entries, shared land, one plan that works for everyone.",
  },
  {
    num: "06",
    title: "Display Home",
    desc: "Walk a finished OJ Pippin home before you commit to one. See the finishes, the volume and the light in person.",
  },
];

export interface InclusionGroup {
  group: string;
  items: string[];
}

export const inclusions: InclusionGroup[] = [
  {
    group: "Kitchen",
    items: [
      "Stone benchtops throughout",
      "Soft-close cabinetry, full height",
      "900mm freestanding cooktop & oven",
      "Glass splashback & dishwasher",
    ],
  },
  {
    group: "Bathrooms",
    items: [
      "Stone vanity tops",
      "Floor-to-ceiling tiling to wet areas",
      "Semi-frameless shower screens",
      "Designer tapware",
    ],
  },
  {
    group: "Throughout",
    items: [
      "LED downlight package",
      "Ducted air-conditioning",
      "Quality flooring allowance",
      "Fly screens & security screens",
    ],
  },
  {
    group: "Outside",
    items: [
      "Rendered or mixed facade",
      "Exposed-aggregate driveway",
      "Fencing & turf to boundaries",
      "Sectional garage door",
    ],
  },
];

export interface Step {
  num: string;
  title: string;
  desc: string;
}

export const process: Step[] = [
  {
    num: "01",
    title: "First conversation",
    desc: "An open, no-pressure sit-down about how you live, your block, your budget and the ideas you've been collecting.",
  },
  {
    num: "02",
    title: "Design & develop",
    desc: "Our designers shape a plan that works for the way you actually use a home, then refine it until it's right.",
  },
  {
    num: "03",
    title: "Selections & approvals",
    desc: "We lock in your finishes, handle council and prepare every document, so the build starts on solid ground.",
  },
  {
    num: "04",
    title: "Construction",
    desc: "Your project manager and our trusted trades build it, and you always know what's happening and why.",
  },
  {
    num: "05",
    title: "Handover & after-care",
    desc: "Keys, a walk-through, structural warranty and a team that picks up the phone long after you've moved in.",
  },
];

export interface Pillar {
  title: string;
  desc: string;
}

export const pillars: Pillar[] = [
  {
    title: "All-inclusive pricing",
    desc: "One figure, fixed at contract. The finishes you'd expect to pay extra for are already in the price.",
  },
  {
    title: "Thirty years, one family",
    desc: "Owned and run by the same people since 1994. The name on the contract answers the phone.",
  },
  {
    title: "Flexible designs",
    desc: "Move a wall, add a bedroom, plan for two generations. Our designs are a starting point, not a cage.",
  },
  {
    title: "Built for QLD blocks",
    desc: "Sloping sites, narrow lots and the Queensland sun. We build homes that suit where they actually sit.",
  },
  {
    title: "No fine print",
    desc: "Allowances written plainly, inclusions you can read in one sitting, and a contract that means what it says.",
  },
];

export interface Testimonial {
  quote: string;
  author: string;
  place: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "We compared four builders and OJ Pippin were the only ones whose price didn't move from the day we signed. The house came in on budget and on time.",
    author: "Daniel & Priya",
    place: "Knockdown rebuild, Aspley",
  },
  {
    quote:
      "Our block had a real slope and everyone else made it sound like a problem. The Pippin team made it the best part of the design.",
    author: "The Hendersons",
    place: "Custom home, Samford",
  },
  {
    quote:
      "Thirty years in business means something. They'd seen every question we had before we asked it. Honestly the easiest big decision we've made.",
    author: "Megan & Tom",
    place: "House & land, North Lakes",
  },
];

export const cta = {
  eyebrow: "Start the conversation",
  heading: ["Let's talk about", "the home you're picturing."],
  body:
    "Book a free, no-pressure consultation. Bring a block, a budget, or just a folder of ideas, and we'll tell you honestly what's possible.",
};
