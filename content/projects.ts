/**
 * finbar✶studio, Project Content
 * All copy, images, dates, tags, and case study content lives here.
 * Edit this file to update anything on the site.
 *
 * IMAGE GUIDE
 * All images live in /public/images/<slug>/
 * Compressed WebP versions are in the same folder as the originals.
 * Videos are WebM; poster frames are WebP.
 *
 * ProjectImage.video: set this to a .webm path to render a looping video
 * in the case study gallery. src then acts as poster.
 *
 * Project.heroVideo: looping WebM for the case study hero.
 * Project.pdfSlideshow: array of WebP page images from a PDF.
 */

export type Tier = "featured" | "full" | "gallery";

export interface ProjectImage {
  src: string;        // WebP image path (also poster when video is set)
  caption?: string;
  alt: string;
  video?: string;     // WebM path. If set, renders as a looping video.
  aspectRatio?: string; // Override the default 16/9 frame (e.g. "1/1" for square covers).
}

export interface DepthSection {
  heading: string;
  body: string;
  images: ProjectImage[];
  /** Force an even N-up grid (e.g. 4 small posters in a row) instead of the
   *  default aspect-aware layout. */
  cols?: number;
}

// One horizontal row of media (images or videos) sharing a single caption.
// Used when a project needs a clean lineup of variants rather than the
// default 2-up gallery + depth-sections layout.
export interface MediaRow {
  ratio: string;            // CSS aspect-ratio, e.g. "1/1", "9/16"
  videos?: string[];        // WebM paths (if set, used in preference to images)
  images?: string[];        // Static image paths
  caption?: string;
  alt?: string;             // Shared alt for accessibility
}

export interface Project {
  slug: string;
  name: string;
  tier: Tier;
  rank: number;
  isConcept?: boolean;
  /** Personal / hobby project — shows a "Hobby project" pink tag. */
  isHobby?: boolean;
  /** Per-page SEO overrides. Used to preserve the exact title/description that
   *  the live site already ranks for on migrated slugs. Falls back to a
   *  generated title + oneLiner when omitted. */
  seo?: { title?: string; description?: string };
  date: string;
  categories: string[];
  skills: string[];
  oneLiner: string;
  role: string;
  problem: string;
  outcome: string;
  heroImage: ProjectImage;
  heroVideo?: string;     // WebM for case study hero (looping, muted)
  images: ProjectImage[];
  hasDepth: boolean;
  depth?: DepthSection[];
  mediaRows?: MediaRow[];  // When set, replaces images + depth body on case study page

  logo?: string;          // Small client/brand logo. Shown in card + case study header.
  cardLogo?: string;      // When set, the home/archive card thumbnail shows this
                          // logo (centred, animates on hover) instead of media.
  cardStack?: string[];   // When set, the card thumbnail stacks these images
                          // (contained, not full-bleed) — e.g. two infographics.
  liveUrl?: string;
  heroSpline?: string;
  heroModel?: {           // Interactive 3D model with looping video on its screen
    model: string;        // Path to .gltf (under /public)
    video?: string;       // Path to looping video shown on the screen
    image?: string;       // OR a still image (e.g. a site screenshot) on the screen
    poster?: string;      // Poster shown until the canvas is ready
    modelScale?: number;  // Uniform scale of the loaded model (different glb's
                          // ship in wildly different units).
    screenRotation?: number; // Texture rotation about its centre (radians),
                          // so different screen UV orientations look right.
    screenRepeat?: [number, number]; // Source-UV repeat to fix screen aspect.
    camDist?: number;     // Rest camera distance.
    camDistHover?: number;// Hover camera distance (smaller = more zoom).
    camY?: number;        // Rest camera height.
    camYHover?: number;   // Hover camera height.
    lookYHover?: number;  // Hover lookAt height.
    modelY?: number;      // Vertical offset of the model in frame.
  };
  heroPhones?: {          // 7-phone carousel, each with its own looping video
    model: string;        // Path to .glb (under /public)
    videos: string[];     // Exactly 7 video URLs
    poster?: string;
  };
  heroMagazine?: {        // 20-page 3D magazine that flips through itself
    pages: string[];      // Page image URLs in flip order
  };
  heroAlbums?: {          // Row of glossy album-cover panels that skew to catch light
    images: string[];     // Square cover image URLs, rendered left-to-right
  };
  heroSlideshow?: string[];   // Flowing cover carousel (card thumbnail + detail hero)
  slideshowAspect?: string;   // Card shape for the carousel (e.g. "1/1", "3/2")
  heroPdf?: string[];         // Page images for a lightweight crossfade PDF thumbnail

  companyUrl?: string;
  pdfSlideshow?: {        // PDF rendered as image pages
    title: string;
    pages: string[];
  };

  /** Client testimonial pulled out as a front-and-centre quote on the case study. */
  testimonial?: {
    quote: string;
    author: string;        // "Name, Company"
  };
  /** Flat list of deliverables — rendered as a clean bulleted grid near the meta. */
  delivered?: string[];
  /** Measurable outcomes (campaign metrics etc.) — rendered with big highlighted
   *  numbers and small delta/label beneath. */
  outcomes?: {
    intro?: string;
    subtitle?: string;
    stats: { value: string; delta?: string; label: string }[];
    source?: string;
  };
  /** Hide from the home grid + sitemap. Detail page still exists if linked. */
  hidden?: boolean;
  /** TikTok creator handle (no @). When set, the case study embeds the profile
   *  at the top with the metrics beside it. */
  tiktok?: string;
}

/* PROJECTS, ranked, all tiers */

