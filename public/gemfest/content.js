/* ============================================================
   GemFest '27 — all page copy & data in one place.
   Structured to move into Sanity later: each export maps 1:1
   to a future document/singleton. Hardcoded for now.
   ============================================================ */

const CONTENT = {

  meta: {
    title: "GemFest '27",
    dates: "17–20 June 2027",
    datesLong: "Thursday 17th – Sunday 20th June 2027",
    location: "Charlton Park, Wiltshire",
    locationLong: "Charlton Park Estate, Malmesbury, Wiltshire, SN16 9LL",
    priceHook: "Weekend tickets from £75",
    status: "TICKETS ON SALE",
  },

  /* ---- Section: Ticket CTA band ---- */
  ticketBand: {
    heading: "2027 Tickets",
    body: "Weekend tickets start at £75. Parking passes and Chippenham shuttle add-ons are available at checkout. Tiers do sell through, so check back if yours is gone.",
    cta: { label: "Get 2027 Tickets", href: "#" },
  },

  /* ---- Section: Ticket list ----
     TODO: PLACEHOLDER TIERS/PRICES — confirm real pricing with
     the client before launch. Purchasing is visual only.       */
  tickets: [
    { name: "Weekend Standard", desc: "Four days & nights. Camping included.", price: 75 },
    { name: "Weekend + Parking Pass", desc: "Weekend ticket with pre-booked parking.", price: 95 },
    { name: "Weekend + Shuttle", desc: "Weekend ticket with return shuttle from Chippenham station.", price: 90 },
    { name: "Day Ticket (Saturday)", desc: "One day, no camping.", price: 45 },
  ],

  /* ---- Section: Discover grid ---- */
  discover: [
    { tag: "Discover", heading: "What is GemFest?", href: "#" },
    { tag: "Lineup", heading: "2027 coming soon. Browse the 2026 lineup", href: "#" },
    { tag: "Info", heading: "Getting there, times & FAQs", href: "#" },
    { tag: "Get Involved", heading: "Become a Rep", href: "#" },
  ],

  /* ---- Section: News grid ---- */
  news: [
    { tag: "GemFest '27", date: "June 2026", headline: "2027 dates announced: 17–20 June", slug: "#" },
    { tag: "GemFest '27", date: "June 2026", headline: "First lineup drop coming soon", slug: "#" },
    { tag: "GemFest '27", date: "May 2026", headline: "Travel & shuttle info: how to get to Charlton Park", slug: "#" },
    { tag: "GemFest '27", date: "May 2026", headline: "Become a rep: sell tickets, earn perks", slug: "#" },
  ],

  /* ---- Section: Footer ---- */
  footer: {
    newsletter: {
      heading: "Get Notified",
      body: "Be first to hear about lineup drops, ticket releases and news.",
      // TODO: newsletter form is visual only — no backend wired.
    },
    columns: [
      {
        title: "Festival",
        links: [
          { label: "Tickets", href: "#" },
          { label: "Lineup", href: "#" },
          { label: "Info", href: "#" },
          { label: "Become a Rep", href: "#" },
          { label: "Accessibility", href: "#" },
          { label: "Local Community", href: "#" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Privacy & Cookies", href: "#" },
          { label: "Terms & Conditions", href: "#" },
        ],
      },
      {
        title: "Support",
        links: [{ label: "Contact", href: "#" }],
      },
    ],
    socials: [
      { label: "Instagram", href: "https://www.instagram.com/gemfest.uk" },
      { label: "TikTok", href: "https://www.tiktok.com/@gemfest.uk" },
    ],
    credit: "An independent festival.",
  },
};
