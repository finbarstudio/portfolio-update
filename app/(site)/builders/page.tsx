import type { Metadata } from "next";
import EmailBlock from "./EmailBlock";

// Private index of every builder demo + pitch — for Finbar's own navigation.
// Reachable by URL only: noindex, not in the sitemap, not linked from the nav.
export const metadata: Metadata = {
  title: { absolute: "Builders · index" },
  description: "Private index of the builder demo sites and pitch pages.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

type Page = { label: string; href: string };
type Email = { to: string; subject: string; body: string };
type Builder = {
  name: string;
  meta: string;
  pitch: string;
  pages: Page[];
  email?: Email;
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
    email: {
      to: "info@foundationhomes.com.au (attn. Edward Murphy)",
      subject: "Your homes vs your website",
      body: `Hi Edward,

I'm Finbar, a designer based in Brisbane. I came across Foundation Homes while looking at the best custom builders on the Sunshine Coast, and the work genuinely stopped me. Amani Palace, the Doonan and Noosa homes, six Master Builders wins including a Queensland Custom Home of the Year.

Then I opened the website. It still reads 2019 and runs on an old template, and it just doesn't do the homes justice. So rather than send you a pitch, I rebuilt it.

I put together a short page explaining what I noticed, with a working demo of your site, home, projects and about, all custom built around your own photography:

finbar.studio/foundation-homes

No pressure and nothing to sign. Have a click through on a desktop when you get a minute, and if it feels right I'd love to have a chat.

Cheers,
Finbar
finbar.studio`,
    },
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
    email: {
      to: "admin@resolveconstruction.net.au (attn. Billy Thomas)",
      subject: "Your homes vs your website",
      body: `Hi Billy,

I'm Finbar, a designer based in Brisbane. I came across Resolve while looking at the best builders on the Gold Coast, and the work genuinely stopped me. Neu Burleigh, Villa Franco, the Lowry Farmhouse, eleven Master Builders wins with five in 2025 alone.

Then I opened the website. It's built like it's still 2014, and it just doesn't do the homes justice. So rather than send you a pitch, I rebuilt it.

I put together a short page explaining what I noticed, with a working demo of your site, home, projects and about, all custom built around your own photography:

finbar.studio/resolve-construction

No pressure and nothing to sign. Have a click through on a desktop when you get a minute, and if it feels right I'd love to have a chat.

Cheers,
Finbar
finbar.studio`,
    },
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
    email: {
      to: "enquiries@rosshogno.com.au (attn. Ross Hogno)",
      subject: "Your homes vs your website",
      body: `Hi Ross,

I'm Finbar, a designer based in Brisbane. I came across Ross Hogno Constructions while looking at the best builders on the Darling Downs, and the work genuinely stopped me. Twenty years of custom homes, eleven Master Builders awards, the Highfields sloping-site home.

Then I opened the website. It's an old slider template now, and it just doesn't do the homes justice. So rather than send you a pitch, I rebuilt it.

I put together a short page explaining what I noticed, with a working demo of your site, home, projects and about, all custom built around your own photography:

finbar.studio/ross-hogno

No pressure and nothing to sign. Have a click through on a desktop when you get a minute, and if it feels right I'd love to have a chat.

Cheers,
Finbar
finbar.studio`,
    },
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
    email: {
      to: "admin@drphomes.com.au (attn. David & Natasha Radic)",
      subject: "Your homes vs your website",
      body: `Hi David and Natasha,

I'm Finbar, a designer based in Brisbane. I came across David Radic Prestige Homes while looking at the best builders on the Gold Coast, and the work genuinely stopped me. The Buccaneer Residence, the Hope Island and Broadbeach waterfronts, an HIA finalist over two million.

Then I opened the website. It's from around 2016 now, and it just doesn't do the homes justice. So rather than send you a pitch, I rebuilt it.

I put together a short page explaining what I noticed, with a working demo of your site, home, our homes and about, all custom built around your own photography:

finbar.studio/david-radic

No pressure and nothing to sign. Have a click through on a desktop when you get a minute, and if it feels right I'd love to have a chat.

Cheers,
Finbar
finbar.studio`,
    },
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
    email: {
      to: "info@gtobuilding.com.au (attn. Gaston Ottl)",
      subject: "Your homes vs your website",
      body: `Hi Gaston,

I'm Finbar, a designer based in Brisbane. I came across GTO Building while looking at the best builders on the Sunshine Coast, and the work genuinely stopped me. Panorama House, the Tristania beach house, your work with Bark and the string of Master Builders wins.

Then I opened the website. It's a Wix template now, and it just doesn't do the homes justice. So rather than send you a pitch, I rebuilt it.

I put together a short page explaining what I noticed, with a working demo of your site, home, projects and about, all custom built around your own photography (and your GTO mark, which I really like):

finbar.studio/gto-building

No pressure and nothing to sign. Have a click through on a desktop when you get a minute, and if it feels right I'd love to have a chat.

Cheers,
Finbar
finbar.studio`,
    },
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
    email: {
      to: "info@hmdevelopments.com.au (attn. McLean Henzell)",
      subject: "Your developments vs your website",
      body: `Hi McLean,

I'm Finbar, a designer based in Brisbane. I came across HM Developments while looking at who's shaping the Sunshine Coast, and the work genuinely stopped me. The Cove at Pelican Waters, the sold-out terraces, the Caloundra projects in the pipeline.

Then I opened the website. The footer still reads 2020 and the story's split across two sites, so it just doesn't do the work justice. Rather than send you a pitch, I rebuilt it.

I put together a short page explaining what I noticed, with a working demo of your site, home, projects and about, all custom built around your 2024 photography and your existing HM brand:

finbar.studio/hm-developments

No pressure and nothing to sign. Have a click through on a desktop when you get a minute, and if it feels right I'd love to have a chat.

Cheers,
Finbar
finbar.studio`,
    },
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
    email: {
      to: "info@mbcprestige.com.au (attn. David Conolly / Sam Walker)",
      subject: "Your developments vs your website",
      body: `Hi there,

I'm Finbar, a designer based in Brisbane. I came across MBC Prestige while looking at who's shaping Noosa, and the work genuinely stopped me. Forty years on the coast, the Kalani riverfront residences, the whole-floor Sunshine Beach apartments.

Then I opened the website. It's a 2015 build now, with most of the detail trapped in PDFs, so it just doesn't do the developments justice. Rather than send you a pitch, I rebuilt it.

I put together a short page explaining what I noticed, with a working demo of your site, home, projects and about, all custom built around your own photography and your existing MBC brand:

finbar.studio/mbc-prestige

No pressure and nothing to sign. Have a click through on a desktop when you get a minute, and if it feels right I'd love to have a chat.

Cheers,
Finbar
finbar.studio`,
    },
  },
  {
    name: "BPPD",
    meta: "Brisbane · developer (thin content)",
    pitch: "/bppd",
    pages: [
      { label: "Home", href: "/bppd/site" },
      { label: "About", href: "/bppd/site/about" },
    ],
    email: {
      to: "john@bppd.com.au (attn. John Samios)",
      subject: "Your track record vs your website",
      body: `Hi John,

I'm Finbar, a designer based in Brisbane. I came across Brisbane Prestige Property Developments while looking at the city's prestige developers, and the story stood out, forty years across complex, de-risked projects and joint ventures most people won't touch.

Then I opened the website. It's a single-page free WordPress template with none of that work shown, so it really doesn't carry the reputation. Rather than send you a pitch, I rebuilt the front of it.

I put together a short page explaining what I noticed, with a working demo, home and about, led by your story and your "unity is strength" philosophy. The obvious next step is a proper project portfolio, which is where most of the lift would be, and something we'd put together:

finbar.studio/bppd

No pressure and nothing to sign. Have a click through on a desktop when you get a minute, and if it feels right I'd love to have a chat.

Cheers,
Finbar
finbar.studio`,
    },
  },
];

