/**
 * ─────────────────────────────────────────────────────────────
 *  finbar✶studio — Project Content
 *  All copy, images, dates, tags, and case study content lives
 *  here. Edit this file to update anything on the site.
 *
 *  IMAGE GUIDE
 *  ───────────────────────────────────────────────────────────
 *  All images live in /public/images/<slug>/
 *  Compressed WebP versions are in the same folder as the originals.
 *  Videos are WebM; poster frames are WebP.
 *
 *  ProjectImage.video — set this to a .webm path to render a
 *  looping video in the case study gallery. src then acts as poster.
 *
 *  Project.heroVideo — looping WebM for the case study hero.
 *  Project.pdfSlideshow — array of WebP page images from a PDF.
 * ─────────────────────────────────────────────────────────────
 */

export type Tier = "featured" | "full" | "gallery";

export interface ProjectImage {
  src: string;        // WebP image path (also poster when video is set)
  caption?: string;
  alt: string;
  video?: string;     // WebM path — if set, renders as looping video
}

export interface DepthSection {
  heading: string;
  body: string;
  images: ProjectImage[];
}

export interface Project {
  slug: string;
  name: string;
  tier: Tier;
  rank: number;
  isConcept?: boolean;
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
  liveUrl?: string;
  heroSpline?: string;
  companyUrl?: string;
  pdfSlideshow?: {        // PDF rendered as image pages
    title: string;
    pages: string[];
  };
}

/* ─────────────────────────────────────────────────────────── */
/*  PROJECTS — ranked, all tiers                              */
/* ─────────────────────────────────────────────────────────── */

