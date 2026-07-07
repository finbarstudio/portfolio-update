/* ============================================================
   PullUp Recordings — page content (scraped from
   pulluprecordings.co.uk). Kept in one object so it's easy to
   swap into a CMS later. Some links are placeholders (#).
   ============================================================ */
const PU = {
  meta: {
    title: "PullUp Recordings",
    tagline: "Cardiff dance-music label, event promoter & lifestyle brand.",
  },

  /* Events */
  events: [
    {
      name: "GemFest '27",
      desc: "Full lineup out now — High Contrast, Dr Banana, Pola & Bryson, Saint Ludo and more.",
      price: "£149",
      cta: { label: "Check the lineup", href: "https://gemfest.co.uk" },
    },
    {
      name: "PAMPA",
      desc: "Our club series — intimate rooms, proper sound systems. Next date announced soon.",
      cta: { label: "Tickets", href: "#" },
    },
    {
      name: "Sunday Club",
      desc: "Sport meets sound — the Sunday sessions where the family gets together.",
      cta: { label: "Learn more", href: "#" },
    },
  ],

  /* Merch band */
  merch: {
    heading: "New Merch",
    body: "Restocked across the board — new hoodies, tees, footie tops and accessories.",
    cta: { label: "Browse merch", href: "https://store.pulluprecordings.co.uk" },
  },

  /* Latest release */
  release: {
    heading: "Latest Release",
    body: "Stream the latest PullUp release now.",
    cta: { label: "Listen on Spotify", href: "#" },
  },

  /* Join The Family grid */
  join: [
    { tag: "Community", heading: "Join the family", href: "#" },
    { tag: "Team", heading: "Join the team", href: "#" },
    { tag: "DJs", heading: "DJ application", href: "#" },
    { tag: "Say hi", heading: "Contact us", href: "#" },
  ],

  /* Footer */
  footer: {
    subscribe: {
      heading: "Subscribe",
      body: "Stay up to date & get exclusive merch and event discounts.",
      // TODO: form is visual only, no backend wired.
    },
    columns: [
      {
        title: "Events",
        links: [
          { label: "Tickets", href: "#" },
          { label: "GemFest", href: "https://gemfest.co.uk" },
          { label: "PAMPA", href: "#" },
          { label: "Sunday Club", href: "#" },
        ],
      },
      {
        title: "Shop",
        links: [{ label: "Store", href: "https://store.pulluprecordings.co.uk" }],
      },
      {
        title: "Join",
        links: [
          { label: "Communities", href: "#" },
          { label: "Join the team", href: "#" },
          { label: "DJ application", href: "#" },
          { label: "Contact", href: "#" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Terms & Conditions", href: "#" },
          { label: "Privacy Policy", href: "#" },
        ],
      },
    ],
    socials: [
      { label: "Instagram", href: "https://www.instagram.com/pulluprecordings" },
      { label: "YouTube", href: "#" },
      { label: "TikTok", href: "#" },
      { label: "SoundCloud", href: "#" },
      { label: "Spotify", href: "#" },
      { label: "Facebook", href: "#" },
    ],
    credit: "Cardiff, UK.",
  },
};
