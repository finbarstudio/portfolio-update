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
  /** Extra labelled links (e.g. two scenic route links). */
  links?: { label: string; url: string }[];
  kind?: "do" | "food" | "night" | "optional";
  /** Recommendation strength → colour-codes the item. Finbar's /10 goes in rating. */
  rec?: "must" | "low";
  rating?: number;
  /** Gold-star highlight — the single standout (e.g. Dinh's trek). */
  star?: boolean;
  /** Small images shown in the expanded detail; tap to enlarge. */
  imgs?: string[];
  /** A pointer back to a tip/section at the top, e.g. {label:"Moped tips", href:"#learnt"}. */
  tip?: { label: string; href: string };
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
  /** Recommendation strength → colour-codes the item. Finbar's /10 goes in rating. */
  rec?: "must" | "low";
  rating?: number;
  /** Small images shown in the expanded detail; tap to enlarge. */
  imgs?: string[];
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
  /** Place-level /10 and a one-word vibe, shown as tags on the collapsed card. */
  rating?: number;
  vibe?: string;
  /** Nights for a place stop. */
  nights?: number;
  /** Days on the move for a travel leg. */
  days?: number;
  /** Optional / not-fully-done stop — greyed off and left out of the timeline. */
  muted?: boolean;
  /** Side trip / optional detour — excluded from the running date flow. */
  side?: boolean;
  /** Shown in place of dates for a side trip, e.g. "Side trip · 2–3 days if you go". */
  sideNote?: string;
  /** Pill label for a side trip (defaults to "Side trip"). */
  sideLabel?: string;
  blurb: string;
  /** One hostel, or use `hostels` for a couple of options. */
  hostel?: Hostel;
  hostels?: Hostel[];
  dos?: DoItem[];
  /** How you get from here to the next stop. */
  leg?: Leg;
};

/** A point on the route map. `detailed` = has a stop card to link to. */
export type RoutePoint = {
  id: string;
  /** Spine number; omitted for side trips and pass-through waypoints. */
  n?: number;
  name: string;
  country: Country;
  /** Real coordinates; projected onto the map viewBox by project() in geo.ts. */
  lon: number;
  lat: number;
  detailed?: boolean;
  /** A spur off the main line (e.g. Pai) rather than a spine stop. */
  side?: boolean;
  /** On the route line but just passed through, not a stay (e.g. Vientiane). */
  waypoint?: boolean;
  /** For a side spur, the spine point id it branches from. */
  from?: string;
  /** Force the label to the other side of the pin. */
  flip?: boolean;
};

export const trip = {
  who: "Imogen",
  title: "Southeast Asia",
  subtitle: "my rough route",
  start: "2026-07-21", // rough start, tune as needed
  end: "2026-08-25",
  weeks: "about 5 weeks",
  routeLine: "Chiang Mai → Laos → Vietnam, top to bottom",
  intro:
    "Everything I'd do out here, in one place. Grab what's useful, ignore the rest. The dates are rough, just a sketch to move around.",
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
    note: "In English, pay online. This is the one for complicated multi-leg trips (like Laos into Vietnam): search your start and end and it chains the buses and boats together for you.",
  },
  {
    name: "Vexere",
    tagline: "Single trips in Vietnam",
    url: "https://vexere.com",
    note: "Once you're inside Vietnam and just booking a single trip, use this. It's what the locals use, you can see the actual bus before you book, and it's far cheaper than 12go there.",
  },
  {
    name: "GetYourGuide",
    tagline: "Tours & activities",
    url: "https://www.getyourguide.com",
    note: "The best app for booking activities and day tours (the Sapa trek further down is on here). Good reviews, and you can usually cancel for free.",
  },
  {
    name: "eSIMDB",
    tagline: "Mobile data (eSIMs)",
    url: "https://esimdb.com",
    note: "Perfect for sorting a data eSIM. It compares all the providers so you get the cheapest deal, and you can set it up on your phone before you even land, no hunting for a SIM card.",
  },
];

// ── How to travel (the stuff nobody tells you) ─────────────────────────────
export const tips: Tip[] = [
  {
    title: "The people make it",
    body: "Honestly the best thing I did was just talk to people, the staff and whoever was in my dorm. I met a group in Chiang Mai and ended up travelling with them through Laos and Vietnam, and that was the whole trip really. The plan matters way less than who you end up with.",
  },
  {
    title: "Hostels can sort everything",
    body: "I booked nearly all my activities and onward travel through hostel reception. They're so helpful, they handle it for you, and it almost always came back cheaper than booking it myself.",
  },
  {
    title: "Night buses are your friend",
    body: "I took the overnight buses wherever I could. You sleep while you move so you don't lose a day getting anywhere, and the sleeper ones are genuinely comfy.",
  },
  {
    title: "My little night-bus hack",
    body: "You can grab over-the-counter meds at pretty much any pharmacy out here, no prescription. I'd take a dimenhydrinate (travel-sickness tablet) before a night bus, pass straight out, and wake up at the other end feeling fine instead of wrecked. Basically overnight teleportation, and great for the windy roads too.",
  },
  {
    title: "Mopeds (and a scam I dodged)",
    body: "Mopeds were my favourite way to explore, outside the big cities anyway. I'd ask the hostel staff who they'd rent from, as long as they're not just pushing a mate's shop, which is where the scams are. I always filmed a slow video right around the bike before riding off, so no one could pin old scratches on me. And on Google Maps, set it to motorbike mode (not car) so it keeps you off the motorways you can't ride.",
  },
  {
    title: "Google ratings can lie",
    body: "Something I picked up, especially in Vietnam: locals don't really leave Google reviews the way we do, so a lot of the high scores come from tourists that managers have sweet-talked. A huge rating often just means a place is good at working tourists. I leaned on other travellers and the hostel, and when in doubt ate where it was busy with locals.",
  },
  {
    title: "I'd keep it loose",
    body: "I only ever booked a few nights at a time, not the whole stay. If you love a place or the people, extend. If not, move on. Most hostels you can grab the night before, though a few of the best ones go a few days ahead.",
  },
  {
    title: "A Hostelworld trick",
    body: "On Hostelworld you can see how many people have booked a place for the next few nights. When a town had a couple of good options, I'd book where the most people were headed, that's where everyone ends up. You can also message a hostel through the app. Such a good app.",
  },
  {
    title: "Worth reading the history",
    body: "Vietnam's recent history is genuinely fascinating: the French colonial era, the American War, and how the country got split north and south. A bit of reading before you go (or the museums on the way) made a lot of the places hit differently for me.",
  },
];

// ── What I wish I'd done (regrets, mostly about keeping memories) ───────────
export const wishlist: Tip[] = [
  {
    title: "Kept more physical memorabilia",
    body: "I wish I'd held onto more physical bits: ticket stubs, patches, postcards, a few coins, whatever. The photos are great, but the tangible stuff is what I'd actually want on a shelf now.",
  },
  {
    title: "Shot some film",
    body: "Take a disposable or a cheap film camera alongside your phone. The grainy film shots are the ones I keep coming back to, way more than the camera roll.",
  },
  {
    title: "Kept a scrappy journal",
    body: "Even a couple of lines in your notes each night. You forget the small funny stuff so fast, and that's the gold later.",
  },
];