// Earlier demos, for completeness.
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
  },
];

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
      {b.email && (
        <div className="md:ml-[41.6667%] md:pl-8">
          <EmailBlock to={b.email.to} subject={b.email.subject} body={b.email.body} />
        </div>
      )}
    </div>
  );
}

export default function BuildersIndexPage() {
  return (
    <div className="px-5 md:px-10 pb-24">
      <section className="pt-[5svh] md:pt-[7svh] pb-12 md:pb-16">
        <p className="mono-label text-pink mb-6">Private index</p>
        <h1 className="home-display-sm max-w-[20ch]">Builder demos &amp; pitches</h1>
        <p className="text-ink-soft mt-6 max-w-[60ch]" style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)", lineHeight: 1.5 }}>
          Quick links to every redesign demo and its pitch page, plus the outreach email for each
          (expand &ldquo;Email&rdquo; to read or copy it). Just for your reference, this page is noindex
          and isn&rsquo;t linked anywhere public. Demos open best on desktop.
        </p>
      </section>

      <section className="home-section py-10 md:py-14">
        <p className="mono-label text-ink-soft mb-8">The batch · 8</p>
        <div className="flex flex-col gap-7">
          {BATCH.map((b) => (
            <Row key={b.pitch} b={b} />
          ))}
        </div>
      </section>

      <section className="home-section py-10 md:py-14">
        <p className="mono-label text-ink-soft mb-8">Earlier · 4</p>
        <div className="flex flex-col gap-7">
          {EARLIER.map((b) => (
            <Row key={b.pitch} b={b} />
          ))}
        </div>
      </section>
    </div>
  );
}
