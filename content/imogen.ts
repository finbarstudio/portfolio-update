// ─────────────────────────────────────────────────────────────────────────
// Imogen's Asia — all the content for the /imogen travel guide in ONE place.
// Finbar edits this file; the page renders from it. Add a stop = add an object
// to `stops`. Dates are computed from `trip.start` + each stop's nights/days,
// so changing the nights re-flows every date after it. Everything is rough and
// meant to be tweaked.
// ─────────────────────────────────────────────────────────────────────────

export type Country = "Thailand" | "Laos" | "Vietnam";

export type AppItem = {
  name: string;
  tagline: string;
  url: string;
  note?: string;
};

export type Tip = { title: string; body: string };

export type DoItem = {
  name: string;
  note?: string;
  /** Google Maps search query — rendered as a "map" link. */
  maps?: string;
  /** Any other link (booking page etc.). */
  url?: string;
  kind?: "do" | "food" | "night" | "optional";
};

export type Hostel = {
  name: string;
  /** Hostelworld (or any) booking link. */
  url?: string;
  /** Google Maps search query. */
  maps?: string;
  /** Recommended room type. */
  room?: string;
  note?: string;
};

export type Leg = {
  to: string;
  mode: string;
  app?: string;
  appUrl?: string;
  note?: string;
};

export type Stop = {
  id: string;
  kind: "place" | "travel";
  name: string;
  country: Country;
  /** Nights for a place stop. */
  nights?: number;
  /** Days on the move for a travel leg. */
  days?: number;
  blurb: string;
  hostel?: Hostel;
  dos?: DoItem[];
  /** How you get from here to the next stop. */
  leg?: Leg;
};

/** A point on the route map. `detailed` = has a stop card to link to. */
export type RoutePoint = {
  id: string;
  n: number;
  name: string;
  country: Country;
  /** Position in the map's 0–600 (x) / 0–800 (y) viewBox. */
  x: number;
  y: number;
  detailed?: boolean;
};

export const trip = {
  who: "Imogen",
  title: "Southeast Asia",
  subtitle: "your first big one",
  start: "2026-07-21", // rough — we'll tune this together
  weeks: "about 5 weeks",
  routeLine: "Chiang Mai → Laos → Vietnam, top to bottom",
  intro:
    "Hey Im. You're about to have the best few months of your life. I've done this exact trip, so I've dumped everything I know in here for you to just follow along. It's built for your phone, so keep it open as you go. The dates are rough, we'll tweak them together, and you can message me whenever you get stuck.",
};

// ── Apps you'll actually use ───────────────────────────────────────────────
export const apps: AppItem[] = [
  {
    name: "Hostelworld",
    tagline: "Every hostel you book",
    url: "https://www.hostelworld.com",
    note: "The reviews are honest and it's what everyone uses. Book a couple of nights at a time, then extend once you've seen the place and met people.",
  },
  {
    name: "12go.asia",
    tagline: "Buses, boats and trains",
    url: "https://12go.asia",
    note: "Book travel across the whole region. It's in English and you pay online. Easy.",
  },
  {
    name: "Vexere",
    tagline: "Buses in Vietnam",
    url: "https://vexere.com",
    note: "Once you're in Vietnam, use this for buses instead. It's what the locals use, and you can actually see the bus before you book, which helps a lot.",
  },
];

// ── How to travel (the stuff nobody tells you) ─────────────────────────────
export const tips: Tip[] = [
  {
    title: "Be social, follow your people",
    body: "Talk to the staff and talk to your dorm. I met people in Chiang Mai and ended up travelling with them through Laos and Vietnam. That was the best part of the whole thing. Don't overthink the plan, follow the good people you meet.",
  },
  {
    title: "Book through the hostel",
    body: "At every hostel, book your activities and your next journey through reception. They're so helpful, they sort it all for you, and they almost always get you the cheapest price.",
  },
  {
    title: "Take night buses",
    body: "Where you can, take the overnight buses. You sleep while you move, so you don't waste a day getting somewhere. The sleeper ones are generally comfy.",
  },
  {
    title: "Stay flexible",
    body: "Book a few nights, not your whole stay. If you love a place or the people, extend. If not, move on. Most hostels you can book the night before, but a few of the best ones fill up days ahead, so watch for those.",
  },
];

