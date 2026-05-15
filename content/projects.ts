/**
 * ─────────────────────────────────────────────────────────────
 *  finbar✶studio — Project Content
 *  All copy, images, dates, tags, and case study content lives
 *  here. Edit this file to update anything on the site.
 *
 *  Search for "// PLACEHOLDER" to find content Finbar should
 *  review and replace with real copy/dates/metrics/images.
 * ─────────────────────────────────────────────────────────────
 */

export type Tier = "featured" | "full" | "gallery";

export interface ProjectImage {
  src: string;
  caption?: string;
  alt: string;
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
  rank: number;          // controls home-page order + card size
  isConcept?: boolean;   // shows CONCEPT tag on card and case study
  date: string;          // e.g. "2022–2023"
  categories: string[];  // displayed as tag pills on cards
  skills: string[];      // displayed as skill row on case study
  oneLiner: string;      // short "what this was" — shown on cards and case study hero
  role: string;          // case study meta: what Finbar did
  problem: string;       // case study meta: the brief/challenge
  outcome: string;       // case study meta: result / metric / status
  heroImage: ProjectImage;
  images: ProjectImage[];
  hasDepth: boolean;     // whether an optional depth/process section exists (Featured only)
  depth?: DepthSection[];
  liveUrl?: string;
}

/* ─── Helper: placehold.co URL generator ──────────────────── */
const ph = (w: number, h: number, label: string, bg = "E4E4E0", fg = "6B6B6B") =>
  `https://placehold.co/${w}x${h}/${bg}/${fg}?text=${encodeURIComponent(label)}`;

/* ─────────────────────────────────────────────────────────── */
/*  PROJECTS — ranked, all tiers                              */
/* ─────────────────────────────────────────────────────────── */

