/**
 * ─────────────────────────────────────────────────────────────
 *  finbar✶studio — Project Content
 *  All copy, images, dates, tags, and case study content lives
 *  here. Edit this file to update anything on the site.
 *
 *  IMAGE GUIDE
 *  ───────────────────────────────────────────────────────────
 *  All images live in /public/images/<slug>/
 *  Filename in the alt field = the file you need to drop in.
 *  e.g. alt: "tmyr-hero" → upload as /public/images/tmyr/tmyr-hero.jpg
 *
 *  Depth section images follow: <slug>-depth-<section>-<letter>
 *  e.g. tmyr-depth-1-a, tmyr-depth-1-b, tmyr-depth-2-a …
 *
 *  Any format works (.jpg, .webp, .png) — just match the src path.
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
      src: "/images/tmyr/tmyr-hero.jpg",
      alt: "tmyr-hero",
    },
    images: [
      {
        src: "/images/tmyr/tmyr-1.jpg",
        caption: "Light/fade motion style — soft dissolves and gentle typography entrances.",
        alt: "tmyr-1",
      },
      {
        src: "/images/tmyr/tmyr-2.jpg",
        caption: "Bold/typewriter motion style — punchy kinetic text for stronger stops.",
        alt: "tmyr-2",
      },
      {
        src: "/images/tmyr/tmyr-3.jpg",
        caption: "Five formats: 1:1, 9:16, 16:9, 4:5, and carousel — all delivered for every style variant.",
        alt: "tmyr-3",
      },
      {
        src: "/images/tmyr/tmyr-4.jpg",
        caption: "Carousel system: sequential story arc with consistent title/body/CTA structure across slides.",
        alt: "tmyr-4",
      },
    ],
    hasDepth: true,
    depth: [
      {
        heading: "Two Motion Styles",
        body: "The campaign runs in two distinct visual voices. The light/fade style uses soft dissolves and gentle type entrances — aspirational and calm. The bold/typewriter style uses punchy kinetic type and harder cuts — immediate, confident. Both share the same brand palette and can run simultaneously without visual conflict.",
        images: [
          {
            src: "/images/tmyr/tmyr-depth-1-a.jpg",
            caption: "Light/fade style frames — stock footage plus animated type overlays.",
            alt: "tmyr-depth-1-a",
          },
          {
            src: "/images/tmyr/tmyr-depth-1-b.jpg",
            caption: "Bold/typewriter style — type-forward, high contrast.",
            alt: "tmyr-depth-1-b",
          },
        ],
      },
      {
        heading: "Format Matrix",
        body: "Every video and static asset was delivered across five formats (1:1, 9:16, 16:9, 4:5, and Stories/Reels) with both motion styles and all carousel variants — an airtight file and naming system to make client handover and scheduling smooth.",
        images: [
          {
            src: "/images/tmyr/tmyr-depth-2-a.jpg",
            caption: "Format matrix — all five aspect ratios mapped across both styles.",
            alt: "tmyr-depth-2-a",
          },
        ],
      },
      {
        heading: "Carousel System & Production Organisation",
        body: "Carousel variants used a consistent sequential story arc (hook → detail → CTA), with a modular template system in After Effects that made new batches fast to produce. The full file/naming system was documented so Share to Buy could brief future rounds to any studio.",
        images: [
          {
            src: "/images/tmyr/tmyr-depth-3-a.jpg",
            caption: "Carousel card structure — consistent layout across all slide positions.",
            alt: "tmyr-depth-3-a",
          },
          {
            src: "/images/tmyr/tmyr-depth-3-b.jpg",
            caption: "Production file structure — colour-coded, named for channel and format.",
            alt: "tmyr-depth-3-b",
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
      src: "/images/salesmasters/salesmasters-hero.jpg",
      alt: "salesmasters-hero",
    },
    images: [
      {
        src: "/images/salesmasters/salesmasters-1.jpg",
        caption: "Section opener — Midjourney-sourced imagery, Photoshop-composited into brand layout.",
        alt: "salesmasters-1",
      },
      {
        src: "/images/salesmasters/salesmasters-2.jpg",
        caption: "The Sales Wheel infographic — custom illustration mapping the client's full sales process.",
        alt: "salesmasters-2",
      },
      {
        src: "/images/salesmasters/salesmasters-3.jpg",
        caption: "Technique graphics — BANT, STAR method, and Triplicate technique visualised as custom diagrams.",
        alt: "salesmasters-3",
      },
      {
        src: "/images/salesmasters/salesmasters-4.jpg",
        caption: "Text-heavy body pages — style systems keep 3,500-word documents readable and engaging.",
        alt: "salesmasters-4",
      },
    ],
    hasDepth: true,
    depth: [
      {
        heading: "Research & Writing",
        body: "Each playbook started with deep research into the client's industry, sales environment, competitors, and buyer psychology. Finbar then wrote all 3,000–3,500 words of body content — translating Salesmasters' sales methodology into industry-specific language. The writing voice had to feel authoritative and client-specific, not generic.",
        images: [
          {
            src: "/images/salesmasters/salesmasters-depth-1-a.jpg",
            caption: "Research phase — industry mapping, terminology, and content outline before a single InDesign page was built.",
            alt: "salesmasters-depth-1-a",
          },
        ],
      },
      {
        heading: "InDesign Architecture",
        body: "Each playbook was built from scratch in InDesign with a rigorous document architecture: master pages for repeating layouts, paragraph and character styles for consistent typography, and an auto-generated Table of Contents. This meant updates anywhere in the document propagated cleanly — essential for 40–50 page documents delivered on tight turnarounds.",
        images: [
          {
            src: "/images/salesmasters/salesmasters-depth-2-a.jpg",
            caption: "Master pages and style panel — the invisible architecture that makes complex documents manageable.",
            alt: "salesmasters-depth-2-a",
          },
          {
            src: "/images/salesmasters/salesmasters-depth-2-b.jpg",
            caption: "Auto-generated Table of Contents — wired to heading styles so any structural change updates instantly.",
            alt: "salesmasters-depth-2-b",
          },
        ],
      },
      {
        heading: "Custom Illustration & Infographics",
        body: "The Sales Wheel is the centrepiece of every playbook — a custom circular diagram mapping each client's sales process across stages, touchpoints, and actions. Supporting graphics include the BANT qualification framework, STAR technique, and Triplicate closing technique, each visualised as purpose-built diagrams. All built in Illustrator and placed into InDesign.",
        images: [
          {
            src: "/images/salesmasters/salesmasters-depth-3-a.jpg",
            caption: "The Sales Wheel — custom-drawn for each client, mapping their unique sales cycle.",
            alt: "salesmasters-depth-3-a",
          },
          {
            src: "/images/salesmasters/salesmasters-depth-3-b.jpg",
            caption: "BANT, STAR, and Triplicate technique diagrams — consistent visual language across every playbook.",
            alt: "salesmasters-depth-3-b",
          },
        ],
      },
      {
        heading: "Section Openers & Imagery",
        body: "Each section begins with a full-bleed opener page — imagery sourced or generated via Midjourney, then colour-graded and composited in Photoshop to match the client's palette. The openers give the document visual drama and break up the text-heavy body without disrupting the reading rhythm.",
        images: [
          {
            src: "/images/salesmasters/salesmasters-depth-4-a.jpg",
            caption: "Full-bleed section opener — imagery tone-matched to client brand, copy set in headline treatment.",
            alt: "salesmasters-depth-4-a",
          },
        ],
      },
      {
        heading: "Title Page, Cover Design & Print Delivery",
        body: "Each playbook's cover is a fully custom design — client logo prominently placed, bespoke title typography, brand-matched colour. Print files were prepared to spec (bleed, crop marks, CMYK colour profile) and managed through to delivery, including coordinating with the print supplier on quantities and stock.",
        images: [
          {
            src: "/images/salesmasters/salesmasters-depth-5-a.jpg",
            caption: "Cover and title page — each client's playbook has a fully unique cover design within the brand system.",
            alt: "salesmasters-depth-5-a",
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
    date: "2024",
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
      src: "/images/kinaya/kinaya-hero.jpg",
      alt: "kinaya-hero",
    },
    images: [
      {
        src: "/images/kinaya/kinaya-1.jpg",
        caption: "Logomark refinement and logotype — the mark balances warmth with professional trust.",
        alt: "kinaya-1",
      },
      {
        src: "/images/kinaya/kinaya-2.jpg",
        caption: "Colour system: Navy (#2F4858), Rose (#E94E77), Blush (#FF8AA2), Pale (#FFE6EB).",
        alt: "kinaya-2",
      },
      {
        src: "/images/kinaya/kinaya-3.jpg",
        caption: "Home page — structured, readable, accessible layout across all viewports.",
        alt: "kinaya-3",
      },
      {
        src: "/images/kinaya/kinaya-4.jpg",
        caption: "Site-wide accessibility text-resizer — a custom Framer component allowing users to increase text size.",
        alt: "kinaya-4",
      },
    ],
    hasDepth: true,
    depth: [
      {
        heading: "Brand Identity Development",
        body: "The KinAya identity needed to project warmth, trust, and professionalism for an NDIS audience. The logomark went through multiple rounds of refinement — from rough concept to refined vector. The logotype was set in a considered typeface that balances humanity with clarity. Brand guidelines were documented covering logo usage, clear space, and misuse cases.",
        images: [
          {
            src: "/images/kinaya/kinaya-depth-1-a.jpg",
            caption: "Logo development — from initial sketches through to final refined vector mark.",
            alt: "kinaya-depth-1-a",
          },
          {
            src: "/images/kinaya/kinaya-depth-1-b.jpg",
            caption: "Brand guidelines — logo usage, clear space, colour system, typography all documented.",
            alt: "kinaya-depth-1-b",
          },
        ],
      },
      {
        heading: "Colour System",
        body: "The four-colour palette was designed to work across digital and print: Navy (#2F4858) as the primary trust anchor, Rose (#E94E77) as the energetic accent, Blush (#FF8AA2) and Pale (#FFE6EB) as supporting warmth tones. Contrast ratios were checked against WCAG AA for accessibility throughout.",
        images: [
          {
            src: "/images/kinaya/kinaya-depth-2-a.jpg",
            caption: "The full KinAya colour palette with hex values and usage notes.",
            alt: "kinaya-depth-2-a",
          },
        ],
      },
      {
        heading: "CMS & Dynamic Content",
        body: "The Framer CMS was configured to handle all repeating content — services, team profiles, and news posts — so the KinAya team could add, edit, and remove content without touching a line of code. Collections were structured for easy use by a non-technical team.",
        images: [
          {
            src: "/images/kinaya/kinaya-depth-3-a.jpg",
            caption: "CMS collections — structured so the client team can update content independently.",
            alt: "kinaya-depth-3-a",
          },
        ],
      },
      {
        heading: "Interactivity & Custom Components",
        body: "Beyond the standard Framer toolkit, several custom interactive components were built: animated service cards, a testimonial carousel, and interactive navigation elements. All interactions were kept smooth and purposeful — no gratuitous motion.",
        images: [
          {
            src: "/images/kinaya/kinaya-depth-4-a.jpg",
            caption: "Custom Framer components — service cards, carousel, and animated nav elements.",
            alt: "kinaya-depth-4-a",
          },
        ],
      },
      {
        heading: "Accessibility Text-Resizer",
        body: "A custom site-wide text-resizer was built in Framer — a component persistent across all pages that lets users increase the base text size in steps. For an NDIS provider whose users may have visual impairments, this was a non-negotiable feature. The resizer persists via localStorage so the user's preference is remembered across visits.",
        images: [
          {
            src: "/images/kinaya/kinaya-depth-5-a.jpg",
            caption: "The accessibility text-resizer — persistent across sessions, and fully keyboard-accessible.",
            alt: "kinaya-depth-5-a",
          },
        ],
      },
      {
        heading: "SEO & Technical Foundations",
        body: "The site was built with SEO fundamentals in place from day one: semantic HTML structure, optimised meta titles and descriptions per page, Open Graph tags, and clean URL structure. Image alt text was written thoughtfully throughout.",
        images: [
          {
            src: "/images/kinaya/kinaya-depth-6-a.jpg",
            caption: "Clean page structure and meta tag setup across the six-page site.",
            alt: "kinaya-depth-6-a",
          },
        ],
      },
    ],
    liveUrl: "https://kinaya.com.au",
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
      src: "/images/joe-devine/joe-devine-hero.jpg",
      alt: "joe-devine-hero",
    },
    images: [
      {
        src: "/images/joe-devine/joe-devine-1.jpg",
        caption: "Single 1 — the series anchor, establishing the core photographic language.",
        alt: "joe-devine-1",
      },
      {
        src: "/images/joe-devine/joe-devine-2.jpg",
        caption: "Single 2 — warm colour treatment, same compositional logic as the series foundation.",
        alt: "joe-devine-2",
      },
      {
        src: "/images/joe-devine/joe-devine-3.jpg",
        caption: "All five covers together — distinct colour treatments, unified visual language.",
        alt: "joe-devine-3",
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
      src: "/images/compass-capability/compass-capability-hero.jpg",
      alt: "compass-capability-hero",
    },
    images: [
      {
        src: "/images/compass-capability/compass-capability-1.jpg",
        caption: "Logo system — the directional mark and logotype, with navigation-focused symbolism.",
        alt: "compass-capability-1",
      },
      {
        src: "/images/compass-capability/compass-capability-2.jpg",
        caption: "Brand guidelines — logo usage, colour system, typography, graphical asset rules.",
        alt: "compass-capability-2",
      },
      {
        src: "/images/compass-capability/compass-capability-3.jpg",
        caption: "Brand applied — digital and print touchpoints.",
        alt: "compass-capability-3",
      },
    ],
    hasDepth: false,
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
      src: "/images/norths-devils/norths-devils-hero.jpg",
      alt: "norths-devils-hero",
    },
    images: [
      {
        src: "/images/norths-devils/norths-devils-1.jpg",
        caption: "Refreshed primary mark — devil imagery retained, refined vector construction, thickened edges for reproduction.",
        alt: "norths-devils-1",
      },
      {
        src: "/images/norths-devils/norths-devils-2.jpg",
        caption: "Before / after — angular typography for aggression and momentum, rounded corners for vintage character.",
        alt: "norths-devils-2",
      },
      {
        src: "/images/norths-devils/norths-devils-3.jpg",
        caption: "Prototype website — full responsive, working nav, player profiles, team info, and branding showcase.",
        alt: "norths-devils-3",
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
      src: "/images/copper-company/copper-company-hero.jpg",
      alt: "copper-company-hero",
    },
    images: [
      {
        src: "/images/copper-company/copper-company-1.jpg",
        caption: "The monogram mark — refined into a repeating pattern used across all packaging and brand applications.",
        alt: "copper-company-1",
      },
      {
        src: "/images/copper-company/copper-company-2.jpg",
        caption: "Bottle label — print-spec packaging with full bleed pattern application.",
        alt: "copper-company-2",
      },
      {
        src: "/images/copper-company/copper-company-3.jpg",
        caption: "The repeating pattern system — monogram-derived, scalable across all surfaces.",
        alt: "copper-company-3",
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
      src: "/images/lows-design-build/lows-design-build-hero.jpg",
      alt: "lows-design-build-hero",
    },
    images: [
      {
        src: "/images/lows-design-build/lows-design-build-1.jpg",
        caption: "Geometric scalable mark — refined from client sketches, built on established logo principles.",
        alt: "lows-design-build-1",
      },
      {
        src: "/images/lows-design-build/lows-design-build-2.jpg",
        caption: "Bromley FC sponsorship banner — a strategic local partnership with significant visibility results.",
        alt: "lows-design-build-2",
      },
      {
        src: "/images/lows-design-build/lows-design-build-3.jpg",
        caption: "Vehicle wrap — mark-derived design, brand-consistent across every van in the fleet.",
        alt: "lows-design-build-3",
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
      src: "/images/nimbus-coffee/nimbus-coffee-hero.jpg",
      alt: "nimbus-coffee-hero",
    },
    images: [
      {
        src: "/images/nimbus-coffee/nimbus-coffee-1.jpg",
        caption: "Core logo — cloud formation-inspired mark, earthy palette reflecting natural terrains.",
        alt: "nimbus-coffee-1",
      },
      {
        src: "/images/nimbus-coffee/nimbus-coffee-2.jpg",
        caption: "Packaging system — modular label design, scalable across bag sizes and blend types.",
        alt: "nimbus-coffee-2",
      },
      {
        src: "/images/nimbus-coffee/nimbus-coffee-3.jpg",
        caption: "Brand applied: business cards, merchandise, digital assets.",
        alt: "nimbus-coffee-3",
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
    heroImage: {
      src: "/images/momentum-mentoring/momentum-mentoring-hero.jpg",
      alt: "momentum-mentoring-hero",
    },
    images: [
      {
        src: "/images/momentum-mentoring/momentum-mentoring-1.jpg",
        alt: "momentum-mentoring-1",
      },
      {
        src: "/images/momentum-mentoring/momentum-mentoring-2.jpg",
        alt: "momentum-mentoring-2",
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
      src: "/images/taswater/taswater-hero.jpg",
      alt: "taswater-hero",
    },
    images: [
      {
        src: "/images/taswater/taswater-1.jpg",
        alt: "taswater-1",
      },
      {
        src: "/images/taswater/taswater-2.jpg",
        alt: "taswater-2",
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
      "Event-led design across print and digital channels for a large-scale public engagement and campaign rollout.",
    role: "Designer. Print and digital event materials.",
    problem:
      "The London Home Show needed event materials that worked across print collateral and digital campaigns at scale.",
    outcome: "Campaign rollout delivered on time across all channels.",
    heroImage: {
      src: "/images/london-home-show/london-home-show-hero.jpg",
      alt: "london-home-show-hero",
    },
    images: [
      {
        src: "/images/london-home-show/london-home-show-1.jpg",
        alt: "london-home-show-1",
      },
      {
        src: "/images/london-home-show/london-home-show-2.jpg",
        alt: "london-home-show-2",
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
      src: "/images/packer-associates/packer-associates-hero.jpg",
      alt: "packer-associates-hero",
    },
    images: [
      {
        src: "/images/packer-associates/packer-associates-1.jpg",
        alt: "packer-associates-1",
      },
      {
        src: "/images/packer-associates/packer-associates-2.jpg",
        alt: "packer-associates-2",
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
      src: "/images/toombul-bulls/toombul-bulls-hero.jpg",
      alt: "toombul-bulls-hero",
    },
    images: [
      {
        src: "/images/toombul-bulls/toombul-bulls-1.jpg",
        alt: "toombul-bulls-1",
      },
      {
        src: "/images/toombul-bulls/toombul-bulls-2.jpg",
        alt: "toombul-bulls-2",
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
