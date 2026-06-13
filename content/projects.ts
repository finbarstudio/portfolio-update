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
  liveUrl?: string;
  heroSpline?: string;
  heroModel?: {           // Interactive 3D model with looping video on its screen
    model: string;        // Path to .gltf (under /public)
    video: string;        // Path to looping video shown on the screen
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
  heroSlideshow?: string[];   // Auto-advancing crossfade cover carousel (no WebGL)
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
}

/* PROJECTS, ranked, all tiers */

export const projects: Project[] = [

  /* 2. KinAya. Featured */
  {
    slug: "kinaya",
    name: "KinAya",
    tier: "full",
    rank: 5,
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
        "How I designed and produced 15+ bespoke sales process playbooks for a national sales consultancy, end to end, from content writing to print-ready delivery.",
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
      "Bespoke Sales Process Playbooks for a Brisbane sales consultancy. Researched, written, designed, illustrated and print-managed in-house.",
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
    rank: 4,
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
    hidden: true,
    name: "Compass Capability",
    tier: "full",
    rank: 5,
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
    images: [
      {
        src: "/images/compass-capability/graphic.png",
        caption: "Brand graphic system: the directional motif pulled from the logomark, used as a flexible asset.",
        alt: "Compass Capability brand graphic, directional compass motif used as a scalable brand asset",
      },
      {
        src: "/images/compass-capability/pattern.png",
        caption: "Repeating pattern built from the logo geometry. Used across brand touchpoints and digital backgrounds.",
        alt: "Compass Capability repeating pattern, logo-derived geometric pattern for brand applications",
      },
      {
        src: "/images/compass-capability/mockup-billboard.png",
        caption: "Billboard mockup. Brand applied at large-format outdoor scale.",
        alt: "Compass Capability brand identity on billboard mockup, large format outdoor application",
      },
      {
        src: "/images/compass-capability/mockup-business-card.png",
        caption: "Business card mockup: tight typography, logo mark at small print scale.",
        alt: "Compass Capability business card mockup, logo and typography at small print scale",
      },
      {
        src: "/images/compass-capability/mockup-stationary.png",
        caption: "Stationery mockup: brand applied across letterhead and document templates.",
        alt: "Compass Capability stationery mockup, letterhead and document templates with brand identity",
      },
    ],
    hasDepth: false,
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
    hidden: true,
    name: "Norths Devils RLFC",
    tier: "full",
    rank: 6,
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
    images: [
      {
        src: "/images/norths-devils/video-desktop-poster.jpg",
        video: "/images/norths-devils/video-desktop.webm",
        caption: "Desktop scroll through the Norths Devils prototype site.",
        alt: "Norths Devils prototype website desktop interaction, scroll through homepage, team and club sections",
      },
      {
        src: "/images/norths-devils/video-mobile-poster.jpg",
        video: "/images/norths-devils/video-mobile.webm",
        caption: "Mobile scroll showing the full responsive behaviour.",
        alt: "Norths Devils prototype website mobile interaction, responsive scroll through the full site on iPhone",
      },
      {
        src: "/images/norths-devils/logo-1.png",
        caption: "Refreshed primary mark. Devil imagery kept; vector construction tightened.",
        alt: "Norths Devils RLFC refreshed logo, modernised devil mark with thickened edges for digital reproduction",
      },
      {
        src: "/images/norths-devils/logo-2.png",
        caption: "Before and after comparison. Angular type for aggression, rounded corners for a vintage feel.",
        alt: "Norths Devils logo before and after comparison, original versus refreshed mark side by side",
      },
      {
        src: "/images/norths-devils/iphone-1.png",
        caption: "iPhone mockup: responsive layout at mobile scale, club colours intact.",
        alt: "Norths Devils prototype website on iPhone mockup, mobile responsive layout",
      },
      {
        src: "/images/norths-devils/iphone-2.png",
        caption: "iPhone mockup: secondary page scroll showing team profile and news sections.",
        alt: "Norths Devils prototype website iPhone mockup, team profile and news page layout",
      },
      {
        src: "/images/norths-devils/mockup-wall.png",
        caption: "Concrete wall mockup. Refreshed mark at large environmental scale.",
        alt: "Norths Devils refreshed logo on concrete wall mockup, environmental scale brand application",
      },
      {
        src: "/images/norths-devils/mockup-gallery.png",
        caption: "Gallery wall mockup: logo silhouettes and brand applications across surfaces.",
        alt: "Norths Devils brand identity gallery wall mockup, logo silhouettes across multiple brand applications",
      },
    ],
    hasDepth: false,
    liveUrl: "https://northsdevilsrlfc.framer.website",
  },

  /* 7. Copper Company. Full */
  {
    slug: "copper-company",
    hidden: true,
    name: "Copper Company",
    tier: "full",
    rank: 7,
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
    images: [
      {
        src: "/images/copper-company/bottle-1.png",
        caption: "Bottle front: monogram label at full print spec, ready for production.",
        alt: "Copper Company rum bottle front, monogram label at print specification on amber glass bottle",
      },
      {
        src: "/images/copper-company/bottle-2.png",
        caption: "Bottle back: secondary label with tasting notes and brand pattern.",
        alt: "Copper Company rum bottle back, secondary label with tasting notes and repeating monogram pattern",
      },
      {
        src: "/images/copper-company/label-flat.png",
        caption: "Label flat net: the full label design as print-ready artwork with bleed and crop marks.",
        alt: "Copper Company label flat net, print-ready label design showing full bleed and artwork at flat view",
      },
      {
        src: "/images/copper-company/insta-1.png",
        caption: "Social content: brand-consistent product photography for Instagram.",
        alt: "Copper Company Instagram post 1, brand-consistent social photography for rum product launch",
      },
      {
        src: "/images/copper-company/insta-2.png",
        caption: "Social content: lifestyle photography with the brand colour treatment.",
        alt: "Copper Company Instagram post 2, lifestyle photography with brand copper and dark colour treatment",
      },
    ],
    hasDepth: false,
  },

  /* 8. Lows Design and Build. Full */
  {
    slug: "lows-design-build",
    hidden: true,
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
    logo: "/images/lows-design-build/logo.png",
    heroImage: {
      src: "/images/lows-design-build/hero.png",
      alt: "Lows Design and Build brand identity, hero composite showing logo and brand applications",
    },
    images: [
      {
        src: "/images/lows-design-build/logo.png",
        caption: "Scalable geometric mark, refined from the client's sketches and built on standard logo construction principles.",
        alt: "Lows Design and Build logo, geometric scalable mark refined from client concept sketches",
      },
      {
        src: "/images/lows-design-build/bromley-fc.jpg",
        caption: "Bromley FC sponsorship: the Lows mark in a Premier League-affiliated club's kit and branding.",
        alt: "Lows Design and Build Bromley FC sponsorship, brand mark on football club materials and kit",
      },
      {
        src: "/images/lows-design-build/bromley-led-2.jpg",
        caption: "Bromley FC LED pitch-side banner. Brand at full stadium visibility.",
        alt: "Lows Design and Build Bromley FC LED pitch-side advertising banner, brand at stadium scale",
      },
      {
        src: "/images/lows-design-build/hoarding.jpg",
        caption: "Site hoarding: brand applied to construction site fencing at street scale.",
        alt: "Lows Design and Build site hoarding, brand identity on construction site fence at street scale",
      },
      {
        src: "/images/lows-design-build/website.png",
        caption: "Website: clean, brand-consistent design built for conversion and referral traffic.",
        alt: "Lows Design and Build website, branded homepage design for the construction and design company",
      },
    ],
    hasDepth: false,
  },

  /* 9. Nimbus Coffee Co. Full */
  {
    slug: "nimbus-coffee",
    hidden: true,
    name: "Nimbus Coffee Co.",
    tier: "full",
    rank: 9,
    date: "2024",
    categories: ["Brand Identity", "Packaging Design"],
    skills: [
      "Brand Identity",
      "Logo Design",
      "Packaging Design",
      "Typography",
      "Brand Systems",
    ],
    oneLiner:
      "Visual identity system for an artisan roastery. Earthy palette, cloud-inspired mark, built to extend into print, web and experiential.",
    role: "Sole designer. Built the core logo, typography, palette and brand system. Applied across business cards, packaging, merchandise and digital.",
    problem:
      "Nimbus wanted to feel artisanal and considered without coming across precious or cold. The identity had to hold its own on specialty retail shelves and scale into e-commerce, pop-ups and whatever came next.",
    outcome:
      "Brand system delivered across the initial set of touchpoints.",
    logo: "/images/nimbus-coffee/logo.jpg",
    heroImage: {
      src: "/images/nimbus-coffee/hero.png",
      alt: "Nimbus Coffee Co. packaging mockup, branded coffee bags showing the cloud-inspired mark and earthy palette",
    },
    images: [
      {
        src: "/images/nimbus-coffee/mockup-2.png",
        caption: "Packaging system: modular label design, scalable across bag sizes and blend types.",
        alt: "Nimbus Coffee Co. packaging system mockup, modular label design on multiple coffee bag sizes",
      },
      {
        src: "/images/nimbus-coffee/logo.jpg",
        caption: "Core logo: a cloud-formation-inspired mark with an earthy palette that nods to roasting terrain.",
        alt: "Nimbus Coffee Co. logo, cloud formation mark with logotype in earthy brand palette",
      },
      {
        src: "/images/nimbus-coffee/creative-1.png",
        caption: "Brand creative: identity applied across digital touchpoints and social.",
        alt: "Nimbus Coffee Co. brand creative, logo and brand identity applied to digital social asset",
      },
      {
        src: "/images/nimbus-coffee/creative-2.png",
        caption: "Brand creative: secondary touchpoint showing typographic hierarchy in use.",
        alt: "Nimbus Coffee Co. brand creative 2, secondary digital asset with typographic brand system",
      },
    ],
    hasDepth: false,
  },

  /* 10. Momentum Mentoring. Gallery */
  {
    slug: "momentum-mentoring",
    name: "Momentum Mentoring",
    tier: "gallery",
    rank: 6,
    date: "2024",
    categories: ["Brand Identity", "Web Design", "NDIS"],
    skills: ["Brand Identity", "Web Design", "Framer Development"],
    oneLiner:
      "Brand and website for an NDIS mentoring provider. Built around empowerment, independence and personal growth.",
    role: "Designer and developer.",
    problem:
      "Momentum needed a brand and site that read as empowering and independent without slipping into clinical or institutional territory.",
    outcome: "Live site: momentummentoring.co.",
    logo: "/images/momentum-mentoring/Logo2.svg",
    heroModel: {
      model: "/models/studio-display/display.gltf",
      video: "/images/momentum-mentoring/screen.mp4",
    },
    heroImage: {
      src: "/images/momentum-mentoring/hero.webp",
      alt: "Momentum Mentoring brand identity and website for an NDIS mentoring provider",
    },
    images: [],
    hasDepth: false,
    liveUrl: "https://momentummentoring.co",
  },

  /* 11. TasWater. Gallery */
  {
    slug: "taswater",
    hidden: true,
    name: "TasWater",
    tier: "gallery",
    rank: 11,
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
    heroImage: {
      src: "/images/taswater/hero.jpg",
      alt: "TasWater infographic project: progression infographic showing Tasmania's water infrastructure milestones",
    },
    images: [
      {
        src: "/images/taswater/map.jpg",
        caption: "Interactive map infographic. TasWater's service area and infrastructure on a branded map.",
        alt: "TasWater interactive map infographic, service area and infrastructure locations across Tasmania",
      },
      {
        src: "/images/taswater/logo.png",
        caption: "TasWater. Brand-compliant design inside their existing identity system.",
        alt: "TasWater logo, the brand identity guiding all infographic design decisions",
      },
    ],
    hasDepth: false,
  },

  /* 12. The London Home Show. Gallery */
  {
    slug: "london-home-show",
    hidden: true,
    name: "The London Home Show",
    tier: "gallery",
    rank: 12,
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
    images: [
      {
        src: "/images/london-home-show/flags.jpg",
        caption: "Exterior flags: branding at street scale, welcoming attendees in.",
        alt: "London Home Show exterior flags, branded event flags outside the exhibition venue",
      },
      {
        src: "/images/london-home-show/banner.jpg",
        caption: "Banner and wayfinding: interior directional signage and brand presence.",
        alt: "London Home Show banner, interior branded signage for event wayfinding",
      },
      {
        src: "/images/london-home-show/booklets.jpg",
        caption: "Event booklets: programme and exhibitor guides for attendees.",
        alt: "London Home Show event booklets, attendee programme and exhibitor guide printed collateral",
      },
      {
        src: "/images/london-home-show/brochure.jpg",
        caption: "Show brochure: the main take-home piece of printed collateral.",
        alt: "London Home Show brochure, primary printed collateral distributed at the exhibition",
      },
      {
        src: "/images/london-home-show/podium.jpg",
        caption: "Speaker podium: branded stage environment for the panel sessions.",
        alt: "London Home Show speaker podium, branded stage and podium for exhibition panel sessions",
      },
      {
        src: "/images/london-home-show/stage.jpg",
        caption: "Stage backdrop: full-width branded graphic for the main event space.",
        alt: "London Home Show stage backdrop, full-width branded graphic for the main exhibition stage",
      },
      {
        src: "/images/london-home-show/brochure-10yr.jpg",
        caption: "10-year anniversary brochure. A commemorative edition marking a decade of the show.",
        alt: "London Home Show 10-year anniversary brochure, commemorative edition marking decade of the exhibition",
      },
    ],
    hasDepth: false,
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
];

/* Helper: get project by slug */
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/* Helper: get all projects that have case study pages */
export function getCaseStudyProjects(): Project[] {
  return projects.filter((p) => p.tier !== "gallery");
}
