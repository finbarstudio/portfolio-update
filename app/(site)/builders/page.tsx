import type { Metadata } from "next";
import { cookies } from "next/headers";
import Gate from "./Gate";
import MessageBlock from "./MessageBlock";

// Private index of every builder demo + pitch, plus the round-2 outreach kit:
// who runs each company, verified contacts and LinkedIn profiles, the architects
// and photographers behind their builds, research hooks, and ready-to-send
// messages. Reachable by URL only: noindex, not in the sitemap, not linked from
// the nav, and password-gated in proxy.ts.
//
// Research rules used throughout: emails listed are PUBLISHED addresses only,
// nothing pattern-guessed. LinkedIn URLs marked "verified" were spot-checked
// against live profiles on 5 Jul 2026.
export const metadata: Metadata = {
  title: { absolute: "Builders · index" },
  description: "Private index of the builder demo sites, contacts and outreach.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

type Page = { label: string; href: string };
type Person = {
  name: string;
  role: string;
  email?: string;
  linkedin?: string;
  note?: string;
};
type Partner = {
  kind: string; // Architect / Design / Interiors / Photo / Brand & web
  company: string;
  name?: string;
  site?: string;
  email?: string;
  linkedin?: string;
  note?: string;
};
type Message = {
  label: string;
  to: string;
  subject?: string;
  body: string;
};
type Builder = {
  name: string;
  meta: string;
  pitch: string;
  pages: Page[];
  people: Person[];
  partners: Partner[];
  partnersNote?: string; // shown when the partners list is empty on purpose
  intel: string[];
  messages: Message[];
};

// The current batch of Lindon-style redesign demos.
const BATCH: Builder[] = [
  {
    name: "Foundation Homes",
    meta: "Sunshine Coast · custom homes",
    pitch: "/foundation-homes",
    pages: [
      { label: "Home", href: "/foundation-homes/site" },
      { label: "About", href: "/foundation-homes/site/about" },
      { label: "Projects", href: "/foundation-homes/site/portfolio" },
    ],
    people: [
      {
        name: "Edward Murphy",
        role: "Founder & co-director",
        email: "info@foundationhomes.com.au",
        linkedin: "https://www.linkedin.com/in/edward-murphy-659036105/",
        note: "verified, but near-dormant (~20 connections). Email attn. Edward; 0427 140 882 is likely his mobile",
      },
      {
        name: "Bobbie",
        role: "Co-director (Edward's partner)",
        note: "surname never published. Address as 'Edward and Bobbie', never 'Bobbie Murphy'",
      },
    ],
    partners: [
      {
        kind: "Design",
        company: "Aboda Design Group",
        name: "Lee Foster & Scott Falconer",
        site: "https://www.aboda.com.au",
        email: "admin@aboda.com.au",
        note: "their most frequent partner: 5 credited projects incl. Amani Place and two MB winners. 07 5345 5499",
      },
      {
        kind: "Architect",
        company: "Cal Turner Architects",
        name: "Callum Turner",
        site: "https://calturnerarchitects.com.au",
        linkedin: "https://au.linkedin.com/in/callumturner",
        note: "Persimmon House (2023). Brisbane based, no email published",
      },
      {
        kind: "Design",
        company: "Reitsma & Associates",
        name: "Trevor Reitsma",
        site: "https://www.reitsmadesign.com.au",
        note: "Watson Residence, Doonan: the 2023 MB Custom Built Home win",
      },
      {
        kind: "Architect",
        company: "Aspect Architecture",
        site: "https://www.aspectarch.com",
        note: "3 credited projects incl. Maleny House, QLD Custom Home of the Year 2017. Principal name unconfirmed",
      },
      {
        kind: "Design",
        company: "Adrian Ramsay Design House",
        name: "Adrian Ramsay",
        site: "https://ardesignhouse.com",
        note: "Grandview Drive. Buderim, no email published",
      },
      {
        kind: "Photo",
        company: "Lucas Muro Photographer",
        name: "Lucas Muro",
        site: "https://www.lucasmuro.com.au",
        note: "shoots their Aboda-designed builds (Buderim, Peregian Beach). Contact form only",
      },
    ],
    intel: [
      "Freshest hook: Finestone (their stone supplier) published a feature on Amani Place around Feb 2026. It is Edward and Bobbie's own home on a 3-acre Maroochy River block; they lived in a small studio on the block for years before building. Their line: 'never cookie-cutter, never compromised'.",
      "Verified award record: 5 Master Builders wins 2017 to 2023, incl. QLD Custom Home of the Year 2017 (Maleny House). Nothing won in 2024 or 2025, so don't congratulate anything recent.",
      "Current site is by Marx Creative, thin content: no team page, no project pages, awards buried in gallery captions.",
      "Don't confuse with Murphy Builders / Murphy Homes (Leigh Murphy, Mooloolaba). Different company.",
    ],
    messages: [
      {
        label: "Round 2 · Email",
        to: "info@foundationhomes.com.au (attn. Edward)",
        subject: "Amani Place",
        body: `Hi Edward,

I read Finestone's piece on Amani Place. Living in a studio on the block for years so you'd know where every view should sit before you built, that's the kind of care most builders talk about and never do.

I emailed a while back with a rebuilt version of your website. It's still live: finbar.studio/foundation-homes

What struck me while building it: five Master Builders wins including a Queensland Custom Home of the Year, and almost none of it visible on the current site. "Never cookie-cutter, never compromised" deserves a website that holds the same line.

If you and Bobbie want to talk it through, I'm a phone call away.

Cheers,
Finbar
finbar.studio`,
      },
      {
        label: "Round 1 · Email (sent)",
        to: "info@foundationhomes.com.au (attn. Edward Murphy)",
        subject: "Your homes vs your website",
        body: `Hi Edward,

I'm Finbar, a designer based in Brisbane. I went looking for the best custom builders on the Sunshine Coast and kept coming back to yours. Amani Palace, the Doonan and Noosa homes, six Master Builders wins including a Queensland Custom Home of the Year.

Then I opened the website. It still reads 2019 and runs on an old template, so it doesn't do the homes justice. Rather than send you a pitch, I rebuilt it.

There's a short page on what I noticed, plus a working demo (home, projects and about) built around your own photography:

finbar.studio/foundation-homes

No pressure and nothing to sign. Have a click through on a desktop when you get a minute, and if it feels right I'd love to have a chat.

Cheers,
Finbar
finbar.studio`,
      },
    ],
  },
  {
    name: "Resolve Construction",
    meta: "Gold Coast · boutique prestige",
    pitch: "/resolve-construction",
    pages: [
      { label: "Home", href: "/resolve-construction/site" },
      { label: "About", href: "/resolve-construction/site/about" },
      { label: "Projects", href: "/resolve-construction/site/portfolio" },
    ],
    people: [
      {
        name: "Billy Thomas",
        role: "Founder & managing director",
        email: "admin@resolveconstruction.net.au",
        linkedin: "https://www.linkedin.com/in/bill-thomas-076815105/",
        note: "verified. Don't guess bill@/billy@, only admin@ is published",
      },
      {
        name: "Zahra Glassford",
        role: "Operations manager",
        linkedin: "https://www.linkedin.com/in/zahra-glassford-35607b3b/",
        note: "verified. Won the MB Gold Coast Women in Building Award 2023",
      },
    ],
    partners: [
      {
        kind: "Brand & web",
        company: "Havealook",
        site: "https://www.havealook.com.au",
        note: "template agency behind the current site. No architect, interiors or photographer credits exist anywhere public: verified, not a research gap",
      },
    ],
    intel: [
      "2025 GC win: Coastal Muse (Palm Beach) took Individual Home $1M to $1.5M at the Master Builders Gold Coast awards, and possibly a sustainability award too (category unconfirmed, don't name it).",
      "That makes five straight years of MB wins (Neu Burleigh 2023; Sovereign House, Villa Franco and Lowry Farmhouse 2024; Coastal Muse 2025), and the site's award pages still stop at 2023.",
      "The brand actually lives on Instagram: @resolveconstruction, ~5.3k followers, #builtbyresolve, warm sign-offs from 'the team at Resolve'.",
      "Billy: started as a carpenter at 15, South Sydney Rabbitohs tragic, surfs and boats. Personal and direct lands better than polished.",
    ],
    messages: [
      {
        label: "Round 2 · Email",
        to: "admin@resolveconstruction.net.au (attn. Billy)",
        subject: "Coastal Muse",
        body: `Hi Billy,

Congrats on Coastal Muse. That makes five years straight of Master Builders wins on the Gold Coast, which almost nobody pulls off.

Your website still stops at 2023 though. Anyone who looks you up after awards night has no idea the last two years happened.

I emailed a while back with a rebuilt version of the site that fixes exactly that: finbar.studio/resolve-construction

Fifteen minutes on the phone and I'll walk you through it. If not, no harm, keep collecting trophies.

Cheers,
Finbar
finbar.studio`,
      },
      {
        label: "Round 2 · LinkedIn connection note (Billy)",
        to: "linkedin.com/in/bill-thomas-076815105",
        body: `Hi Billy, Finbar here, a designer in Brisbane. Congrats on Coastal Muse, five straight years of MB wins now. I rebuilt your website as a working demo a while back (finbar.studio/resolve-construction) and figured I'd connect properly.`,
      },
      {
        label: "Round 1 · Email (sent)",
        to: "admin@resolveconstruction.net.au (attn. Billy Thomas)",
        subject: "Your homes vs your website",
        body: `Hi Billy,

I'm Finbar, a designer based in Brisbane. I went looking for the best builders on the Gold Coast and yours pulled me up short. Neu Burleigh, Villa Franco, the Lowry Farmhouse, eleven Master Builders wins with five in 2025 alone.

Then I opened the website. It's built like it's still 2014, so it doesn't do the homes justice. Rather than send you a pitch, I rebuilt it.

There's a short page on what I noticed, plus a working demo (home, projects and about) built around your own photography:

finbar.studio/resolve-construction

No pressure and nothing to sign. Have a click through on a desktop when you get a minute, and if it feels right I'd love to have a chat.

Cheers,
Finbar
finbar.studio`,
      },
    ],
  },
  {
    name: "Ross Hogno Constructions",
    meta: "Toowoomba · custom homes",
    pitch: "/ross-hogno",
    pages: [
      { label: "Home", href: "/ross-hogno/site" },
      { label: "About", href: "/ross-hogno/site/about" },
      { label: "Projects", href: "/ross-hogno/site/portfolio" },
    ],
    people: [
      {
        name: "Ross Hogno",
        role: "Founder, director & builder",
        email: "enquiries@rosshogno.com.au",
        linkedin: "https://www.linkedin.com/in/ross-hogno-51247525/",
        note: "verified, 189 connections, genuinely usable. Mobile on site: 0437 525 613",
      },
      {
        name: "Danielle Hogno",
        role: "Client interior selections (Ross's wife)",
        note: "named warmly in client testimonials; no title, email or LinkedIn published",
      },
      {
        name: "Deniese",
        role: "Office manager",
        note: "likely triages enquiries@. Surname not published",
      },
    ],
    partners: [
      {
        kind: "Design",
        company: "Eco Blueprints",
        name: "Ross Campbell",
        site: "https://www.ecoblueprints.com.au",
        email: "ross@ecoblueprints.com.au",
        note: "8.5-star Highfields home, two BDAQ design awards. Their site is DOWN too (checked 5 Jul 2026); phone 0431 404 608 is the safer channel",
      },
    ],
    intel: [
      "Strongest hook in the whole batch: rosshogno.com.au is literally a holding page right now ('Site currently being updated'), every interior page 404s. They have no live portfolio while the 2026 Downs & Western awards season runs (mid July).",
      "Won Best Use of Sloping Sites at the 2025 Downs & Western awards for the Hooson Home, Highfields (presented 18 Jul 2025). The award-winning home isn't viewable anywhere online because the site is down.",
      "Ross sits on Master Builders QLD's Electoral College for Downs & Western. Origin story: WorldSkills national champion carpenter (2001), MB Apprentice of the Year (2000), 11 awards since.",
      "Small family crew: Ross, Brad, Andrew, Hannah (apprentice), Deniese in the office. No photographer credit anywhere; imagery looks self-shot.",
    ],
    messages: [
      {
        label: "Round 2 · Email",
        to: "enquiries@rosshogno.com.au (attn. Ross)",
        subject: "While the site's being updated",
        body: `Hi Ross,

I saw rosshogno.com.au is down to a holding page at the moment. That means the Hooson Home award from last July isn't viewable anywhere online, right as this year's Downs and Western season rolls around.

A while back I emailed through a rebuilt version of your site. If you're mid-transition anyway, the timing might actually work in your favour: finbar.studio/ross-hogno

It's a working site built around your own photography, not a mockup. Happy for you, Deniese or Danielle to click around and judge it on its merits.

Fifteen minutes on the phone and I can show you how it'd come together.

Cheers,
Finbar
finbar.studio`,
      },
      {
        label: "Round 2 · LinkedIn connection note (Ross)",
        to: "linkedin.com/in/ross-hogno-51247525",
        body: `Hi Ross, Finbar here, a designer in Brisbane. Saw the site's mid-update and figured I'd connect while it's in motion. I rebuilt a version of it as a working demo: finbar.studio/ross-hogno. Congrats on the Hooson Home win too.`,
      },
      {
        label: "Round 1 · Email (sent)",
        to: "enquiries@rosshogno.com.au (attn. Ross Hogno)",
        subject: "Your homes vs your website",
        body: `Hi Ross,

I'm Finbar, a designer based in Brisbane. I went looking for the best builders on the Darling Downs and yours stood out straight away. Twenty years of custom homes, eleven Master Builders awards, the Highfields sloping-site home.

Then I opened the website. It's an old slider template now, so it doesn't do the homes justice. Rather than send you a pitch, I rebuilt it.

There's a short page on what I noticed, plus a working demo (home, projects and about) built around your own photography:

finbar.studio/ross-hogno

No pressure and nothing to sign. Have a click through on a desktop when you get a minute, and if it feels right I'd love to have a chat.

Cheers,
Finbar
finbar.studio`,
      },
    ],
  },
  {
    name: "David Radic Prestige Homes",
    meta: "Gold Coast · waterfront prestige",
    pitch: "/david-radic",
    pages: [
      { label: "Home", href: "/david-radic/site" },
      { label: "About", href: "/david-radic/site/about" },
      { label: "Our Homes", href: "/david-radic/site/portfolio" },
    ],
    people: [
      {
        name: "David Radic",
        role: "Owner & licensed builder",
        email: "admin@drphomes.com.au",
        linkedin: "https://www.linkedin.com/in/david-radic-a62572220/",
        note: "LinkedIn verified but has 2 connections, effectively dead. Email only; mobiles 0402 996 715 / 0414 617 446",
      },
      {
        name: "Natasha Radic",
        role: "Co-owner, operations & admin",
        email: "admin@drphomes.com.au",
        note: "no LinkedIn found (a same-name US nurse profile is NOT her)",
      },
    ],
    partners: [
      {
        kind: "Architect",
        company: "BDA Architecture",
        name: "Darren Greenaway",
        site: "https://bdaarch.com.au",
        email: "info@bdaarch.com.au",
        linkedin: "https://www.linkedin.com/in/darren-greenaway-33303332/",
        note: "director; DRP-built luxury home credited on Houzz. Mermaid Beach, 07 5555 2600",
      },
      {
        kind: "Architect",
        company: "BDA Architecture",
        name: "Adam Beck",
        email: "info@bdaarch.com.au",
        linkedin: "https://au.linkedin.com/in/adam-beck-a27338121",
        note: "second BDA director, same DRP tie",
      },
      {
        kind: "Photo",
        company: "BWRM",
        site: "https://bwrm.com",
        linkedin: "https://au.linkedin.com/company/bwrm-australia",
        note: "credit is second-hand via a supplier's Houzz upload, and they're a volume real-estate agency. Treat as probable, not confirmed",
      },
    ],
    intel: [
      "They WON the 2025 HIA Gold Coast/Northern Rivers Custom Built Home award for a Broadbeach Waters residence (announced 18 Sep 2025). Round 1 called them finalists, so the upgrade is the opener.",
      "The win appears nowhere on their website. Newest portfolio entries: Hope Island Residence #7 parts 1 and 2, currently in flight.",
      "Husband-and-wife business, deliberately few builds a year, Gold Coast only. Site is an older WordPress build by Hernsby Website Design; project pages are bare galleries.",
      "No firstname@ email pattern exists anywhere, so don't guess one.",
    ],
    messages: [
      {
        label: "Round 2 · Email",
        to: "admin@drphomes.com.au (attn. David & Natasha)",
        subject: "The Broadbeach Waters win",
        body: `Hi David and Natasha,

Congratulations on the HIA Custom Built Home award for the Broadbeach Waters residence. When I first emailed I had you down as finalists, so you've gone one better since.

The win isn't mentioned anywhere on your website though, and Hope Island Residence #7 will deserve a proper page when it wraps up.

The rebuilt demo I sent is still live: finbar.studio/david-radic

You deliberately keep your build list short, so each enquiry the site brings in counts for a lot. Fifteen minutes on the phone and I'll show you what I'd do with it.

Cheers,
Finbar
finbar.studio`,
      },
      {
        label: "Round 1 · Email (sent)",
        to: "admin@drphomes.com.au (attn. David & Natasha Radic)",
        subject: "Your homes vs your website",
        body: `Hi David and Natasha,

I'm Finbar, a designer based in Brisbane. I went looking for the best builders on the Gold Coast and your homes stopped me. The Buccaneer Residence, the Hope Island and Broadbeach waterfronts, an HIA finalist over two million.

Then I opened the website. It's from around 2016 now, so it doesn't do the homes justice. Rather than send you a pitch, I rebuilt it.

There's a short page on what I noticed, plus a working demo (home, our homes and about) built around your own photography:

finbar.studio/david-radic

No pressure and nothing to sign. Have a click through on a desktop when you get a minute, and if it feels right I'd love to have a chat.

Cheers,
Finbar
finbar.studio`,
      },
    ],
  },
  {
    name: "GTO Building",
    meta: "Sunshine Coast · architect-led",
    pitch: "/gto-building",
    pages: [
      { label: "Home", href: "/gto-building/site" },
      { label: "About", href: "/gto-building/site/about" },
      { label: "Projects", href: "/gto-building/site/portfolio" },
    ],
    people: [
      {
        name: "Gaston Ottl",
        role: "Founder & director",
        email: "info@gtobuilding.com.au",
        linkedin: "https://www.linkedin.com/in/gaston-ottl-463016148/",
        note: "verified but ~19 connections, skip LinkedIn. Email attn. Gaston or call 0431 087 344. Genuinely a one-principal business",
      },
    ],
    partners: [
      {
        kind: "Architect",
        company: "Bark Design Architects",
        name: "Lindy Atkin & Stephen Guthrie",
        site: "https://www.barkdesign.com.au",
        email: "info@barkdesign.com.au",
        note: "Tristania Beach House + Panorama House (the 2025 steel-frame winner). Noosa Heads, 07 5471 0340",
      },
      {
        kind: "Design",
        company: "Reitsma & Associates",
        name: "Trevor Reitsma",
        site: "https://www.reitsmadesign.com.au",
        email: "info@reitsma.com.au",
        note: "Shearwater House, the 2025 Individual Home winner. 0493 062 182",
      },
      {
        kind: "Photo",
        company: "Jack Gore Photo",
        name: "Jack Gore",
        site: "https://www.jackgorephoto.com.au",
        email: "hello@jackgorephoto.com.au",
        note: "shot Shearwater. Sunshine Coast architecture specialist, 0424 889 638",
      },
      {
        kind: "Photo",
        company: "CFJPhotography",
        name: "Christopher Frederick Jones",
        site: "https://www.cfjphoto.com.au",
        email: "studio@cfjphoto.com.au",
        linkedin: "https://au.linkedin.com/in/christopher-frederick-jones-b3485142",
        note: "shot Tristania. One of QLD's best-known architectural photographers",
      },
      {
        kind: "Photo",
        company: "Aimee Dodge Photography",
        name: "Aimee Dodge",
        site: "https://www.aimeedodge.com.au",
        email: "hello@aimeedodge.com.au",
        note: "shot Panorama House. Lifestyle shooter, likely an occasional collaborator",
      },
    ],
    intel: [
      "Double winner at the Master Builders Sunshine Coast 2025 awards (Aug 2025): Shearwater House took Individual Home $2.5M to $3M (Reitsma design) and Panorama House took Best Use of Steel Frame (Bark design). Neither win shows anywhere on the site.",
      "The homepage still just says 'award-winning' with no awards page, and the project pages don't mention their own wins.",
      "Photography is already paid for and excellent (Jack Gore, CFJ, Aimee Dodge), sitting in a Wix-class template. 'Your photos deserve a better site' is the honest pitch.",
      "Caution: a different 'Panorama House, Doonan' by Gerard Smith Design exists. GTO's is the Bark one, don't conflate them.",
    ],
    messages: [
      {
        label: "Round 2 · Email",
        to: "info@gtobuilding.com.au (attn. Gaston)",
        subject: "Shearwater and Panorama",
        body: `Hi Gaston,

Two wins on the one night at the Sunshine Coast awards. Shearwater and Panorama House are proper homes, and it says something that Reitsma and Bark keep working with you.

Neither win shows up on your website though. You've already paid Jack Gore and CFJ for photography most builders would kill for, and right now it's sitting in a template that doesn't do it justice.

The rebuild I sent a while back puts that photography front and centre: finbar.studio/gto-building

Call me and I'll talk you through it in 15 minutes. Either way, good luck at this year's awards.

Cheers,
Finbar
finbar.studio`,
      },
      {
        label: "Round 1 · Email (sent)",
        to: "info@gtobuilding.com.au (attn. Gaston Ottl)",
        subject: "Your homes vs your website",
        body: `Hi Gaston,

I'm Finbar, a designer based in Brisbane. I went looking for the best builders on the Sunshine Coast and kept coming back to yours. Panorama House, the Tristania beach house, your work with Bark and the string of Master Builders wins.

Then I opened the website. It's a Wix template now, so it doesn't do the homes justice. Rather than send you a pitch, I rebuilt it.

There's a short page on what I noticed, plus a working demo (home, projects and about) built around your own photography, and your GTO mark, which I really like:

finbar.studio/gto-building

No pressure and nothing to sign. Have a click through on a desktop when you get a minute, and if it feels right I'd love to have a chat.

Cheers,
Finbar
finbar.studio`,
      },
    ],
  },
  {
    name: "HM Developments",
    meta: "Sunshine Coast · developer",
    pitch: "/hm-developments",
    pages: [
      { label: "Home", href: "/hm-developments/site" },
      { label: "About", href: "/hm-developments/site/about" },
      { label: "Projects", href: "/hm-developments/site/portfolio" },
    ],
    people: [
      {
        name: "Mclean Henzell",
        role: "Director & co-founder",
        email: "info@hmdevelopments.com.au",
        note: "spelling is 'Mclean' per their team page. Fourth-generation Henzell; no personal LinkedIn exists. Personal IG appears to be @mbhenzell",
      },
      {
        name: "Ben Murphy",
        role: "Co-founder (the M in HM)",
        note: "silent partner: not on the team page, never quoted, no verified contacts. Not the BA Murphy collapse guy, different person",
      },
      {
        name: "Marcus Muir",
        role: "Ex sales director",
        linkedin: "https://au.linkedin.com/in/marcus-muir-268b96176",
        note: "DO NOT CONTACT at HM. He became McGrath QLD Head Auctioneer in Jul 2025; the HM team page is stale",
      },
    ],
    partners: [
      {
        kind: "Architect",
        company: "OGE Group Architects",
        name: "John Robertson",
        site: "https://www.ogegrouparchitects.com",
        email: "info@ogegroup.com.au",
        note: "designed The Cove 'Corsica' (featured in The Local Project issue 17). Maroochydore, 07 5444 8883",
      },
      {
        kind: "Photo",
        company: "Catherine Schusler",
        name: "Catherine Schusler",
        site: "https://www.catherineschusler.com",
        email: "info@catherineschusler.com",
        linkedin: "https://www.linkedin.com/in/catherineschusler/",
        note: "shot Corsica for The Local Project. Brisbane; featured in Architectural Digest and NYT",
      },
      {
        kind: "Photo",
        company: "KJB Photography",
        name: "Kelli Jean Black",
        site: "https://www.kjbphotographer.com.au",
        note: "shot the $5M Comino penthouse. No email published; 0400 804 878, IG @kellijeanblack",
      },
      {
        kind: "Interiors",
        company: "Blink Living",
        name: "Nick Counsell",
        site: "https://www.blinkliving.com.au",
        email: "hello@blinkliving.com.au",
        note: "styled the penthouse; their case study carries Mclean's own testimonial. Warmest thread to HM. 07 5455 5015",
      },
    ],
    intel: [
      "Comino at The Cove reportedly passed $25M in sales within weeks of launch; Mclean was quoted in Marine Business News in May 2026 pitching the marina-berth lifestyle.",
      "The $5M Penthouse 2601 (Blink Living styling, KJB photos) ran in The Weekend Australian and Sunshine Coast News, Jul 2025.",
      "Their news page has had nothing added since 7 Jun 2021, five years of milestones missing. Current site is by April Ford (GC agency), so they already pay for professional web work.",
      "The Cove is a ~$400M masterplan due 2027, the largest private development on the Sunshine Coast; Verre Caloundra ($95M) is next in the pipeline. thecove.com.au is a separate, more active site: a 'family of sites' pitch fits.",
      "Henzells turned 90 in 2025 (Roy Henzell, 1935; the family bought the Pelican Waters land in 1946). Heritage is the warm open.",
    ],
    messages: [
      {
        label: "Round 2 · Email",
        to: "info@hmdevelopments.com.au (attn. Mclean Henzell)",
        subject: "Comino",
        body: `Hi Mclean,

Comino passing $25 million in sales within weeks says everything about what you're building at Pelican Waters. And the penthouse shoot with Blink Living ending up in The Weekend Australian is the kind of press money can't buy.

Almost none of it reaches your own website though. The news page hasn't moved since June 2021, five years of milestones ago.

The rebuilt demo I emailed about earlier is still live: finbar.studio/hm-developments

Ninety years of Henzells on the coast, fourth generation, and the biggest private project the Sunshine Coast has seen. That story deserves a site that can carry it, and I'd like to show you how the whole family of sites could hang together. Fifteen minutes, whenever suits.

Cheers,
Finbar
finbar.studio`,
      },
      {
        label: "Round 1 · Email (sent)",
        to: "info@hmdevelopments.com.au (attn. McLean Henzell)",
        subject: "Your developments vs your website",
        body: `Hi McLean,

I'm Finbar, a designer based in Brisbane. I was looking at who's shaping the Sunshine Coast and your work kept coming up. The Cove at Pelican Waters, the sold-out terraces, the Caloundra projects in the pipeline.

Then I opened the website. The footer still reads 2020 and the story's split across two sites, so it doesn't do the work justice. Rather than send you a pitch, I rebuilt it.

There's a short page on what I noticed, plus a working demo (home, projects and about) built around your 2024 photography and your HM brand:

finbar.studio/hm-developments

No pressure and nothing to sign. Have a click through on a desktop when you get a minute, and if it feels right I'd love to have a chat.

Cheers,
Finbar
finbar.studio`,
      },
    ],
  },
  {
    name: "MBC Prestige",
    meta: "Noosa · developer",
    pitch: "/mbc-prestige",
    pages: [
      { label: "Home", href: "/mbc-prestige/site" },
      { label: "About", href: "/mbc-prestige/site/about" },
      { label: "Projects", href: "/mbc-prestige/site/portfolio" },
    ],
    people: [
      {
        name: "Mark Bain",
        role: "Owner & MD, Mark Bain Constructions (the builder behind MBC)",
        email: "info@mbcprestige.com.au",
        linkedin: "https://www.linkedin.com/in/mark-bain-b687b764/",
        note: "verified. The real decision-maker; second-generation Noosa builder, Sunshine Beach since 1987. Son Joe Mark Bain is project coordinator",
      },
      {
        name: "David Conolly",
        role: "Principal, Century 21 Conolly Hay Group (markets MBC's projects)",
        email: "david@c21noosa.com",
        linkedin: "https://au.linkedin.com/in/david-conolly-4b919052",
        note: "email verified live on the C21 team page. NOT MBC staff, frame accordingly. 0438 259 956",
      },
      {
        name: "Sam Walker",
        role: "Sales executive, Century 21 Conolly Hay Group",
        email: "sam@c21noosa.com",
        note: "email verified live. 0400 730 457",
      },
    ],
    partners: [
      {
        kind: "Design",
        company: "Chris Clout Design",
        name: "Chris Clout",
        site: "https://www.chriscloutdesign.com.au",
        email: "info@chriscloutdesign.com.au",
        note: "Tea Tree Residences, Noosa Heads. 60+ design awards; office on the same street as MBC's Sails project. 07 5474 8107",
      },
      {
        kind: "Design",
        company: "Kidd + Co Designers",
        name: "Stephen Kidd",
        site: "http://www.kiddco.com.au",
        note: "White Sands, Sunshine Beach ('coming soon'). No email published; (07) 5474 4442; their site was unreachable at check time",
      },
      {
        kind: "Architect",
        company: "PUSH Architects",
        site: "https://push.net.au",
        note: "Avoca Residences, Peregian Springs (50 units, completing now). Coolum Beach, 0412 636 378",
      },
    ],
    intel: [
      "Key correction from round 1: David Conolly and Sam Walker are Century 21 agents who market MBC's projects, not MBC staff. The decision-maker is Mark Bain, and info@mbcprestige.com.au may be read by the C21 side.",
      "Noosa Today, 10 Dec 2025: Tea Tree Residences called 'a high water mark in coastal design' (Chris Clout Design x MBC). The penthouse went to auction 13 Dec 2025.",
      "Avoca Residences is completing early-to-mid 2026, i.e. right now. White Sands and Oceane Coolum Beach are 'coming soon': two unlaunched projects that will need marketing and a web presence. That's the strongest hook.",
      "Pipeline otherwise: Kalani, Sails, Tanglewood, Botanica, Habitat all 'now selling'. No team page, no MBC Instagram (marketing runs through @century21noosa).",
    ],
    messages: [
      {
        label: "Round 2 · Email (Mark Bain)",
        to: "info@mbcprestige.com.au (attn. Mark Bain)",
        subject: "Tea Tree, and what's coming",
        body: `Hi Mark,

Noosa Today called Tea Tree "a high water mark in coastal design" in December. With Avoca finishing up and White Sands and Oceane still to launch, you've got more in the pipeline than most builders on the coast.

Each of those launches needs a web presence that matches the homes, and the current site buries most of its detail in PDFs.

A while back I sent a rebuilt version of mbcprestige.com.au to the info address, which I suspect lands with the sales side rather than with you. It's still live: finbar.studio/mbc-prestige

Forty years of building Sunshine Beach has earned better than a 2015 website. Fifteen minutes on the phone and I'll show you what I mean.

Cheers,
Finbar
finbar.studio`,
      },
      {
        label: "Round 2 · Email (David Conolly, C21)",
        to: "david@c21noosa.com",
        subject: "Better project pages for the MBC listings",
        body: `Hi David,

You're selling Tea Tree, Kalani and Sails for MBC, with White Sands and Oceane still to come. The homes sell themselves once people stand in them. The website is the weak link before that: most of the detail sits in PDFs and the press never makes it onto the page.

I rebuilt the site as a working demo: finbar.studio/mbc-prestige

Better project pages mean buyers arrive at you and Sam already sold on the story. If you think Mark would be open to it, I'd value the introduction, and I'm happy to walk you both through it over a coffee in Noosa.

Cheers,
Finbar
finbar.studio`,
      },
      {
        label: "Round 1 · Email (sent)",
        to: "info@mbcprestige.com.au (attn. David Conolly / Sam Walker)",
        subject: "Your developments vs your website",
        body: `Hi there,

I'm Finbar, a designer based in Brisbane. I was looking at who's shaping Noosa and your developments stopped me. Forty years on the coast, the Kalani riverfront residences, the whole-floor Sunshine Beach apartments.

Then I opened the website. It's a 2015 build now, with most of the detail trapped in PDFs, so it doesn't do the developments justice. Rather than send you a pitch, I rebuilt it.

There's a short page on what I noticed, plus a working demo (home, projects and about) built around your own photography and your MBC brand:

finbar.studio/mbc-prestige

No pressure and nothing to sign. Have a click through on a desktop when you get a minute, and if it feels right I'd love to have a chat.

Cheers,
Finbar
finbar.studio`,
      },
    ],
  },
];

// Earlier demos, now with the same research + outreach treatment.
const EARLIER: Builder[] = [
  {
    name: "Braeden Constructions",
    meta: "Noosa · custom homes",
    pitch: "/braeden",
    pages: [
      { label: "Home", href: "/braeden/site" },
      { label: "About", href: "/braeden/site/about" },
      { label: "Projects", href: "/braeden/site/projects" },
    ],
    people: [
      {
        name: "Mick Devlin",
        role: "Founder & owner-builder",
        note: "NO email exists anywhere, verified twice. Channel: contact form or 'Call Mick' 0418 505 117. He answers his own phone. No LinkedIn",
      },
    ],
    partners: [
      {
        kind: "Design",
        company: "Chris Clout Design",
        name: "Chris Clout",
        site: "https://www.chriscloutdesign.com.au",
        email: "info@chriscloutdesign.com.au",
        linkedin: "https://www.linkedin.com/in/chris-clout-570a5b56/",
        note: "Modern Thai House (2022 QLD House of the Year) and likely Riverside too. The real alternative route to Mick. LinkedIn unverified, double-check before using",
      },
      {
        kind: "Interiors",
        company: "CLO Studios",
        name: "Chloe Tozer",
        site: "https://clostudios.com.au",
        linkedin: "https://www.linkedin.com/in/chloe-tozer-982898232/",
        note: "Modern Thai House interiors and styling. Contact form only; IG @clo_studios",
      },
      {
        kind: "Photo",
        company: "David Chatfield Photography",
        name: "David Chatfield",
        site: "https://www.davidchatfield.studio",
        email: "info@davidchatfield.studio",
        linkedin: "https://au.linkedin.com/in/david-chatfield-6b8286147",
        note: "shot the Modern Thai House. Brisbane. NOT davidchatfieldphotography.com (a UK namesake)",
      },
      {
        kind: "Design",
        company: "Skale Building Design",
        name: "Ben Thornton",
        site: "https://skale.com.au",
        email: "info@skale.com.au",
        note: "Elizabeth Villas, Noosaville. 0412 025 657",
      },
    ],
    intel: [
      "Riverside (Noosaville) won TWICE at the 2025 MB Sunshine Coast awards (15 Aug 2025): Individual Home $5M to $10M and Best Residential Kitchen. The Riverside page on their own site is nearly empty.",
      "30 years in 2026, but the site still says 'celebrating 25 years'. First-ever Sunshine Coast builder to win MB National Residential Builder of the Year (2010); 2022 QLD House of the Year.",
      "The 2026 regional awards run July to August, i.e. right now: a 'good luck at this year's awards' line works.",
      "Ignore 'Sally Devlin, Director' (RocketReach only, unverified). Tiny operation, ~2 employees. Site by agency KOOK; active on Facebook, no Instagram.",
    ],
    messages: [
      {
        label: "Round 2 · Contact form (or read it to him on the phone)",
        to: "braedenconstructions.com.au contact form (attn. Mick) · or call 0418 505 117",
        body: `Hi Mick,

Congrats on Riverside. Two awards on the one night, and the judges raving about that kitchen. Funny thing is the Riverside page on your own site is close to empty, and the footer still says 25 years when 2026 makes it 30.

I'm Finbar, a designer in Brisbane. I rebuilt your site as a working demo built around that award record: finbar.studio/braeden

First Sunshine Coast builder to win the national title, a Queensland House of the Year, and thirty years in. That deserves a site that says so. If you'd rather talk than click, I'm on [your number], or finbar@finbar.studio.

Cheers,
Finbar`,
      },
    ],
  },
  {
    name: "A Rolley & Sons",
    meta: "Sunshine Coast · 4th-gen builder",
    pitch: "/a-rolley",
    pages: [
      { label: "Home", href: "/a-rolley/site" },
      { label: "About", href: "/a-rolley/site/about" },
      { label: "Projects", href: "/a-rolley/site/projects" },
    ],
    people: [
      {
        name: "Dan Rolley",
        role: "Director & principal supervisor, 4th generation",
        email: "admin@arolleyandsons.com.au",
        note: "no LinkedIn (the 'Daniel Rolley' director profile in searches is a transport guy, not him)",
      },
      {
        name: "Lee Rolley",
        role: "Co-owner & business development (Dan's wife)",
        email: "admin@arolleyandsons.com.au",
        linkedin: "https://www.linkedin.com/in/lee-rolley-3039552bb/",
        note: "verified; the only digitally active principal, and design-literate (studied building design). Beware a UK namesake profile",
      },
      {
        name: "Sarah Molyneux",
        role: "Office manager",
        note: "joined 2024; likely reads admin@",
      },
    ],
    partners: [
      {
        kind: "Brand & web",
        company: "Nina Hansen Design",
        name: "Nina Hansen",
        site: "https://www.ninahansendesign.com",
        email: "ninahansendesign@icloud.com",
        linkedin: "https://www.linkedin.com/in/nina-hansen-98291930/",
        note: "designed the CURRENT brand and site (and possibly its photos). Never disparage the site; frame as evolution. No architect or photographer is credited anywhere else, verified",
      },
    ],
    intel: [
      "2025 Quality Business Awards: Best Home Builder on the Sunshine Coast (95%+ quality score). The freshest concrete win; no MB awards 2023 to 2025.",
      "Fifth-generation angle: Dan's youngest son recently finished his apprenticeship, and they have an apprentice carpenter (Jarrod Goodwin). Family firm since 1943, building in Caloundra since 1968.",
      "Staleness proof points: blog's last post is April 2021, and the copy still says '75 years' when it's past 80 now.",
      "Their socials are modest and community-minded (storm-prepping client sites ahead of Cyclone Alfred, Mar 2025). Humble craft tone fits.",
    ],
    messages: [
      {
        label: "Round 2 · Email",
        to: "admin@arolleyandsons.com.au (attn. Dan & Lee)",
        subject: "Five generations",
        body: `Hi Dan and Lee,

Best Home Builder on the Sunshine Coast in the 2025 Quality Business Awards, and your youngest finishing his apprenticeship in the same stretch. Four generations built the name and the fifth is already on the tools. Not many builders in the country can say that.

I like your current site, and I'd keep its warmth. It just hasn't moved in a while: the blog stops at 2021 and the copy still says 75 years when you're past 80 now.

A while back I rebuilt a version as a working demo, in two flavours so you can compare: finbar.studio/a-rolley

If Lee wants to pull it apart with me, I'd genuinely enjoy that conversation.

Cheers,
Finbar
finbar.studio`,
      },
      {
        label: "Round 2 · LinkedIn connection note (Lee)",
        to: "linkedin.com/in/lee-rolley-3039552bb",
        body: `Hi Lee, Finbar here, a designer in Brisbane. Congrats on the 2025 Best Home Builder award, and the fifth generation coming through. I rebuilt your site as a working demo in two versions (finbar.studio/a-rolley) and would honestly value your read on it.`,
      },
    ],
  },
  {
    name: "Lindon Homes",
    meta: "Brisbane · custom & luxury",
    pitch: "/lindon",
    pages: [
      { label: "Home", href: "/lindon/site" },
      { label: "About", href: "/lindon/site/about" },
      { label: "Portfolio", href: "/lindon/site/portfolio" },
    ],
    people: [
      {
        name: "Ashley Lindon",
        role: "Managing director & founder",
        linkedin: "https://www.linkedin.com/in/ashley-lindon-69267493/",
        note: "verified. Founded in Toowoomba 1984, 40+ years licensed",
      },
      {
        name: "Lynn Lindon",
        role: "Accounts & marketing (co-founder, Ashley's wife)",
        linkedin: "https://www.linkedin.com/in/lynn-lindon-ab8661138/",
        note: "verified. She runs marketing, so the site conversation is partly hers",
      },
      {
        name: "Trent Lindon",
        role: "Building consulting (son, next generation)",
        linkedin: "https://www.linkedin.com/in/trent-lindon-3448ab170/",
        note: "URL resolves but title unconfirmed (login wall). Don't lead with it",
      },
    ],
    partners: [
      {
        kind: "Architect",
        company: "Clements Clarke Architects",
        name: "Matthew Clements",
        site: "https://clementsclarke.com.au",
        email: "matthew@clementsclarke.com.au",
        note: "Oriel Road, the HIA 2023 Renovation/Addition winner. Direct email VERIFIED live, the best partner contact in the whole set. (07) 3852 3944",
      },
      {
        kind: "Architect",
        company: "Clements Clarke Architects",
        name: "Nick Clarke",
        email: "nick@clementsclarke.com.au",
        note: "co-founder; direct email verified live",
      },
      {
        kind: "Architect",
        company: "DesignFolk Architecture",
        site: "https://designfolk.com.au",
        note: "McIlwraith Ave (HIA finalist 2018). Site unreachable at check time; not the Irish designfolk.ie",
      },
    ],
    intel: [
      "Double 2025 HIA Brisbane winner: Custom Built Home $1.5M to $2M AND Renovation/Addition $1.5M to $2M, bannered proudly on their own homepage. Plus 2023 HIA Brisbane Home of the Year pedigree (Tranters Ave).",
      "No email is published anywhere: contact form, (07) 3823 5522, or LinkedIn only.",
      "Site gaps to cite: the news page's latest post is Nov 2021, and the 'Meet Our Team' page under About Us renders empty (the /team/ page works fine).",
      "Flagship new project: Ormuz (Yeronga knock-down-rebuild, curved walls, Lindon-designed), added Feb 2025. IG @lindon_homes ~5.2k followers, active. No photographer is credited anywhere, a genuine gap.",
    ],
    messages: [
      {
        label: "Round 2 · LinkedIn connection note (Ashley)",
        to: "linkedin.com/in/ashley-lindon-69267493",
        body: `Hi Ashley, I'm Finbar, a designer in Brisbane. The double HIA win this year and Ormuz caught my eye. I rebuilt lindonhomes.com.au as a working demo (finbar.studio/lindon) and figured I should connect with the bloke whose name's on the door.`,
      },
      {
        label: "Round 2 · LinkedIn DM (Lynn, after connecting)",
        to: "linkedin.com/in/lynn-lindon-ab8661138",
        body: `Hi Lynn,

Congrats on the two HIA wins this year. Since you run the marketing side, this is probably for you: I rebuilt lindonhomes.com.au as a working demo, built around your portfolio and the awards. It's at finbar.studio/lindon

Two things I noticed while building it: the news page's latest post is from November 2021, and the Meet Our Team page under About Us comes up empty (the /team/ page works fine). Easy fixes either way.

Happy to walk you and Ashley through the demo on a quick call, or just send through the full list of what I found.`,
      },
      {
        label: "Round 2 · Contact form",
        to: "lindonhomes.com.au contact form (attn. Ashley) · or (07) 3823 5522",
        body: `Hi Ashley,

Congrats on the double HIA win this year, and Ormuz looks like a special one.

I'm Finbar, a designer in Brisbane. I rebuilt lindonhomes.com.au as a working demo around your portfolio and awards: finbar.studio/lindon

Worth a look next time you're at a desk. I'm on [your number] or finbar@finbar.studio if it sparks anything.

Cheers,
Finbar`,
      },
    ],
  },
  {
    name: "OJ Pippin Homes",
    meta: "Brisbane · all-inclusive",
    pitch: "/oj-pippin",
    pages: [
      { label: "Home", href: "/oj-pippin/site" },
      { label: "About", href: "/oj-pippin/site/about" },
      { label: "Designs", href: "/oj-pippin/site/designs" },
      { label: "What We Do", href: "/oj-pippin/site/what-we-do" },
    ],
    people: [
      {
        name: "Wade Hastie",
        role: "Managing director & owner",
        email: "info@ojpippin.com.au",
        note: "NO LinkedIn exists, verified. Email attn. Wade Hastie; 07 3889 7775. Don't guess wade@, the pattern is unknown",
      },
      {
        name: "Mike Nancarrow",
        role: "Sales manager",
        linkedin: "https://au.linkedin.com/in/mike-nancarrow-917212104",
        note: "verified, 469 connections: the most LinkedIn-reachable person in this whole cohort. Use 'Sales Manager' (per the site), not GM",
      },
    ],
    partners: [],
    partnersNote:
      "None exist: design is in-house and the imagery is render-heavy with no photographer ever credited. Verified correct, not a research gap (and itself a pitch angle: their visual pipeline is DIY).",
    intel: [
      "Best opener: their new Design & Display Home Centre at Building 6, 205 Leitchs Rd, Brendale opened early 2026 and is now open 7 days a week.",
      "Celebrating 30 years (est. 1994, 1000+ homes, 100+ plans). No MB or HIA wins 2024 to 2026, so don't congratulate awards.",
      "Wade's development arm Keystone Urban Developments just rebranded with a brand-new site (keystoneurban.com.au), proof he spends on web when it counts. Possible second-site upsell.",
      "Their blog is genuinely active (weekly SEO posts through June 2026), so someone there already invests in content marketing.",
    ],
    messages: [
      {
        label: "Round 2 · Email",
        to: "info@ojpippin.com.au (attn. Wade Hastie)",
        subject: "The new Brendale centre",
        body: `Hi Wade,

The new Design and Display Home Centre at Brendale is a big swing, and opening it in your 30th year makes it a proper milestone. Congratulations.

It also means more people than ever will look you up before they visit. I rebuilt ojpippin.com.au as a working demo a while back, and it's still live: finbar.studio/oj-pippin

You already back digital when it counts. The Keystone rebrand and the weekly blog show that. This is the same move for the home-building side, timed to the centre opening.

If it's worth 15 minutes, reply or call and I'll walk you through it.

Cheers,
Finbar
finbar.studio`,
      },
      {
        label: "Round 2 · LinkedIn connection note (Mike)",
        to: "linkedin.com/in/mike-nancarrow-917212104",
        body: `Hi Mike, Finbar here, a designer in Brisbane. Congrats on the new Brendale display centre. I rebuilt ojpippin.com.au as a working demo (finbar.studio/oj-pippin) and emailed it through for Wade. Figured you'd want a look too, since sales feels the website first.`,
      },
    ],
  },
];

function linkHost(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

function PersonLine({ p }: { p: Person }) {
  return (
    <li style={{ fontSize: "0.85rem", lineHeight: 1.6 }}>
      <span className="text-ink">{p.name}</span>
      <span className="text-ink-soft"> · {p.role}</span>
      {p.email && (
        <>
          {" · "}
          <a href={`mailto:${p.email}`} className="text-pink hover:underline">{p.email}</a>
        </>
      )}
      {p.linkedin && (
        <>
          {" · "}
          <a href={p.linkedin} target="_blank" rel="noopener noreferrer" className="text-pink hover:underline">
            LinkedIn&nbsp;&#8599;
          </a>
        </>
      )}
      {p.note && <span className="text-ink-soft"> · {p.note}</span>}
    </li>
  );
}

function PartnerLine({ p }: { p: Partner }) {
  return (
    <li style={{ fontSize: "0.85rem", lineHeight: 1.6 }}>
      <span className="mono-label text-ink-soft" style={{ marginRight: "0.5em" }}>{p.kind}</span>
      <span className="text-ink">{p.company}</span>
      {p.name && <span className="text-ink-soft"> ({p.name})</span>}
      {p.site && (
        <>
          {" · "}
          <a href={p.site} target="_blank" rel="noopener noreferrer" className="text-pink hover:underline">
            {linkHost(p.site)}
          </a>
        </>
      )}
      {p.email && (
        <>
          {" · "}
          <a href={`mailto:${p.email}`} className="text-pink hover:underline">{p.email}</a>
        </>
      )}
      {p.linkedin && (
        <>
          {" · "}
          <a href={p.linkedin} target="_blank" rel="noopener noreferrer" className="text-pink hover:underline">
            LinkedIn&nbsp;&#8599;
          </a>
        </>
      )}
      {p.note && <span className="text-ink-soft"> · {p.note}</span>}
    </li>
  );
}

function Row({ b }: { b: Builder }) {
  return (
    <div className="border-t border-line pt-5">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-3">
        <div className="md:col-span-5">
          <h3 className="mono-heading text-ink">{b.name}</h3>
          <p className="text-ink-soft mt-1" style={{ fontSize: "0.85rem" }}>{b.meta}</p>
        </div>
        <div className="md:col-span-7 flex flex-wrap items-center gap-x-4 gap-y-2">
          <a href={b.pitch} className="mono-label text-pink hover:underline">
            Pitch &rarr;
          </a>
          <span className="text-ink-soft/40" aria-hidden="true">|</span>
          {b.pages.map((p) => (
            <a
              key={p.href}
              href={p.href}
              className="mono-label text-ink hover:text-pink transition-colors"
            >
              {p.label}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4 md:max-w-[76ch]">
        <div>
          <p className="mono-label text-ink-soft mb-2">People</p>
          <ul className="flex flex-col gap-1">
            {b.people.map((p) => (
              <PersonLine key={p.name} p={p} />
            ))}
          </ul>
        </div>

        <div>
          <p className="mono-label text-ink-soft mb-2">Architects · designers · photographers</p>
          {b.partners.length > 0 ? (
            <ul className="flex flex-col gap-1">
              {b.partners.map((p, i) => (
                <PartnerLine key={`${p.company}-${i}`} p={p} />
              ))}
            </ul>
          ) : (
            <p className="text-ink-soft" style={{ fontSize: "0.85rem", lineHeight: 1.6 }}>{b.partnersNote}</p>
          )}
        </div>

        <div>
          <p className="mono-label text-ink-soft mb-2">Hooks &amp; cautions</p>
          <ul className="list-disc pl-5 flex flex-col gap-1 text-ink-soft" style={{ fontSize: "0.85rem", lineHeight: 1.6 }}>
            {b.intel.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mono-label text-ink-soft">Messages</p>
          {b.messages.map((m) => (
            <MessageBlock key={m.label} label={m.label} to={m.to} subject={m.subject} body={m.body} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function BuildersIndexPage() {
  // On-screen password gate (cookie set by the unlock server action). The check
  // lives here rather than in proxy.ts so the lock is a styled page, not a
  // browser Basic Auth popup; the content below never renders without the key.
  const expected = process.env.BUILDERS_PASSWORD || "lovedev";
  const jar = await cookies();
  if (jar.get("builders_key")?.value !== expected) return <Gate />;

  return (
    <div className="px-5 md:px-10 pb-24">
      <section className="pt-[5svh] md:pt-[7svh] pb-12 md:pb-16">
        <p className="mono-label text-pink mb-6">Private index</p>
        <h1 className="home-display-sm max-w-[20ch]">Builder demos &amp; outreach</h1>
        <p className="text-ink-soft mt-6 max-w-[62ch]" style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)", lineHeight: 1.5 }}>
          Every demo and pitch page, plus the round-two kit: who actually runs each company, their
          verified emails and LinkedIn profiles, the architects and photographers behind their builds,
          the freshest hooks, and ready-to-send warm messages (expand each to read or copy). Emails
          listed are published addresses only, nothing guessed; research checked against live sources
          on 5 July 2026. Noindex, unlinked, password-gated.
        </p>
      </section>

      <section className="home-section py-10 md:py-14">
        <p className="mono-label text-ink-soft mb-8">The batch · 7</p>
        <div className="flex flex-col gap-10">
          {BATCH.map((b) => (
            <Row key={b.pitch} b={b} />
          ))}
        </div>
      </section>

      <section className="home-section py-10 md:py-14">
        <p className="mono-label text-ink-soft mb-8">Earlier · 4</p>
        <div className="flex flex-col gap-10">
          {EARLIER.map((b) => (
            <Row key={b.pitch} b={b} />
          ))}
        </div>
      </section>
    </div>
  );
}
