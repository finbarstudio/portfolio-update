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
  subtitle: "your first big one",
  start: "2026-07-21", // rough — we'll tune this together
  end: "2026-08-25",
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
    title: "Pharmacies + the night-bus hack",
    body: "You can grab over-the-counter meds at pretty much any pharmacy in Asia, no prescription needed. The one I'd flag is dimenhydrinate (travel-sickness tablets). My move before a night bus was to take one, pass straight out, and wake up at the other end feeling fine instead of wrecked. Basically overnight teleportation. Great for the windy mountain roads too.",
  },
  {
    title: "Renting a moped",
    body: "Mopeds are the best way to explore (except big cities like Hanoi). Look for a rental with good reviews, but honestly the best move is to ask the hostel staff who they'd use, as long as they seem trustworthy and aren't just pushing a mate's shop, which is where scams happen. And always film a slow video all the way around the bike before you ride off, so nobody can pin existing scratches on you. One more thing: when you're navigating, set Google Maps to motorbike mode rather than car. It keeps you off the big motorways you're not allowed to ride on, and the back roads are usually nicer anyway.",
  },
  {
    title: "Don't trust Google ratings blindly",
    body: "A general Asia tip, but especially in Hanoi. Locals don't really leave Google reviews the way we do back home, so a lot of the high ratings come from tourists that managers have sweet-talked into reviewing. A massive score often just means a place is good at working tourists. Ask other travellers and your hostel instead, and when in doubt, eat where it's busy with locals.",
  },
  {
    title: "Stay flexible",
    body: "Book a few nights, not your whole stay. If you love a place or the people, extend. If not, move on. Most hostels you can book the night before, but a few of the best ones fill up days ahead, so watch for those.",
  },
  {
    title: "Use Hostelworld's numbers",
    body: "On Hostelworld you can see how many people have booked a place for the next few nights. My picks are always good, but sometimes a town has a few good ones, and it's worth booking where the most people are headed, that's where the crowd (and the fun) will be. You can also message a hostel through the app when you book. Such a good app.",
  },
  {
    title: "Read a bit of the history",
    body: "Vietnam's recent history is genuinely fascinating: the French colonial era, the American War, and how the country was split into north and south. A little reading before you go (or the museums along the way) makes a lot of the places hit differently.",
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
    longEasyRider: "~$200",
    selfRide: "~$170",
    versions: "3-day or 4-day",
    note: "Biggest party of the lot, all the groups pile in together for huge nights. Younger backpacker crowd. I heard great things.",
  },
  {
    name: "Jasmine",
    party: 3,
    longEasyRider: "~$230–290",
    selfRide: "~$140–160",
    versions: "3-day or 4-day",
    note: "Pitches itself as the premium, organised option, but the reputation is still pretty party. I heard great things here too.",
  },
  {
    name: "Bong",
    party: 2,
    longEasyRider: "~$160–180",
    selfRide: "~$130–150",
    versions: "3-day, 4-day (+ longer combos)",
    note: "What I did, and I'd 100% recommend it. A genuine happy medium (party if you want it, no pressure if you don't). You can pop into their Hanoi hostel and they'll sort the whole thing for you.",
    pick: true,
  },
  {
    name: "Road Kings",
    party: 1,
    longEasyRider: "~$300–335",
    selfRide: "~$260",
    versions: "3-day or 4-day",
    note: "The most professional and the quietest. Small groups, more late-20s/early-30s couples. Priciest, but the best inclusions.",
  },
];

