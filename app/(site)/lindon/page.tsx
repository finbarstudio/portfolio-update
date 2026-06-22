import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import MaskReveal from "@/components/MaskReveal";
import ContactCta from "@/components/ContactCta";

// Private pitch page for Lindon Homes. Reachable by URL, kept out of the index,
// the sitemap and the public nav — it's something Finbar sends, not something
// people find. Editorial two-column sections keep it tight.
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
    value: "26s",
    label: "Then gone",
    note: "The average visit lasts twenty-six seconds, at one and a half pages. People glance and leave before a home lands.",
  },
];

const OFFERINGS = [
  {
    title: "Web design & build",
    body: "A site designed by someone who cares, written in custom code, that works as well on a phone as it does on a desktop.",
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
            I&rsquo;m Finbar, a Brisbane designer. I built this page, and a working demo of your site,
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

      {/* ── 01 · Why I reached out (heading | body) ───────────── */}
      <Reveal as="section" section className="home-section py-24 md:py-36 grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-5" aria-label="Why I reached out">
        <div className="md:col-span-5">
          <h2 className="home-display-sm">The homes are premium. The site isn&rsquo;t.</h2>
        </div>
        <div className="md:col-span-7">
          <p className="text-ink" style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.35rem)", lineHeight: 1.55 }}>
            I went looking at the best builders in Brisbane and Lindon kept pulling me back. Custom
            design, the hard sloping blocks nobody else wants, thirty years of it. Then I opened the
            website and felt the drop. It&rsquo;s all award badges and blocks of text where it should
            be the homes filling the screen. For a builder at your level that&rsquo;s backwards. People
            should fall for the work the second they land.
          </p>
        </div>
      </Reveal>

      {/* ── 02 · The numbers ──────────────────────────────────── */}
      <Reveal as="section" section className="home-section py-24 md:py-36" aria-label="What I noticed">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-4 mb-12">
          <div className="md:col-span-5">
            <h2 className="home-display-sm">You&rsquo;ve already won the hard part. The site gives it back.</h2>
          </div>
          <div className="md:col-span-7 flex md:items-end">
            <p className="text-ink-soft" style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.3rem)", lineHeight: 1.5 }}>
              I dug into your search and traffic first. Here is what stood out.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
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

        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-6 mt-12">
          <div className="md:col-span-8 flex md:items-center">
            <p className="text-ink" style={{ fontSize: "clamp(1.15rem, 1.9vw, 1.6rem)", lineHeight: 1.4 }}>
              You&rsquo;re spending real money, in ranking and reputation, to get people through the
              door. The site is where it leaks out the back.
            </p>
          </div>
          <div className="md:col-span-4 flex md:items-center">
            <p className="text-ink-soft" style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>
              And most of them land on a phone, so when we build the real thing, mobile gets
              designed properly rather than bolted on at the end.
            </p>
          </div>
        </div>
      </Reveal>

      {/* ── 03 · The demo (heading | body + card) ─────────────── */}
      <Reveal as="section" section className="home-section py-24 md:py-36 grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-5" aria-label="The demo">
        <div className="md:col-span-5">
          <h2 className="home-display-sm">A working demo, built around your homes.</h2>
        </div>
        <div className="md:col-span-7">
          <p className="text-ink" style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.35rem)", lineHeight: 1.55 }}>
            Three pages, enough to show the direction. A home page that opens on the architecture, a
            portfolio you can get lost scrolling, and an about page with room for the family story.
            Every line is written from scratch, custom code, no template. That&rsquo;s the point,
            because it means the site bends whichever way we want it to. This is one version. A site
            like yours could go a dozen directions.
          </p>
          <div className="lindon-demo-card mt-8">
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="tag tag-default">Home</span>
              <span className="tag tag-default">Portfolio</span>
              <span className="tag tag-default">About Us</span>
            </div>
            <Link href={DEMO_HREF} className="lindon-cta lindon-cta-pink">
              View the live demo &rarr;
            </Link>
            <p className="text-ink-soft mt-5" style={{ fontSize: "0.95rem", lineHeight: 1.5 }}>
              Open it on desktop and have a click around. The full nav is there, but only Home,
              Portfolio and About Us are built so far, so those are the links that work.
            </p>
          </div>
        </div>
      </Reveal>

      {/* ── 04 · What I see in it (story | logo) ──────────────── */}
      <Reveal as="section" section className="home-section py-24 md:py-36" aria-label="What I see in it">
        <h2 className="home-display-sm mb-10 max-w-[20ch]">Honestly, I&rsquo;m excited about this one.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
          <div className="border-t border-line pt-5">
            <h3 className="mono-heading text-ink mb-3">The story</h3>
            <p className="text-ink-soft" style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)", lineHeight: 1.55 }}>
              You&rsquo;ve got incredible imagery, and a real story sitting right behind it. The
              family, the thirty years, the houses you&rsquo;ve put your name to. That&rsquo;s the
              kind of thing you weave through a whole site, not bury on an about page. I can already
              picture it, and I&rsquo;d love the chance to tell it properly.
            </p>
          </div>
          <div className="border-t border-line pt-5">
            <h3 className="mono-heading text-ink mb-3">The logo</h3>
            <p className="text-ink-soft" style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)", lineHeight: 1.55 }}>
              Your current mark sells the brand short, so I drew up a new one to show the idea.
              You&rsquo;ll see it across the demo. A rebrand isn&rsquo;t essential, but the brand would
              thank you for it, and it&rsquo;s the kind of work I love.
            </p>
          </div>
        </div>
      </Reveal>

      {/* ── 05 · How I can help (heading | grid + value) ──────── */}
      <Reveal as="section" section className="home-section py-24 md:py-36 grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-8" aria-label="How I can help">
        <div className="md:col-span-4">
          <h2 className="home-display-sm">What working together looks like.</h2>
        </div>
        <div className="md:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
            {OFFERINGS.map((o) => (
              <div key={o.title} className="border-t border-line pt-4">
                <h3 className="mono-heading text-ink mb-2">{o.title}</h3>
                <p className="text-ink-soft" style={{ fontSize: "clamp(0.95rem, 1.3vw, 1.15rem)", lineHeight: 1.5 }}>{o.body}</p>
              </div>
            ))}
          </div>
          <p className="text-ink mt-9" style={{ fontSize: "clamp(1.1rem, 1.7vw, 1.45rem)", lineHeight: 1.45 }}>
            And you&rsquo;d deal with me directly. No account managers, no agency layers. One designer
            who&rsquo;s genuinely into your project.
          </p>
        </div>
      </Reveal>

      {/* ── Let's talk ────────────────────────────────────────── */}
      <Reveal as="section" section className="home-section no-rule py-24 md:py-36" aria-label="Let's talk">
        <div className="text-center flex flex-col items-center">
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