export const projects: Project[] = [

  /* ── 1 ── KinAya ── Featured ────────────────────────────── */
  {
    slug: "kinaya",
    name: "KinAya",
    tier: "featured",
    rank: 1,
    date: "2024",
    categories: ["Brand Identity", "Web Design", "Framer", "NDIS"],
    skills: ["Brand Identity", "Logo Design", "Framer Development", "CMS Setup", "Accessibility", "Web Design"],
    oneLiner: "Full brand identity and six-page Framer website for an Adelaide NDIS support services provider rebranding under a new name.",
    role: "Sole designer and developer. Delivered brand identity (logomark, logotype, colour system, guidelines) and a complete Framer website with CMS, custom interactive components, and an accessibility text-resizer.",
    problem: "KinAya was rebranding entirely — new name, new identity. They needed a trustworthy and human brand that felt considered and professional, not flashy, plus a website that could be handed over for ongoing CMS management.",
    outcome: "Cohesive brand and site delivered as one unified vision. Smooth CMS handover. Positive client testimonial from Aryan Sareen.",
    heroSpline: "/models/kinaya/kinaya.splinecode",
    heroImage: { src: "/images/kinaya/desktop.webp", alt: "KinAya website desktop view — structured, accessible homepage layout" },
    images: [
      { src: "/images/kinaya/desktop.webp", caption: "Home page — structured, readable, accessible layout across all viewports.", alt: "KinAya Framer website homepage on desktop — clean navigation, hero section with NDIS branding" },
      { src: "/images/kinaya/mobile.webp", caption: "Responsive mobile layout — full CMS control handed to the KinAya team post-launch.", alt: "KinAya website mobile view — responsive layout with navy and rose colour palette" },
      { src: "/images/kinaya/logo-dev-1.webp", caption: "Early logomark explorations — testing forms, weight, and warmth.", alt: "KinAya logo development early stage — pencil and vector explorations of the mark" },
      { src: "/images/kinaya/logo-dev-4.webp", caption: "Final refined logomark — the mark that balances warmth with professional trust.", alt: "KinAya final logomark — refined vector mark with logotype in brand typeface" },
    ],
    hasDepth: true,
    depth: [
      {
        heading: "Brand Identity Development",
        body: "The KinAya identity needed to project warmth, trust, and professionalism for an NDIS audience. The logomark went through multiple rounds of refinement — from rough concept to refined vector. The logotype was set in a considered typeface that balances humanity with clarity.",
        images: [
          { src: "/images/kinaya/logo-dev-1.webp", caption: "Early explorations — testing forms and visual weight.", alt: "KinAya logo development stage 1 — initial vector form explorations" },
          { src: "/images/kinaya/logo-dev-2.webp", caption: "Mid-process refinement — narrowing to the core concept.", alt: "KinAya logo development stage 2 — refined mark candidates" },
          { src: "/images/kinaya/logo-dev-3.webp", caption: "Near-final stage — geometry tightened, proportions locked.", alt: "KinAya logo development stage 3 — near-final mark with logotype" },
          { src: "/images/kinaya/logo-dev-4.webp", caption: "Final mark — delivered with full brand guidelines.", alt: "KinAya final logomark in brand colours — navy and rose on white" },
        ],
      },
      {
        heading: "Accessibility Text-Resizer",
        body: "A custom site-wide text-resizer was built in Framer — a component persistent across all pages that lets users increase the base text size in steps. For an NDIS provider whose users may have visual impairments, this was a non-negotiable feature. The resizer persists via localStorage so the user's preference is remembered across visits.",
        images: [
          {
            src: "/images/kinaya/accessibility-poster.webp",
            video: "/images/kinaya/accessibility.webm",
            caption: "The accessibility text-resizer in action — persistent across sessions, fully keyboard-accessible.",
            alt: "KinAya accessibility text-resizer demonstration — custom Framer component incrementally scaling text site-wide",
          },
        ],
      },
      {
        heading: "Website & CMS",
        body: "The six-page Framer site was built for handover from day one. CMS collections handle all repeating content — services, team profiles, and news posts — so the KinAya team can update content without touching code. SEO fundamentals were set from the outset: semantic HTML, per-page meta, Open Graph, and clean URLs.",
        images: [
          { src: "/images/kinaya/desktop.webp", caption: "Desktop layout — clean hierarchy, strong CTA structure.", alt: "KinAya desktop homepage full view — hero, services, and CTA sections" },
          { src: "/images/kinaya/mobile.webp", caption: "Mobile — fully responsive, same content hierarchy on small screens.", alt: "KinAya mobile homepage — responsive layout adapting to small viewport" },
        ],
      },
    ],
    liveUrl: "https://kinaya.com.au",
    companyUrl: "https://kinaya.com.au",
  },

  /* ── 2 ── TMYR — The Moment You Realise ── Featured ────── */
  {
    slug: "tmyr",
    name: "The Moment You Realise",
    tier: "featured",
    rank: 2,
    companyUrl: "https://sharetobuy.com",
    date: "2022–2023",
    categories: ["Social Campaign", "Motion Graphics", "Digital"],
    skills: [
      "Motion Graphics",
      "After Effects",
      "Video Editing",
      "Campaign Production",
      "Static Asset Design",
    ],
    oneLiner:
      "Evergreen social campaign for the UK's leading affordable-homeownership portal — capturing the emotional turning point when a buyer realises homeownership is within reach.",
    role: "Solo motion designer and campaign producer. Sourced/selected stock footage, built and animated all motion graphic templates in After Effects, adapted Share to Buy brand elements, and delivered the complete asset library.",
    problem:
      "Share to Buy needed an evergreen social campaign that emotionally connected with first-time buyers at the pivotal moment they realise shared ownership is achievable — across every major social format and channel.",
    outcome:
      "Campaign ran across 2022–2023 windows. December 2023 YoY: new registrants +19.7%, page views +1.5%, property enquiries +3.4%.",
    heroImage: {
      src: "/images/tmyr/hero-poster.webp",
      alt: "The Moment You Realise campaign — Share to Buy social video series hero frame",
    },
    heroVideo: "/images/tmyr/Looping Reels Hero.webm",
    images: [
      {
        src: "/images/tmyr/post-anthony.webp",
        video: "/images/tmyr/1080x1080 IG Posts/Anthony.webm",
        caption: "Anthony — 1:1 format social post, light/fade motion style.",
        alt: "TMYR campaign — Anthony story, 1080x1080 Instagram post with Share to Buy branding and motion overlay",
      },
      {
        src: "/images/tmyr/post-freya.webp",
        video: "/images/tmyr/1080x1080 IG Posts/Freya.webm",
        caption: "Freya — 1:1 format social post, light/fade motion style.",
        alt: "TMYR campaign — Freya story, 1080x1080 Instagram post showing shared ownership journey",
      },
      {
        src: "/images/tmyr/post-katie.webp",
        video: "/images/tmyr/1080x1080 IG Posts/Katie.webm",
        caption: "Katie — 1:1 format social post, bold/typewriter motion style.",
        alt: "TMYR campaign — Katie story, 1080x1080 Instagram post with kinetic text treatment",
      },
      {
        src: "/images/tmyr/post-lauren.webp",
        video: "/images/tmyr/1080x1080 IG Posts/Lauren.webm",
        caption: "Lauren — 1:1 format social post, bold/typewriter motion style.",
        alt: "TMYR campaign — Lauren story, 1080x1080 Instagram post with bold typography animation",
      },
    ],
    hasDepth: true,
    depth: [
      {
        heading: "Two Motion Styles",
        body: "The campaign runs in two distinct visual voices. The light/fade style uses soft dissolves and gentle type entrances — aspirational and calm. The bold/typewriter style uses punchy kinetic type and harder cuts — immediate, confident. Both share the same brand palette and can run simultaneously without visual conflict.",
        images: [
          {
            src: "/images/tmyr/post-anthony.webp",
            video: "/images/tmyr/1080x1080 IG Posts/Anthony.webm",
            caption: "Light/fade style — soft dissolves and gentle typography entrances.",
            alt: "TMYR light/fade motion style — Anthony story with soft animated text overlays",
          },
          {
            src: "/images/tmyr/post-katie.webp",
            video: "/images/tmyr/1080x1080 IG Posts/Katie.webm",
            caption: "Bold/typewriter style — punchy kinetic text for stronger stops.",
            alt: "TMYR bold/typewriter motion style — Katie story with kinetic text animation",
          },
        ],
      },
      {
        heading: "Format Matrix & Production Scale",
        body: "Every video was delivered across five formats (1:1, 9:16, 16:9, 4:5, and Stories/Reels) with both motion styles. An airtight file and naming system made client handover and future production scheduling frictionless. The modular After Effects templates meant each new story variant could be turned around in a fraction of the time.",
        images: [
          {
            src: "/images/tmyr/post-freya.webp",
            video: "/images/tmyr/1080x1080 IG Posts/Freya.webm",
            caption: "Freya — 1:1 square post, one of five format deliverables per story.",
            alt: "TMYR Freya story 1:1 format — one delivery format from the five-format matrix",
          },
          {
            src: "/images/tmyr/post-lauren.webp",
            video: "/images/tmyr/1080x1080 IG Posts/Lauren.webm",
            caption: "Lauren — consistent brand treatment across all story variants.",
            alt: "TMYR Lauren story — consistent Share to Buy brand treatment across all campaign variants",
          },
        ],
      },
    ],
  },

  /* ── 3 ── Salesmasters ── Featured ─────────────────────── */
  {
    slug: "salesmasters",
    name: "Salesmasters",
    tier: "featured",
    rank: 3,
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
      "Bespoke Sales Process Playbooks for a Brisbane sales consultancy — researched, written, designed, illustrated, and print-managed end-to-end.",
    role: "Sole designer and writer. Researching each client's industry, writing all content (3,000–3,500 words per playbook), building InDesign documents from scratch, designing custom illustrations and infographics, managing print delivery.",
    problem:
      "Salesmasters needed unique, 40–50+ page playbooks for each client — text-heavy but engaging, fully brand-compliant, and ready for print. No template existed. Every playbook had to feel custom while maintaining consistency.",
    outcome:
      "15+ playbooks delivered across healthcare, manufacturing, technology, storage, and professional services. Repeat engagement over 1+ year is the signal.",
    heroImage: {
      src: "/images/salesmasters/hero.webp",
      alt: "Salesmasters Sales Process Playbook — double-page spread from the Bus4x4 edition showing full-bleed layout and typography",
    },
    images: [
      {
        src: "/images/salesmasters/double-spread.webp",
        caption: "Double-page spread — full-bleed imagery with Salesmasters brand layout and typographic hierarchy.",
        alt: "Salesmasters playbook double-page spread — Bus4x4 edition, full-bleed photography with branded layout",
      },
      {
        src: "/images/salesmasters/sales-wheel-1.webp",
        caption: "The Sales Wheel — custom circular diagram mapping the client's full sales process across every stage.",
        alt: "Salesmasters Sales Wheel infographic — Active Medical edition, circular diagram mapping the sales cycle",
      },
      {
        src: "/images/salesmasters/bant-diagram.webp",
        caption: "BANT qualification framework — visualised as a purpose-built diagram for the playbook.",
        alt: "Salesmasters BANT qualification diagram — custom infographic for the SiteWare Direct playbook",
      },
      {
        src: "/images/salesmasters/cover-alpha-lifecare.webp",
        caption: "Cover design — Alpha Lifecare edition, each client gets a fully unique cover within the brand system.",
        alt: "Salesmasters playbook cover — Alpha Lifecare edition with healthcare photography and branded title treatment",
      },
    ],
    hasDepth: true,
    depth: [
      {
        heading: "Custom Sales Wheels",
        body: "The Sales Wheel is the centrepiece of every playbook — a custom circular diagram mapping each client's sales process across stages, touchpoints, and actions. Each wheel is drawn from scratch in Illustrator, adapted to the client's industry and specific sales methodology, then placed into InDesign for the final document.",
        images: [
          {
            src: "/images/salesmasters/sales-wheel-1.webp",
            caption: "Active Medical Sales Wheel — mapped to the medical equipment sales cycle.",
            alt: "Salesmasters Sales Wheel — Active Medical edition, circular infographic showing sales stages and touchpoints",
          },
          {
            src: "/images/salesmasters/sales-wheel-2.webp",
            caption: "Cutek Sales Wheel — adapted to the timber treatment and coatings industry.",
            alt: "Salesmasters Sales Wheel — Cutek edition, customised for timber treatment product sales cycle",
          },
        ],
      },
      {
        heading: "Technique Diagrams",
        body: "Supporting the Sales Wheel, each playbook includes a set of technique diagrams — BANT qualification, STAR method, and client-specific process maps. All built in Illustrator to a consistent visual grammar, then placed into InDesign alongside the body copy.",
        images: [
          {
            src: "/images/salesmasters/bant-diagram.webp",
            caption: "BANT diagram — Budget, Authority, Need, Timing qualification framework visualised.",
            alt: "BANT qualification framework diagram — custom infographic for Salesmasters playbook",
          },
          {
            src: "/images/salesmasters/star-diagram.webp",
            caption: "STAR method diagram — Situation, Task, Action, Result structured for sales storytelling.",
            alt: "STAR method diagram — Salesmasters playbook infographic for structured sales technique",
          },
          {
            src: "/images/salesmasters/technical-diagram.webp",
            caption: "Bus4x4 6-Point Technical Diagram — bespoke process map for the client's product range.",
            alt: "Bus4x4 6-point technical diagram — custom process infographic for the Bus4x4 playbook",
          },
        ],
      },
      {
        heading: "Cover Design & Print Delivery",
        body: "Each playbook's cover is a fully custom design — client logo prominently placed, bespoke title typography, brand-matched colour, imagery composited in Photoshop. Print files were prepared to spec (bleed, crop marks, CMYK) and managed through to delivery.",
        images: [
          {
            src: "/images/salesmasters/cover-alpha-lifecare.webp",
            caption: "Alpha Lifecare — healthcare imagery, brand-compliant layout.",
            alt: "Salesmasters playbook cover — Alpha Lifecare edition with healthcare photography and brand title treatment",
          },
          {
            src: "/images/salesmasters/cover-playbook.webp",
            caption: "Generic playbook cover — typographic-led treatment for broader applicability.",
            alt: "Salesmasters generic playbook cover — typographic design for broad use",
          },
          {
            src: "/images/salesmasters/cover-siteware.webp",
            caption: "SiteWare Direct — tech/industrial palette and sharp typographic hierarchy.",
            alt: "Salesmasters SiteWare Direct playbook cover — technology and industrial brand treatment",
          },
        ],
      },
    ],
  },

  /* ── 4 ── Joe Devine ── Full ────────────────────────────── */
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
      "Visual identity across five instrumental singles for a London-based guitarist transitioning to solo work.",
    role: "Art director and photographer. Created the cohesive visual identity for the five-single series: studio photography, custom artwork, colour treatments, and social/streaming assets.",
    problem:
      "Joe was transitioning from session work to solo releases and needed a visual identity that felt cohesive across five separate singles — each with its own colour and mood, but immediately recognisable as a series.",
    outcome:
      "Client pleased with the series. The releases gained significant traction after launch.",
    heroImage: {
      src: "/images/joe-devine/hero.webp",
      alt: "Joe Devine — all five single cover artworks displayed together, showing the cohesive visual series",
    },
    images: [
      {
        src: "/images/joe-devine/cover-1.webp",
        caption: "Single 1 — the series anchor, establishing the core photographic and typographic language.",
        alt: "Joe Devine single cover artwork — first release, establishing the visual series identity",
      },
      {
        src: "/images/joe-devine/cover-2.webp",
        caption: "Single 2 — warm colour treatment, same compositional logic as the series foundation.",
        alt: "Joe Devine single cover artwork — second release with warm colour treatment",
      },
      {
        src: "/images/joe-devine/cover-3.webp",
        caption: "Single 3 — distinct palette, cohesive visual grammar maintained across the series.",
        alt: "Joe Devine single cover artwork — third release with distinct colour palette",
      },
      {
        src: "/images/joe-devine/cover-4.webp",
        caption: "Single 4 — colour shift, same compositional and typographic framework throughout.",
        alt: "Joe Devine single cover artwork — fourth release maintaining series typographic framework",
      },
      {
        src: "/images/joe-devine/cover-5.webp",
        caption: "Single 5 — series conclusion; all five covers read as a complete set.",
        alt: "Joe Devine single cover artwork — fifth and final release completing the visual series",
      },
    ],
    hasDepth: false,
  },

  /* ── 5 ── Compass Capability ── Full ────────────────────── */
  {
    slug: "compass-capability",
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
      "Comprehensive brand identity from concept to implementation for a consulting firm empowering organisations through capability solutions.",
    role: "Sole designer. Developed the full brand identity: logo with directional symbolism, typographic selection, logo variations, graphical asset systems, brand guidelines, and social assets.",
    problem:
      "Compass needed a visual identity that communicated their positioning — navigation, direction, and capability — across green industry, renewables, mining, transport, and manufacturing sectors. The brand had to feel considered and credible across all touchpoints.",
    outcome:
      "Cohesive visual language across all touchpoints delivered.",
    heroImage: {
      src: "/images/compass-capability/hero.webp",
      alt: "Compass Capability brand identity — logo mockup collage showing the mark applied across touchpoints",
    },
    images: [
      {
        src: "/images/compass-capability/graphic.webp",
        caption: "Brand graphic system — the directional motif derived from the logomark, applied as a flexible graphic asset.",
        alt: "Compass Capability brand graphic — directional compass motif used as a scalable brand asset",
      },
      {
        src: "/images/compass-capability/pattern.webp",
        caption: "Repeating pattern — derived from the logo geometry, used across brand touchpoints and digital backgrounds.",
        alt: "Compass Capability repeating pattern — logo-derived geometric pattern for brand applications",
      },
      {
        src: "/images/compass-capability/mockup-billboard.webp",
        caption: "Billboard mockup — brand identity applied at large-format outdoor scale.",
        alt: "Compass Capability brand identity on billboard mockup — large format outdoor application",
      },
      {
        src: "/images/compass-capability/mockup-business-card.webp",
        caption: "Business card mockup — tight typography and logo mark at small print scale.",
        alt: "Compass Capability business card mockup — logo and typography at small print scale",
      },
      {
        src: "/images/compass-capability/mockup-stationary.webp",
        caption: "Stationery mockup — brand applied across letterhead and document templates.",
        alt: "Compass Capability stationery mockup — letterhead and document templates with brand identity",
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

  /* ── 6 ── Norths Devils RLFC ── Full — CONCEPT ──────────── */
  {
    slug: "norths-devils",
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
      "Brand refresh and prototype website for a storied Queensland rugby league club — modernised mark, full responsive site, speculative work.",
    role: "Sole designer and developer. Executed brand refresh (modernised primary mark retaining devil imagery) and built a prototype website from scratch mimicking professional NRL club sites.",
    problem:
      "Norths Devils needed an identity that felt contemporary and dynamic while honouring the club's history. The existing mark lacked clarity at small sizes and digital applications. A companion website concept was developed to show the full vision.",
    outcome:
      "Speculative work — not accepted or implemented by the club. Produced as a self-initiated concept project.",
    heroImage: {
      src: "/images/norths-devils/desktop.webp",
      alt: "Norths Devils RLFC prototype website — desktop view showing the full-screen hero and navigation",
    },
    images: [
      {
        src: "/images/norths-devils/video-desktop-poster.webp",
        video: "/images/norths-devils/video-desktop.webm",
        caption: "Website interaction — desktop scroll through the Norths Devils prototype site.",
        alt: "Norths Devils prototype website desktop interaction — scroll through homepage, team, and club sections",
      },
      {
        src: "/images/norths-devils/video-mobile-poster.webp",
        video: "/images/norths-devils/video-mobile.webm",
        caption: "Website interaction — mobile scroll demonstrating full responsive behaviour.",
        alt: "Norths Devils prototype website mobile interaction — responsive scroll through the full site on iPhone",
      },
      {
        src: "/images/norths-devils/logo-1.webp",
        caption: "Refreshed primary mark — devil imagery retained, refined vector construction.",
        alt: "Norths Devils RLFC refreshed logo — modernised devil mark with thickened edges for digital reproduction",
      },
      {
        src: "/images/norths-devils/logo-2.webp",
        caption: "Before / after comparison — angular typography for aggression, rounded corners for vintage character.",
        alt: "Norths Devils logo before and after comparison — original versus refreshed mark side by side",
      },
      {
        src: "/images/norths-devils/iphone-1.webp",
        caption: "iPhone mockup — responsive layout at mobile scale, club colours intact.",
        alt: "Norths Devils prototype website on iPhone mockup — mobile responsive layout",
      },
      {
        src: "/images/norths-devils/iphone-2.webp",
        caption: "iPhone mockup — secondary page scroll showing team profile and news sections.",
        alt: "Norths Devils prototype website iPhone mockup — team profile and news page layout",
      },
      {
        src: "/images/norths-devils/mockup-wall.webp",
        caption: "Concrete wall mockup — refreshed mark at large environmental scale.",
        alt: "Norths Devils refreshed logo on concrete wall mockup — environmental scale brand application",
      },
      {
        src: "/images/norths-devils/mockup-gallery.webp",
        caption: "Gallery wall mockup — logo silhouettes and brand applications across surfaces.",
        alt: "Norths Devils brand identity gallery wall mockup — logo silhouettes across multiple brand applications",
      },
    ],
    hasDepth: false,
    liveUrl: "https://northsdevilsrlfc.framer.website",
  },

  /* ── 7 ── Copper Company ── Full ────────────────────────── */
  {
    slug: "copper-company",
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
      "Complete brand identity system for a rum brand — concept to market launch, from monogram logo to packaging and brand guidelines.",
    role: "Sole designer. Developed the full brand identity: distinctive monogram logo, repeating pattern system for packaging and brand applications, comprehensive guidelines, print-spec packaging, and social photography.",
    problem:
      "The Copper Company needed a brand built from the ground up — name, identity, and packaging all aligned. The mark needed to feel distinctive on shelf and translate into a pattern system that could wrap across packaging and brand touchpoints.",
    outcome:
      "Client satisfied with final output and brand cohesion across all touchpoints.",
    heroImage: {
      src: "/images/copper-company/hero.webp",
      alt: "Copper Company rum bottle — staged product photography showing the final label design and brand identity",
    },
    images: [
      {
        src: "/images/copper-company/bottle-1.webp",
        caption: "Bottle front — monogram label applied at full print spec, ready for production.",
        alt: "Copper Company rum bottle front — monogram label at print specification on amber glass bottle",
      },
      {
        src: "/images/copper-company/bottle-2.webp",
        caption: "Bottle back — secondary label with tasting notes and brand pattern.",
        alt: "Copper Company rum bottle back — secondary label with tasting notes and repeating monogram pattern",
      },
      {
        src: "/images/copper-company/label-flat.webp",
        caption: "Label flat net — the full label design in print-ready format with bleed and crop marks.",
        alt: "Copper Company label flat net — print-ready label design showing full bleed and artwork at flat view",
      },
      {
        src: "/images/copper-company/insta-1.webp",
        caption: "Social content — brand-consistent product photography for Instagram.",
        alt: "Copper Company Instagram post 1 — brand-consistent social photography for rum product launch",
      },
      {
        src: "/images/copper-company/insta-2.webp",
        caption: "Social content — lifestyle photography with brand colour treatment.",
        alt: "Copper Company Instagram post 2 — lifestyle photography with brand copper and dark colour treatment",
      },
    ],
    hasDepth: false,
  },

  /* ── 8 ── Lows Design and Build ── Full ─────────────────── */
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
      "Full branding suite for a London family-run design-and-build company — logo to vehicle wrap, including a Bromley FC sponsorship activation.",
    role: "Sole designer. Refined client sketches into a scalable geometric mark, selected brand typeface, managed colour for digital and print. Applications: Bromley FC sponsorship banners, site hoarding, social icons, website, and vehicle wrap.",
    problem:
      "Lows needed a brand that could work across every surface — from a football club sponsorship banner to a vehicle wrap to a website. The mark had to be instantly legible at all scales and production environments.",
    outcome:
      "Strong workload growth since launch. Bromley FC sponsorship partnership generated significant results.",
    heroImage: {
      src: "/images/lows-design-build/hero.webp",
      alt: "Lows Design and Build brand identity — hero composite showing logo and brand applications",
    },
    images: [
      {
        src: "/images/lows-design-build/logo.webp",
        caption: "Geometric scalable mark — refined from client sketches, built on established logo construction principles.",
        alt: "Lows Design and Build logo — geometric scalable mark refined from client concept sketches",
      },
      {
        src: "/images/lows-design-build/bromley-fc.webp",
        caption: "Bromley FC sponsorship — the Lows mark in a Premier League-affiliated club's kit and branding.",
        alt: "Lows Design and Build Bromley FC sponsorship — brand mark on football club materials and kit",
      },
      {
        src: "/images/lows-design-build/bromley-led-2.webp",
        caption: "Bromley FC LED pitch-side banner — brand at full stadium visibility scale.",
        alt: "Lows Design and Build Bromley FC LED pitch-side advertising banner — brand at stadium scale",
      },
      {
        src: "/images/lows-design-build/hoarding.webp",
        caption: "Site hoarding — brand applied to construction site fencing at street-facing scale.",
        alt: "Lows Design and Build site hoarding — brand identity on construction site fence at street scale",
      },
      {
        src: "/images/lows-design-build/website.webp",
        caption: "Website — clean, brand-consistent design built for conversion and referral traffic.",
        alt: "Lows Design and Build website — branded homepage design for the construction and design company",
      },
    ],
    hasDepth: false,
  },

  /* ── 9 ── Nimbus Coffee Co. ── Full ─────────────────────── */
  {
    slug: "nimbus-coffee",
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
      "Cohesive visual identity system for a premier artisan roastery — earthy palette, cloud-inspired mark, modular for future print/web/experiential expansion.",
    role: "Sole designer. Developed core logo, typographic hierarchy, palette, and brand system. Applied across business cards, packaging, merchandise, and digital assets.",
    problem:
      "Nimbus needed a brand that communicated artisanal quality and sustainability without being precious or cold. The identity had to feel distinctive on specialty retail shelves and scale to e-commerce, pop-up events, and future expansion.",
    outcome:
      "Cohesive visual identity delivered across all initial touchpoints.",
    heroImage: {
      src: "/images/nimbus-coffee/hero.webp",
      alt: "Nimbus Coffee Co. packaging mockup — branded coffee bags showing the cloud-inspired mark and earthy palette",
    },
    images: [
      {
        src: "/images/nimbus-coffee/mockup-2.webp",
        caption: "Packaging system — modular label design, scalable across bag sizes and blend types.",
        alt: "Nimbus Coffee Co. packaging system mockup — modular label design on multiple coffee bag sizes",
      },
      {
        src: "/images/nimbus-coffee/logo.webp",
        caption: "Core logo — cloud formation-inspired mark, earthy palette reflecting natural roasting terrains.",
        alt: "Nimbus Coffee Co. logo — cloud formation mark with logotype in earthy brand palette",
      },
      {
        src: "/images/nimbus-coffee/creative-1.webp",
        caption: "Brand creative — identity applied across digital touchpoints and social assets.",
        alt: "Nimbus Coffee Co. brand creative — logo and brand identity applied to digital social asset",
      },
      {
        src: "/images/nimbus-coffee/creative-2.webp",
        caption: "Brand creative — secondary touchpoint application showing typographic hierarchy.",
        alt: "Nimbus Coffee Co. brand creative 2 — secondary digital asset with typographic brand system",
      },
    ],
    hasDepth: false,
  },

  /* ── 10 ── Momentum Mentoring ── Gallery ────────────────── */
  {
    slug: "momentum-mentoring",
    name: "Momentum Mentoring",
    tier: "gallery",
    rank: 10,
    date: "2024",
    categories: ["Brand Identity", "Web Design", "NDIS"],
    skills: ["Brand Identity", "Web Design", "Framer Development"],
    oneLiner:
      "Brand and website for an NDIS mentoring provider — built to reflect empowerment, independence, and personal growth.",
    role: "Designer and developer.",
    problem:
      "Momentum needed a brand and website that communicated their mission of empowerment and independence without feeling clinical or institutional.",
    outcome: "Live site: momentummentoring.co.",
    heroSpline: "/models/momentum/momentum.splinecode",
    heroImage: {
      src: "/images/momentum-mentoring/hero.webp",
      alt: "Momentum Mentoring brand identity and website — NDIS mentoring provider",
    },
    images: [],
    hasDepth: false,
    liveUrl: "https://momentummentoring.co",
  },

  /* ── 11 ── TasWater ── Gallery ──────────────────────────── */
  {
    slug: "taswater",
    name: "TasWater",
    tier: "gallery",
    rank: 11,
    date: "2023",
    categories: ["Infographic Design", "Information Design"],
    skills: ["Infographic Design", "Information Design", "Brand-Compliant Design"],
    oneLiner:
      "Two comprehensive infographic projects for Tasmania's statewide water and sewerage corporation — within brand, leadership-approved.",
    role: "Infographic designer. Delivered two projects over one month within TasWater's established brand guidelines — new visual systems and refinement of existing materials.",
    problem:
      "TasWater needed complex data visualised clearly within their strict brand guidelines — new visual systems that felt native to the existing brand.",
    outcome:
      "Client confirmed satisfaction. Leadership affirmed strong brand alignment.",
    heroImage: {
      src: "/images/taswater/hero.webp",
      alt: "TasWater infographic project — progression infographic showing Tasmania's water infrastructure milestones",
    },
    images: [
      {
        src: "/images/taswater/map.webp",
        caption: "Interactive map infographic — TasWater's service area and infrastructure overlaid on a branded map.",
        alt: "TasWater interactive map infographic — service area and infrastructure locations across Tasmania",
      },
      {
        src: "/images/taswater/logo.webp",
        caption: "TasWater — brand-compliant design within their established identity system.",
        alt: "TasWater logo — the brand identity guiding all infographic design decisions",
      },
    ],
    hasDepth: false,
  },

  /* ── 12 ── The London Home Show ── Gallery ──────────────── */
  {
    slug: "london-home-show",
    name: "The London Home Show",
    tier: "gallery",
    rank: 12,
    date: "2022",
    categories: ["Event Design", "Print & Digital"],
    skills: ["Event Design", "Print Design", "Digital Campaign"],
    oneLiner:
      "Event-led design across print and digital channels for the UK's first affordable homes exhibition — flags, banners, stage graphics, brochures, and booklets.",
    role: "Designer. Print and digital event materials across all show collateral.",
    problem:
      "The London Home Show needed event materials that worked across a wide range of print formats and digital channels — from outdoor flags to stage graphics to 10-year anniversary brochures.",
    outcome: "Campaign rollout delivered on time across all channels.",
    heroImage: {
      src: "/images/london-home-show/hero.webp",
      alt: "The London Home Show event — branding and signage across the exhibition venue",
    },
    images: [
      {
        src: "/images/london-home-show/flags.webp",
        caption: "Exterior flags — branding at street scale, welcoming attendees to the venue.",
        alt: "London Home Show exterior flags — branded event flags outside the exhibition venue",
      },
      {
        src: "/images/london-home-show/banner.webp",
        caption: "Banner and wayfinding — interior directional signage and brand presence.",
        alt: "London Home Show banner — interior branded signage for event wayfinding",
      },
      {
        src: "/images/london-home-show/booklets.webp",
        caption: "Event booklets — programme and exhibitor guides for attendees.",
        alt: "London Home Show event booklets — attendee programme and exhibitor guide printed collateral",
      },
      {
        src: "/images/london-home-show/brochure.webp",
        caption: "Show brochure — primary take-home printed collateral for the exhibition.",
        alt: "London Home Show brochure — primary printed collateral distributed at the exhibition",
      },
      {
        src: "/images/london-home-show/podium.webp",
        caption: "Speaker podium — branded stage environment for the exhibition's panel sessions.",
        alt: "London Home Show speaker podium — branded stage and podium for exhibition panel sessions",
      },
      {
        src: "/images/london-home-show/stage.webp",
        caption: "Stage backdrop — full-width branded stage graphic for the main event space.",
        alt: "London Home Show stage backdrop — full-width branded graphic for the main exhibition stage",
      },
      {
        src: "/images/london-home-show/brochure-10yr.webp",
        caption: "10-year anniversary brochure — a commemorative edition marking a decade of the show.",
        alt: "London Home Show 10-year anniversary brochure — commemorative edition marking decade of the exhibition",
      },
    ],
    hasDepth: false,
  },

  /* ── 13 ── Packer & Associates ── Gallery ───────────────── */
  {
    slug: "packer-associates",
    name: "Packer & Associates",
    tier: "gallery",
    rank: 13,
    date: "2023",
    categories: ["Publication Design", "Print Collateral"],
    skills: [
      "Publication Design",
      "Capability Statement",
      "Print Collateral",
      "Brand Applications",
    ],
    oneLiner:
      "Design and communications across digital, print, and internal docs for a capability solutions company — main deliverable: the capability statement.",
    role: "Designer. Range of design and communications projects across digital platforms, print collateral, internal documentation, and brand applications.",
    problem:
      "Packer needed consistent, professional design across a range of touchpoints — with the capability statement as the flagship deliverable.",
    outcome: "Consistent brand expression maintained across all touchpoints.",
    heroImage: {
      src: "/images/packer-associates/hero-poster.webp",
      alt: "Packer & Associates website — brand identity and digital presence for the capability solutions company",
    },
    heroVideo: "/images/packer-associates/website-video.webm",
    images: [],
    hasDepth: false,
    pdfSlideshow: {
      title: "Capability Statement",
      pages: [
        "/images/packer-associates/pdf-pages/page-0.webp",
        "/images/packer-associates/pdf-pages/page-1.webp",
        "/images/packer-associates/pdf-pages/page-2.webp",
        "/images/packer-associates/pdf-pages/page-3.webp",
        "/images/packer-associates/pdf-pages/page-4.webp",
        "/images/packer-associates/pdf-pages/page-5.webp",
        "/images/packer-associates/pdf-pages/page-6.webp",
        "/images/packer-associates/pdf-pages/page-7.webp",
        "/images/packer-associates/pdf-pages/page-8.webp",
        "/images/packer-associates/pdf-pages/page-9.webp",
        "/images/packer-associates/pdf-pages/page-10.webp",
        "/images/packer-associates/pdf-pages/page-11.webp",
      ],
    },
  },

  /* ── 14 ── Toombul Bulls ── Gallery — CONCEPT ───────────── */
  {
    slug: "toombul-bulls",
    name: "Toombul Bulls",
    tier: "gallery",
    rank: 14,
    isConcept: true,
    date: "2024",
    categories: ["Brand Refresh", "Sports Branding"],
    skills: ["Logo Design", "Brand Refresh", "Sports Branding"],
    oneLiner:
      "Logo and brand applications for a rugby league club rebrand — speculative, not yet adopted.",
    role: "Designer. Logo and brand applications.",
    problem:
      "Toombul Bulls needed a refreshed identity that felt contemporary while honouring the club's heritage.",
    outcome:
      "Speculative work — not accepted or implemented by the club. Produced as a self-initiated concept project.",
    heroImage: {
      src: "/images/toombul-bulls/hero.webp",
      alt: "Toombul Bulls brand refresh concept — logo and brand applications for Queensland rugby league club",
    },
    images: [],
    hasDepth: false,
  },
];

/* ─── Helper: get project by slug ─────────────────────────── */
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/* ─── Helper: get all projects that have case study pages ──── */
export function getCaseStudyProjects(): Project[] {
  return projects.filter((p) => p.tier !== "gallery");
}