export const loopNote =
  "Booked through a hostel that collects you in Hanoi. Prices are rough, per person, for the long 4-day / 3-night loop with an easy rider. Self-ride is a bit cheaper, and the short 3-day version knocks roughly $30–40 off. Most include the bike or easy rider, fuel, meals, homestays, gear and the Hanoi pickup; the ~$10 border permit and drinks are usually extra.";

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
      rec: "must",
      url: "https://www.hostelworld.com/pwa/s?q=Chiang%20Mai,%20Thailand&country=Thailand&city=Chiang%20Mai&type=city&id=831&from=2026-08-06&to=2026-08-14&guests=2&HostelNumber=265137&MoreOptions=true&page=1",
      maps: "Stamps Backpackers Hostel, Chiang Mai",
      room: "Deluxe 6 Bed Mixed Dorm Ensuite",
      note: "Worth the extra few dollars a night. This one's so good it books out a few days ahead, so reserve it before you fly. Super social, the whole place hangs out together.",
    },
    dos: [
      {
        name: "Cooking with Sammy",
        rec: "must",
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
        note: "Go to a live fight night, loud and fun and very Thailand. Ask the hostel which stadium has a fight on, I don't have a specific one for you.",
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
        rec: "must",
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
    side: true,
    name: "Pai",
    country: "Thailand",
    sideNote: "Side trip from Chiang Mai · 2–3 days if you go",
    blurb:
      "A little hippie town up in the hills, kind of like Nimbin. I didn't fall head over heels for it, but I get the appeal, and plenty of people fall into the \"Pai hole\" and never leave. Honestly, I'd still say go if you've got the days.",
    hostel: {
      name: "Bros Music Bar and Hostel",
      maps: "Bros Music Bar and Hostel Pai",
      rating: 8,
      note: "Really good. A hostel with a proper music bar attached, so it's social and a good night out in one.",
    },
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
        name: "A river cruise",
        note: "We did a cruise on the Mekong and it was lovely, a really chilled way to see it.",
        maps: "Luang Prabang Mekong river cruise",
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
      mode: "The new high-speed train (about an hour)",
      note: "Worth doing for its own sake. It's a sleek, modern Chinese-built line dropped into the middle of a really poor country, which is a fascinating thing to see in itself. Fast and easy.",
    },
  },
  {
    id: "vang-vieng",
    kind: "place",
    name: "Vang Vieng",
    country: "Laos",
    nights: 3,
    blurb:
      "Don't let the safety note put you off, Vang Vieng was one of my favourites. Big limestone-mountain scenery, and the most beautiful place on the whole trip to drive a moped around. Go with a group of friends and it's the best. Just be drink-smart while you're here (see the note above).",
    hostel: {
      name: "Golden Dragon House",
      url: "https://www.hostelworld.com/pwa/hosteldetails.php/Golden-Dragon-House/Vang-Vieng/327611?from=2026-06-29&to=2026-07-02&guests=2#position=1",
      maps: "Golden Dragon House, Vang Vieng",
      note: "Stayed here and it was good. Go with a group of friends and you're set.",
    },
    dos: [
      {
        name: "Rent a moped",
        note: "Do this, it's a must. The scenery here is unreal and riding around it is the best way to see it. (Check the moped tips above.)",
        kind: "do",
      },
      {
        name: "Nam Xay Viewpoint",
        note: "Ride out here for the classic Vang Vieng view over the valley. Worth the climb.",
        maps: "Nam Xay Viewpoint, Vang Vieng",
        kind: "do",
      },
      {
        name: "Blue Lagoon 3",
        note: "The best of the three blue lagoons. Pair it with Nam Xay in one day on the moped.",
        maps: "Blue Lagoon 3, Vang Vieng",
        kind: "do",
      },
      {
        name: "Paragliding",
        rec: "must",
        note: "You have to do this. Book an early-morning or late-afternoon flight, it was amazing.",
        maps: "Vang Vieng paragliding",
        kind: "do",
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
    days: 1,
    blurb:
      "Getting from Vang Vieng to Hanoi is a mission, and honestly half the adventure. You route through Vientiane, the capital, but don't bother stopping there, it's not worth your time. Then it's a long bus to the border, where we waited around 6 hours, and the passport process was wild. With someone next to you it's all part of it, and it makes one of the best stories afterwards.",
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
    nights: 3,
    blurb:
      "And then Hanoi, which is amazing. About 3 days is right, there's loads to do. Stay in the Old Quarter, that's where you want to be. Don't hire a moped here, just walk the Old Quarter and use Grab for anything further out. The food is incredible and most of it's within walking distance, so wander and graze, and ask your hostel or locals for spots rather than trusting Google. I wouldn't bother with day trips here, just take the city in. Same as everywhere, meet people and see where they're headed next. Honestly I was eating banh mi every single day.",
    hostels: [
      {
        name: "Lake View",
        maps: "Lake View Hostel, Hanoi Old Quarter",
        url: "https://www.hostelworld.com/st/hostels/asia/vietnam/hanoi/",
        note: "Where I stayed the second time round. Slightly more social, and a slightly better location.",
      },
      {
        name: "The One",
        maps: "The One Hostel, Hanoi Old Quarter",
        url: "https://www.hostelworld.com/st/hostels/asia/vietnam/hanoi/",
        note: "Where I stayed first. A touch more upmarket but somehow even cheaper, so great value. Both are in the Old Quarter.",
      },
    ],
    dos: [
      {
        name: "Wander the Old Quarter",
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
        note: "Cool for fake clothes, and just a nice hour wandering around.",
        maps: "Dong Xuan Market Hanoi",
        kind: "do",
      },
      {
        name: "Hanoi Train Street",
        note: "Go one evening to watch the train squeeze right through the houses. Awesome.",
        maps: "Hanoi Train Street",
        kind: "night",
      },
      {
        name: "Banh Mi 25",
        note: "The best banh mi in the city. (I wasn't kidding about eating it every day.)",
        maps: "Banh Mi 25 Hanoi",
        kind: "food",
      },
      {
        name: "Pho 10",
        rec: "low",
        note: "Good pho. Not my favourite and a little overrated, but still worth a go.",
        maps: "Pho 10 Hanoi",
        kind: "food",
      },
      {
        name: "Egg coffee",
        note: "A fun novelty to try while you're here.",
        maps: "egg coffee Hanoi",
        kind: "food",
      },
      {
        name: "Ho Chi Minh's Mausoleum",
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
    side: true,
    sideLabel: "The loop",
    name: "Ha Giang Loop",
    country: "Vietnam",
    sideNote: "From Hanoi · do the LONG version · the famous bike loop",
    blurb:
      "The most famous thing to do up north, and a proper must. Ha Giang is a province right up on the Chinese border, and \"the loop\" is a big multi-day motorbike circuit through it. There's a short and a long version, do the long one. You book it through a hostel and they handle everything: they pick you up in Hanoi, drive you up to Ha Giang, and you stay the night in their hostel there. The next morning a huge group (like 200 people) sets off together, split into smaller groups each with a leader. You can ride your own bike if you hire one, or take an \"easy rider\" and sit on the back while a local drives. Get the easy rider, honestly. It's far less stressful, the roads are tough, and the riders grew up there so they know every bend. They're lovely too, you end up proper mates, and it means you can actually look up and take the views in. Don't stress the planning either, once you're on the loop your next few days are completely sorted. It was so amazing.",
    dos: [
      {
        name: "Pizza near Bong",
        note: "You get a night in Ha Giang before the loop (and sometimes one after). If you're staying at Bong it's right nearby. We ate pizza here and it was so good.",
        maps: "137 Nguyễn Thái Học, Hà Giang, Vietnam",
        kind: "food",
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
    side: true,
    sideLabel: "Up north",
    name: "Sapa",
    country: "Vietnam",
    sideNote: "From Hanoi · 2–3 days · the mountains",
    blurb:
      "A mountain town up in the far north, and a brilliant one. It's a genuinely odd place, styled like a European ski resort but full of Chinese tourists, since it's right by the border. After the loop you'll be knackered and short on sleep, so it's the perfect reset. One heads-up: Sapa has a real problem with kids selling things in the streets instead of being at school. It's tied to poverty and it's a bit confronting. Dinh's tour below is part of the answer to it.",
    hostels: [
      {
        name: "Lady Hill Resort",
        maps: "Lady Hill Sapa Resort",
        note: "Not a hostel, a proper hotel that blew up on TikTok. Pricey for a backpacker but so worth it after the loop: the infinity pool and the view are insane, and I did a massage and aromatherapy. We extended because we didn't want to leave.",
      },
      {
        name: "Lustig Hostel",
        rec: "low",
        maps: "Lustig Hostel Sapa",
        note: "A solid, normal hostel if you'd rather keep it cheap. Sapa isn't really a hostel town, but this does the job.",
      },
    ],
    dos: [
      {
        name: "Explore Sapa: 2D1N trek & homestay with Dinh",
        rec: "must",
        note: "You MUST do this, a genuine 10/10 and the best thing I did on the whole trip. Dinh takes you trekking through the rice fields, then you stay at her homestay up the hill, where she runs a little school for local kids whose families can't afford one. We were there on graduation day: the kids put on a talent show, we judged it, and everyone was in tears by the end. Unforgettable. Book it on GetYourGuide.",
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
      note: "Easy to book through your Hanoi hostel. From Sapa you loop back through Hanoi and out to Halong Bay (below), or carry straight south if you'd rather.",
    },
  },
  {
    id: "halong-bay",
    kind: "place",
    side: true,
    sideLabel: "Day trip",
    name: "Halong Bay",
    country: "Vietnam",
    sideNote: "From Hanoi · about a day on the water",
    blurb:
      "Worth doing, it was fun as hell, but realistically it's about a one-day thing and it can be a bit out of the way once you're heading south. Mine got storm-delayed so we got messed around a bit. One tip: skip Cat Ba Island. We went and it was a waste of time, desolate, nothing going on.",
    dos: [
      {
        name: "A Halong Bay cruise",
        note: "Do it as a day cruise out of Hanoi. Book through your hostel or on GetYourGuide.",
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
    nights: 2,
    blurb:
      "First proper stop heading south, and I wouldn't skip it. Limestone karsts, rivers and caves, a bit like a greener Halong but on land. Rent a moped or a bicycle from the hostel and just explore. The real highlight, though, was the hostel.",
    hostel: {
      name: "Banana Tree Hostel",
      maps: "Banana Tree Hostel Ninh Binh",
      rating: 8,
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
        rating: 9,
        note: "A 9/10, and honestly it's mostly about the drive. Do one of these scenic routes out and the other on the way back, they're both gorgeous and it's a proper must-do. You can't take a moped on the big motorway anyway, so set Google Maps to motorbike mode (or, if it won't let you, choose 'avoid motorways').",
        maps: "Bear Sanctuary Ninh Binh Vietnam",
        links: [
          { label: "Scenic route 1", url: "https://maps.app.goo.gl/wcD5VomY8rPUi9oD8" },
          { label: "Scenic route 2", url: "https://maps.app.goo.gl/f63dhKJPWcuaSjcd7" },
        ],
        kind: "do",
      },
      {
        name: "The grottos",
        note: "The little boat trips through the caves and karsts are lovely.",
        maps: "Tam Coc Ninh Binh",
        kind: "do",
      },
      {
        name: "The bus karaoke (the Local Bar)",
        rating: 9,
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
        note: "Good food spot nearby.",
        maps: "Duck Farm Ninh Binh",
        kind: "food",
      },
      {
        name: "Bus Bar Pub Tam Coc",
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
    nights: 1,
    blurb:
      "Full honesty: I skipped this one to keep moving south, but my friends went and raved about it. It's all about the caves. Totally up to you and how your timing is looking.",
    dos: [
      {
        name: "The caves",
        note: "The whole reason to come. My friends rated it really highly.",
        maps: "Phong Nha Ke Bang caves",
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
    nights: 1,
    blurb:
      "Honest take: Hue was a bit boring, more of a local city than a backpacker spot. The real reason to come is to ride the Hai Van Pass out of it. So treat it as a quick one-nighter, then ride.",
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
    days: 1,
    blurb:
      "This was unreal, a 9.5/10. We took easy riders on the Ha Giang loop and never drove ourselves, so we did this one on our own bikes, and it was the best. You ride from Hue up through the mountains and back down to the coast, through Da Nang and into Hoi An. It rained on us but it was warm and just so much fun.",
    dos: [
      {
        name: "Ride the pass",
        rating: 9.5,
        note: "Plenty of companies set it up: you ride Hue → Hoi An and they collect the bike from Hoi An at the other end. It's popular and it felt safe, I'd put the risk at about 3/10. Go with people, and convince someone to do it with you. If you'd rather not drive, you can hire a jeep and have someone drive you, but the bike is so worth it. I've dropped a Google Maps route below that strings the Lang Co stops together (switch it to motorbike once it opens).",
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
        note: "A wild cemetery of huge, ornate, colourful tombs near the coast, nicknamed the City of Ghosts. A surreal, beautiful detour.",
        maps: "An Bang Cemetery City of Ghosts Hue Vietnam",
        kind: "do",
      },
      {
        name: "Six Miles Coast (the abandoned resort)",
        note: "A great detour on the ride: a huge abandoned resort at Lang Co you can wander around. Super cool to explore. It's on the route link above.",
        maps: "Six Miles Coast Lang Co Vietnam",
        kind: "do",
      },
      {
        name: "An Lagoon Seafood (Lang Co)",
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
    nights: 2,
    blurb:
      "Hoi An was my favourite place of the whole trip. You roll in at the end of the pass (through Da Nang), and honestly I don't think you'll want to leave. Hire a moped for sure. Do the hostel drinks and head out with the group on their nights, but make sure you get into the old town itself, the lanterns and the river, that's the real magic. More than anything it was peaceful, my favourite place on the whole trip to just sit and look at. To be fair there isn't a huge amount going on, but honestly that was the appeal, a calm and lovely way to end the trip.",
    hostel: {
      name: "Cuckoo's Nest",
      maps: "Cuckoo's Nest Hostel Hoi An",
      rec: "must",
      note: "Stay here. So social and such a good vibe, I genuinely don't think you'll want to leave.",
    },
    dos: [
      {
        name: "Hire a moped",
        rec: "must",
        note: "Do it for sure. It's the best way to get around Hoi An and out to the beach and the rice paddies.",
        kind: "do",
      },
      {
        name: "The old town",
        rec: "must",
        note: "The heart of it: lantern-lit streets, the river, the tailors, the food. Spend your evenings here, not just at the hostel.",
        maps: "Hoi An Ancient Town",
        kind: "do",
      },
      {
        name: "Hoianese History Talk",
        rating: 8,
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
        name: "Get a suit tailored",
        note: "Hoi An is famous for its tailors, and it's cheap and such good value. We all got suits made, such a cool experience, I got mine for a wedding I had in Bali straight after. Order early in your stay so it's done and fitted before you move on.",
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
        note: "Do the hostel drinks and head out with the group on their nights. Great crowd at Cuckoo's Nest.",
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
        rating: 6,
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
  { id: "pai", name: "Pai", country: "Thailand", lon: 98.44, lat: 19.36, detailed: true, side: true, from: "chiang-mai", flip: true },
  { id: "luang-prabang", n: 2, name: "Luang Prabang", country: "Laos", lon: 102.13, lat: 19.88, detailed: true },
  { id: "vang-vieng", n: 3, name: "Vang Vieng", country: "Laos", lon: 102.45, lat: 18.92, detailed: true, flip: true },
  { id: "vientiane", name: "Vientiane", country: "Laos", lon: 102.6, lat: 17.97, waypoint: true },
  { id: "hanoi", n: 4, name: "Hanoi", country: "Vietnam", lon: 105.84, lat: 21.03, detailed: true },
  { id: "ha-giang", name: "Ha Giang", country: "Vietnam", lon: 104.98, lat: 22.82, detailed: true, side: true, from: "hanoi", flip: true },
  { id: "sapa", name: "Sapa", country: "Vietnam", lon: 103.84, lat: 22.34, detailed: true, side: true, from: "hanoi", flip: true },
  { id: "halong-bay", name: "Halong Bay", country: "Vietnam", lon: 107.04, lat: 20.91, detailed: true, side: true, from: "hanoi" },
  { id: "ninh-binh", n: 5, name: "Ninh Binh", country: "Vietnam", lon: 105.97, lat: 20.25, detailed: true },
  { id: "phong-nha", n: 6, name: "Phong Nha", country: "Vietnam", lon: 106.28, lat: 17.59, detailed: true },
  { id: "hue", n: 7, name: "Huế", country: "Vietnam", lon: 107.58, lat: 16.46, detailed: true },
  { id: "hoi-an", n: 8, name: "Hội An", country: "Vietnam", lon: 108.34, lat: 15.88, detailed: true },
  { id: "hcmc", n: 9, name: "Ho Chi Minh City", country: "Vietnam", lon: 106.66, lat: 10.76, detailed: true },
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