// ── The route, in order ────────────────────────────────────────────────────
export const stops: Stop[] = [
  {
    id: "chiang-mai",
    kind: "place",
    name: "Chiang Mai",
    country: "Thailand",
    nights: 4,
    blurb:
      "Start here. The best hostel I stayed in anywhere in Asia, and the most social. This is where the trip really begins and where you'll meet your people.",
    hostel: {
      name: "Stamps Backpackers",
      url: "https://www.hostelworld.com/pwa/s?q=Chiang%20Mai,%20Thailand&country=Thailand&city=Chiang%20Mai&type=city&id=831&from=2026-08-06&to=2026-08-14&guests=2&HostelNumber=265137&MoreOptions=true&page=1",
      maps: "Stamps Backpackers Hostel, Chiang Mai",
      room: "Deluxe 6 Bed Mixed Dorm Ensuite",
      note: "Worth the extra few dollars a night. This one's so good it books out a few days ahead, so reserve it before you fly. Super social, the whole place hangs out together.",
    },
    dos: [
      {
        name: "Cooking with Sammy",
        note: "A Thai cooking class, so much fun. Ask reception for Sammy.",
        maps: "Cooking with Sammy, Chiang Mai",
        kind: "do",
      },
      {
        name: "Sticky Waterfall",
        note: "A waterfall you can literally walk up. Book it through the hostel.",
        maps: "Bua Tong Sticky Waterfall, Chiang Mai",
        kind: "do",
      },
      {
        name: "See a Muay Thai fight",
        note: "Go to a live fight night. Loud, fun, very Thailand.",
        maps: "Muay Thai stadium, Chiang Mai",
        kind: "night",
      },
      {
        name: "A night out with the hostel",
        note: "They run a social night out. Go to it, that's how the group forms.",
        kind: "night",
      },
      {
        name: "The old town and night markets",
        note: "Spend a day wandering the markets and the temples.",
        maps: "Chiang Mai Old Town",
        kind: "do",
      },
      {
        name: "Neng Roasted Pork",
        note: "Michelin-listed roast pork. Eat here before you leave Thailand, you won't get it again after this.",
        maps: "Neng Roasted Pork, Chiang Mai",
        kind: "food",
      },
      {
        name: "Elephant sanctuary + the water park",
        note: "I didn't do these but they looked great if you've got the days.",
        kind: "optional",
      },
    ],
    leg: {
      to: "Luang Prabang, Laos",
      mode: "Bus to Chiang Rai, then the 2-day slow boat down the Mekong",
      app: "Book through the hostel (or 12go)",
      appUrl: "https://12go.asia",
      note: "It's the classic way to cross into Laos and it makes total sense geographically. Lock it in a day or two ahead.",
    },
  },
  {
    id: "slow-boat",
    kind: "travel",
    name: "The slow boat",
    country: "Laos",
    days: 2,
    blurb:
      "Two days down the Mekong with an overnight stop in Pak Beng. It sounds long but it was one of the best bits, especially once you've made mates to do it with. Bring snacks, a book, and something soft to sit on.",
    leg: {
      to: "Luang Prabang",
      mode: "You land right in Luang Prabang",
      note: "You'll roll off the boat with a whole new crew of friends.",
    },
  },
  {
    id: "luang-prabang",
    kind: "place",
    name: "Luang Prabang",
    country: "Laos",
    nights: 4,
    blurb:
      "My favourite place in Laos. Beautiful, relaxed, great food, and an easy place to just be for a few days.",
    hostel: {
      name: "Jam Hostel",
      maps: "Jam Hostel, Luang Prabang",
      note: "Really cool spot, great crowd.",
    },
    dos: [
      {
        name: "Late-night bowling",
        note: "When the bars close, everyone ends up at the bowling alley. Random and so fun.",
        maps: "Luang Prabang Bowling Alley",
        kind: "night",
      },
    ],
    leg: {
      to: "Northern Vietnam",
      mode: "Heading toward Hanoi and the north",
      note: "Still writing this leg, more coming soon.",
    },
  },
];

// ── The map: full intended route. Detailed points link to a stop card. ─────
// Coords are in the RouteMap's 0–600 (x) / 0–800 (y) viewBox, placed roughly
// by real geography (Chiang Mai NW → Luang Prabang → Hanoi → coast → south).
export const route: RoutePoint[] = [
  { id: "chiang-mai", n: 1, name: "Chiang Mai", country: "Thailand", x: 99, y: 265, detailed: true },
  { id: "luang-prabang", n: 2, name: "Luang Prabang", country: "Laos", x: 225, y: 211, detailed: true },
  { id: "hanoi", n: 3, name: "Hanoi", country: "Vietnam", x: 374, y: 156 },
  { id: "hue-hoi-an", n: 4, name: "Huế & Hội An", country: "Vietnam", x: 456, y: 389 },
  { id: "nha-trang", n: 5, name: "Nha Trang", country: "Vietnam", x: 508, y: 583 },
  { id: "hcmc", n: 6, name: "Ho Chi Minh City", country: "Vietnam", x: 406, y: 655 },
];

// ── Rough date helper ──────────────────────────────────────────────────────
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function addDays(iso: string, days: number): string {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
function label(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

export type StopDates = { from: string; to: string; nights?: number; days?: number };

/** Walk the stops from trip.start, accumulating nights/days into rough dates. */
export function buildItinerary(): Record<string, StopDates> {
  let cursor = trip.start;
  const out: Record<string, StopDates> = {};
  for (const s of stops) {
    const len = s.nights ?? s.days ?? 0;
    const from = cursor;
    const to = addDays(cursor, len);
    out[s.id] = { from: label(from), to: label(to), nights: s.nights, days: s.days };
    cursor = to;
  }
  return out;
}

/** "21 Jul – 25 Aug" style label for the whole trip header. */
export function tripDateLabel(): string {
  const it = buildItinerary();
  const ids = stops.map((s) => s.id);
  const first = it[ids[0]];
  // Trip end is rough: the last detailed stop + a buffer to the planned end.
  return `${first?.from ?? "21 Jul"} – 25 Aug`;
}

export function mapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
