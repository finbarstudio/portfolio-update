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
    body: "Weekend tickets start at £75. Parking passes and Chippenham shuttle add-ons are available at checkout. Availability moves fast — check back if your tier is gone.",
    cta: { label: "Get 2027 Tickets", href: "/tickets" },
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
    { tag: "Discover", heading: "What is GemFest?", href: "/discover" },
    { tag: "Lineup", heading: "2027 coming soon — browse the 2026 full lineup", href: "/lineup" },
    { tag: "Info", heading: "Getting there, times & FAQs", href: "/info" },
    { tag: "Get Involved", heading: "Become a Rep", href: "/reps" },
  ],

  /* ---- Section: News grid ---- */
  news: [
    { tag: "GemFest '27", date: "June 2026", headline: "2027 dates announced — 17–20 June", slug: "/news/2027-dates-announced" },
    { tag: "GemFest '27", date: "June 2026", headline: "First lineup drop coming soon", slug: "/news/first-lineup-drop" },
    { tag: "GemFest '27", date: "May 2026", headline: "Travel & shuttle info: how to get to Charlton Park", slug: "/news/travel-shuttle-info" },
    { tag: "GemFest '27", date: "May 2026", headline: "Become a rep — sell tickets, earn perks", slug: "/news/become-a-rep" },
  ],

  /* ---- Section: Footer ---- */
  footer: {
    newsletter: {
      heading: "Get Notified",
      body: "Lineup drops, ticket releases and news — straight to your inbox.",
      // TODO: newsletter form is visual only — no backend wired.
    },
    columns: [
      {
        title: "Festival",
        links: [
          { label: "Tickets", href: "/tickets" },
          { label: "Lineup", href: "/lineup" },
          { label: "Info", href: "/info" },
          { label: "Become a Rep", href: "/reps" },
          { label: "Accessibility", href: "/accessibility" },
          { label: "Local Community", href: "/community" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Privacy & Cookies", href: "/privacy-policy" },
          { label: "Terms & Conditions", href: "/terms-conditions" },
        ],
      },
      {
        title: "Support",
        links: [{ label: "Contact", href: "/contact" }],
      },
    ],
    socials: [
      { label: "Instagram", href: "https://www.instagram.com/gemfest.uk" },
      { label: "TikTok", href: "https://www.tiktok.com/@gemfest.uk" },
    ],
    credit: "An independent festival.",
  },
};
