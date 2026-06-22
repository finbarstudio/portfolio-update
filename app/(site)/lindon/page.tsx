import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import MaskReveal from "@/components/MaskReveal";
import ContactCta from "@/components/ContactCta";

// Private pitch page for Lindon Homes. Reachable by URL, kept out of the index,
// the sitemap and the public nav — it's something Finbar sends, not something
// people find. Built mobile-first on purpose: ~80% of Lindon's traffic is phone.
export const metadata: Metadata = {
  title: { absolute: "For Lindon Homes — Finbar Studio" },
  description: "A note and a working demo for Lindon Homes, from Brisbane designer Finbar Skitini.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

const DEMO_HREF = "/lindon/site";

const STATS = [
  {
    value: "#2",
    label: "On Google",
    note: 'You rank second for "luxury home builders brisbane" and the terms around it. Most builders would kill for that.',
  },
  {
    value: "80%",
    label: "On a phone",
    note: "Four out of five people reach you on mobile. The current site wasn’t built phone-first, and on a phone that really shows.",
  },
  {
    value: "26s",
    label: "Then gone",
    note: "The average visit lasts twenty-six seconds, at one and a half pages. People arrive, glance, and leave before a single home lands.",
  },
];

const OFFERINGS = [
  {
    title: "Web design & build",
    body: "A site designed by someone who cares, written in custom code, built phone-first.",
  },
  {
    title: "Headless CMS",
    body: "You run your own content. Swap homes, photos and words yourself, no developer, no waiting.",
  },
  {
    title: "SEO",
    body: "A proper audit and the work to back it. With the code in my hands, fixes go live the same day.",
  },
  {
    title: "Brand & logo",
    body: "A sharper mark and a tighter identity, as much or as little as you want.",
  },
];

export default function LindonPage() {
  return (
    <div className="px-5 md:px-10 pb-10">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="pt-[5svh] md:pt-[7svh] pb-16 md:pb-24" aria-label="Introduction">
        <Reveal as="p" immediate className="mono-label text-pink mb-6">
          For Lindon Homes
        </Reveal>
        <MaskReveal as="h1" className="home-display">
          Lindon builds beautiful homes. The website doesn&rsquo;t do them justice yet.
        </MaskReveal>
        <Reveal as="div" immediate delay={0.5} className="mt-10 max-w-[62ch]">
          <p className="text-ink-soft" style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.35rem)", lineHeight: 1.5 }}>
            I&rsquo;m Finbar, a Brisbane designer. I built this page, and a quick demo of your site,
            because I think your work deserves far better online, and I&rsquo;d rather show you than
            just say it.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href={DEMO_HREF} className="lindon-cta lindon-cta-pink">
              See the demo &rarr;
            </Link>
            <ContactCta className="lindon-cta lindon-cta-ghost">Talk to me</ContactCta>
          </div>
        </Reveal>
      </section>

      {/* ── 01 · Why I reached out ────────────────────────────── */}
      <Reveal as="section" section className="home-section" aria-label="Why I reached out">
        <p className="mono-label text-ink-soft mb-4">01 / Why I reached out</p>
        <h2 className="home-display-sm mb-6 max-w-[24ch]">The homes are premium. The site isn&rsquo;t.</h2>
        <p className="text-ink max-w-[62ch]" style={{ fontSize: "clamp(1.1rem, 1.7vw, 1.5rem)", lineHeight: 1.5 }}>
          I went looking at the best builders in Brisbane and Lindon kept pulling me back. Custom
          design, the hard sloping blocks nobody else wants, thirty years of it. Then I opened the
          website and felt the drop. It&rsquo;s all award badges and blocks of text where it should
          be the homes filling the screen. For a builder at your level that&rsquo;s backwards. People
          should fall for the work the second they land.
        </p>
      </Reveal>

      {/* ── 02 · The numbers ──────────────────────────────────── */}
      <Reveal as="section" section className="home-section" aria-label="What I noticed">
        <p className="mono-label text-ink-soft mb-4">02 / What I noticed</p>
        <h2 className="home-display-sm mb-6 max-w-[24ch]">You&rsquo;ve already won the hard part. The site gives it back.</h2>
        <p className="text-ink-soft mb-12 max-w-[56ch]" style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.3rem)", lineHeight: 1.5 }}>
          I dug into your search and traffic first. Here is what stood out.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
          {STATS.map((s) => (
            <div key={s.label} className="border-t border-line pt-5">
              <p className="text-pink font-mono leading-none" style={{ fontSize: "clamp(2.8rem, 6vw, 4.5rem)" }}>
                {s.value}
              </p>
              <p className="mono-label text-ink mt-3 mb-2">{s.label}</p>
              <p className="text-ink-soft" style={{ fontSize: "0.95rem", lineHeight: 1.5 }}>{s.note}</p>
            </div>
          ))}
        </div>

        <div className="lindon-callout mt-12">
          <p style={{ fontSize: "clamp(1.05rem, 1.7vw, 1.35rem)", lineHeight: 1.5 }}>
            Eight in ten of your visitors are on a phone. That can&rsquo;t be an afterthought, so I
            built this page and the demo for the phone first, then the desktop. Open it on yours and
            you&rsquo;ll feel the difference.
          </p>
        </div>

        <p className="text-ink mt-10 max-w-[50ch]" style={{ fontSize: "clamp(1.2rem, 2vw, 1.7rem)", lineHeight: 1.4 }}>
          You&rsquo;re spending real money, in ranking and reputation, to get people through the door.
          The site is where it leaks out the back.
        </p>
      </Reveal>

      {/* ── 03 · The demo (centrepiece) ───────────────────────── */}
      <Reveal as="section" section className="home-section" aria-label="The demo">
        <p className="mono-label text-ink-soft mb-4">03 / So I built you something</p>
        <h2 className="home-display-sm mb-6 max-w-[24ch]">A quick demo, built around your homes.</h2>
        <p className="text-ink max-w-[62ch]" style={{ fontSize: "clamp(1.1rem, 1.7vw, 1.45rem)", lineHeight: 1.5 }}>
          I put together three pages to show the direction. A home page that opens on the
          architecture, a gallery made for actually getting lost in the portfolio, and a contact page
          that makes reaching out feel easy. I wrote every line of it from scratch, custom code, no
          template, and it didn&rsquo;t take long. That matters, because it means the thing bends
          whatever way we want it to. This is only one version. A site like yours could go a dozen
          directions.
        </p>

        <div className="lindon-demo-card mt-10">
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="tag tag-default">Home</span>
            <span className="tag tag-default">Gallery</span>
            <span className="tag tag-default">Contact</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href={DEMO_HREF} className="lindon-cta lindon-cta-pink">
              View the live demo &rarr;
            </Link>
          </div>
          <p className="text-ink-soft mt-5" style={{ fontSize: "0.95rem", lineHeight: 1.5 }}>
            It&rsquo;s built phone-first, so it&rsquo;s best on your phone. Open it there and watch it
            move, or have a look on desktop.
          </p>
        </div>
      </Reveal>

      {/* ── 04 · What I see in it ─────────────────────────────── */}
      <Reveal as="section" section className="home-section" aria-label="What I see in it">
        <p className="mono-label text-ink-soft mb-4">04 / What I see in it</p>
        <h2 className="home-display-sm mb-6 max-w-[20ch]">Honestly, I&rsquo;m excited about this one.</h2>
        <p className="text-ink max-w-[62ch]" style={{ fontSize: "clamp(1.1rem, 1.7vw, 1.45rem)", lineHeight: 1.5 }}>
          You&rsquo;ve got incredible imagery, and a real story sitting right behind it. The family,
          the thirty years, the houses you&rsquo;ve put your name to. That&rsquo;s the kind of thing
          you weave through a whole site, not bury on an about page. I don&rsquo;t get this fired up
          about every project. With yours I can already picture it, and I&rsquo;d love the chance to
          tell it properly.
        </p>
      </Reveal>

      {/* ── 05 · The logo ─────────────────────────────────────── */}
      <Reveal as="section" section className="home-section" aria-label="The logo">
        <p className="mono-label text-ink-soft mb-4">05 / A taste of more</p>
        <h2 className="home-display-sm mb-6 max-w-[20ch]">I also had a go at your logo.</h2>
        <p className="text-ink max-w-[62ch]" style={{ fontSize: "clamp(1.1rem, 1.7vw, 1.45rem)", lineHeight: 1.5 }}>
          This wasn&rsquo;t the main event, but your current mark sells the brand short, so I drew up
          a new one to show the idea. You&rsquo;ll see it across the demo. A rebrand isn&rsquo;t
          essential. The brand would thank you for it though, and it&rsquo;s the kind of work I love
          getting into.
        </p>
      </Reveal>

      {/* ── 06 · What I can do ────────────────────────────────── */}
      <Reveal as="section" section className="home-section" aria-label="How I can help">
        <p className="mono-label text-ink-soft mb-4">06 / How I can help</p>
        <h2 className="home-display-sm mb-10 max-w-[24ch]">What working together looks like.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
          {OFFERINGS.map((o) => (
            <div key={o.title} className="border-t border-line pt-5">
              <h3 className="mono-heading text-ink mb-3">{o.title}</h3>
              <p className="text-ink-soft" style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)", lineHeight: 1.5 }}>{o.body}</p>
            </div>
          ))}
        </div>
        <p className="text-ink mt-12 max-w-[52ch]" style={{ fontSize: "clamp(1.15rem, 1.9vw, 1.6rem)", lineHeight: 1.45 }}>
          And you&rsquo;d deal with me directly. No account managers, no agency layers. One designer
          who&rsquo;s genuinely into your project.
        </p>
      </Reveal>

      {/* ── 07 · Let's talk ───────────────────────────────────── */}
      <Reveal as="section" section className="home-section no-rule" aria-label="Let's talk">
        <div className="py-10 md:py-20 text-center flex flex-col items-center">
          <MaskReveal as="h2" className="home-display max-w-[16ch]">
            Let&rsquo;s have a chat.
          </MaskReveal>
          <p className="text-ink-soft mt-8 max-w-[48ch]" style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.3rem)", lineHeight: 1.5 }}>
            No deck, no hard sell. Have a look at the demo, sit with it, and if it feels right, get in
            touch and we&rsquo;ll talk about your homes and the site they deserve.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <ContactCta className="lindon-cta lindon-cta-pink">Talk to me</ContactCta>
            <Link href={DEMO_HREF} className="lindon-cta lindon-cta-ghost">
              See the demo &rarr;
            </Link>
          </div>
          <p className="mono-label text-ink-soft mt-10">Finbar Skitini · finbar.studio</p>
        </div>
      </Reveal>
    </div>
  );
}
