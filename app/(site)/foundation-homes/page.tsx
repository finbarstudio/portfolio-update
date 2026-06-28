import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import MaskReveal from "@/components/MaskReveal";
import ContactCta from "@/components/ContactCta";

// Private pitch page for Foundation Homes. Reachable by URL, kept out of the
// index, the sitemap and the public nav — something Finbar sends, not something
// people find.
export const metadata: Metadata = {
  title: { absolute: "For Foundation Homes · Finbar Studio" },
  description:
    "A note and a working demo for Foundation Homes, from Brisbane designer Finbar Skitini.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

const DEMO_HREF = "/foundation-homes/site";

const STATS = [
  {
    value: "6",
    label: "Awards, barely shown",
    note: "Six Master Builders wins, including the 2017 Queensland Custom Home of the Year. You'd never know it from the homepage.",
  },
  {
    value: "2019",
    label: "Frozen since",
    note: "The site still reads © 2019 and runs on a 2015-era template, with some images served over an insecure connection. The homes have moved on a long way since.",
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

export default function FoundationPitchPage() {
  return (
    <div className="px-5 md:px-10 pb-10">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="pt-[5svh] md:pt-[7svh] pb-16 md:pb-24" aria-label="Introduction">
        <Reveal as="p" immediate className="mono-label text-pink mb-6">
          For Foundation Homes
        </Reveal>
        <MaskReveal as="h1" className="home-display">
          Foundation builds some of the coast&rsquo;s best homes. The website hides them.
        </MaskReveal>
        <Reveal as="div" immediate delay={0.5} className="mt-10 max-w-[62ch]">
          <p className="text-ink-soft" style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.35rem)", lineHeight: 1.5 }}>
            I&rsquo;m Finbar, a Brisbane designer. I built this page, and a working demo of your site,
            because I reckon your work deserves far better online, and I&rsquo;d rather show you than
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

      {/* ── Why I reached out ─────────────────────────────────── */}
      <Reveal as="section" section className="home-section py-24 md:py-36 grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-5" aria-label="Why I reached out">
        <div className="md:col-span-5">
          <h2 className="home-display-sm">The homes are award-winning. The site is from 2019.</h2>
        </div>
        <div className="md:col-span-7">
          <p className="text-ink" style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.35rem)", lineHeight: 1.55 }}>
            I went looking at the best builders on the Sunshine Coast and Foundation kept stopping me.
            Custom, design-led, six Master Builders wins including Queensland Custom Home of the Year.
            Then I opened the website and felt the drop. It still reads 2019, runs on an old template,
            and leans on an orange that isn&rsquo;t really yours. For homes at this level that&rsquo;s
            backwards. People should fall for the work the second they land.
          </p>
        </div>
      </Reveal>

      {/* ── The numbers ───────────────────────────────────────── */}
      <Reveal as="section" section className="home-section py-24 md:py-36" aria-label="What I noticed">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-4 mb-12">
          <div className="md:col-span-5">
            <h2 className="home-display-sm">You&rsquo;ve already done the hard part. The site gives it back.</h2>
          </div>
          <div className="md:col-span-7 flex md:items-end">
            <p className="text-ink-soft" style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.3rem)", lineHeight: 1.5 }}>
              A quick look at what&rsquo;s holding it back.
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
              You&rsquo;re winning the awards and the referrals. The website is where that momentum
              leaks out the back.
            </p>
          </div>
          <div className="md:col-span-4 flex md:items-center">
            <p className="text-ink-soft" style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>
              And most people land on a phone, so when we build the real thing, mobile gets designed
              properly rather than bolted on at the end.
            </p>
          </div>
        </div>
      </Reveal>

      {/* ── The demo ──────────────────────────────────────────── */}
      <Reveal as="section" section className="home-section py-24 md:py-36 grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-5" aria-label="The demo">
        <div className="md:col-span-5">
          <h2 className="home-display-sm">A working demo, built around your homes.</h2>
        </div>
        <div className="md:col-span-7">
          <p className="text-ink" style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.35rem)", lineHeight: 1.55 }}>
            Three pages, enough to show the direction. A home page that opens on the architecture, a
            projects gallery you can get lost scrolling, and an about page with room for the design-led
            story. Every line is written from scratch, custom code, no template. That&rsquo;s the
            point, because it means the site bends whichever way we want it to. This is one version. A
            builder like you could go a dozen directions.
          </p>
          <div className="lindon-demo-card mt-8">
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="tag tag-default">Home</span>
              <span className="tag tag-default">Projects</span>
              <span className="tag tag-default">About</span>
            </div>
            <Link href={DEMO_HREF} className="lindon-cta lindon-cta-pink">
              View the live demo &rarr;
            </Link>
            <p className="text-ink-soft mt-5" style={{ fontSize: "0.95rem", lineHeight: 1.5 }}>
              It&rsquo;s a responsive build that reflows to fit whatever screen it&rsquo;s on, though
              it&rsquo;s at its best on desktop, so open it there and have a click around. The full nav
              is there, but only Home, Projects and About are built so far, so those are the links that
              work. It&rsquo;s a first draft to show the uplift, with the real refinement to come.
            </p>
          </div>
        </div>
      </Reveal>

      {/* ── What I see in it ──────────────────────────────────── */}
      <Reveal as="section" section className="home-section py-24 md:py-36" aria-label="What I see in it">
        <h2 className="home-display-sm mb-10 max-w-[20ch]">Honestly, I&rsquo;m excited about this one.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
          <div className="border-t border-line pt-5">
            <h3 className="mono-heading text-ink mb-3">The story</h3>
            <p className="text-ink-soft" style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)", lineHeight: 1.55 }}>
              You&rsquo;ve got beautiful photography and a genuine point of difference, the design-led,
              architect-collaboration approach. That&rsquo;s the kind of thing you weave through a whole
              site, not bury on an about page. I can already picture it, and I&rsquo;d love the chance to
              tell it properly.
            </p>
          </div>
          <div className="border-t border-line pt-5">
            <h3 className="mono-heading text-ink mb-3">The logo</h3>
            <p className="text-ink-soft" style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)", lineHeight: 1.55 }}>
              I&rsquo;ve kept your mark on the demo so it still feels like you, but it&rsquo;s a low-res
              file that could be redrawn crisp and sharp. A rebrand isn&rsquo;t essential, but the brand
              would thank you for it, and it&rsquo;s the kind of work I love.
            </p>
          </div>
        </div>
      </Reveal>

      {/* ── How I can help ────────────────────────────────────── */}
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
