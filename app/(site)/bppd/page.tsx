import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import MaskReveal from "@/components/MaskReveal";
import ContactCta from "@/components/ContactCta";

// Private pitch page for BPPD. Reachable by URL, kept out of the index, the
// sitemap and the public nav.
export const metadata: Metadata = {
  title: { absolute: "For BPPD · Finbar Studio" },
  description:
    "A note and a working demo for Brisbane Prestige Property Developments, from Brisbane designer Finbar Skitini.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

const DEMO_HREF = "/bppd/site";

const STATS = [
  {
    value: "1 page",
    label: "A free template",
    note: "The whole company sits on a single-page free WordPress theme from around 2017, with no portfolio and no project pages.",
  },
  {
    value: "0",
    label: "Projects shown",
    note: "Forty years of work and decades of developments, and not one of them is shown on the site. For a blue-chip developer, that's the real gap.",
  },
];

const OFFERINGS = [
  {
    title: "Web design & build",
    body: "A site designed by someone who cares, written in custom code, that works as well on a phone as it does on a desktop.",
  },
  {
    title: "Headless CMS",
    body: "You run your own content. Add a project, swap photos and words yourself, no developer, no waiting.",
  },
  {
    title: "SEO",
    body: "A proper audit and the work to back it. With the code in my hands, fixes go live the same day.",
  },
  {
    title: "Brand & logo",
    body: "A sharper mark and a tighter identity built for the prestige end of the market, as much or as little as you want.",
  },
];

export default function BppdPitchPage() {
  return (
    <div className="px-5 md:px-10 pb-10">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="pt-[5svh] md:pt-[7svh] pb-16 md:pb-24" aria-label="Introduction">
        <Reveal as="p" immediate className="mono-label text-pink mb-6">
          For Brisbane Prestige Property Developments
        </Reveal>
        <MaskReveal as="h1" className="home-display">
          Forty years of work. None of it is on the website.
        </MaskReveal>
        <Reveal as="div" immediate delay={0.5} className="mt-10 max-w-[62ch]">
          <p className="text-ink-soft" style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.35rem)", lineHeight: 1.5 }}>
            I&rsquo;m Finbar, a Brisbane designer. I built this page, and a working demo of your site,
            because I reckon a developer at your level deserves far better online, and I&rsquo;d rather
            show you than just say it.
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
          <h2 className="home-display-sm">The positioning is blue-chip. The site is a free theme.</h2>
        </div>
        <div className="md:col-span-7">
          <p className="text-ink" style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.35rem)", lineHeight: 1.55 }}>
            I went looking at Brisbane&rsquo;s prestige developers and BPPD&rsquo;s story stood out.
            Forty years across complex, de-risked projects, joint ventures, the hard regulatory work
            most won&rsquo;t touch. Then I opened the website and felt the drop. It&rsquo;s a single-page
            free WordPress template with no portfolio at all. For a developer at your level that&rsquo;s
            backwards. The work, and the trust behind it, should be front and centre.
          </p>
        </div>
      </Reveal>

      {/* ── The numbers ───────────────────────────────────────── */}
      <Reveal as="section" section className="home-section py-24 md:py-36" aria-label="What I noticed">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-4 mb-12">
          <div className="md:col-span-5">
            <h2 className="home-display-sm">You&rsquo;ve built the reputation. The site doesn&rsquo;t carry it.</h2>
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
              <p className="text-pink font-mono leading-none" style={{ fontSize: "clamp(2.6rem, 5.6vw, 4.2rem)" }}>
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
              You win work on relationships and a track record. The website is the one place that
              track record is invisible.
            </p>
          </div>
          <div className="md:col-span-4 flex md:items-center">
            <p className="text-ink-soft" style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>
              And investors do their first diligence on a phone, so when we build the real thing, mobile
              gets designed properly rather than bolted on at the end.
            </p>
          </div>
        </div>
      </Reveal>

      {/* ── The demo ──────────────────────────────────────────── */}
      <Reveal as="section" section className="home-section py-24 md:py-36 grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-5" aria-label="The demo">
        <div className="md:col-span-5">
          <h2 className="home-display-sm">A working demo, built around your story.</h2>
        </div>
        <div className="md:col-span-7">
          <p className="text-ink" style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.35rem)", lineHeight: 1.55 }}>
            Because there&rsquo;s no project content to draw on yet, I&rsquo;ve led the demo with the
            company itself, a home page that opens on the city you build in, your &ldquo;unity is
            strength&rdquo; philosophy and what you actually do, and an about page for the team and the
            track record. Every line is custom code, no template. The obvious next step we&rsquo;d do
            together is a proper project portfolio, which is where most of the lift is.
          </p>
          <div className="lindon-demo-card mt-8">
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="tag tag-default">Home</span>
              <span className="tag tag-default">About</span>
              <span className="tag tag-default">Projects (to build)</span>
            </div>
            <Link href={DEMO_HREF} className="lindon-cta lindon-cta-pink">
              View the live demo &rarr;
            </Link>
            <p className="text-ink-soft mt-5" style={{ fontSize: "0.95rem", lineHeight: 1.5 }}>
              It&rsquo;s a responsive build that reflows to fit whatever screen it&rsquo;s on, though
              it&rsquo;s at its best on desktop, so open it there and have a click around. Home and About
              are built; a projects section is the natural next piece once we pull your developments
              together. It&rsquo;s a first draft to show the direction.
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
              The complex, de-risked, relationships-first way you work is a genuinely strong story, and
              right now it&rsquo;s a wall of text. Paired with a real portfolio of what you&rsquo;ve
              delivered, it becomes the reason an investor picks up the phone. I&rsquo;d love to build
              that with you.
            </p>
          </div>
          <div className="border-t border-line pt-5">
            <h3 className="mono-heading text-ink mb-3">The logo</h3>
            <p className="text-ink-soft" style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)", lineHeight: 1.55 }}>
              Your current mark is a small, dated image that only works on a dark panel. A crisp,
              modern wordmark would lift the whole brand into the prestige bracket it&rsquo;s aiming for,
              and it&rsquo;s the kind of work I love.
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
            touch and we&rsquo;ll talk about your developments and the site they deserve.
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
