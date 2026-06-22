import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import MaskReveal from "@/components/MaskReveal";
import ContactCta from "@/components/ContactCta";

// Private pitch page for Lindon Homes. Reachable by URL, kept out of the index,
// the sitemap and the public nav — it's something Finbar sends, not something
// people find.
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
    note: 'Ranked second for "luxury home builders brisbane" and the terms around it. You’re already winning the hard part.',
  },
  {
    value: "84%",
    label: "On a phone",
    note: "Most of your visitors arrive on mobile, on a site that wasn’t built for phones first.",
  },
  {
    value: "26s",
    label: "Then gone",
    note: "Average time on the site, at 1.5 pages a visit. People land, glance, and leave before the homes get a chance.",
  },
];

const OFFERINGS = [
  {
    title: "Web design & build",
    body: "A site designed by a creative, not pulled from a template. Built well, and built for phones.",
  },
  {
    title: "Headless CMS",
    body: "You run your own content. Change homes, photos and words yourselves, no code required.",
  },
  {
    title: "SEO",
    body: "A full audit, and the work to act on it. With the codebase in my hands, fixes go live fast.",
  },
  {
    title: "Brand & logo",
    body: "A sharper mark and a tighter identity. As much or as little as you want.",
  },
];

export default function LindonPage() {
  return (
    <div className="px-5 md:px-10 pb-10">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="pt-[11svh] md:pt-[15svh] pb-20 md:pb-28" aria-label="Introduction">
        <Reveal as="p" immediate className="mono-label text-pink mb-6">
          A note for Lindon Homes
        </Reveal>
        <MaskReveal as="h1" className="home-display max-w-[18ch]">
          Lindon builds some of Brisbane&rsquo;s finest homes. Let&rsquo;s make the website match.
        </MaskReveal>
        <Reveal as="div" immediate delay={0.5} className="mt-10 max-w-[52ch]">
          <p className="text-ink-soft" style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.35rem)", lineHeight: 1.5 }}>
            I&rsquo;m Finbar, a Brisbane designer. I built this page, and a working demo of your
            site, to show you what that could look like.
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
        <h2 className="home-display-sm mb-6 max-w-[20ch]">The homes are premium. The website hasn&rsquo;t caught up.</h2>
        <p className="text-ink max-w-[58ch]" style={{ fontSize: "clamp(1.1rem, 1.7vw, 1.5rem)", lineHeight: 1.5 }}>
          I went looking at Brisbane&rsquo;s best builders and your work stood out straight away.
          Custom design, hard sites, thirty years of it. The website doesn&rsquo;t do any of that
          justice. It leans on award badges and paragraphs where it should be showing the houses.
          For a luxury builder that&rsquo;s backwards. The work should sell itself the moment someone
          lands.
        </p>
      </Reveal>

      {/* ── 02 · The numbers ──────────────────────────────────── */}
      <Reveal as="section" section className="home-section" aria-label="What I noticed">
        <p className="mono-label text-ink-soft mb-4">02 / What I noticed</p>
        <h2 className="home-display-sm mb-6 max-w-[22ch]">You&rsquo;ve earned the attention. The site isn&rsquo;t holding it.</h2>
        <p className="text-ink-soft mb-12 max-w-[52ch]" style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.3rem)", lineHeight: 1.5 }}>
          I pulled your search and traffic numbers. They tell a pretty clear story.
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
        <p className="text-ink mt-12 max-w-[48ch]" style={{ fontSize: "clamp(1.2rem, 2vw, 1.7rem)", lineHeight: 1.4 }}>
          You&rsquo;re spending reputation and ranking to get people to the door. The site is where
          that spend leaks away.
        </p>
      </Reveal>

      {/* ── 03 · The demo (centrepiece) ───────────────────────── */}
      <Reveal as="section" section className="home-section" aria-label="The demo">
        <p className="mono-label text-ink-soft mb-4">03 / So I built you something</p>
        <h2 className="home-display-sm mb-6 max-w-[22ch]">A working demo, designed around your homes.</h2>
        <p className="text-ink max-w-[58ch]" style={{ fontSize: "clamp(1.1rem, 1.7vw, 1.45rem)", lineHeight: 1.5 }}>
          Three pages to show where it could go. A home page that opens on the architecture instead
          of badges, a gallery made for actually browsing the portfolio, and a contact page that
          makes getting in touch feel easy. It&rsquo;s properly built, animated, and designed for
          phones first. It also runs headless, on a content system your team controls, so you can
          change homes, photos and words yourselves without calling a developer.
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
            It&rsquo;s best on a phone. Open it there and watch it move, or have a look on desktop.
          </p>
        </div>
      </Reveal>

      {/* ── 04 · The logo ─────────────────────────────────────── */}
      <Reveal as="section" section className="home-section" aria-label="The logo">
        <p className="mono-label text-ink-soft mb-4">04 / A taste of more</p>
        <h2 className="home-display-sm mb-6 max-w-[18ch]">I also reworked your logo.</h2>
        <p className="text-ink max-w-[58ch]" style={{ fontSize: "clamp(1.1rem, 1.7vw, 1.45rem)", lineHeight: 1.5 }}>
          This wasn&rsquo;t the main job, but your current mark sells the brand short, so I drew up a
          new version to show the idea. You&rsquo;ll see it through the demo. A rebrand isn&rsquo;t
          essential, but the brand would thank you for it, and it&rsquo;s something I&rsquo;d love to
          get into with you.
        </p>
      </Reveal>

      {/* ── 05 · What I can do ────────────────────────────────── */}
      <Reveal as="section" section className="home-section" aria-label="How I can help">
        <p className="mono-label text-ink-soft mb-4">05 / How I can help</p>
        <h2 className="home-display-sm mb-10 max-w-[22ch]">Design, build, and everything around it.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
          {OFFERINGS.map((o) => (
            <div key={o.title} className="border-t border-line pt-5">
              <h3 className="mono-heading text-ink mb-3">{o.title}</h3>
              <p className="text-ink-soft" style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)", lineHeight: 1.5 }}>{o.body}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ── 06 · Let's talk ───────────────────────────────────── */}
      <Reveal as="section" section className="home-section no-rule" aria-label="Let's talk">
        <div className="py-10 md:py-20 text-center flex flex-col items-center">
          <MaskReveal as="h2" className="home-display max-w-[16ch]">
            Let&rsquo;s have a conversation.
          </MaskReveal>
          <p className="text-ink-soft mt-8 max-w-[46ch]" style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.3rem)", lineHeight: 1.5 }}>
            No deck, no pressure. Have a look at the demo, and if it lands, let&rsquo;s talk about
            your homes and what a site worth them looks like.
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
