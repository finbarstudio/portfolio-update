// ─────────────────────────────────────────────────────────────────────────
// Toombul District Cricket Club — content for the /toombul demo, ripped and
// condensed from toombulcricket.com. Real facts only. This is a leaner site
// than the live one on purpose (no blog/news/live ladder) — see the section
// picks in page.tsx.
// ─────────────────────────────────────────────────────────────────────────

export const club = {
  name: "Toombul District Cricket Club",
  short: "Toombul",
  nickname: "the Bulls",
  founded: 1882,
  ground: "Oxenham Park",
  suburb: "Nundah",
  address: "Cnr Duke & York Streets, Nundah QLD 4012",
  postal: "PO Box 370, Nundah QLD 4012",
  competition: "Queensland Premier Cricket",
};

export const heroStrip = [
  "Est. 1882",
  "Oxenham Park, Nundah",
  "Queensland Premier Cricket",
];

// The heritage/legacy ledger — Toombul's real playing history. This is the
// spine of the story section.
export const legacyStats = [
  { value: "1882", label: "Founded", detail: "One of Australia's oldest sporting clubs" },
  { value: "3", label: "Invincibles", detail: "Don Tallon, Bill Brown & Colin McCool toured with Bradman in 1948" },
  { value: "11", label: "Test players", detail: "Plus 4 ODI and 3 T20 internationals" },
  { value: "61", label: "Sheffield Shield players", detail: "Representing Queensland across the decades" },
];

export const legacyNames = [
  {
    name: "Bill Brown",
    note: "1948 Invincible, and the first and only Queensland-born cricketer to captain Australia in Test cricket.",
  },
  {
    name: "Jeff Thomson",
    note: "One of the fastest bowlers the game has seen, and a Toombul name known well beyond Brisbane.",
  },
  {
    name: "Chris Lynn",
    note: "Carried the Toombul banner into the modern game with his power hitting in the short formats.",
  },
  {
    name: "Matthew Renshaw",
    note: "Toombul junior turned current Australian international, playing for Queensland and the Brisbane Heat.",
  },
];

export const legacyLead =
  "Toombul has been shaping Australian cricket since 1882. Three Toombul players toured England with Sir Donald Bradman's undefeated 1948 Invincibles, and the club has sent 11 players to Test cricket since. That depth still runs through every grade at Oxenham Park.";

export const philosophy = {
  eyebrow: "Not just a cricket club",
  lead: "We're a community that comes together to celebrate a shared history and a shared spirit, on and off the field.",
  sub: "The journey starts as young as five, and for some it doesn't stop until the international stage.",
};

export type Grade = {
  key: string;
  label: string;
  age: string;
  description: string;
  image: string;
  alt: string;
};

export const grades: Grade[] = [
  {
    key: "seniors",
    label: "Seniors",
    age: "Mens & Womens",
    description:
      "Toombul fields men's and women's sides across Queensland Premier Cricket, from first grade through to sixth, plus dedicated seniors training.",
    image: "/toombul/seniors.webp",
    alt: "Toombul Premier Cricket batsman playing a shot at Oxenham Park",
  },
  {
    key: "juniors",
    label: "Juniors",
    age: "Boys & Girls",
    description:
      "Boys' and girls' junior cricket with a clear pathway up through the grades, backed by structured junior training through the season.",
    image: "/toombul/juniors.webp",
    alt: "Toombul junior cricketers celebrating together after a match",
  },
  {
    key: "blasters",
    label: "Blasters",
    age: "Boys & Girls, from age 5",
    description:
      "Cricket's entry point. Friday Night Blasters is where the newest Bulls get their first taste of the game, coached and community-driven.",
    image: "/toombul/blasters.webp",
    alt: "Young Toombul Blasters player bowling as a coach looks on",
  },
];

export const getInvolved = [
  { label: "Get Involved", body: "Find the right team or role at the club, whatever your age or experience." },
  { label: "Registration", body: "Sign up for the season and pick your grade." },
  { label: "Pathways", body: "See how players move from Blasters through juniors into senior grade cricket." },
];

export const sponsors = [
  { name: "Lexus Brisbane", logo: "/toombul/sponsors/lexus.webp" },
  { name: "Qube Logistics", logo: "/toombul/sponsors/qube.webp" },
  { name: "T2 Electrical & Data", logo: "/toombul/sponsors/t2-electrical.webp" },
  { name: "Prince of Wales Hotel", logo: "/toombul/sponsors/prince-of-wales.webp" },
];

export type MerchItem = { name: string; price: string; image: string };

export const merchItems: MerchItem[] = [
  { name: "EV2 Stadium Jacket", price: "$185", image: "/toombul/merch/stadium-jacket.webp" },
  { name: "EV2 Spray Jacket", price: "$110", image: "/toombul/merch/spray-jacket.webp" },
  { name: "EV2 2026 Puffer Vest", price: "$100", image: "/toombul/merch/puffer.webp" },
  { name: "EV2 Pro Bucket Hat", price: "$35", image: "/toombul/merch/bucket-hat.webp" },
  { name: "EV2 Pro Training Cap", price: "$35", image: "/toombul/merch/training-cap.webp" },
  { name: "TDCC Cap, Blue", price: "$30", image: "/toombul/merch/blue-cap.webp" },
];

export const contact = {
  ground: `${club.ground} (Main Ground)`,
  address: club.address,
  postal: club.postal,
  roles: [
    { role: "Club President", name: "Andrew Cranstoun" },
    { role: "Operations Manager", name: "Greg Blake" },
  ],
};