export const projects: Project[] = [

  /* 2. KinAya. Featured */
  {
    slug: "kinaya",
    name: "KinAya",
    tier: "full",
    rank: 4,
    seo: {
      title: "KinAya: Brand Identity & Framer Website | Finbar Studio",
      description:
        "How I designed the KinAya brand identity and built their Framer website from the ground up. A complete startup rebrand for an Adelaide-based NDIS support services provider.",
    },
    date: "2024",
    categories: ["Brand Identity", "Web Design", "Framer", "NDIS"],
    skills: ["Brand Identity", "Logo Design", "Framer Development", "CMS Setup", "Accessibility", "Web Design"],
    oneLiner: "Full brand identity and a six-page Framer site for an Adelaide NDIS provider rebranding under a new name.",
    role: "Sole designer and developer. Delivered the brand (logomark, logotype, colour, guidelines) and the Framer site itself, including CMS, custom interactive components, and a site-wide accessibility text-resizer.",
    problem: "KinAya was rebranding from the ground up: new name, new identity. The brand had to feel trustworthy and human without slipping into something flashy. The site needed to be easy for the team to run themselves after launch.",
    outcome: "Brand and site delivered as a single piece of work. CMS handover went smoothly. Positive testimonial from Aryan Sareen.",
    logo: "/images/kinaya/Final%20Logos/Logo%20Pink%20Grey.svg",
    heroModel: {
      model: "/models/studio-display/display.gltf",
      video: "/images/kinaya/accessibility.webm",
    },
    heroImage: { src: "/images/kinaya/desktop.png", alt: "KinAya website desktop view with structured, accessible homepage layout" },
    images: [
      { src: "/images/kinaya/desktop.png", caption: "Home page: structured, readable, accessible layout across viewports.", alt: "KinAya Framer website homepage on desktop with clean navigation and NDIS branding" },
      { src: "/images/kinaya/mobile.png", caption: "Responsive mobile layout. Full CMS control was handed over to the KinAya team after launch.", alt: "KinAya website mobile view with responsive layout in the navy and rose palette" },
      { src: "/images/kinaya/logo-dev-1.png", caption: "Early logomark explorations: testing form, weight and warmth.", alt: "KinAya logo development early stage with pencil and vector explorations" },
      { src: "/images/kinaya/logo-dev-4.png", caption: "Final refined logomark. The version that balanced warmth with professional trust.", alt: "KinAya final logomark, refined vector mark with logotype in the brand typeface" },
    ],
    hasDepth: true,
    depth: [
      {
        heading: "Brand Identity Development",
        body: "The KinAya identity had to land somewhere between warm and trustworthy for an NDIS audience. The logomark went through several rounds of refinement from rough concept to final vector. The logotype was set in a typeface that balances human feel with clarity at small sizes.",
        images: [
          { src: "/images/kinaya/logo-dev-1.png", caption: "Early explorations: testing form and visual weight.", alt: "KinAya logo development stage 1, initial vector form explorations" },
          { src: "/images/kinaya/logo-dev-2.png", caption: "Mid-process refinement: narrowing to the core concept.", alt: "KinAya logo development stage 2, refined mark candidates" },
          { src: "/images/kinaya/logo-dev-3.png", caption: "Near-final stage. Geometry tightened, proportions locked.", alt: "KinAya logo development stage 3, near-final mark with logotype" },
          { src: "/images/kinaya/logo-dev-4.png", caption: "Final mark, delivered with full brand guidelines.", alt: "KinAya final logomark in brand colours navy and rose on white" },
        ],
      },
      {
        heading: "Accessibility Text-Resizer",
        body: "A custom site-wide text-resizer was built in Framer. It persists across every page and lets users step the base text size up or down. For an NDIS provider whose audience may include people with vision impairments, this wasn't optional. The preference is stored in localStorage so it sticks across visits.",
        images: [
          {
            src: "/images/kinaya/accessibility-poster.jpg",
            video: "/images/kinaya/accessibility.webm",
            caption: "The text-resizer in action: persistent across sessions and fully keyboard-accessible.",
            alt: "KinAya accessibility text-resizer demonstration, custom Framer component scaling text site-wide",
          },
        ],
      },
      {
        heading: "Website & CMS",
        body: "The six-page Framer site was built for handover from day one. CMS collections handle the repeating content (services, team profiles, news posts), so the KinAya team can update without touching code. SEO basics were in place from launch: semantic HTML, per-page meta, Open Graph and clean URLs.",
        images: [
          { src: "/images/kinaya/desktop.png", caption: "Desktop layout with clean hierarchy and a clear CTA structure.", alt: "KinAya desktop homepage full view with hero, services and CTA sections" },
          { src: "/images/kinaya/mobile.png", caption: "Mobile: fully responsive, same content hierarchy on smaller screens.", alt: "KinAya mobile homepage, responsive layout adapting to small viewport" },
        ],
      },
    ],
    liveUrl: "https://kinaya.com.au",
    companyUrl: "https://kinaya.com.au",
    testimonial: {
      quote:
        "Finbar was great to work with from start to finish. He took the time to understand what KinAya needed, communicated clearly throughout, and delivered something that felt cohesive. The branding and website genuinely felt like one vision. The accessibility features he suggested, like the text resizer, showed he was thinking beyond just aesthetics. Handover was smooth and we felt confident managing the site ourselves after his walkthrough. Highly recommend.",
      author: "Aryan Sareen, KinAya",
    },
    delivered: [
      "Six-page Framer website",
      "Logotype design and kerning",
      "Auto-advancing hero slideshow",
      "Shared nav and footer components",
      "Logomark refinement and development",
      "Full primary logo (logomark + logotype)",
      "Custom hover-interactive services component",
      "All logo deliverables in brand colours, black, and white",
      "Brand colour system including extended tint and gradient direction",
      "CMS connected to homes, services, and team sections with detail pages",
      "FAQ accordion",
      "Post-launch support",
      "CMS handover session",
      "Multiple contact forms",
      "Mobile-optimised throughout",
      "Domain connection via GoDaddy",
      "Foundational SEO and technical setup",
      "Midjourney image generation with custom style profile",
      "Gradient map and grain post-processing on all images",
      "Site-wide text resizer (custom AI-assisted component)",
    ],
  },

  /* 1. TMYR (The Moment You Realise). Featured */
  {
    slug: "tmyr",
    name: "The Moment You Realise",
    tier: "featured",
    rank: 1,
    seo: {
      title: "The Moment You Realise: Social Campaign Design | Finbar Studio",
      description:
        "An evergreen, modular social campaign for the UK's leading affordable homeownership platform. 30+ motion and static assets across every major format, built to run again and again.",
    },
    companyUrl: "https://sharetobuy.com",
    date: "2022–2023",
    categories: ["Social Campaign", "Motion Graphics", "Digital"],
    skills: [
      "After Effects",
      "DaVinci Resolve",
      "SmarterQueue",
    ],
    oneLiner:
      "Evergreen social campaign for the UK's biggest affordable-homeownership portal. The films sit on the moment a first-time buyer realises they can actually afford it.",
    role: "Solo motion designer and campaign producer. Sourced and selected stock footage, built and animated every motion graphic template in After Effects, adapted Share to Buy brand elements, and shipped the full asset library.",
    problem:
      "Share to Buy needed an evergreen social campaign that hit a specific emotional beat: the second someone realises shared ownership is within reach. It had to work across every major social format and channel.",
    outcome:
      "Campaign ran across 2022 and 2023 windows. December 2023 year on year: new registrants +19.7%, page views +1.5%, property enquiries +3.4%.",
    logo: "/images/tmyr/STB%20Logo.svg",
    heroImage: {
      src: "/images/tmyr/hero-poster.jpg",
      alt: "The Moment You Realise campaign, Share to Buy social video series hero frame",
    },
    heroPhones: {
      model: "/models/iphone/iphone-15-pro-max.glb",
      videos: [
        "/images/tmyr/1080x1920%20IG%20Reels/Anthony.webm",
        "/images/tmyr/1080x1920%20IG%20Reels/Freya.webm",
        "/images/tmyr/1080x1920%20IG%20Reels/Katie.webm",
        "/images/tmyr/1080x1920%20IG%20Reels/Kiran.webm",
        "/images/tmyr/1080x1920%20IG%20Reels/Lauren.webm",
        "/images/tmyr/1080x1920%20IG%20Reels/Molly.webm",
        "/images/tmyr/1080x1920%20IG%20Reels/Olu.webm",
      ],
      poster: "/images/tmyr/hero-poster.jpg",
    },
    images: [],
    hasDepth: false,
    mediaRows: [
      {
        ratio: "1/1",
        videos: [
          "/images/tmyr/1080x1080%20IG%20Posts/Anthony.webm",
          "/images/tmyr/1080x1080%20IG%20Posts/Freya.webm",
          "/images/tmyr/1080x1080%20IG%20Posts/Katie.webm",
          "/images/tmyr/1080x1080%20IG%20Posts/Kiran.webm",
          "/images/tmyr/1080x1080%20IG%20Posts/Lauren.webm",
          "/images/tmyr/1080x1080%20IG%20Posts/Molly.webm",
          "/images/tmyr/1080x1080%20IG%20Posts/Olu.webm",
        ],
        alt: "TMYR campaign, 1080x1080 Instagram post variants for Share to Buy",
      },
      {
        // Reel source videos are 540×1162 (not 9:16) — match exactly so they fill the column.
        // Filenames don't match the actual reel subject — re-ordered so each reel slot
        // (col 1..7) lines up with the same person/story in the posts row above.
        ratio: "540/1162",
        videos: [
          "/images/tmyr/1080x1920%20IG%20Reels/Anthony.webm",
          "/images/tmyr/1080x1920%20IG%20Reels/Lauren.webm",
          "/images/tmyr/1080x1920%20IG%20Reels/Freya.webm",
          "/images/tmyr/1080x1920%20IG%20Reels/Molly.webm",
          "/images/tmyr/1080x1920%20IG%20Reels/Katie.webm",
          "/images/tmyr/1080x1920%20IG%20Reels/Olu.webm",
          "/images/tmyr/1080x1920%20IG%20Reels/Kiran.webm",
        ],
        alt: "TMYR campaign, 1080x1920 Instagram reel variants for Share to Buy",
      },
    ],
    outcomes: {
      intro:
        "The campaign ran across multiple windows in 2022 and 2023, timed to periods of lower organic search demand. When search interest in shared ownership dropped from peak, paid and social activity picked up the gap.",
      subtitle: "December 2023 results, year on year",
      stats: [
        { value: "3,417", delta: "+19.7% YoY", label: "New registrants" },
        { value: "1,391,921", delta: "+1.5% YoY", label: "Page views" },
        { value: "+3.4%", delta: "Year on year", label: "Property enquiries" },
      ],
      source: "Similarweb",
    },
  },

  /* 4. Salesmasters. Full */
  {
    slug: "salesmasters",
    name: "Salesmasters",
    tier: "full",
    rank: 3,
    seo: {
      title: "Salesmasters: Sales Playbook Design & Production | Finbar Studio",
      description:
        "How I designed and produced 15+ custom sales process playbooks for a national sales consultancy, end to end, from content writing to print-ready delivery.",
    },
    companyUrl: "https://salesmasters.com.au",
    date: "2023–2024",
    categories: ["Publication Design", "Infographic Design", "Print"],
    skills: [
      "Publication Design",
      "InDesign",
      "Content Writing",
      "Illustration",
      "Infographic Design",
      "Print Production",
    ],
    oneLiner:
      "Custom Sales Process Playbooks for a Brisbane sales consultancy. Researched, written, designed, illustrated and print-managed in-house.",
    role: "Sole designer and writer. Researched each client's industry, wrote all content (3,000 to 3,500 words per playbook), built the InDesign documents from scratch, designed the illustrations and infographics, and managed print delivery.",
    problem:
      "Salesmasters needed unique 40 to 50-page playbooks for each client. Text-heavy but still readable, brand-compliant, and ready to print. There was no template to start from. Every playbook had to feel custom while still reading as part of the same set.",
    outcome:
      "15+ playbooks delivered across healthcare, manufacturing, technology, storage and professional services. The clearest signal is the repeat work over more than a year.",
    logo: "/images/salesmasters/logo.webp",
    heroSlideshow: [
      "/images/salesmasters/covers/alpha.webp",
      "/images/salesmasters/covers/siteware.webp",
      "/images/salesmasters/covers/playbook.webp",
      "/images/salesmasters/covers/bus4x4.webp",
    ],
    heroImage: {
      src: "/images/salesmasters/covers/bus4x4.webp",
      alt: "Salesmasters Sales Process Playbook cover, Bus4x4 edition",
    },
    // Detail page uses the bespoke SalesmastersShowcase, so the generic
    // images/depth galleries aren't rendered.
    images: [],
    hasDepth: false,
    delivered: [
      "Digital PDF optimisation",
      "Technique infographics per playbook",
      "Section opener design and composition",
      "Brand setup: fonts, colours, assets",
      "Sales context research per engagement",
      "Playbook writing (3,000–3,500 words)",
      "Photoshop: grading, compositing, finishing",
      "15+ engagements across 12+ months",
      "Title page and back cover design",
      "Print preflight and production management",
      "Midjourney image generation and prompting",
      "Sales technique integration: BANT, STAR",
      "InDesign document architecture and setup",
      "Custom Sales Wheel illustration per client",
    ],
  },

  /* 3. Joe Devine. Featured */
  {
    slug: "joe-devine",
    name: "Joe Devine",
    tier: "full",
    rank: 7,
    date: "2023",
    categories: ["Art Direction", "Cover Artwork", "Photography"],
    skills: [
      "Art Direction",
      "Cover Artwork",
      "Photography",
      "Brand Identity",
      "Social Media Assets",
    ],
    oneLiner:
      "Visual identity across five instrumental singles for a London-based guitarist moving from session work into solo releases.",
    role: "Art director and photographer. Built the visual identity for the five-single series: studio photography, custom artwork, colour treatments, and social and streaming assets.",
    problem:
      "Joe was moving from session work into solo releases. He needed a look that read as one series across five separate singles. Each track wanted its own colour and mood while still being instantly recognisable as part of the set.",
    outcome:
      "Client happy with the series. The releases picked up real traction after launch.",
    heroImage: {
      src: "/images/joe-devine/hero.png",
      alt: "Joe Devine, all five single cover artworks shown together as a series",
    },
    heroAlbums: {
      images: [
        "/images/joe-devine/albums/baby-steps.webp",
        "/images/joe-devine/albums/giant-leap.webp",
        "/images/joe-devine/albums/a-perfect-contrast.webp",
        "/images/joe-devine/albums/one-foot-forward.webp",
        "/images/joe-devine/albums/too-far-gone.webp",
      ],
    },
    // Card thumbnail uses the flowing cover carousel (square covers, no clipping);
    // the detail page still uses the bespoke AlbumShowcase via heroAlbums.
    heroSlideshow: [
      "/images/joe-devine/albums/baby-steps.webp",
      "/images/joe-devine/albums/giant-leap.webp",
      "/images/joe-devine/albums/a-perfect-contrast.webp",
      "/images/joe-devine/albums/one-foot-forward.webp",
      "/images/joe-devine/albums/too-far-gone.webp",
    ],
    slideshowAspect: "1/1",
    images: [
      {
        src: "/images/joe-devine/albums/baby-steps-md.webp",
        caption: "Baby Steps",
        alt: "Joe Devine, Baby Steps single cover artwork",
        aspectRatio: "1/1",
      },
      {
        src: "/images/joe-devine/albums/giant-leap-md.webp",
        caption: "Giant Leap",
        alt: "Joe Devine, Giant Leap single cover artwork",
        aspectRatio: "1/1",
      },
      {
        src: "/images/joe-devine/albums/a-perfect-contrast-md.webp",
        caption: "A Perfect Contrast",
        alt: "Joe Devine, A Perfect Contrast single cover artwork",
        aspectRatio: "1/1",
      },
      {
        src: "/images/joe-devine/albums/one-foot-forward-md.webp",
        caption: "One Foot Forward",
        alt: "Joe Devine, One Foot Forward single cover artwork",
        aspectRatio: "1/1",
      },
      {
        src: "/images/joe-devine/albums/too-far-gone-md.webp",
        caption: "Too Far Gone",
        alt: "Joe Devine, Too Far Gone single cover artwork",
        aspectRatio: "1/1",
      },
    ],
    hasDepth: false,
    testimonial: {
      quote:
        "Finbar nailed the visual language from the first round. Each single ended up with its own colour and feel, but they still read as one set when you line them up. He listened to what each track was about and translated it into the artwork without me having to over-explain. The covers raised the bar for how the releases were received.",
      author: "Joe Devine, Musician",
    },
  },

  /* 5. Compass Capability. Full */
  {
    slug: "compass-capability",
    name: "Compass Capability",
    tier: "full",
    rank: 14,
    date: "2024",
    categories: ["Brand Identity", "Brand Guidelines"],
    skills: [
      "Brand Identity",
      "Logo Design",
      "Brand Guidelines",
      "Graphic Systems",
    ],
    oneLiner:
      "Brand identity from concept through to rollout for a consulting firm working with industry on capability and workforce solutions.",
    role: "Sole designer. Built the full identity: logo with directional symbolism, typography, logo variations, graphic asset systems, brand guidelines and social assets.",
    problem:
      "Compass needed an identity that read as navigation, direction and capability across green industry, renewables, mining, transport and manufacturing. It had to feel credible at every touchpoint and not lean too hard on any one sector.",
    outcome:
      "Consistent visual language delivered across the brand system.",
    heroImage: {
      src: "/images/compass-capability/hero.png",
      alt: "Compass Capability brand identity, logo mockup collage across touchpoints",
    },
    heroSlideshow: [
      "/images/compass-capability/graphic.png",
      "/images/compass-capability/pattern.png",
      "/images/compass-capability/mockup-billboard.png",
      "/images/compass-capability/mockup-business-card.png",
      "/images/compass-capability/mockup-stationary.png",
    ],
    slideshowAspect: "1/1",
    images: [],
    hasDepth: true,
    depth: [
      {
        heading: "The mark and the system",
        body: "The logo reads as direction. From the mark came a flexible graphic motif and a repeating pattern, both built on the same geometry so the brand holds together wherever it lands.",
        images: [
          {
            src: "/images/compass-capability/graphic.png",
            aspectRatio: "1/1",
            caption: "The directional motif, pulled from the logomark.",
            alt: "Compass Capability brand graphic, directional compass motif used as a scalable brand asset",
          },
          {
            src: "/images/compass-capability/pattern.png",
            aspectRatio: "1/1",
            caption: "A repeating pattern built from the logo geometry.",
            alt: "Compass Capability repeating pattern, logo-derived geometric pattern for brand applications",
          },
        ],
      },
      {
        heading: "Applied",
        body: "The same system, run across outdoor, print and stationery. It had to stay credible at billboard scale and at the size of a business card.",
        images: [
          {
            src: "/images/compass-capability/mockup-billboard.png",
            aspectRatio: "1/1",
            caption: "Large-format outdoor.",
            alt: "Compass Capability brand identity on billboard mockup, large format outdoor application",
          },
          {
            src: "/images/compass-capability/mockup-business-card.png",
            aspectRatio: "1/1",
            caption: "Business card, mark at small print scale.",
            alt: "Compass Capability business card mockup, logo and typography at small print scale",
          },
          {
            src: "/images/compass-capability/mockup-stationary.png",
            aspectRatio: "1/1",
            caption: "Letterhead and document templates.",
            alt: "Compass Capability stationery mockup, letterhead and document templates with brand identity",
          },
        ],
      },
    ],
    pdfSlideshow: {
      title: "Brand Guidelines",
      pages: [
        "/images/compass-capability/pdf-pages/page-0.webp",
        "/images/compass-capability/pdf-pages/page-1.webp",
        "/images/compass-capability/pdf-pages/page-2.webp",
        "/images/compass-capability/pdf-pages/page-3.webp",
      ],
    },
  },

  /* 6. Norths Devils RLFC. Full. CONCEPT */
  {
    slug: "norths-devils",
    name: "Norths Devils RLFC",
    tier: "full",
    rank: 6,
    hidden: true,
    isConcept: true,
    date: "2024",
    categories: ["Brand Refresh", "Web Design", "Sports Branding"],
    skills: [
      "Brand Refresh",
      "Logo Design",
      "Web Design",
      "Framer Development",
      "Sports Branding",
    ],
    oneLiner:
      "Brand refresh and prototype website for a long-standing Queensland rugby league club. Modernised mark, full responsive site, speculative.",
    role: "Sole designer and developer. Refreshed the brand (modernised primary mark, kept the devil) and built a prototype website from scratch modelled on professional NRL club sites.",
    problem:
      "Norths Devils needed an identity that felt current and dynamic without losing the club's history. The existing mark struggled at small sizes and in digital. The site concept was built alongside the brand to show how it would work in practice.",
    outcome:
      "Speculative work. Not adopted by the club. Built as a self-initiated concept.",
    heroImage: {
      src: "/images/norths-devils/desktop.png",
      alt: "Norths Devils RLFC prototype website desktop view with full-screen hero and navigation",
    },
    images: [],
    hasDepth: true,
    depth: [
      {
        heading: "A modernised mark",
        body: "The brief was to feel current without losing the club. I kept the devil and tightened the vector construction so it holds at small sizes and in digital, where the old mark struggled. Angular type for aggression, rounded corners for a bit of vintage.",
        images: [
          {
            src: "/images/norths-devils/logo-1.png",
            aspectRatio: "1/1",
            caption: "The refreshed primary mark.",
            alt: "Norths Devils RLFC refreshed logo, modernised devil mark with thickened edges for digital reproduction",
          },
          {
            src: "/images/norths-devils/logo-2.png",
            aspectRatio: "1/1",
            caption: "Before and after, old mark versus new.",
            alt: "Norths Devils logo before and after comparison, original versus refreshed mark side by side",
          },
        ],
      },
      {
        heading: "The prototype site",
        body: "Built from scratch and modelled on professional NRL club sites, so the brand could be judged in something close to the real thing rather than a static mockup.",
        images: [
          {
            src: "/images/norths-devils/video-desktop-poster.jpg",
            video: "/images/norths-devils/video-desktop.webm",
            aspectRatio: "16/9",
            caption: "Scrolling the desktop prototype.",
            alt: "Norths Devils prototype website desktop interaction, scroll through homepage, team and club sections",
          },
        ],
      },
      {
        heading: "On every screen",
        body: "The same layout, holding its shape down to a phone.",
        images: [
          {
            src: "/images/norths-devils/iphone-1.png",
            aspectRatio: "4/3",
            caption: "Mobile layout, club colours intact.",
            alt: "Norths Devils prototype website on iPhone mockup, mobile responsive layout",
          },
          {
            src: "/images/norths-devils/iphone-2.png",
            aspectRatio: "4/3",
            caption: "Team profile and news pages.",
            alt: "Norths Devils prototype website iPhone mockup, team profile and news page layout",
          },
          {
            src: "/images/norths-devils/video-mobile-poster.jpg",
            video: "/images/norths-devils/video-mobile.webm",
            aspectRatio: "4/3",
            caption: "Scrolling the responsive site on mobile.",
            alt: "Norths Devils prototype website mobile interaction, responsive scroll through the full site on iPhone",
          },
        ],
      },
      {
        heading: "Out in the world",
        body: "And how the refreshed mark would carry into the club's physical spaces.",
        images: [
          {
            src: "/images/norths-devils/mockup-wall.png",
            aspectRatio: "3/2",
            caption: "The mark at environmental scale.",
            alt: "Norths Devils refreshed logo on concrete wall mockup, environmental scale brand application",
          },
          {
            src: "/images/norths-devils/mockup-gallery.png",
            aspectRatio: "4/3",
            caption: "Brand applications across surfaces.",
            alt: "Norths Devils brand identity gallery wall mockup, logo silhouettes across multiple brand applications",
          },
        ],
      },
    ],
    liveUrl: "https://northsdevilsrlfc.framer.website",
  },

  /* 7. Copper Company. Full */
  {
    slug: "copper-company",
    name: "Copper Company",
    tier: "full",
    rank: 9,
    date: "2023",
    categories: ["Brand Identity", "Packaging Design"],
    skills: [
      "Brand Identity",
      "Logo Design",
      "Packaging Design",
      "Pattern Design",
      "Brand Guidelines",
    ],
    oneLiner:
      "Brand identity for a rum brand. Concept through to launch: monogram logo, packaging and guidelines.",
    role: "Sole designer. Built the full brand: monogram logo, repeating pattern for packaging and brand applications, guidelines, print-spec packaging and social photography.",
    problem:
      "The Copper Company was being built from scratch: name, identity and packaging all needed to line up. The mark had to stand out on shelf and translate into a pattern that could wrap across packaging and brand touchpoints.",
    outcome:
      "Client happy with the final output and the brand reading consistently across every touchpoint.",
    heroImage: {
      src: "/images/copper-company/hero.png",
      alt: "Copper Company rum bottle, staged product photography showing the final label design and brand identity",
    },
    heroSlideshow: [
      "/images/copper-company/hero.png",
      "/images/copper-company/bottle-1.png",
      "/images/copper-company/bottle-2.png",
      "/images/copper-company/insta-1.png",
      "/images/copper-company/insta-2.png",
    ],
    slideshowAspect: "1/1",
    images: [],
    hasDepth: true,
    depth: [
      {
        heading: "On the bottle",
        body: "The monogram does the heavy lifting on pack. The front label keeps it to the mark and the name; the back carries tasting notes over the repeating pattern, built from the same geometry as the logo.",
        images: [
          {
            src: "/images/copper-company/bottle-1.png",
            aspectRatio: "1/1",
            caption: "Front label, monogram at full print spec.",
            alt: "Copper Company rum bottle front, monogram label at print specification on amber glass bottle",
          },
          {
            src: "/images/copper-company/bottle-2.png",
            aspectRatio: "1/1",
            caption: "Back label, tasting notes over the repeat pattern.",
            alt: "Copper Company rum bottle back, secondary label with tasting notes and repeating monogram pattern",
          },
        ],
      },
      {
        heading: "Print-ready artwork",
        body: "The label as a flat net, set up for production with bleed and crop marks so it could go straight to the printer.",
        images: [
          {
            src: "/images/copper-company/label-flat.png",
            aspectRatio: "1.86/1",
            caption: "Label flat, artwork with full bleed and crop marks.",
            alt: "Copper Company label flat net, print-ready label design showing full bleed and artwork at flat view",
          },
        ],
      },
      {
        heading: "On social",
        body: "A short run of launch photography, graded to the copper-and-dark palette so the feed reads as one piece with the pack.",
        images: [
          {
            src: "/images/copper-company/insta-1.png",
            aspectRatio: "1/1",
            caption: "Launch product photography.",
            alt: "Copper Company Instagram post 1, brand-consistent social photography for rum product launch",
          },
          {
            src: "/images/copper-company/insta-2.png",
            aspectRatio: "1/1",
            caption: "Lifestyle shot in the brand grade.",
            alt: "Copper Company Instagram post 2, lifestyle photography with brand copper and dark colour treatment",
          },
        ],
      },
    ],
  },

  /* 8. Lows Design and Build. Full */
  {
    slug: "lows-design-build",
    name: "Lows Design and Build",
    tier: "full",
    rank: 8,
    date: "2023",
    categories: ["Brand Identity", "Web Design", "Environmental Graphics"],
    skills: [
      "Brand Identity",
      "Logo Design",
      "Web Design",
      "Environmental/Vehicle Graphics",
      "Brand Applications",
    ],
    oneLiner:
      "Full branding for a London family-run design-and-build company. Logo through to vehicle wrap, including a Bromley FC sponsorship activation.",
    role: "Sole designer. Refined the client's sketches into a scalable geometric mark, selected the brand typeface, set colour for digital and print. Applied across Bromley FC sponsorship banners, site hoarding, social icons, the website and a vehicle wrap.",
    problem:
      "Lows needed a brand that could hold up anywhere: a football club sponsorship banner, a vehicle wrap, a website. The mark had to be readable at every scale and in every production environment.",
    outcome:
      "Strong growth in workload since launch. The Bromley FC sponsorship pulled real results.",
    logo: "/images/lows-design-build/logomark.svg",
    cardLogo: "/images/lows-design-build/logomark.svg",
    liveUrl: "https://www.lowsdesignandbuild.com",
    heroModel: {
      model: "/models/studio-display/display.gltf",
      image: "/images/lows-design-build/website-live.webp",
    },
    heroImage: {
      src: "/images/lows-design-build/hero.png",
      alt: "Lows Design and Build brand identity, hero composite showing logo and brand applications",
    },
    images: [],
    hasDepth: true,
    depth: [
      {
        heading: "The mark",
        body: "I refined the client's own sketches into a scalable geometric mark, then set a typeface and colour that hold up in print and on screen.",
        images: [
          {
            src: "/images/lows-design-build/logomark.svg",
            aspectRatio: "300/80",
            caption: "The geometric mark, refined from the client's concepts.",
            alt: "Lows Design and Build logo, geometric scalable mark refined from client concept sketches",
          },
        ],
      },
      {
        heading: "Bromley FC sponsorship",
        body: "The real test was a football club. The mark went onto matchday kit and a pitch-side LED banner, where it had to read from across the stadium.",
        images: [
          {
            src: "/images/lows-design-build/bromley-fc.jpg",
            aspectRatio: "3/4",
            caption: "The mark on club kit and matchday branding.",
            alt: "Lows Design and Build Bromley FC sponsorship, brand mark on football club materials and kit",
          },
          {
            src: "/images/lows-design-build/bromley-led-2.jpg",
            aspectRatio: "3/4",
            caption: "Pitch-side LED banner, brand at stadium scale.",
            alt: "Lows Design and Build Bromley FC LED pitch-side advertising banner, brand at stadium scale",
          },
        ],
      },
      {
        heading: "On site",
        body: "Closer to home, the same brand wraps the hoarding around a live construction site at street scale.",
        images: [
          {
            src: "/images/lows-design-build/hoarding.jpg",
            aspectRatio: "4/3",
            caption: "Site hoarding on construction fencing.",
            alt: "Lows Design and Build site hoarding, brand identity on construction site fence at street scale",
          },
        ],
      },
    ],
  },

  /* 10. Momentum Mentoring. Gallery */
  {
    slug: "momentum-mentoring",
    name: "Momentum Mentoring",
    tier: "gallery",
    rank: 10,
    date: "2024",
    categories: ["Brand Identity", "Web Design", "NDIS"],
    skills: ["Brand Identity", "Web Design", "Framer Development"],
    oneLiner:
      "Brand and website for an NDIS mentoring provider, built to feel empowering and warm rather than clinical.",
    role: "Sole designer and developer. Built the brand identity and the Framer website end to end, from the logomark and colour through to a CMS the team can run themselves after launch.",
    problem:
      "Momentum needed a brand and site that read as empowering and independent without slipping into clinical or institutional territory. It had to feel approachable for participants and their families, and stay simple for a small team to maintain once it was live.",
    outcome:
      "Brand and website delivered as a single piece of work and live at momentummentoring.co.",
    logo: "/images/momentum-mentoring/Logo2.svg",
    heroModel: {
      model: "/models/studio-display/display.gltf",
      video: "/images/momentum-mentoring/screen.mp4",
    },
    heroImage: {
      src: "/images/momentum-mentoring/hero.webp",
      alt: "Momentum Mentoring brand identity and website for an NDIS mentoring provider",
    },
    images: [
      {
        src: "/images/momentum-mentoring/hero.webp",
        caption: "Home page: a warm, approachable layout built for an NDIS mentoring audience.",
        alt: "Momentum Mentoring website homepage with empowering, approachable NDIS branding",
      },
    ],
    hasDepth: false,
    delivered: [
      "Brand identity (logomark and logotype)",
      "Brand colour system",
      "Framer website, designed and built",
      "CMS setup for team-managed content",
      "Responsive, mobile-optimised layouts",
      "Foundational SEO and technical setup",
      "Domain connection",
      "CMS handover session",
    ],
    liveUrl: "https://momentummentoring.co",
  },

  /* 11. TasWater. Gallery */
  {
    slug: "taswater",
    name: "TasWater",
    tier: "gallery",
    rank: 12,
    date: "2023",
    categories: ["Infographic Design", "Information Design"],
    skills: ["Infographic Design", "Information Design", "Brand-Compliant Design"],
    oneLiner:
      "Two infographic projects for Tasmania's statewide water and sewerage corporation. On-brand and leadership-approved.",
    role: "Infographic designer. Delivered two projects in a month inside TasWater's existing brand guidelines: new visual systems plus refinement of existing materials.",
    problem:
      "TasWater needed complex data shown clearly while staying inside their strict brand guidelines. New visual systems had to feel native to what already existed.",
    outcome:
      "Client confirmed they were happy. Leadership signed off on the brand alignment.",
    logo: "/images/taswater/logo.png",
    cardStack: ["/images/taswater/hero.jpg", "/images/taswater/map.jpg"],
    heroImage: {
      src: "/images/taswater/hero.jpg",
      alt: "TasWater 'first 12 months' employee onboarding journey infographic, designed inside the TasWater brand",
    },
    images: [],
    hasDepth: true,
    depth: [
      {
        heading: "Inside the guidelines",
        body: "Two infographic projects in a month, both made to live inside TasWater's existing brand. The job was to show complex infrastructure data clearly without inventing a new visual language, so the new pieces read as native to what was already there. Leadership signed off on the brand alignment.",
        images: [
          {
            src: "/images/taswater/map.jpg",
            aspectRatio: "16/9",
            caption: "Service area and infrastructure, mapped on a branded base.",
            alt: "TasWater interactive map infographic, service area and infrastructure locations across Tasmania",
          },
        ],
      },
    ],
  },

  /* 12. The London Home Show. Gallery */
  {
    slug: "london-home-show",
    name: "The London Home Show",
    tier: "gallery",
    rank: 11,
    date: "2022",
    categories: ["Event Design", "Print & Digital"],
    skills: ["Event Design", "Print Design", "Digital Campaign"],
    oneLiner:
      "Event design across print and digital for the UK's first affordable homes exhibition. Flags, banners, stage graphics, brochures and booklets.",
    role: "Designer. Print and digital event materials across all show collateral.",
    problem:
      "The London Home Show needed event materials that worked across a wide range of print formats and digital channels: outdoor flags, stage graphics, 10-year anniversary brochures.",
    outcome: "Campaign rollout delivered on time across every channel.",
    logo: "/images/london-home-show/LHS%20Logo.svg",
    heroImage: {
      src: "/images/london-home-show/hero.jpg",
      alt: "The London Home Show event, branding and signage across the exhibition venue",
    },
    heroSlideshow: [
      "/images/london-home-show/hero.jpg",
      "/images/london-home-show/flags.jpg",
      "/images/london-home-show/banner.jpg",
      "/images/london-home-show/stage.jpg",
      "/images/london-home-show/booklets.jpg",
      "/images/london-home-show/brochure.jpg",
      "/images/london-home-show/podium.jpg",
      "/images/london-home-show/brochure-10yr.jpg",
    ],
    slideshowAspect: "3/2",
    images: [],
    hasDepth: true,
    depth: [
      {
        heading: "Around the venue",
        body: "The first affordable-homes exhibition of its kind needed to feel like an event from the street in. Flags outside, then directional signage and brand presence once you were through the doors.",
        images: [
          {
            src: "/images/london-home-show/flags.jpg",
            aspectRatio: "3/2",
            caption: "Exterior flags at street scale.",
            alt: "London Home Show exterior flags, branded event flags outside the exhibition venue",
          },
          {
            src: "/images/london-home-show/banner.jpg",
            aspectRatio: "3/2",
            caption: "Interior wayfinding and signage.",
            alt: "London Home Show banner, interior branded signage for event wayfinding",
          },
        ],
      },
      {
        heading: "On stage",
        body: "A branded stage for the panel sessions, from the podium to the full backdrop behind the speakers.",
        images: [
          {
            src: "/images/london-home-show/podium.jpg",
            aspectRatio: "3/2",
            caption: "Speaker podium.",
            alt: "London Home Show speaker podium, branded stage and podium for exhibition panel sessions",
          },
          {
            src: "/images/london-home-show/stage.jpg",
            aspectRatio: "3/2",
            caption: "Full-width stage backdrop.",
            alt: "London Home Show stage backdrop, full-width branded graphic for the main exhibition stage",
          },
        ],
      },
      {
        heading: "In print",
        body: "The take-home pieces: the show brochure and the programme and exhibitor booklets.",
        images: [
          {
            src: "/images/london-home-show/brochure.jpg",
            aspectRatio: "3/2",
            caption: "Show brochure.",
            alt: "London Home Show brochure, primary printed collateral distributed at the exhibition",
          },
          {
            src: "/images/london-home-show/booklets.jpg",
            aspectRatio: "3/2",
            caption: "Programme and exhibitor booklets.",
            alt: "London Home Show event booklets, attendee programme and exhibitor guide printed collateral",
          },
        ],
      },
      {
        heading: "Ten years",
        body: "And a commemorative brochure marking a decade of the show.",
        images: [
          {
            src: "/images/london-home-show/brochure-10yr.jpg",
            aspectRatio: "3/2",
            caption: "The 10-year anniversary edition.",
            alt: "London Home Show 10-year anniversary brochure, commemorative edition marking decade of the exhibition",
          },
        ],
      },
    ],
  },

  /* Packer & Associates. First of the Selected Projects grid. */
  {
    slug: "packer-associates",
    name: "Packer & Associates",
    tier: "gallery",
    rank: 2,
    date: "2023",
    categories: ["Publication Design", "Print Collateral"],
    skills: [
      "Publication Design",
      "Capability Statement",
      "Print Collateral",
      "Brand Applications",
    ],
    oneLiner:
      "An ongoing design and communications contract across three workstreams: website management, the capability statement, and social/editorial content.",
    role: "Designer and content lead across the contract, running the website, producing the capability statement, and creating ongoing social and editorial content.",
    problem:
      "Packer & Associates needed a consistent design and communications presence maintained over time across three fronts: their website, their flagship capability statement, and their day-to-day social and editorial output.",
    outcome: "Brand expression held consistent across every touchpoint, sustained over the full engagement.",
    heroPdf: [
      "/images/packer-associates/pdf-pages/page-0-thumb.webp",
      "/images/packer-associates/pdf-pages/page-1-thumb.webp",
      "/images/packer-associates/pdf-pages/page-2-thumb.webp",
      "/images/packer-associates/pdf-pages/page-3-thumb.webp",
      "/images/packer-associates/pdf-pages/page-4-thumb.webp",
      "/images/packer-associates/pdf-pages/page-5-thumb.webp",
      "/images/packer-associates/pdf-pages/page-6-thumb.webp",
      "/images/packer-associates/pdf-pages/page-7-thumb.webp",
      "/images/packer-associates/pdf-pages/page-8-thumb.webp",
      "/images/packer-associates/pdf-pages/page-9-thumb.webp",
      "/images/packer-associates/pdf-pages/page-10-thumb.webp",
      "/images/packer-associates/pdf-pages/page-11-thumb.webp",
    ],
    // Detail-page hero: the studio-display mac (same as KinAya) playing the
    // packer video. Home grid still uses heroPdf (checked first in the card).
    heroModel: {
      model: "/models/studio-display/display.gltf",
      video: "/images/packer-associates/3D%20Model%20Video.webm",
    },
    heroImage: {
      src: "/images/packer-associates/hero-poster.jpg",
      alt: "Packer & Associates website, brand identity and digital presence for the capability solutions company",
    },
    heroVideo: "/images/packer-associates/website-video.webm",
    images: [],
    hasDepth: false,
  },

  /* 14. Toombul Bulls. Gallery. CONCEPT */
  {
    slug: "toombul-bulls",
    hidden: true,
    name: "Toombul Bulls",
    tier: "gallery",
    rank: 14,
    isConcept: true,
    date: "2024",
    categories: ["Brand Refresh", "Sports Branding"],
    skills: ["Logo Design", "Brand Refresh", "Sports Branding"],
    oneLiner:
      "Logo and brand applications for a rugby league club rebrand. Speculative, not yet adopted.",
    role: "Designer. Logo and brand applications.",
    problem:
      "Toombul Bulls needed a refreshed identity that felt current while keeping the club's heritage in view.",
    outcome:
      "Speculative work. Not adopted by the club. Built as a self-initiated concept.",
    heroImage: {
      src: "/images/toombul-bulls/hero.webp",
      alt: "Toombul Bulls brand refresh concept, logo and brand applications for Queensland rugby league club",
    },
    images: [],
    hasDepth: false,
  },

  /* ─── Palms Motel — personal AI image-direction + TikTok series ───
     Pulled across from the old Framer site. Copy + numbers are real; refine the
     wording as you like. Slug kept as "palmsmotel" to match the indexed URL. */
  {
    slug: "palmsmotel",
    name: "Palms Motel",
    tier: "full",
    rank: 5,
    isHobby: true,
    tiktok: "palmsmotel",
    date: "2024",
    categories: ["Art Direction", "AI Imagery", "Social Content"],
    skills: ["Midjourney", "Prompt Engineering", "Photoshop", "Art Direction", "Social Content"],
    oneLiner:
      "A personal project: a fictional 1970s Palm Springs motel, built as an AI image world and run as a TikTok slideshow series.",
    role: "Solo. Directed the look, built the Midjourney prompt system, graded and finished every image in Photoshop, and ran the TikTok series end to end.",
    problem:
      "Most AI imagery falls apart as a set: every picture looks like a different photographer on a different day. The aim was the opposite. One motel, one world, every post looking like it was shot on the same afternoon, in the same light, by the same person.",
    outcome:
      "Forty-eight slideshow posts off the back of one prompt system. The series passed 100k likes, and the top post hit 770k views.",
    heroSlideshow: [
      "/images/palmsmotel/scene-1.webp",
      "/images/palmsmotel/scene-2.webp",
      "/images/palmsmotel/scene-3.webp",
    ],
    slideshowAspect: "4/3",
    heroImage: {
      src: "/images/palmsmotel/scene-1.webp",
      alt: "Palms Motel, an AI-generated 1970s Palm Springs motel scene with a kidney pool, palms and a mid-century house",
    },
    images: [],
    hasDepth: true,
    outcomes: {
      subtitle: "Across the series",
      stats: [
        { value: "770k", delta: "Top post", label: "Views" },
        { value: "48", delta: "One prompt system", label: "Slideshow posts" },
        { value: "288+", delta: "From the same recipe", label: "Images generated" },
      ],
    },
    depth: [
      {
        heading: "The idea",
        body: "A motel that never existed, told one post at a time. Each slideshow was six images under the same line, “POV: you just moved to Palm Springs, 1977,” set to a piece of viral audio. The point was the world, not the single image.",
        images: [
          {
            src: "/images/palmsmotel/sign.png",
            aspectRatio: "4/5",
            caption: "The motel sign, the anchor of the world.",
            alt: "Palms Motel illuminated roadside sign at dusk, framed by palm trees",
          },
        ],
      },
      {
        heading: "The prompt system",
        body: "Consistency came from a prompt framework split into fixed and variable parts. Fixed: the era, the camera (Hasselblad, 28mm), a sage-and-coral colour temperature, and a Slim Aarons / Architectural Digest reference. Variable: the scene. Same recipe, different room, so 288 images still read as one set.",
        images: [],
      },
      {
        heading: "Finishing and the store",
        body: "Raw Midjourney outputs went through Photoshop for grading and artifact cleanup, then out as TikTok slideshows. A handful sold as poster prints through a Shopify store before the time it took to run made it not worth keeping open.",
        cols: 4,
        images: [
          { src: "/images/palmsmotel/poster-1.webp", aspectRatio: "424/600", caption: "Poster print.", alt: "Palms Motel poster print, retro travel poster style" },
          { src: "/images/palmsmotel/poster-2.webp", aspectRatio: "424/600", caption: "Poster print.", alt: "Palms Motel poster print, retro travel poster style" },
          { src: "/images/palmsmotel/poster-3.webp", aspectRatio: "424/600", caption: "Poster print.", alt: "Palms Motel poster print, retro travel poster style" },
          { src: "/images/palmsmotel/poster-4.webp", aspectRatio: "424/600", caption: "Poster print.", alt: "Palms Motel poster print, retro travel poster style" },
        ],
      },
    ],
  },
];

/* Helper: get project by slug */
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/* Helper: get all projects that have case study pages */
export function getCaseStudyProjects(): Project[] {
  return projects.filter((p) => p.tier !== "gallery");
}
