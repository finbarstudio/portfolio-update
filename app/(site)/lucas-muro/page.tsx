import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import MaskReveal from "@/components/MaskReveal";
import ContactCta from "@/components/ContactCta";

// Private pitch page for Lucas Muro. Reachable by URL, kept out of the index,
// the sitemap and the public nav — something Finbar sends, not something
// people find.
export const metadata: Metadata = {
  title: { absolute: "For Lucas Muro · Finbar Studio" },
  description:
    "A note and a working demo for Lucas Muro, architectural photographer, from Brisbane designer Finbar Skitini.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

const DEMO_HREF = "/lucas-muro/site";

const STATS = [
  {
    value: "© 2004",
    label: "The footer hasn't changed since",
    note: "Neither has much else. The sitemap says nothing on the site has been touched since September 2022, and the galleries under 'Latest Work' are years old. The shoots kept coming; the site stopped keeping up.",
  },
  {
    value: "0",
    label: "Pages about Lucas",
    note: "No about page, no bio, no credits. Gallery captions show raw filenames like _MG_5164.jpg, and most pages carry hidden keyword-stuffing text, the kind of thing Google now penalises rather than rewards.",
  },
];

const OFFERINGS = [
  {
    title: "Web design & build",
    body: "A site designed by someone who cares, written in custom code, that works as well on a phone as it does on a desktop.",
  },
  {
    title: "Headless CMS",
    body: "You run your own galleries. Add a shoot the week you deliver it, no developer, no waiting.",
  },
  {
    title: "SEO",
    body: "Remove the hidden keyword-stuffing blocks before Google does it for you. One meta description is currently shared by every page; each should have its own.",
  },
  {
    title: "Image pipeline",
    body: "Retina-grade delivery of your frames, sized and served properly. The current site caps everything at 1500px, and your work deserves better than that.",
  },
];

export default function LucasMuroPitchPage() {
  return (
    <div className="px-5 md:px-10 pb-10">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="pt-[5svh] md:pt-[7svh] pb-16 md:pb-24" aria-label="Introduction">
        <Reveal as="p" immediate className="mono-label text-pink mb-6">
          For Lucas Muro
        </Reveal>
        <MaskReveal as="h1" className="home-display">
          Lucas shoots the coast&rsquo;s best architecture. His own website is from another decade.
        </MaskReveal>
        <Reveal as="div" immediate delay={0.5} className="mt-10 max-w-[62ch]">
          <p className="text-ink-soft" style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.35rem)", lineHeight: 1.5 }}>
            I&rsquo;m Finbar, a Brisbane designer. I built this page, and a working demo of your site,
            because your work deserves better online, and I&rsquo;d rather show you than just say it.
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
          <h2 className="home-display-sm">The photography sells itself. The website gets in the way.</h2>
        </div>
        <div className="md:col-span-7">
          <p className="text-ink" style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.35rem)", lineHeight: 1.55 }}>
            The client list reads Qantas, Fendi, Nike, Hyatt, and the Sunshine Coast&rsquo;s best
            architects and builders keep coming back shoot after shoot. The frames themselves are
            superb. Then they get poured into a Wix template with default Arial and 1500px images,
            and the quality gap between the work and its container is enormous. For a photographer,
            the website is the product shot. Yours is underexposed.
          </p>
        </div>
      </Reveal>

      {/* ── The numbers ───────────────────────────────────────── */}
      <Reveal as="section" section className="home-section py-24 md:py-36" aria-label="What I noticed">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-4 mb-12">
          <div className="md:col-span-5">
            <h2 className="home-display-sm">The work is current. The website isn&rsquo;t.</h2>
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
              Every shoot you deliver is a moment the site should be ready for, and right now
              it isn&rsquo;t.
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
          <h2 className="home-display-sm">A working demo, built around your frames.</h2>
        </div>
        <div className="md:col-span-7">
          <p className="text-ink" style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.35rem)", lineHeight: 1.55 }}>
            Three pages, enough to show the direction. A home page that opens on the photography, a
            work gallery with your real shoots for Immackulate, Koda, Aboda and Dayne Lawrie, and an
            about page built from your own words, starting with &ldquo;it&rsquo;s all about light,
            shape and texture&rdquo;. Full-bleed images, custom code, no template. This is one
            version. It could go a dozen directions.
          </p>
          <div className="lindon-demo-card mt-8">
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="tag tag-default">Home</span>
              <span className="tag tag-default">Work</span>
              <span className="tag tag-default">About</span>
            </div>
            <Link href={DEMO_HREF} className="lindon-cta lindon-cta-pink">
              View the live demo &rarr;
            </Link>
            <p className="text-ink-soft mt-5" style={{ fontSize: "0.95rem", lineHeight: 1.5 }}>
              It&rsquo;s a responsive build that reflows to fit whatever screen it&rsquo;s on, though
              it&rsquo;s at its best on desktop, so open it there and have a click around. Home,
              Work and About are built so far, so those are the links that work. It&rsquo;s a first
              draft to show the uplift, with the real refinement to come.
            </p>
          </div>
        </div>
      </Reveal>

      {/* ── What I see in it ──────────────────────────────────── */}
      <Reveal as="section" section className="home-section py-24 md:py-36" aria-label="What I see in it">
        <h2 className="home-display-sm mb-10 max-w-[20ch]">Honestly, this one writes itself.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
          <div className="border-t border-line pt-5">
            <h3 className="mono-heading text-ink mb-3">The archive</h3>
            <p className="text-ink-soft" style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)", lineHeight: 1.55 }}>
              There are hundreds of frames across 60-plus galleries on the current site, and they
              deserve a curated, fast, full-bleed treatment instead of a thumbnail wall. Twenty years
              of shoots is an asset most photographers would kill for.
            </p>
          </div>
          <div className="border-t border-line pt-5">
            <h3 className="mono-heading text-ink mb-3">The client list</h3>
            <p className="text-ink-soft" style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)", lineHeight: 1.55 }}>
              Aboda has come back 7 times, Sprout 6, Dayne Lawrie 5. Repeat clients are the strongest
              proof a photographer has, and the site never mentions it. It should make the next
              architect who lands on it feel late to the party.
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
            And you&rsquo;d deal with me directly. One designer, start to finish, who oversees all
            his own post. Sound familiar?
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
            touch and we&rsquo;ll talk about the site your archive deserves.
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
