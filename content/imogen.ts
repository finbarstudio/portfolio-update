// ─────────────────────────────────────────────────────────────────────────
// Imogen's Asia — all the content for the /imogen travel guide in ONE place.
// Finbar edits this file; the page renders from it. Add a stop = add an object
// to `stops`. Dates are computed from `trip.start` + each stop's nights/days,
// so changing the nights re-flows every date after it. Side trips (side: true)
// are skipped by the date maths since their timing is still up in the air.
// Everything is rough and meant to be tweaked.
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
  /** Side trip / optional detour — excluded from the running date flow. */
  side?: boolean;
  /** Shown in place of dates for a side trip, e.g. "Side trip · 2–3 days if you go". */
  sideNote?: string;
  blurb: string;
  hostel?: Hostel;
  dos?: DoItem[];
  /** How you get from here to the next stop. */
  leg?: Leg;
};

/** A point on the route map. `detailed` = has a stop card to link to. */
export type RoutePoint = {
  id: string;
  /** Spine number; omitted for side trips. */
  n?: number;
  name: string;
  country: Country;
  /** Position in the map's 0–600 (x) / 0–800 (y) viewBox. */
  x: number;
  y: number;
  detailed?: boolean;
  /** A spur off the main line (e.g. Pai) rather than a spine stop. */
  side?: boolean;
  /** For a side spur, the spine point id it branches from. */
  from?: string;
  /** Force the label to the other side of the pin. */
  flip?: boolean;
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
    name: "Grab",
    tagline: "Taxis (and food)",
    url: "https://www.grab.com",
    note: "Get this everywhere in SE Asia. It's the local Uber for taxis and tuk-tuks, with the price agreed up front so there's no haggling. It does food delivery too.",
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
    note: "Once you're in Vietnam, use this for buses instead. It's what the locals use, you can actually see the bus before you book, and it's far cheaper than 12go there.",
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
    title: "Renting a moped",
    body: "Mopeds are the best way to explore. Look for a rental with good reviews, but honestly the best move is to ask the hostel staff who they'd use, as long as they seem trustworthy and aren't just pushing a mate's shop, which is where scams happen. And always film a slow video all the way around the bike before you ride off, so nobody can pin existing scratches on you.",
  },
  {
    title: "Stay flexible",
    body: "Book a few nights, not your whole stay. If you love a place or the people, extend. If not, move on. Most hostels you can book the night before, but a few of the best ones fill up days ahead, so watch for those.",
  },
];