export const projects: Project[] = [

  /* ── 1 ── TMYR — The Moment You Realise ── Featured ────── */
  {
    slug: "tmyr",
    name: "The Moment You Realise",
    tier: "featured",
    rank: 1,
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
      src: ph(1600, 900, "TMYR Hero", "1a1a2e", "FAFAF8"),
      alt: "The Moment You Realise — hero campaign still",
    },
    images: [
      {
        src: ph(1200, 750, "TMYR — Light/Fade Style", "e8eaf6", "141414"),
        caption: "Light/fade motion style — soft dissolves and gentle typography entrances.",
        alt: "TMYR light fade motion style",
      },
      {
        src: ph(1200, 750, "TMYR — Bold/Typewriter Style", "1a1a2e", "FAFAF8"),
        caption: "Bold/typewriter motion style — punchy kinetic text for stronger stops.",
        alt: "TMYR bold typewriter motion style",
      },
      {
        src: ph(1200, 750, "TMYR — Format Matrix", "E4E4E0", "141414"),
        caption: "Five formats: 1:1, 9:16, 16:9, 4:5, and carousel — all delivered for every style variant.", // PLACEHOLDER — update format names if needed
        alt: "TMYR format matrix showing all five aspect ratios",
      },
      {
        src: ph(1200, 750, "TMYR — Carousel System", "E4E4E0", "141414"),
        caption: "Carousel system: sequential story arc with consistent title/body/CTA structure across slides.", // PLACEHOLDER
        alt: "TMYR carousel system",
      },
    ],
    hasDepth: true,
    depth: [
      {
        heading: "Two Motion Styles",
        body: "The campaign runs in two distinct visual voices. The light/fade style uses soft dissolves and gentle type entrances — aspirational and calm. The bold/typewriter style uses punchy kinetic type and harder cuts — immediate, confident. Both share the same brand palette and can run simultaneously without visual conflict.",
        images: [
          {
            src: ph(1200, 700, "Light Style Frames", "e8eaf6", "141414"),
            caption: "Light/fade style frames — stock footage plus animated type overlays.",
            alt: "Light fade style animation frames",
          },
          {
            src: ph(1200, 700, "Bold Style Frames", "1a1a2e", "FAFAF8"),
            caption: "Bold/typewriter style — type-forward, high contrast.",
            alt: "Bold typewriter style animation frames",
          },
        ],
      },
      {
        heading: "Format Matrix",
        body: "Every video and static asset was delivered across five formats (1:1, 9:16, 16:9, 4:5, and Stories/Reels) with both motion styles and all carousel variants — an airtight file and naming system to make client handover and scheduling smooth.", // PLACEHOLDER — confirm exact formats
        images: [
          {
            src: ph(1600, 800, "Full Format Matrix", "E4E4E0", "141414"),
            caption: "Format matrix — all five aspect ratios mapped across both styles.",
            alt: "TMYR full format matrix",
          },
        ],
      },
      {
        heading: "Carousel System & Production Organisation",
        body: "Carousel variants used a consistent sequential story arc (hook → detail → CTA), with a modular template system in After Effects that made new batches fast to produce. The full file/naming system was documented so Share to Buy could brief future rounds to any studio.", // PLACEHOLDER
        images: [
          {
            src: ph(1200, 700, "Carousel Structure", "E4E4E0", "141414"),
            caption: "Carousel card structure — consistent layout across all slide positions.",
            alt: "TMYR carousel structure",
          },
          {
            src: ph(1200, 700, "File System", "FAFAF8", "6B6B6B"),
            caption: "Production file structure — colour-coded, named for channel and format.",
            alt: "TMYR production file system",
          },
        ],
      },
    ],
  },

  /* ── 2 ── Salesmasters ── Featured ─────────────────────── */
  {
    slug: "salesmasters",
    name: "Salesmasters",
    tier: "featured",
    rank: 2,
    date: "2023–2024", // PLACEHOLDER — confirm exact date range
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
      src: ph(1600, 900, "Salesmasters Playbook Cover", "1C3D5A", "FAFAF8"),
      alt: "Salesmasters Sales Process Playbook cover spread",
    },
    images: [
      {
        src: ph(1200, 750, "Playbook Spread — Chapter Opener", "1C3D5A", "FAFAF8"),
        caption: "Section opener — Midjourney-sourced imagery, Photoshop-composited into brand layout.",
        alt: "Salesmasters playbook chapter opener spread",
      },
      {
        src: ph(1200, 750, "Playbook Spread — The Sales Wheel", "FAFAF8", "141414"),
        caption: "The Sales Wheel infographic — custom illustration mapping the client's full sales process.",
        alt: "Salesmasters Sales Wheel infographic",
      },
      {
        src: ph(1200, 750, "Playbook Spread — BANT / STAR / Triplicate", "E4E4E0", "141414"),
        caption: "Technique graphics — BANT, STAR method, and Triplicate technique visualised as custom diagrams.",
        alt: "Salesmasters technique infographics",
      },
      {
        src: ph(1200, 750, "Playbook Spread — Text Body Pages", "FAFAF8", "141414"),
        caption: "Text-heavy body pages — style systems keep 3,500-word documents readable and engaging.",
        alt: "Salesmasters body text spread",
      },
    ],
    hasDepth: true,
    depth: [
      {
        heading: "Research & Writing",
        body: "Each playbook started with deep research into the client's industry, sales environment, competitors, and buyer psychology. Finbar then wrote all 3,000–3,500 words of body content — translating Salesmasters' sales methodology into industry-specific language. The writing voice had to feel authoritative and client-specific, not generic.",
        images: [
          {
            src: ph(1200, 700, "Research & Writing Phase", "E4E4E0", "141414"),
            caption: "Research phase — industry mapping, terminology, and content outline before a single InDesign page was built.", // PLACEHOLDER — replace with real process image
            alt: "Research and writing phase for Salesmasters playbooks",
          },
        ],
      },
      {
        heading: "InDesign Architecture",
        body: "Each playbook was built from scratch in InDesign with a rigorous document architecture: master pages for repeating layouts, paragraph and character styles for consistent typography, and an auto-generated Table of Contents. This meant updates anywhere in the document propagated cleanly — essential for 40–50 page documents delivered on tight turnarounds.",
        images: [
          {
            src: ph(1200, 700, "InDesign Master Pages", "FAFAF8", "141414"),
            caption: "Master pages and style panel — the invisible architecture that makes complex documents manageable.",
            alt: "InDesign master pages for Salesmasters playbooks",
          },
          {
            src: ph(1200, 700, "Auto Table of Contents", "FAFAF8", "141414"),
            caption: "Auto-generated Table of Contents — wired to heading styles so any structural change updates instantly.",
            alt: "Salesmasters playbook auto table of contents",
          },
        ],
      },
      {
        heading: "Custom Illustration & Infographics",
        body: "The Sales Wheel is the centrepiece of every playbook — a custom circular diagram mapping each client's sales process across stages, touchpoints, and actions. Supporting graphics include the BANT qualification framework, STAR technique, and Triplicate closing technique, each visualised as purpose-built diagrams. All built in Illustrator and placed into InDesign.",
        images: [
          {
            src: ph(1200, 700, "Sales Wheel Detail", "1C3D5A", "FAFAF8"),
            caption: "The Sales Wheel — custom-drawn for each client, mapping their unique sales cycle.",
            alt: "Salesmasters Sales Wheel infographic close-up",
          },
          {
            src: ph(1200, 700, "Supporting Technique Graphics", "E4E4E0", "141414"),
            caption: "BANT, STAR, and Triplicate technique diagrams — consistent visual language across every playbook.",
            alt: "Salesmasters technique infographic diagrams",
          },
        ],
      },
      {
        heading: "Section Openers & Imagery",
        body: "Each section begins with a full-bleed opener page — imagery sourced or generated via Midjourney, then colour-graded and composited in Photoshop to match the client's palette. The openers give the document visual drama and break up the text-heavy body without disrupting the reading rhythm.",
        images: [
          {
            src: ph(1600, 800, "Section Opener Full Spread", "1C3D5A", "FAFAF8"),
            caption: "Full-bleed section opener — imagery tone-matched to client brand, copy set in headline treatment.",
            alt: "Salesmasters section opener full spread",
          },
        ],
      },
      {
        heading: "Title Page, Cover Design & Print Delivery",
        body: "Each playbook's cover is a fully custom design — client logo prominently placed, bespoke title typography, brand-matched colour. Print files were prepared to spec (bleed, crop marks, CMYK colour profile) and managed through to delivery, including coordinating with the print supplier on quantities and stock.", // PLACEHOLDER — add specific stock/print details if available
        images: [
          {
            src: ph(1200, 700, "Cover & Title Page", "1C3D5A", "FAFAF8"),
            caption: "Cover and title page — each client's playbook has a fully unique cover design within the brand system.",
            alt: "Salesmasters playbook cover and title page",
          },
        ],
      },
    ],
  },

  /* ── 3 ── KinAya ── Featured ────────────────────────────── */
  {
    slug: "kinaya",
    name: "KinAya",
    tier: "featured",
    rank: 3,
    date: "2024", // PLACEHOLDER — confirm exact year
    categories: ["Brand Identity", "Web Design", "Framer", "NDIS"],
    skills: [
      "Brand Identity",
      "Logo Design",
      "Framer Development",
      "CMS Setup",
      "Accessibility",
      "Web Design",
    ],
    oneLiner:
      "Full brand identity and six-page Framer website for an Adelaide NDIS support services provider rebranding under a new name.",
    role: "Sole designer and developer. Delivered brand identity (logomark, logotype, colour system, guidelines) and a complete Framer website with CMS, custom interactive components, and an accessibility text-resizer.",
    problem:
      "KinAya was rebranding entirely — new name, new identity. They needed a trustworthy and human brand that felt considered and professional, not flashy, plus a website that could be handed over for ongoing CMS management.",
    outcome:
      "Cohesive brand and site delivered as one unified vision. Smooth CMS handover. Positive client testimonial from Aryan Sareen.",
    heroImage: {
      src: ph(1600, 900, "KinAya Brand & Site", "2F4858", "FAFAF8"),
      alt: "KinAya brand identity and Framer website hero",
    },
    images: [
      {
        src: ph(1200, 750, "KinAya Logo System", "2F4858", "FAFAF8"),
        caption: "Logomark refinement and logotype — the mark balances warmth with professional trust.",
        alt: "KinAya logo system",
      },
      {
        src: ph(1200, 750, "KinAya Colour System", "E94E77", "FAFAF8"),
        caption: "Colour system: Navy (#2F4858), Rose (#E94E77), Blush (#FF8AA2), Pale (#FFE6EB).",
        alt: "KinAya colour system",
      },
      {
        src: ph(1200, 750, "KinAya Website — Home", "FAFAF8", "2F4858"),
        caption: "Home page — structured, readable, accessible layout across all viewports.",
        alt: "KinAya Framer website home page",
      },
      {
        src: ph(1200, 750, "KinAya Accessibility Resizer", "2F4858", "FAFAF8"),
        caption: "Site-wide accessibility text-resizer — a custom Framer component allowing users to increase text size.",
        alt: "KinAya website accessibility text resizer",
      },
    ],
    hasDepth: true,
    depth: [
      {
        heading: "Brand Identity Development",
        body: "The KinAya identity needed to project warmth, trust, and professionalism for an NDIS audience. The logomark went through multiple rounds of refinement — from rough concept to refined vector. The logotype was set in a considered typeface that balances humanity with clarity. Brand guidelines were documented covering logo usage, clear space, and misuse cases.",
        images: [
          {
            src: ph(1200, 700, "Logo Development Rounds", "E4E4E0", "141414"),
            caption: "Logo development — from initial sketches through to final refined vector mark.", // PLACEHOLDER — replace with real development stages
            alt: "KinAya logo development process",
          },
          {
            src: ph(1200, 700, "Brand Guidelines", "FAFAF8", "2F4858"),
            caption: "Brand guidelines — logo usage, clear space, colour system, typography all documented.",
            alt: "KinAya brand guidelines",
          },
        ],
      },
      {
        heading: "Colour System",
        body: "The four-colour palette was designed to work across digital and print: Navy (#2F4858) as the primary trust anchor, Rose (#E94E77) as the energetic accent, Blush (#FF8AA2) and Pale (#FFE6EB) as supporting warmth tones. Contrast ratios were checked against WCAG AA for accessibility throughout.",
        images: [
          {
            src: ph(1600, 700, "Full Colour System", "2F4858", "FAFAF8"),
            caption: "The full KinAya colour palette with hex values and usage notes.",
            alt: "KinAya full colour system documentation",
          },
        ],
      },
      {
        heading: "CMS & Dynamic Content",
        body: "The Framer CMS was configured to handle all repeating content — services, team profiles, and news posts — so the KinAya team could add, edit, and remove content without touching a line of code. Collections were structured for easy use by a non-technical team.",
        images: [
          {
            src: ph(1200, 700, "Framer CMS Structure", "FAFAF8", "141414"),
            caption: "CMS collections — structured so the client team can update content independently.", // PLACEHOLDER
            alt: "KinAya Framer CMS setup",
          },
        ],
      },
      {
        heading: "Interactivity & Custom Components",
        body: "Beyond the standard Framer toolkit, several custom interactive components were built: animated service cards, a testimonial carousel, and interactive navigation elements. All interactions were kept smooth and purposeful — no gratuitous motion.",
        images: [
          {
            src: ph(1200, 700, "Interactive Components", "2F4858", "FAFAF8"),
            caption: "Custom Framer components — service cards, carousel, and animated nav elements.",
            alt: "KinAya custom Framer interactive components",
          },
        ],
      },
      {
        heading: "Accessibility Text-Resizer",
        body: "A custom site-wide text-resizer was built in Framer — a component persistent across all pages that lets users increase the base text size in steps. For an NDIS provider whose users may have visual impairments, this was a non-negotiable feature. The resizer persists via localStorage so the user's preference is remembered across visits.",
        images: [
          {
            src: ph(1200, 700, "Text Resizer Component", "2F4858", "FAFAF8"),
            caption: "The accessibility text-resizer — persistent, persistent across sessions, and fully keyboard-accessible.",
            alt: "KinAya accessibility text resizer component in detail",
          },
        ],
      },
      {
        heading: "SEO & Technical Foundations",
        body: "The site was built with SEO fundamentals in place from day one: semantic HTML structure, optimised meta titles and descriptions per page, Open Graph tags, and clean URL structure. Image alt text was written thoughtfully throughout.", // PLACEHOLDER — add any additional technical details
        images: [
          {
            src: ph(1200, 700, "Site Structure & SEO", "FAFAF8", "141414"),
            caption: "Clean page structure and meta tag setup across the six-page site.",
            alt: "KinAya site SEO and technical setup",
          },
        ],
      },
    ],
    liveUrl: "https://kinaya.com.au", // PLACEHOLDER — confirm live URL
  },

  /* ── 4 ── Joe Devine ── Full (light) ───────────────────── */
  {
    slug: "joe-devine",
    name: "Joe Devine",
    tier: "full",
    rank: 4,
    date: "2023", // PLACEHOLDER — confirm year
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
      "Client pleased with the series. The releases gained significant traction after launch.", // PLACEHOLDER — add streaming numbers or specific metrics if available
    heroImage: {
      src: ph(1600, 900, "Joe Devine Singles Series", "1a1a1a", "FAFAF8"),
      alt: "Joe Devine five-single visual identity series",
    },
    images: [
      {
        src: ph(800, 500, "Single 1 Cover", "2C3E50", "FAFAF8"),
        caption: "Single 1 — the series anchor, establishing the core photographic language.", // PLACEHOLDER
        alt: "Joe Devine single 1 cover artwork",
      },
      {
        src: ph(800, 500, "Single 2 Cover", "E74C3C", "FAFAF8"),
        caption: "Single 2 — warm colour treatment, same compositional logic as the series foundation.", // PLACEHOLDER
        alt: "Joe Devine single 2 cover artwork",
      },
      {
        src: ph(800, 500, "Singles Series Overview", "1a1a1a", "FAFAF8"),
        caption: "All five covers together — distinct colour treatments, unified visual language.",
        alt: "Joe Devine all five singles covers together",
      },
    ],
    hasDepth: false,
  },

  /* ── 5 ── Compass Capability ── Full (light) ───────────── */
  {
    slug: "compass-capability",
    name: "Compass Capability",
    tier: "full",
    rank: 5,
    date: "2024", // PLACEHOLDER — confirm year
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
      "Cohesive visual language across all touchpoints delivered.", // PLACEHOLDER — add client result/feedback
    heroImage: {
      src: ph(1600, 900, "Compass Capability Brand", "1B4F72", "FAFAF8"),
      alt: "Compass Capability brand identity hero",
    },
    images: [
      {
        src: ph(800, 500, "Compass Logo System", "1B4F72", "FAFAF8"),
        caption: "Logo system — the directional mark and logotype, with navigation-focused symbolism.",
        alt: "Compass Capability logo system",
      },
      {
        src: ph(800, 500, "Brand Guidelines", "FAFAF8", "141414"),
        caption: "Brand guidelines — logo usage, colour system, typography, graphical asset rules.",
        alt: "Compass Capability brand guidelines",
      },
      {
        src: ph(800, 500, "Brand in Context", "1B4F72", "FAFAF8"),
        caption: "Brand applied — digital and print touchpoints.", // PLACEHOLDER
        alt: "Compass Capability brand applied to touchpoints",
      },
    ],
    hasDepth: false,
  },

  /* ── 6 ── Norths Devils RLFC ── Full (light) — CONCEPT ── */
  {
    slug: "norths-devils",
    name: "Norths Devils RLFC",
    tier: "full",
    rank: 6,
    isConcept: true,
    date: "2024", // PLACEHOLDER — confirm year
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
      src: ph(1600, 900, "Norths Devils Brand & Site", "C0392B", "FAFAF8"),
      alt: "Norths Devils RLFC brand refresh and prototype website",
    },
    images: [
      {
        src: ph(800, 500, "Refreshed Primary Mark", "C0392B", "FAFAF8"),
        caption: "Refreshed primary mark — devil imagery retained, refined vector construction, thickened edges for reproduction.",
        alt: "Norths Devils refreshed primary logo mark",
      },
      {
        src: ph(800, 500, "Logo Before / After", "1a1a1a", "FAFAF8"),
        caption: "Before / after — angular typography for aggression and momentum, rounded corners for vintage character.", // PLACEHOLDER
        alt: "Norths Devils logo before and after comparison",
      },
      {
        src: ph(800, 500, "Website Prototype", "FAFAF8", "141414"),
        caption: "Prototype website — full responsive, working nav, player profiles, team info, and branding showcase.",
        alt: "Norths Devils prototype website",
      },
    ],
    hasDepth: false,
    liveUrl: "https://northsdevilsrlfc.framer.website",
  },

  /* ── 7 ── Copper Company ── Full (light) ────────────────── */
  {
    slug: "copper-company",
    name: "Copper Company",
    tier: "full",
    rank: 7,
    date: "2023", // PLACEHOLDER — confirm year
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
      src: ph(1600, 900, "Copper Company Brand", "B7410E", "FAFAF8"),
      alt: "Copper Company rum brand identity and packaging",
    },
    images: [
      {
        src: ph(800, 500, "Monogram Logo", "B7410E", "FAFAF8"),
        caption: "The monogram mark — refined into a repeating pattern used across all packaging and brand applications.",
        alt: "Copper Company monogram logo",
      },
      {
        src: ph(800, 500, "Packaging — Bottle Label", "FAFAF8", "B7410E"),
        caption: "Bottle label — print-spec packaging with full bleed pattern application.",
        alt: "Copper Company bottle label packaging",
      },
      {
        src: ph(800, 500, "Pattern System", "B7410E", "FAFAF8"),
        caption: "The repeating pattern system — monogram-derived, scalable across all surfaces.",
        alt: "Copper Company repeating pattern system",
      },
    ],
    hasDepth: false,
  },

  /* ── 8 ── Lows Design and Build ── Full (light) ─────────── */
  {
    slug: "lows-design-build",
    name: "Lows Design and Build",
    tier: "full",
    rank: 8,
    date: "2023", // PLACEHOLDER — confirm year
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
      src: ph(1600, 900, "Lows Design and Build", "2C3E50", "FAFAF8"),
      alt: "Lows Design and Build brand identity and applications",
    },
    images: [
      {
        src: ph(800, 500, "Lows Logo System", "2C3E50", "FAFAF8"),
        caption: "Geometric scalable mark — refined from client sketches, built on established logo principles.",
        alt: "Lows Design and Build logo system",
      },
      {
        src: ph(800, 500, "Bromley FC Sponsorship Banner", "FAFAF8", "2C3E50"),
        caption: "Bromley FC sponsorship banner — a strategic local partnership with significant visibility results.",
        alt: "Lows Design and Build Bromley FC sponsorship banner",
      },
      {
        src: ph(800, 500, "Vehicle Wrap", "2C3E50", "FAFAF8"),
        caption: "Vehicle wrap — mark-derived design, brand-consistent across every van in the fleet.", // PLACEHOLDER
        alt: "Lows Design and Build vehicle wrap",
      },
    ],
    hasDepth: false,
  },

  /* ── 9 ── Nimbus Coffee Co. ── Full (light) ─────────────── */
  {
    slug: "nimbus-coffee",
    name: "Nimbus Coffee Co.",
    tier: "full",
    rank: 9,
    date: "2024", // PLACEHOLDER — confirm year
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
      "Cohesive visual identity delivered across all initial touchpoints.", // PLACEHOLDER — add client result/feedback
    heroImage: {
      src: ph(1600, 900, "Nimbus Coffee Co.", "6B4226", "FAFAF8"),
      alt: "Nimbus Coffee Co. brand identity and packaging",
    },
    images: [
      {
        src: ph(800, 500, "Nimbus Logo & Mark", "6B4226", "FAFAF8"),
        caption: "Core logo — cloud formation-inspired mark, earthy palette reflecting natural terrains.",
        alt: "Nimbus Coffee Co. logo and mark",
      },
      {
        src: ph(800, 500, "Packaging System", "FAFAF8", "6B4226"),
        caption: "Packaging system — modular label design, scalable across bag sizes and blend types.",
        alt: "Nimbus Coffee Co. packaging system",
      },
      {
        src: ph(800, 500, "Brand Touchpoints", "6B4226", "FAFAF8"),
        caption: "Brand applied: business cards, merchandise, digital assets.", // PLACEHOLDER
        alt: "Nimbus Coffee Co. brand touchpoints",
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
    date: "2024", // PLACEHOLDER
    categories: ["Brand Identity", "Web Design", "NDIS"],
    skills: ["Brand Identity", "Web Design", "Framer Development"],
    oneLiner:
      "Brand and website for an NDIS mentoring provider — built to reflect empowerment, independence, and personal growth.",
    role: "Designer and developer.", // PLACEHOLDER
    problem:
      "Momentum needed a brand and website that communicated their mission of empowerment and independence without feeling clinical or institutional.", // PLACEHOLDER
    outcome: "Live site: momentummentoring.co.", // PLACEHOLDER
    heroImage: {
      src: ph(600, 380, "Momentum Mentoring", "2ECC71", "FAFAF8"),
      alt: "Momentum Mentoring brand and website",
    },
    images: [
      {
        src: ph(600, 380, "Momentum Brand", "2ECC71", "FAFAF8"),
        alt: "Momentum Mentoring brand identity",
      },
      {
        src: ph(600, 380, "Momentum Website", "FAFAF8", "141414"),
        alt: "Momentum Mentoring website",
      },
    ],
    hasDepth: false,
    liveUrl: "https://momentummentoring.co",
  },

  /* ── 11 ── TasWater ── Gallery ──────────────────────────── */
  {
    slug: "taswater",
    name: "TasWater",
    tier: "gallery",
    rank: 11,
    date: "2023", // PLACEHOLDER
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
      src: ph(600, 380, "TasWater Infographics", "0077C8", "FAFAF8"),
      alt: "TasWater infographic design",
    },
    images: [
      {
        src: ph(600, 380, "TasWater Infographic 1", "0077C8", "FAFAF8"),
        alt: "TasWater infographic project 1",
      },
      {
        src: ph(600, 380, "TasWater Infographic 2", "FAFAF8", "0077C8"),
        alt: "TasWater infographic project 2",
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
    date: "2022", // PLACEHOLDER
    categories: ["Event Design", "Print & Digital"],
    skills: ["Event Design", "Print Design", "Digital Campaign"],
    oneLiner:
      "Event-led design across print and digital channels for a large-scale public engagement and campaign rollout.",
    role: "Designer. Print and digital event materials.", // PLACEHOLDER
    problem:
      "The London Home Show needed event materials that worked across print collateral and digital campaigns at scale.", // PLACEHOLDER
    outcome: "Campaign rollout delivered on time across all channels.", // PLACEHOLDER
    heroImage: {
      src: ph(600, 380, "London Home Show", "8E44AD", "FAFAF8"),
      alt: "The London Home Show event design",
    },
    images: [
      {
        src: ph(600, 380, "Event Print Materials", "8E44AD", "FAFAF8"),
        alt: "London Home Show print materials",
      },
      {
        src: ph(600, 380, "Digital Campaign Assets", "FAFAF8", "8E44AD"),
        alt: "London Home Show digital campaign assets",
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
    date: "2023", // PLACEHOLDER
    categories: ["Publication Design", "Print Collateral"],
    skills: [
      "Publication Design",
      "Capability Statement",
      "Print Collateral",
      "Brand Applications",
    ],
    oneLiner:
      "Design and communications across digital, print, and internal docs for a capability solutions company — main deliverable: the capability statement.",
    role: "Designer. Range of design and communications projects across digital platforms, print collateral, internal documentation, and brand applications.", // PLACEHOLDER
    problem:
      "Packer needed consistent, professional design across a range of touchpoints — with the capability statement as the flagship deliverable.", // PLACEHOLDER
    outcome: "Consistent brand expression maintained across all touchpoints.", // PLACEHOLDER
    heroImage: {
      src: ph(600, 380, "Packer & Associates", "1A252F", "FAFAF8"),
      alt: "Packer & Associates capability statement and design work",
    },
    images: [
      {
        src: ph(600, 380, "Capability Statement", "1A252F", "FAFAF8"),
        alt: "Packer & Associates capability statement",
      },
      {
        src: ph(600, 380, "Print Collateral", "FAFAF8", "141414"),
        alt: "Packer & Associates print collateral",
      },
    ],
    hasDepth: false,
  },

  /* ── 14 ── Toombul Bulls ── Gallery — CONCEPT ───────────── */
  {
    slug: "toombul-bulls",
    name: "Toombul Bulls",
    tier: "gallery",
    rank: 14,
    isConcept: true,
    date: "2024", // PLACEHOLDER
    categories: ["Brand Refresh", "Sports Branding"],
    skills: ["Logo Design", "Brand Refresh", "Sports Branding"],
    oneLiner:
      "Logo and brand applications for a rugby league club rebrand — speculative, not yet adopted.",
    role: "Designer. Logo and brand applications.", // PLACEHOLDER
    problem:
      "Toombul Bulls needed a refreshed identity that felt contemporary while honouring the club's heritage.", // PLACEHOLDER
    outcome:
      "Speculative work — not accepted or implemented by the club. Produced as a self-initiated concept project.",
    heroImage: {
      src: ph(600, 380, "Toombul Bulls Rebrand", "8B0000", "FAFAF8"),
      alt: "Toombul Bulls rugby league club brand refresh",
    },
    images: [
      {
        src: ph(600, 380, "Toombul Bulls Logo", "8B0000", "FAFAF8"),
        alt: "Toombul Bulls refreshed logo",
      },
      {
        src: ph(600, 380, "Brand Applications", "FAFAF8", "8B0000"),
        alt: "Toombul Bulls brand applications",
      },
    ],
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