// ── One serious safety note (drinks / methanol) ────────────────────────────
export const safety = {
  title: "One serious thing: drinks",
  body: "Please read this one properly. Laos is noticeably poorer than Thailand and Vietnam, which is part of what makes it such an interesting place to see, but a lot of the local spirits are home-made and the methanol in them can be dangerously high. In 2024, several young backpackers died in Vang Vieng after drinking tainted spirits. So keep it simple: stick to beer (that's all I drank the whole time in Laos, and it's a good habit anywhere in Asia), and only drink spirits if you actually watch the bottle being opened in front of you. Be wary of free shots and very cheap spirits. This can happen in any hostel, so look out for yourself and the people you're with.",
  vangVieng:
    "The hostel where it happened was Nana's. It has since reopened under a new name, Vang Vieng Central Backpacker Hostel, so I'd give that one a miss. Golden Dragon (in the Vang Vieng stop below) was great.",
  closer:
    "None of this is to scare you off anywhere, least of all Vang Vieng. It's just so you can be smart and still have a brilliant time. Vietnam felt much safer to me anyway, and the people there are honestly the best of the whole trip.",
  sources: [
    { text: "What happened (Wikipedia)", url: "https://en.wikipedia.org/wiki/2024_Laos_methanol_poisoning" },
    { text: "The story (BBC)", url: "https://www.bbc.com/news/articles/ckg7x4x1lk5o" },
  ],
};

// ── Ha Giang Loop: the hostels you can book the loop through, most → least party.
// Prices are rough USD, per person, for the long 4D3N loop with an easy rider
// (self-ride is a bit cheaper). They change with season, so treat as ballpark.
export type LoopHostel = {
  name: string;
  /** 1 (quiet) – 4 (full party). */
  party: number;
  longEasyRider: string;
  selfRide?: string;
  versions: string;
  note: string;
  pick?: boolean;
};

export const loopHostels: LoopHostel[] = [
  {
    name: "Mama's",
    party: 4,
    longEasyRider: "~$180–210",
    selfRide: "~$150",
    versions: "3-day or 4-day",
    note: "A big, social party with the groups piling in together, though by all accounts the nights wind down earlier than you'd expect (around 11). Younger backpacker crowd, and the best value of the bunch. I heard great things.",
  },
  {
    name: "Jasmine",
    party: 3,
    longEasyRider: "~$290–350+",
    selfRide: "~$140–160",
    versions: "3-day or 4-day",
    note: "The premium, most-organised option (full safety kit, support van) and the priciest by a fair bit. The party reputation swings a lot by group: some call it the rowdiest, some the buttoned-up one. I heard great things either way.",
  },
  {
    name: "Bong",
    party: 3,
    longEasyRider: "~$160–200",
    selfRide: "~$130–150",
    versions: "3-day, 4-day (+ longer combos)",
    note: "What I did, and I'd 100% recommend it. It's a 3-star party, sociable and lively (karaoke and 'happy water' nights) with zero pressure to join in if you fancy an early one. The easy riders are like family and it's one of the highest-rated of the lot. Pop into their Hanoi hostel and they'll sort the whole thing for you.",
    pick: true,
  },
  {
    name: "Road Kings",
    party: 1,
    longEasyRider: "~$299",
    selfRide: "~$259",
    versions: "3-day or 4-day",
    note: "The small-group, safety-first pick (private room every night), and the one Reddit keeps recommending lately. Smaller, quieter groups, more late-20s/early-30s, drivers like dads. A touch pricey, but brilliant if a 30-bike convoy isn't your thing.",
  },
];

export const loopNote =
  "Booked through a hostel that collects you in Hanoi. Prices are rough, per person, for the long 4-day / 3-night loop with an easy rider (I double-checked these against current reviews). Self-ride is a bit cheaper, and the short 3-day version knocks roughly $30–40 off. Most include the bike or easy rider, fuel, meals, homestays, gear and the Hanoi pickup; the ~$10 border permit and drinks are usually extra. One more worth knowing about: Cheers Hostel runs a more party-leaning loop with a free Hanoi pickup if you want another option.";

