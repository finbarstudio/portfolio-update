import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import MaskReveal from "@/components/MaskReveal";
import ContactCta from "@/components/ContactCta";

// Private pitch page for OJ Pippin Homes (ojpippin.com.au). Same play as
// /lindon: reachable by URL, kept out of the index, the sitemap and the public
// nav — something Finbar sends, not something people find. Reuses the pitch
// CTA / card styles (.lindon-cta / .lindon-demo-card) from the Lindon page.
export const metadata: Metadata = {
  title: { absolute: "For OJ Pippin Homes · Finbar Studio" },
  description:
    "A note and a working demo for OJ Pippin Homes, from Brisbane designer Finbar Skitini.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

const DEMO_HREF = "/oj-pippin/site";

// Their own credentials, used as the stat row (positive framing) before the gap.
const STATS = [
  {
    value: "1994",
    label: "Building since",
    note: "Thirty years of homes across Brisbane, Moreton Bay, Ipswich, Logan and the Redlands. That track record should be the first thing people feel.",
  },
  {
    value: "1,000+",
    label: "Homes built",
    note: "A thousand finished homes is a photo library most builders would envy. Right now the site leans on renders instead.",
  },
  {
    value: "No fine print",
    label: "All-inclusive",
    note: "Your all-inclusive pricing is a genuine differentiator. It deserves to be front and centre, not a line buried in the copy.",
  },
];

const OFFERINGS = [
  {
    title: "Web design & build",
    body: "A site designed by someone who cares, written in custom code, that works as well on a phone as it does on a desktop.",
  },
  {
    title: "Headless CMS",
    body: "You run your own content. Add homes, swap photos and update plans yourself, no developer, no waiting.",
  },
  {
    title: "SEO",
    body: "A proper audit and the work to back it. With the code in my hands, fixes go live the same day.",
  },
  {
    title: "Brand & polish",
    body: "A sharper logo and a tighter identity if you want it, as much or as little as makes sense.",
  },
];

export default function OjPippinPage() {
  return (
    <div className="px-5 md:px-10 pb-10">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="pt-[5svh] md:pt-[7svh] pb-16 md:pb-24" aria-label="Introduction">
        <Reveal as="p" immediate className="mono-label text-pink mb-6">
          For OJ Pippin Homes
        </Reveal>
        <MaskReveal as="h1" className="home-display">
          OJ Pippin has built a thousand homes. The website could show a lot more of them.
        </MaskReveal>
        <Reveal as="div" immediate delay={0.5} className="mt-10 max-w-[62ch]">
          <p className="text-ink-soft" style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.35rem)", lineHeight: 1.5 }}>
            I&rsquo;m Finbar, a Brisbane designer. I built this page, and a working demo of your site,
            because I think there&rsquo;s a sharper, more custom version of it in here, and I&rsquo;d
            rather show you than just say it.
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
          <h2 className="home-display-sm">The homes are strong. The website plays it safe.</h2>
        </div>
        <div className="md:col-span-7">
          <p className="text-ink" style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.35rem)", lineHeight: 1.55 }}>
            I went looking at the best builders around Brisbane and OJ Pippin kept coming up. Thirty
            years, a thousand homes, all-inclusive pricing with no fine print. Then I opened the site.
            It&rsquo;s clean and it works, but it looks like a lot of other builder sites, and it leans
            on renders where it could be showing the real homes you&rsquo;ve put your name to. For a
            builder with your record, it could feel a lot more like one of one.
          </p>
        </div>
      </Reveal>

      {/* ── 02 · What stood out (their credentials as the stat row) ── */}
      <Reveal as="section" section className="home-section py-24 md:py-36" aria-label="What stood out">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-4 mb-12">
          <div className="md:col-span-5">
            <h2 className="home-display-sm">You&rsquo;ve built the reputation. The site can carry more of it.</h2>
          </div>
          <div className="md:col-span-7 flex md:items-end">
            <p className="text-ink-soft" style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.3rem)", lineHeight: 1.5 }}>
              I went through the site the way a homebuyer would. Here is what stood out.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
          {STATS.map((s) => (
            <div key={s.label} className="border-t border-line pt-5">
              <p className="text-pink font-mono leading-none" style={{ fontSize: "clamp(2rem, 4.5vw, 3.4rem)" }}>
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
              A builder with a thousand homes behind them should feel one of one online, not one of
              many. The site does its job today. It could be unmistakably yours.
            </p>
          </div>
          <div className="md:col-span-4 flex md:items-center">
            <p className="text-ink-soft" style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>
              And most people will meet you on a phone first, so mobile gets designed properly from
              the start rather than bolted on at the end.
            </p>
          </div>
        </div>
      </Reveal>

      {/* ── 03 · The demo (heading | body + card) ─────────────── */}
      {/* Demo is still being built; /oj-pippin/site is a placeholder for now. */}
      <Reveal as="section" section className="home-section py-24 md:py-36 grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-5" aria-label="The demo">
        <div className="md:col-span-5">
          <h2 className="home-display-sm">A working demo, built around your homes.</h2>
        </div>
        <div className="md:col-span-7">
          <p className="text-ink" style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.35rem)", lineHeight: 1.55 }}>
            A few pages to show the direction, written from scratch in custom code, no template.
            That&rsquo;s the point, because it means the site can bend whichever way we want it to and
            look like nobody else&rsquo;s. This is one version. A builder like you could go a dozen
            directions.
          </p>
          <div className="lindon-demo-card mt-8">
            <Link href={DEMO_HREF} className="lindon-cta lindon-cta-pink">
              See the demo &rarr;
            </Link>
            <p className="text-ink-soft mt-5" style={{ fontSize: "0.95rem", lineHeight: 1.5 }}>
              It&rsquo;s an early build and still growing, so treat it as a direction rather than the
              finished article. It&rsquo;s a responsive build, but at its best on desktop, so open it
              there and have a click around.
            </p>
          </div>
        </div>
      </Reveal>

      {/* ── 04 · What I see in it (real homes | the range) ────── */}
      <Reveal as="section" section className="home-section py-24 md:py-36" aria-label="What I see in it">
        <h2 className="home-display-sm mb-10 max-w-[20ch]">Honestly, I&rsquo;m keen on this one.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
          <div className="border-t border-line pt-5">
            <h3 className="mono-heading text-ink mb-3">The real homes</h3>
            <p className="text-ink-soft" style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)", lineHeight: 1.55 }}>
              A thousand finished homes is a goldmine. Real photography, shot and shown well, beats a
              render every time, and it&rsquo;s the fastest way to look like the builder you already
              are. I&rsquo;d build the site to put those homes front and centre.
            </p>
          </div>
          <div className="border-t border-line pt-5">
            <h3 className="mono-heading text-ink mb-3">The range</h3>
            <p className="text-ink-soft" style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)", lineHeight: 1.55 }}>
              Your design series, the Bree, the Willow, the Airlie and the rest, could be a proper
              range people lose an afternoon in, sorted by size, bedrooms and block. Something to
              explore, not a static list.
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