// ── One serious safety note (drinks / methanol) ────────────────────────────
export const safety = {
  title: "One serious thing: drinks",
  body: "Please read this one properly. Laos is noticeably poorer than Thailand and Vietnam, which is part of what makes it such an interesting place to see, but a lot of the local spirits are home-made and the methanol in them can be dangerously high. In 2024, several young backpackers died in Vang Vieng after drinking tainted spirits. So keep it simple: stick to beer (that's all I drank the whole time in Laos, and it's a good habit anywhere in Asia), and only drink spirits if you actually watch the bottle being opened in front of you. Be wary of free shots and very cheap spirits. This can happen in any hostel, so look out for yourself and the people you're with.",
  closer:
    "None of this is to scare you off anywhere, least of all Vang Vieng. It's just so you can be smart and still have a brilliant time. Vietnam felt much safer to me anyway, and the people there are honestly the best of the whole trip.",
  linkText: "What happened in Vang Vieng",
  linkUrl: "https://en.wikipedia.org/wiki/2024_Laos_methanol_poisoning",
};

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
        name: "Khao Soi",
        note: "The northern coconut curry noodle soup. A Chiang Mai speciality, get it while you're up here.",
        maps: "Khao Soi Chiang Mai",
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
      note: "It's the classic way to cross into Laos and makes total sense geographically. Lock it in a day or two ahead. (Optional: you can skip Laos and fly straight to Vietnam if you're tight on time, but you'd miss Luang Prabang and Vang Vieng, which are both worth it. See the Pai side trip below too.)",
    },
  },
  {
    id: "pai",
    kind: "place",
    side: true,
    name: "Pai",
    country: "Thailand",
    sideNote: "Side trip from Chiang Mai · 2–3 days if you go",
    blurb:
      "A little hippie town up in the hills, kind of like Nimbin. I didn't fall head over heels for it, but I get the appeal, and plenty of people fall into the \"Pai hole\" and never leave. Honestly, I'd still say go if you've got the days. We'll sort the timing nearer the trip and maybe bump this up the list.",
    dos: [
      {
        name: "Pai Canyon",
        note: "Narrow ridges and big drops with great views. Really cool, especially near sunset.",
        maps: "Pai Canyon",
        kind: "do",
      },
      {
        name: "Pai Vinyl & Sky Lounge",
        note: "Chilled spot for a drink with a good vibe.",
        maps: "Pai Vinyl and Sky Lounge",
        kind: "night",
      },
    ],
    leg: {
      to: "The road from Chiang Mai",
      mode: "Bus from the Chiang Mai hostel, or ride it yourself on a moped",
      note: "Heads up: it's one of the windiest roads in Thailand, hundreds of hairpin bends, so loads of people get carsick on the bus (take a motion-sickness tablet). Riding it on a moped is stunning, but it's the most full-on ride of the whole trip: misty most of the year, steep drops, 180-degree hairpins, and fast local drivers cutting the corners. Only if you're a confident rider.",
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
      "My favourite place in Laos and one of my standout spots of the whole trip. It has this surprising European feel left over from the old French-colonial days, really pretty and walkable, with great food.",
    hostel: {
      name: "Jam Hostel",
      maps: "Jam Hostel, Luang Prabang",
      note: "Really cool spot, great crowd.",
    },
    dos: [
      {
        name: "The night market",
        note: "One of the best night markets going. Go hungry, the food alley is unreal.",
        maps: "Luang Prabang Night Market",
        kind: "food",
      },
      {
        name: "Kuang Si Falls",
        note: "A gorgeous day trip out to bright turquoise pools you can swim in.",
        maps: "Kuang Si Falls",
        kind: "do",
      },
      {
        name: "Mount Phousi",
        note: "Climb the hill in the middle of town for sunset over the rivers.",
        maps: "Mount Phousi Luang Prabang",
        kind: "do",
      },
      {
        name: "UXO Bomb Museum",
        note: "Sobering but worth it. Laos is one of the most heavily bombed countries in history and this tells that story.",
        maps: "UXO Lao Visitor Centre Luang Prabang",
        kind: "do",
      },
      {
        name: "Late-night bowling",
        note: "When the bars close, everyone ends up at the bowling alley. Random and so fun.",
        maps: "Luang Prabang Bowling Alley",
        kind: "night",
      },
    ],
    leg: {
      to: "Vang Vieng",
      mode: "Bus south to Vang Vieng (a few hours)",
      note: "Easy hop, and Vang Vieng turned out to be a highlight.",
    },
  },
  {
    id: "vang-vieng",
    kind: "place",
    name: "Vang Vieng",
    country: "Laos",
    nights: 2,
    blurb:
      "Don't let the safety note put you off, Vang Vieng was one of my favourites. Big limestone-mountain scenery and a proper backpacker buzz, and it's the kind of place that's the best with a group of friends. I'll add the specifics on what to do here soon. Just be drink-smart while you're here (see the note above).",
    hostel: {
      name: "Golden Dragon House",
      url: "https://www.hostelworld.com/pwa/hosteldetails.php/Golden-Dragon-House/Vang-Vieng/327611?from=2026-06-29&to=2026-07-02&guests=2#position=1",
      maps: "Golden Dragon House, Vang Vieng",
      note: "Stayed here and it was good. Go with a group of friends and you're set.",
    },
    leg: {
      to: "Vientiane",
      mode: "Bus on to Vientiane",
      note: "Short leg down to the capital to set up the crossing into Vietnam.",
    },
  },
  {
    id: "vientiane",
    kind: "place",
    name: "Vientiane",
    country: "Laos",
    nights: 1,
    blurb:
      "I'll be honest, this was my least favourite stop, and the rest of Laos after Luang Prabang and Vang Vieng didn't do much for me. But you pass through the capital to catch the bus into Vietnam, so think of it as a one-night transit stop, then move on.",
    leg: {
      to: "Northern Vietnam (Hanoi)",
      mode: "Overnight bus from Vientiane across the border into Vietnam",
      app: "Book on 12go (or Vexere once you're in)",
      appUrl: "https://12go.asia",
      note: "Fair warning: this overnight bus is long, rough, hard to book and mostly locals, so it's the least fun leg of the trip. It's the price of doing Laos. If that really puts you off, the alternative is to skip Laos altogether and fly Thailand to Vietnam (you'd miss Luang Prabang and Vang Vieng though). I'll firm up my recommendation on this. Still writing the Vietnam stops, more soon.",
    },
  },
];

// ── The map: full intended route. Detailed points link to a stop card. ─────
// Coords are in the RouteMap's 0–600 (x) / 0–800 (y) viewBox, placed roughly
// by real geography (Chiang Mai NW → down through Laos → Hanoi → coast → south).
// Pai is a side spur off Chiang Mai. The Laos cluster (LP/Vang Vieng/Vientiane)
// is nudged + label-flipped so the pins don't collide on a small screen.
export const route: RoutePoint[] = [
  { id: "chiang-mai", n: 1, name: "Chiang Mai", country: "Thailand", x: 99, y: 265, detailed: true },
  { id: "pai", name: "Pai", country: "Thailand", x: 78, y: 237, detailed: true, side: true, from: "chiang-mai", flip: true },
  { id: "luang-prabang", n: 2, name: "Luang Prabang", country: "Laos", x: 220, y: 206, detailed: true },
  { id: "vang-vieng", n: 3, name: "Vang Vieng", country: "Laos", x: 252, y: 258, detailed: true, flip: true },
  { id: "vientiane", n: 4, name: "Vientiane", country: "Laos", x: 236, y: 312, detailed: true },
  { id: "hanoi", n: 5, name: "Hanoi", country: "Vietnam", x: 374, y: 156 },
  { id: "hue-hoi-an", n: 6, name: "Huế & Hội An", country: "Vietnam", x: 456, y: 389 },
  { id: "nha-trang", n: 7, name: "Nha Trang", country: "Vietnam", x: 508, y: 583 },
  { id: "hcmc", n: 8, name: "Ho Chi Minh City", country: "Vietnam", x: 406, y: 655 },
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

/** Walk the stops from trip.start, accumulating nights/days into rough dates.
 *  Side trips don't consume the timeline, so they're skipped. */
export function buildItinerary(): Record<string, StopDates> {
  let cursor = trip.start;
  const out: Record<string, StopDates> = {};
  for (const s of stops) {
    if (s.side) continue;
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
  const first = it[stops[0].id];
  // Trip end is rough: a buffer out to the planned end of the trip.
  return `${first?.from ?? "21 Jul"} – 25 Aug`;
}

export function mapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