// ── The route, in order ────────────────────────────────────────────────────
export const stops: Stop[] = [
  {
    id: "chiang-mai",
    kind: "place",
    name: "Chiang Mai",
    country: "Thailand",
    rating: 8,
    vibe: "social",
    nights: 4,
    blurb:
      "Start here. Stamps was the best hostel I stayed in anywhere in Asia, and the most social, this is where the trip really begins and where you'll meet your people.",
    hostel: {
      name: "Stamps Backpackers",
      rating: 10,
      url: "https://www.hostelworld.com/hostels/p/265137/stamps-backpackers-chiang-mai/",
      maps: "Stamps Backpackers Hostel, Chiang Mai",
      room: "Deluxe 6 Bed Mixed Dorm Ensuite",
      note: "Worth the extra few dollars a night. This one's so good it books out a few days ahead, so reserve it before you fly. Super social, the whole place hangs out together.",
    },
    dos: [
      {
        name: "Cooking with Sammy",
        rating: 9,
        note: "A Thai cooking class, so much fun. Ask reception for Sammy.",
        maps: "Cooking with Sammy, Chiang Mai",
        kind: "do",
      },
      {
        name: "Sticky Waterfall",
        rating: 8,
        note: "A waterfall you can literally walk up. Book it through the hostel.",
        maps: "Bua Tong Sticky Waterfall, Chiang Mai",
        kind: "do",
      },
      {
        name: "See a Muay Thai fight",
        note: "Go to a live fight night, loud and fun and very Thailand. Ask the hostel which stadium has a fight on, I don't have a specific one for you.",
        kind: "night",
      },
      {
        name: "A night out with the hostel",
        rating: 6,
        note: "They run a social night out. Go to it, that's how the group forms.",
        kind: "night",
      },
      {
        name: "North Gate Jazz Co-Op",
        rating: 8,
        note: "A must. A tiny, packed live-jazz bar by the north gate, the music spills out onto the street. Such a good night.",
        maps: "North Gate Jazz Co-Op Chiang Mai",
        kind: "night",
      },
      {
        name: "The old town and night markets",
        rating: 7,
        note: "Wander the old town and the night markets of an evening, a lovely way to spend a few hours.",
        maps: "Chiang Mai Old Town",
        kind: "night",
      },
      {
        name: "Neng Roasted Pork",
        rating: 9,
        note: "Michelin-listed roast pork. Eat here before you leave Thailand, you won't get it again after this.",
        maps: "Neng Roasted Pork, Chiang Mai",
        kind: "food",
      },
      {
        name: "Khao Soi",
        note: "The northern coconut curry noodle soup. A Chiang Mai speciality, get it while you're up here. The best one I had was actually up in Pai at Na's Kitchen, so save room for that one too.",
        maps: "Khao Soi Chiang Mai",
        kind: "food",
      },
      {
        name: "Elephant sanctuary + the water park",
        rec: "low",
        note: "I didn't do these but they looked great if you've got the days.",
        kind: "optional",
      },
    ],
    leg: {
      to: "Luang Prabang, Laos",
      mode: "Bus to Chiang Rai, then the 2-day slow boat down the Mekong",
      app: "Book it through Stamps reception",
      note: "Stamps sorts the whole thing for you. It's the classic way to cross into Laos and makes total sense geographically, so lock it in a day or two ahead. (Optional: you could skip Laos and fly straight to Vietnam if you're tight on time, but you'd miss Luang Prabang and Vang Vieng, which are both worth it.)",
    },
  },
  {
    id: "pai",
    kind: "place",
    name: "Pai",
    country: "Thailand",
    rating: 8,
    vibe: "hippie",
    nights: 2,
    blurb:
      "A little hippie town up in the hills, kind of like Nimbin. A lot of why I loved it was the people I was with, it's super social. Plenty of folks fall into the \"Pai hole\" and never leave. I went in low season so the weather was hit and miss, and I reckon better weather would lift it, but I'd still say go if you've got the days.",
    hostels: [
      {
        name: "K Bunk",
        maps: "K Bunk Hostel Pai",
        url: "https://www.hostelworld.com/hostels/p/319544/k-bunk-hostel-pai-walking-street/",
        rating: 6,
        note: "Where I stayed, right in town. Fine and social-ish with a good location, but the beds were a bit rubbish.",
      },
      {
        name: "The hippie communes (Nolo Hub / Common Grounds)",
        note: "Some people stayed a bit out of town at these laid-back commune-style places (think lots of people smoking weed) and said they were cool as. You'll want a moped to reach them. K Bunk is the in-town option if you'd rather be central.",
      },
    ],
    dos: [
      {
        name: "Ride a moped around",
        rating: 8,
        rec: "must",
        note: "Get a moped, no question. It's how you do Pai, the hills, the waterfalls, and the hippie communes are all spread out and you need one to reach them.",
        tip: { label: "Moped tips", href: "#learnt" },
        kind: "do",
      },
      {
        name: "Pai Canyon",
        rating: 8,
        note: "Narrow ridges and big drops with great views. Really cool, especially near sunset.",
        maps: "Pai Canyon",
        kind: "do",
      },
      {
        name: "Na's Kitchen",
        rating: 8,
        note: "Great food, get the khao soi.",
        maps: "Na's Kitchen Pai",
        kind: "food",
      },
      {
        name: "Banh Banh Pun",
        rating: 8,
        note: "Top sandwich spot, this place was so good.",
        maps: "Banh Banh Pun Pai",
        kind: "food",
      },
      {
        name: "Pai Vinyl & Sky Lounge",
        rating: 7,
        note: "Chilled spot for a drink with a good vibe.",
        maps: "Pai Vinyl and Sky Lounge",
        kind: "night",
      },
      {
        name: "Bros Music Bar",
        rating: 7,
        note: "A proper music bar, good for a night out.",
        maps: "Bros Music Bar Pai",
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
    rating: 8,
    vibe: "scenic",
    days: 2,
    blurb:
      "Two days down the Mekong with an overnight stop in Pak Beng. It sounds long but it was one of the best bits, especially once you've made mates to do it with. Bring snacks, a book, and something soft to sit on.",
    dos: [
      {
        name: "Sabaidee Restaurant (Pak Beng)",
        rating: 8,
        note: "On the overnight stop in Pak Beng, eat here and don't bother with anywhere else.",
        maps: "Sabaidee Restaurant Pak Beng",
        kind: "food",
      },
    ],
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
    rating: 8,
    vibe: "charming",
    nights: 4,
    blurb:
      "My favourite place in Laos and one of my standout spots of the whole trip. It has this surprising European feel left over from the old French-colonial days, really pretty and walkable, with great food.",
    hostel: {
      name: "Jam Hostel",
      rating: 9,
      maps: "Jam Hostel, Luang Prabang",
      url: "https://www.hostelworld.com/hostels/p/321537/the-jam-hostel/",
      note: "Really cool spot, great crowd.",
    },
    dos: [
      {
        name: "The night market",
        rating: 8,
        note: "One of the best night markets going. Go hungry, the food alley is unreal.",
        maps: "Luang Prabang Night Market",
        kind: "food",
      },
      {
        name: "Kuang Si Falls",
        rating: 7,
        note: "A gorgeous day trip out to bright turquoise pools you can swim in.",
        maps: "Kuang Si Falls",
        kind: "do",
      },
      {
        name: "A river cruise",
        rating: 6,
        note: "We did a cruise on the Mekong and it was lovely, a really chilled way to see it.",
        maps: "Luang Prabang Mekong river cruise",
        kind: "do",
      },
      {
        name: "Mount Phousi",
        rating: 7,
        note: "Climb the hill in the middle of town for sunset over the rivers. Easy win: not a big commitment and right by the markets and old town.",
        maps: "Mount Phousi Luang Prabang",
        kind: "do",
      },
      {
        name: "UXO Bomb Museum",
        rating: 8,
        note: "Sobering but worth it. Laos is one of the most heavily bombed countries in history and this tells that story.",
        maps: "UXO Lao Visitor Centre Luang Prabang",
        kind: "do",
      },
      {
        name: "Late-night bowling",
        rating: 8,
        note: "When the bars close, everyone ends up at the bowling alley. Random and so fun.",
        maps: "Luang Prabang Bowling Alley",
        kind: "night",
      },
    ],
    leg: {
      to: "Vang Vieng (or detour north to Nong Khiaw first)",
      mode: "High-speed train to Vang Vieng (about an hour); minivan north if you're doing Nong Khiaw",
      note: "The train's worth doing for its own sake, a sleek modern Chinese-built line dropped into a really poor country. If you've got the time though, detour north to Nong Khiaw first (next), then double back through here.",
    },
  },
  {
    id: "nong-khiaw",
    kind: "place",
    name: "Nong Khiaw",
    country: "Laos",
    muted: true,
    vibe: "mountains",
    nights: 2,
    blurb:
      "A tiny riverside village a few hours north of Luang Prabang, wrapped in limestone karst peaks that rise straight out of the Nam Ou. This is the one I'd got mixed up with Phong Nha in Vietnam: the overnight mountain camp here, sleeping up on a peak for sunset, the stars and sunrise, is the thing I kept banging on about. Sleepy, cheap, and all about the viewpoint hikes.",
    hostel: {
      name: "Nong Khiaw guesthouses",
      maps: "Nong Khiaw guesthouses Laos",
      url: "https://www.hostelworld.com/hostels/asia/laos/nong-khiaw/",
      note: "Loads of cheap riverside guesthouses, just turn up. Book the overnight camp in person once you're there (Eco Farm Stay is the known one).",
    },
    dos: [
      {
        name: "The overnight mountain camp",
        note: "The big one, and the thing I half-remembered. Instead of a brutal 4am hike you head up in the afternoon, camp on a peak, and get sunset, the stars and sunrise from the top. Around US$30pp with transport, guide, tent and meals (Eco Farm Stay run the well-known one, book in person).",
        maps: "Eco Farm Stay Nong Khiaw",
        kind: "do",
      },
      {
        name: "Pha Daeng Peak viewpoint",
        note: "The classic day hike: steep, about 1.5 to 2 hours up, for a massive view over the Nam Ou valley. Go for sunrise or sunset and bring water. Small cash entry fee.",
        maps: "Pha Daeng Peak Nong Khiaw",
        kind: "do",
      },
      {
        name: "100 Waterfalls Trek",
        note: "Run from Muang Ngoi (an even sleepier village an hour upriver by boat), a day spent climbing up through a chain of waterfalls. A proper highlight if you've got time.",
        maps: "100 Waterfalls Trek Nong Khiaw",
        kind: "do",
      },
      {
        name: "Muang Ngoi",
        note: "An hour up the river by boat, even quieter and more beautiful. Worth a night if you want to properly slow down.",
        maps: "Muang Ngoi Laos",
        kind: "do",
      },
    ],
    leg: {
      to: "Back to Luang Prabang, then Vang Vieng",
      mode: "Minivan back to Luang Prabang (~3 to 4 hours), then the train south",
      note: "It's a there-and-back detour north, so you come back through Luang Prabang before carrying on south.",
    },
  },
  {
    id: "vang-vieng",
    kind: "place",
    name: "Vang Vieng",
    country: "Laos",
    rating: 9,
    vibe: "scenic",
    nights: 3,
    blurb:
      "Plot twist: this ended up being my actual favourite place on the whole trip. It's got a strange edge to it, the whole of Laos honestly, it can feel a bit lawless and like the place runs on its own rules. But the scenery is unreal, it's the most beautiful spot of the trip to ride a moped around, and the nature stuff is the real draw. Go with a group, lean into the outdoors, and just be drink-smart (see the note above).",
    hostel: {
      name: "Golden Dragon House",
      rating: 8,
      url: "https://www.hostelworld.com/pwa/hosteldetails.php/Golden-Dragon-House/Vang-Vieng/327611?from=2026-06-29&to=2026-07-02&guests=2#position=1",
      maps: "Golden Dragon House, Vang Vieng",
      note: "Stayed here and it was good. Go with a group of friends and you're set.",
    },
    dos: [
      {
        name: "Rent a moped",
        rating: 9,
        note: "Do this, it's a must. The scenery here is unreal and riding around it is the best way to see it.",
        tip: { label: "Moped tips", href: "#learnt" },
        kind: "do",
      },
      {
        name: "Nam Xay Viewpoint",
        note: "I didn't actually make it up here myself, but everyone who did rated it, the classic Vang Vieng view over the valley. Pair it with Blue Lagoon 3 on the moped.",
        maps: "Nam Xay Viewpoint, Vang Vieng",
        kind: "do",
      },
      {
        name: "Blue Lagoon 3",
        rating: 8,
        note: "The best of the three blue lagoons. Pair it with Nam Xay in one day on the moped.",
        maps: "Blue Lagoon 3, Vang Vieng",
        kind: "do",
      },
      {
        name: "Paragliding",
        rec: "must",
        rating: 10,
        note: "You have to do this. Book an early-morning or late-afternoon flight, it was amazing.",
        maps: "Vang Vieng paragliding",
        kind: "do",
      },
      {
        name: "Gary's Irish Bar (The Rising Sun)",
        rating: 9,
        note: "Right across the road from Golden Dragon, so handy. Pool table, music, stays open late-ish. So sick, this was the spot.",
        maps: "Gary's Irish Bar The Rising Sun Vang Vieng",
        kind: "night",
      },
      {
        name: "Jaidee Bar",
        rating: 7,
        note: "A decent bar in its own right. Quick heads-up so it's not a surprise: bars here will openly offer you drugs if you ask, which is wild given how illegal it all is in Laos. Everyone seems to know, but the smart move is to steer well clear.",
        tip: { label: "Read the drinks heads-up", href: "#heads-up" },
        maps: "Jaidee Bar Vang Vieng",
        kind: "night",
      },
    ],
    leg: {
      to: "Hanoi, through Vientiane",
      mode: "Book the whole Vang Vieng → Hanoi trip on 12go",
      app: "12go (it chains the legs for you)",
      appUrl: "https://12go.asia",
      note: "It's a long one and a proper adventure. See the next card.",
    },
  },
  {
    id: "crossing",
    kind: "travel",
    name: "The crossing into Vietnam",
    country: "Vietnam",
    rating: 8,
    vibe: "an adventure",
    days: 2,
    blurb:
      "Getting from Vang Vieng to Hanoi is a mission, and honestly half the adventure. You route through Vientiane, the capital, but don't bother stopping there, it's not worth your time. Then it's a long bus to the border, where we waited around 6 hours, and the passport process was wild. The genuinely hard bit is finding a good bus in the first place, so sort it in advance and brace yourself. In the moment it's a 5/10, but the second it's over it's an 8/10 story, and having someone next to you makes it.",
    leg: {
      to: "Hanoi",
      mode: "One 12go booking from Vang Vieng covers the whole chain",
      app: "12go",
      appUrl: "https://12go.asia",
      note: "This is exactly the kind of complicated multi-leg trip 12go is best for. Save Vexere for single trips once you're inside Vietnam.",
    },
  },
  {
    id: "hanoi",
    kind: "place",
    name: "Hanoi",
    country: "Vietnam",
    rating: 9,
    vibe: "buzzy",
    nights: 3,
    blurb:
      "And then Hanoi, which is amazing. About 3 days is right, there's loads to do. Stay in the Old Quarter, that's where you want to be. Don't hire a moped here, just walk the Old Quarter and use Grab for anything further out. The food is incredible and most of it's within walking distance, so wander and graze, and ask your hostel or locals for spots rather than trusting Google. I wouldn't bother with day trips here, just take the city in. Same as everywhere, meet people and see where they're headed next. Honestly I was eating banh mi every single day.",
    hostels: [
      {
        name: "Lake View",
        rating: 8,
        maps: "Lake View Hostel, Hanoi Old Quarter",
        url: "https://www.hostelworld.com/hostels/p/326518/lake-view-backpackers-hostel-rooftop-bar/",
        note: "Where I stayed the second time round. Slightly more social, and a slightly better location.",
      },
      {
        name: "The One",
        rating: 8,
        maps: "The One Hostel, Hanoi Old Quarter",
        url: "https://www.hostelworld.com/hostels/p/319525/the-one-hostel-and-rooftop-pool-hanoi/",
        note: "Where I stayed first. A touch more upmarket but somehow even cheaper, so great value. Both are in the Old Quarter.",
      },
    ],
    dos: [
      {
        name: "Wander the Old Quarter",
        rating: 9,
        note: "Spend a morning, maybe 4 hours, just wandering. There are about five parallel streets full of shops, you'll find them as you go. Grab some food while you're at it.",
        maps: "Hanoi Old Quarter",
        kind: "do",
      },
      {
        name: "The replica shops",
        note: "Inside the Old Quarter there's a great selection of replica gear, Arc'teryx jackets, shoes, all sorts. The proper shopping is just outside the Old Quarter.",
        kind: "do",
      },
      {
        name: "Đồng Xuân Market",
        rating: 7,
        note: "Cool for fake clothes, and just a nice hour wandering around.",
        maps: "Dong Xuan Market Hanoi",
        kind: "do",
      },
      {
        name: "Hanoi Train Street",
        rating: 9,
        note: "Go one evening to watch the train squeeze right through the houses. Awesome.",
        maps: "Hanoi Train Street",
        kind: "night",
      },
      {
        name: "Banh Mi 25",
        rating: 9,
        note: "The best banh mi in the city. (I wasn't kidding about eating it every day.)",
        maps: "Banh Mi 25 Hanoi",
        kind: "food",
      },
      {
        name: "Pho 10",
        rating: 7,
        note: "Good pho. Not my favourite and a little overrated, but still worth a go.",
        maps: "Pho 10 Hanoi",
        kind: "food",
      },
      {
        name: "Egg coffee",
        rating: 7,
        note: "A fun novelty to try while you're here.",
        maps: "egg coffee Hanoi",
        kind: "food",
      },
      {
        name: "Ho Chi Minh's Mausoleum",
        rating: 8,
        note: "Worth a look while you're in the city.",
        maps: "Ho Chi Minh Mausoleum Hanoi",
        kind: "do",
      },
    ],
    leg: {
      to: "The north, then south",
      mode: "Use Hanoi as your base: the Ha Giang Loop, Sapa and Halong Bay are all from here (next), then carry on down the coast",
      note: "Do the northern bits below, then point yourself south.",
    },
  },
  {
    id: "ha-giang",
    kind: "place",
    name: "Ha Giang Loop",
    country: "Vietnam",
    rating: 10,
    vibe: "epic",
    nights: 4,
    blurb:
      "The most famous thing to do up north, and a proper must. Ha Giang is a province right up on the Chinese border, and \"the loop\" is a big multi-day motorbike circuit through it. There's a short and a long version, do the long one. You book it through a hostel and they handle everything: they pick you up in Hanoi, drive you up to Ha Giang, and you stay the night there. The way it works is the magic of it: there's a huge crowd (like 200 people) but you're split into small groups, so all day, riding to your activities and along the route, it's just your little group and your riders. You get really close with them. Then every evening the whole 200 reunites at a homestay: a big meal, karaoke, all the guides and riders together. That's the best bit. And the homestays are in tiny local villages, so it's not a hotel, it's real life. We got taken to our rider's own home, fed his buffalo in his garden, met his family, saw all this cool local stuff you'd never find on your own. Ride your own bike if you hire one, or take an \"easy rider\" (sit on the back while a local drives), I'd get the easy rider every time: far less stressful, the roads are tough, the riders grew up on them, and you can actually look up and take it in. Don't stress the planning, once you're on the loop your days are completely sorted. So amazing.",
    dos: [
      {
        name: "PIZZAHERE (the pizza near Bong)",
        rating: 8,
        note: "You get a night in Ha Giang before the loop (and sometimes one after). If you're staying at Bong it's right nearby. We ate pizza here and it was so good.",
        maps: "PIZZAHERE Ha Giang Vietnam",
        kind: "food",
      },
      {
        name: "The top of the loop",
        rating: 8,
        note: "The high passes are the best of it. When you're up at the top, with the road dropping away on both sides, that's the whole thing right there.",
        kind: "do",
      },
      {
        name: "Rooftop at the Tuan Son Building",
        note: "A cool rooftop for food and drinks in Ha Giang town.",
        maps: "Tuan Son Building, 38 Hai Bà Trưng, Hà Giang, Vietnam",
        kind: "night",
      },
    ],
    leg: {
      to: "Booking it",
      mode: "Book through one of the loop hostels below, they collect you in Hanoi",
      note: "Easiest move: pop into Bong Hostel in Hanoi and they'll help you sort the lot. Have a chat with your friends about the vibe you want, then just book it.",
    },
  },
  {
    id: "sapa",
    kind: "place",
    name: "Sapa",
    country: "Vietnam",
    rating: 9,
    vibe: "mountains",
    nights: 3,
    blurb:
      "A mountain town up in the far north, and a brilliant one. It's a genuinely odd place, styled like a European ski resort but full of Chinese tourists, since it's right by the border. After the loop you'll be knackered and short on sleep, so it's the perfect reset. One heads-up: Sapa has a real problem with kids selling things in the streets instead of being at school. It's tied to poverty and it's a bit confronting. Dinh's tour below is part of the answer to it.",
    hostels: [
      {
        name: "Lady Hill Resort",
        rating: 10,
        maps: "Lady Hill Sapa Resort",
        url: "https://www.booking.com/hotel/vn/lady-hill-sapa-resort.html",
        note: "Not a hostel, a proper hotel that blew up on TikTok. Pricey for a backpacker but so worth it after the loop: the infinity pool and the view are insane, and I did a massage and aromatherapy. We extended because we didn't want to leave.",
      },
      {
        name: "Lustig Hostel",
        rating: 7,
        maps: "Lustig Hostel Sapa",
        url: "https://www.hostelworld.com/hostels/p/290292/lustig-hostel/",
        note: "It is what it is, a normal hostel that did the job. We got in late off the loop and needed a bed. Sapa isn't really a hostel town, but this is fine if you'd rather keep it cheap.",
      },
    ],
    dos: [
      {
        name: "Explore Sapa: 2D1N trek & homestay with Dinh",
        rec: "must",
        rating: 10,
        star: true,
        note: "The best thing I did on the whole trip, honestly an 11/10, gold star it. Dinh takes you trekking through the rice fields, then you stay at her homestay up the hill, where she runs a little school for local kids whose families can't afford one. We were there on graduation day: the kids put on a talent show, we judged it, and everyone was in tears by the end. Unforgettable. Book it on GetYourGuide.",
        url: "https://www.getyourguide.com/en-au/sa-pa-l1049/explore-sapa-2d1n-trekking-hmong-culture-with-dinh-t737160/",
        kind: "do",
      },
      {
        name: "The spa at Lady Hill",
        note: "Infinity pool, massage, aromatherapy, and that view. After the loop, treat yourself.",
        kind: "do",
      },
    ],
    leg: {
      to: "Getting there",
      mode: "Bus or sleeper from Hanoi (about 6 hours), then back to Hanoi after",
      note: "Handy tip: when you book the loop with Bong they'll ask if you want to come back to Hanoi or carry straight on, and you can have them drop you towards Sapa instead of doubling back. We got in late off the loop and went straight there. Otherwise it's an easy book through your Hanoi hostel. From Sapa you loop back through Hanoi and out to Halong Bay (below), or carry straight south if you'd rather.",
    },
  },
  {
    id: "halong-bay",
    kind: "place",
    name: "Halong Bay",
    country: "Vietnam",
    rating: 7,
    vibe: "scenic",
    nights: 1,
    blurb:
      "Worth doing, it was fun as hell, but realistically it's about a one-day thing and it can be a bit out of the way once you're heading south. Mine got storm-delayed so we got messed around a bit. One tip: skip Cat Ba Island. We went and it was a waste of time, desolate, nothing going on.",
    dos: [
      {
        name: "A Halong Bay cruise",
        rating: 8,
        note: "Do it as a day cruise out of Hanoi. Book through your hostel or on GetYourGuide. The cruise itself was an 8, I probably just didn't do the area justice.",
        url: "https://www.getyourguide.com",
        kind: "do",
      },
    ],
    leg: {
      to: "Getting there",
      mode: "Day cruise from Hanoi",
      note: "After this you're set to head south down the coast.",
    },
  },
  {
    id: "ninh-binh",
    kind: "place",
    name: "Ninh Binh",
    country: "Vietnam",
    rating: 8,
    vibe: "limestone cliffs",
    nights: 2,
    blurb:
      "First proper stop heading south, and I wouldn't skip it. Big limestone cliffs, rivers and caves, a bit like a greener Halong but on land. Rent a moped or a bicycle from the hostel and just explore. The real highlight, though, was the hostel.",
    hostel: {
      name: "Banana Tree Hostel",
      maps: "Banana Tree Hostel Ninh Binh",
      url: "https://www.hostelworld.com/hostels/p/299332/the-banana-tree-hostel/",
      rating: 9,
      note: "One of the best hostels I stayed at, genuinely. Lovely pool, right on the river, and a great spot to rent a moped or bike. Book it.",
    },
    dos: [
      {
        name: "Lying Dragon Mountain (Mua Caves)",
        rating: 9,
        note: "Drive your moped out and hike up to the top. Super cool, and the view over the karsts is unreal.",
        maps: "Mua Caves Lying Dragon Mountain Ninh Binh",
        kind: "do",
      },
      {
        name: "The Bear Sanctuary",
        rating: 8,
        note: "The sanctuary itself is an 8, but the drive out is the real 9/10. Take one of these exact scenic routes out and the other on the way back, they're both gorgeous and it's a proper must-do. You can't take a moped on the big motorway anyway, so set Google Maps to motorbike mode (or, if it won't let you, choose 'avoid motorways').",
        maps: "Bear Sanctuary Ninh Binh Vietnam",
        links: [
          { label: "Scenic route 1 (9/10)", url: "https://maps.app.goo.gl/wcD5VomY8rPUi9oD8" },
          { label: "Scenic route 2 (9/10)", url: "https://maps.app.goo.gl/f63dhKJPWcuaSjcd7" },
        ],
        kind: "do",
      },
      {
        name: "The grottos",
        rating: 7,
        note: "The little boat trips through the caves and karsts are lovely.",
        maps: "Tam Coc Ninh Binh",
        kind: "do",
      },
      {
        name: "The bus karaoke (the Local Bar)",
        rating: 8,
        note: "Right by Banana Tree: old buses converted into karaoke bars, parked up, with locals singing their hearts out. You just hang there and walk back to the hostel. So cool.",
        maps: "Boat Station Thai Vi Street Tam Coc Ninh Binh",
        kind: "night",
      },
      {
        name: "DUC DAT Fastfood and Drink",
        rating: 8,
        note: "Recommended. The family who run it were so lovely. They had 'happy water' (the homemade rice wine that becomes a running joke on the Ha Giang loop) and were thrilled to share it with us. Eat here.",
        maps: "DUC DAT Fastfood and Drink Ninh Binh",
        kind: "food",
      },
      {
        name: "Duck Farm",
        rating: 7,
        note: "Good food spot nearby.",
        maps: "Duck Farm Ninh Binh",
        kind: "food",
      },
      {
        name: "Bus Bar Pub Tam Coc",
        rating: 7,
        note: "Open late and fun. The whole hostel ends up out, just follow them.",
        maps: "Bus bar pub Tam Coc Ninh Binh",
        kind: "night",
      },
    ],
    leg: {
      to: "South to Phong Nha (or straight to Hue)",
      mode: "Bus south, book on Vexere or through the hostel",
      note: "Next is Phong Nha if you fancy it, then Hue.",
    },
  },
  {
    id: "phong-nha",
    kind: "place",
    name: "Phong Nha",
    country: "Vietnam",
    muted: true,
    vibe: "caves",
    nights: 1,
    blurb:
      "Full honesty: I skipped this one to keep moving south, but my friends raved about it and it's the one place I half wish I'd squeezed in. It's proper karst-and-jungle cave country. The thing people lose their minds over is camping overnight inside a cave and waking up for the beam of light coming through at dawn (more on that below). Most people give it 2 to 4 days. Totally up to you and how your timing's looking.",
    dos: [
      {
        name: "The caves (self-guided)",
        note: "The cheap way in: rent a moped and do the self-guided loop, Paradise Cave and the Phong Nha Cave boat trip, plus the free viewpoints along the Ho Chi Minh Highway. A good day even if you skip the big treks.",
        maps: "Phong Nha Ke Bang caves",
        kind: "do",
      },
      {
        name: "Hang En overnight cave camp",
        note: "The famous one: a jungle trek in, then you camp on the sand beach inside Hang En (one of the biggest caves on earth) and wake for the light pouring through the roof. It's run by Oxalis and it's a proper splurge (around US$330), but it's the experience people say is worth blowing the budget on once.",
        url: "https://oxalisadventure.com/tour/hang-en-adventure-cave-camp/",
        kind: "do",
      },
      {
        name: "A budget overnight (Jungle Boss)",
        note: "If Hang En's too steep, Jungle Boss run overnight jungle-and-cave camps for under US$100, the budget way to still sleep out in there. There's also a proper mountain summit, U Bo, the 'roof of Phong Nha', but that's a harder, niche 2-day trek, the cave camps are what most people do.",
        url: "https://junglebosstours.com",
        kind: "do",
      },
    ],
    leg: {
      to: "South to Hue",
      mode: "Bus south",
      note: "On to Hue, which is really about one thing (next).",
    },
  },
  {
    id: "hue",
    kind: "place",
    name: "Hue",
    country: "Vietnam",
    rating: 6,
    vibe: "quiet",
    nights: 1,
    blurb:
      "Honest take: Hue was a bit boring on its own, more of a local city than a backpacker spot, but you need it as the jumping-off point for the Hai Van Pass. The real reason to come is to ride out of it. So treat it as a quick one-nighter, then ride. And if you're not going to do the pass at all, honestly just skip Hue entirely and go straight to Hoi An.",
    dos: [
      {
        name: "Abandoned waterpark (Hồ Thuỷ Tiên)",
        rating: 6,
        note: "An eerie abandoned waterpark you can wander around. We ran out of time and didn't make it, but it looked cool. Up to you.",
        maps: "Ho Thuy Tien abandoned waterpark Hue",
        kind: "do",
      },
    ],
    leg: {
      to: "Hoi An, via the Hai Van Pass",
      mode: "The ride (next card)",
      note: "This is the bit you came for.",
    },
  },
  {
    id: "hai-van",
    kind: "travel",
    name: "The Hai Van Pass",
    country: "Vietnam",
    rating: 9,
    vibe: "the ride",
    days: 1,
    blurb:
      "This was unreal. We took easy riders on the Ha Giang loop and never drove ourselves, so we did this one on our own bikes, and it was the best. You ride from Hue up through the mountains and back down to the coast, through Da Nang and into Hoi An. It rained on us but it was warm and just so much fun.",
    dos: [
      {
        name: "Ride the pass",
        rating: 10,
        note: "Plenty of companies set it up: you ride Hue → Hoi An and they collect the bike from Hoi An at the other end. It's popular and it felt safe, I'd put the risk at about 3/10. Go with people, and convince someone to do it with you. If you'd rather not drive, you don't have to hire a jeep, you can just take a bus over instead, but the bike is so worth it. I've dropped a Google Maps route below that strings the Lang Co stops together (switch it to motorbike once it opens).",
        links: [
          {
            label: "The route, Hue → Hoi An",
            url: "https://www.google.com/maps/dir/?api=1&origin=Hue,+Vietnam&destination=Hoi+An,+Vietnam&waypoints=Six+Miles+Coast+Lang+Co%7CAn+Lagoon+Seafood+Lang+Co&travelmode=driving",
          },
        ],
        kind: "do",
      },
      {
        name: "An Bang Cemetery (City of Ghosts)",
        rating: 7,
        note: "A wild cemetery of huge, ornate, colourful tombs near the coast, nicknamed the City of Ghosts. A surreal, beautiful detour.",
        maps: "An Bang Cemetery City of Ghosts Hue Vietnam",
        kind: "do",
      },
      {
        name: "Six Miles Coast (the abandoned resort)",
        rating: 8,
        note: "A great detour on the ride: a huge abandoned resort at Lang Co you can wander around. Super cool to explore. It's on the route link above.",
        maps: "Six Miles Coast Lang Co Vietnam",
        kind: "do",
      },
      {
        name: "An Lagoon Seafood (Lang Co)",
        rating: 7,
        note: "The food wasn't the best, but that's not really the point. Pulling over at little local spots like this along the ride, for a drink, a toilet stop and a bit of local life, is half the fun.",
        maps: "AN LAGOON Seafood Master Lang Co Hue",
        kind: "food",
      },
    ],
    leg: {
      to: "Hoi An",
      mode: "You arrive into Hoi An, through Da Nang",
      note: "Once you're there you can bounce between Da Nang and Hoi An.",
    },
  },
  {
    id: "hoi-an",
    kind: "place",
    name: "Hoi An",
    country: "Vietnam",
    rating: 9,
    vibe: "peaceful",
    nights: 2,
    blurb:
      "Hoi An was my favourite place of the whole trip. You roll in at the end of the pass (through Da Nang), and honestly I don't think you'll want to leave. Hire a moped for sure. Do the hostel drinks and head out with the group on their nights, but make sure you get into the old town itself, the lanterns and the river, that's the real magic. More than anything it was peaceful, my favourite place on the whole trip to just sit and look at. To be fair there isn't a huge amount going on, but honestly that was the appeal, a calm and lovely way to end the trip.",
    hostels: [
      {
        name: "Cuckoo's Nest",
        rating: 10,
        maps: "Cuckoo's Nest Hostel Hoi An",
        url: "https://www.hostelworld.com/hostels/p/318026/the-cuckoo-s-nest-hostel-and-bar/",
        rec: "must",
        note: "Stay here. One of my two favourite hostels of the whole trip (right up there with Stamps). So social and such a good vibe, I genuinely don't think you'll want to leave. It's a little out of town though, so you'll want a moped.",
      },
      {
        name: "Fuse Hostel",
        rating: 7,
        maps: "Fuse Hostel Hoi An",
        url: "https://www.hostelworld.com/hostels/p/317286/fuse-old-town-hoi-an/",
        note: "Where I stayed in the city itself. Good facilities and the nights out were good too. Honestly you could split your stay: Fuse for being in the middle of things, Cuckoo's for the social side.",
      },
    ],
    dos: [
      {
        name: "Hire a moped",
        note: "Great for getting out to the beach and the rice paddies, but you really only need one if you're staying at Cuckoo's Nest, since it's out of town. If you're in the city itself you can walk most of it.",
        tip: { label: "Moped tips", href: "#learnt" },
        kind: "do",
      },
      {
        name: "The old town",
        rec: "must",
        rating: 9,
        note: "The heart of it: lantern-lit streets, the river, the tailors, the food. Spend your evenings here, not just at the hostel.",
        maps: "Hoi An Ancient Town",
        kind: "do",
      },
      {
        name: "Hoianese History Talk",
        rating: 9,
        note: "Really good. The guy who runs it is a super sweet, passionate local, and you come away understanding the place a lot more.",
        url: "https://hoianese.com/hoi-an-tour/hoianese-history-talk/",
        kind: "do",
      },
      {
        name: "Coconut Basket Boat Ride",
        rating: 4,
        note: "Honestly a bit naff, I'd probably skip it. It's a bit of a TikTok thing though, so plenty of people still do it.",
        maps: "Coconut Basket Boat Ride Hoi An",
        kind: "do",
      },
      {
        name: "Get a suit tailored (or cowboy boots)",
        rating: 9,
        note: "Hoi An is famous for its tailors, and it's cheap and such good value. We all got suits made (I got mine for a wedding I had in Bali straight after), and you can get cowboy boots made here too. Order early in your stay so it's done and fitted before you move on.",
        maps: "Hoi An tailors",
        kind: "do",
      },
      {
        name: "Lantern boats on the river",
        note: "At night you can take a little boat out on the river and float a lantern, the classic Hoi An moment. So pretty.",
        maps: "Hoi An lantern boat ride",
        kind: "night",
      },
      {
        name: "Hostel drinks + a night out",
        rating: 9,
        note: "Do the hostel drinks and head out with the group on their nights. Both Cuckoo's Nest and Fuse had really good nights out.",
        kind: "night",
      },
      {
        name: "Da Nang",
        note: "You come out of the hills and into Da Nang on the way in. It's got a bit of a tacky feel, loads of high-end resorts strung along the coast, and it was busy. I didn't actually stop, and I reckon you'll prefer Hoi An, but it looked kind of cool and I'd have gone with more time. You just drive through it into Hoi An.",
        maps: "Da Nang Vietnam",
        kind: "do",
      },
      {
        name: "Pizza 4P's (Indochina Riverside)",
        rating: 8,
        note: "Went one night and the pizza was genuinely great, but it's a fair way from everything. Worth it if you're bored and fancy a proper feed, otherwise maybe give it a miss.",
        maps: "Pizza 4P's Indochina Riverside Da Nang",
        kind: "food",
      },
    ],
    leg: {
      to: "Saigon, or not",
      mode: "If you carry on, it's a long way down the coast to Ho Chi Minh City (Saigon)",
      note: "Honestly you might just stay put in Hoi An, my friend did. See the Saigon card for the honest take.",
    },
  },
  {
    id: "hcmc",
    kind: "place",
    name: "Ho Chi Minh City (Saigon)",
    country: "Vietnam",
    muted: true,
    vibe: "big city",
    nights: 1,
    blurb:
      "Full honesty: this was my least favourite stop in Vietnam, and an optional one. I only went to say I'd been, and because my flight to Bali was cheaper out of here. It's a big metropolis without a lot that grabbed me, the hostels were worse, and everything's noticeably pricier. My friend just stayed on in Hoi An, which is probably the better shout unless your onward flight is cheaper from Saigon.",
    leg: {
      to: "Onward",
      mode: "Flights out of Saigon (mine went to Bali)",
      note: "And that's the end of the Vietnam run.",
    },
  },
];

// ── The map: full intended route. Detailed points link to a stop card. ─────
// Points are real lon/lat, projected onto the traced SE Asia map by project()
// in components/imogen/geo.ts. Pai is a side spur off Chiang Mai; Vientiane is
// a pass-through waypoint.
export const route: RoutePoint[] = [
  { id: "chiang-mai", n: 1, name: "Chiang Mai", country: "Thailand", lon: 98.98, lat: 18.79, detailed: true },
  { id: "pai", n: 2, name: "Pai", country: "Thailand", lon: 98.44, lat: 19.36, detailed: true },
  { id: "luang-prabang", n: 3, name: "Luang Prabang", country: "Laos", lon: 102.13, lat: 19.88, detailed: true },
  { id: "nong-khiaw", n: 4, name: "Nong Khiaw", country: "Laos", lon: 102.62, lat: 20.57, detailed: true },
  { id: "vang-vieng", n: 5, name: "Vang Vieng", country: "Laos", lon: 102.45, lat: 18.92, detailed: true },
  { id: "vientiane", name: "Vientiane", country: "Laos", lon: 102.6, lat: 17.97, waypoint: true },
  { id: "hanoi", n: 6, name: "Hanoi", country: "Vietnam", lon: 105.84, lat: 21.03, detailed: true },
  { id: "ha-giang", n: 7, name: "Ha Giang", country: "Vietnam", lon: 104.98, lat: 22.82, detailed: true },
  { id: "sapa", n: 8, name: "Sapa", country: "Vietnam", lon: 103.84, lat: 22.34, detailed: true },
  { id: "halong-bay", n: 9, name: "Halong Bay", country: "Vietnam", lon: 107.04, lat: 20.91, detailed: true },
  { id: "ninh-binh", n: 10, name: "Ninh Binh", country: "Vietnam", lon: 105.97, lat: 20.25, detailed: true },
  { id: "phong-nha", n: 11, name: "Phong Nha", country: "Vietnam", lon: 106.28, lat: 17.59, detailed: true },
  { id: "hue", n: 12, name: "Huế", country: "Vietnam", lon: 107.58, lat: 16.46, detailed: true },
  { id: "hoi-an", n: 13, name: "Hội An", country: "Vietnam", lon: 108.34, lat: 15.88, detailed: true },
  { id: "hcmc", n: 14, name: "Ho Chi Minh City", country: "Vietnam", lon: 106.66, lat: 10.76, detailed: true },
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

/**
 * Photo folders in public/imogen are matched to a stop or item by their name.
 * Most match automatically (folder name === a stop or item name). Anything that
 * doesn't is mapped here by hand — folder-name slug → target. `item` omitted
 * means the folder's photos belong to the stop itself.
 */
export const PHOTO_ALIASES: Record<string, { stopId: string; item?: string }> = {
  dinh: { stopId: "sapa", item: "Explore Sapa: 2D1N trek & homestay with Dinh" },
  "vang-vien-moped": { stopId: "vang-vieng", item: "Rent a moped" },
};

/** Slug used to match a name to a local photo file in public/imogen. */
export function imgSlug(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Rating → colour. A green-to-red scale tuned to Finbar's harsh /10
 * (9–10 amazing, 6–8 good, 5 and under weak). Drives the rating tiles.
 */
export function ratingColor(rating?: number): string | null {
  if (rating == null) return null;
  if (rating >= 10) return "#177a3e"; // deep green — perfect
  if (rating >= 9) return "#3a9d5a"; // green — amazing
  if (rating >= 8) return "#74b24a"; // green/lime
  if (rating >= 7) return "#a8b033"; // lime — good
  if (rating >= 6) return "#cf9a26"; // amber — fine
  if (rating >= 5) return "#d2792f"; // orange — weak
  return "#c2473b"; // red — poor
}
export const STAR_COLOR = "#c8922e"; // gold — the single standout (Dinh)

/** Flag emoji per country, for tasteful little accents. */
export const COUNTRY_FLAG: Record<Country, string> = {
  Thailand: "🇹🇭",
  Laos: "🇱🇦",
  Vietnam: "🇻🇳",
};

// ── Highlights: every 9 and 10 across the trip, for the strip near the top ──
export type Highlight = {
  label: string;
  stopId: string;
  stopName: string;
  rating: number;
  star?: boolean;
};

/** The very best of the trip — only 10/10s (and the gold-star standout). */
export function getHighlights(): Highlight[] {
  const out: Highlight[] = [];
  for (const s of stops) {
    if (s.rating != null && s.rating >= 10) {
      out.push({ label: s.name, stopId: s.id, stopName: s.name, rating: s.rating });
    }
    const hostels = s.hostels ?? (s.hostel ? [s.hostel] : []);
    for (const h of hostels) {
      if (h.rating != null && h.rating >= 10) {
        out.push({ label: h.name, stopId: s.id, stopName: s.name, rating: h.rating });
      }
    }
    for (const d of s.dos ?? []) {
      if (d.star || (d.rating != null && d.rating >= 10)) {
        out.push({ label: d.name, stopId: s.id, stopName: s.name, rating: d.rating ?? 10, star: d.star });
      }
    }
  }
  return out.sort(
    (a, b) => Number(b.star ?? false) - Number(a.star ?? false) || b.rating - a.rating,
  );
}
