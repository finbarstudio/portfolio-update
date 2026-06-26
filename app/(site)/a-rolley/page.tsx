import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import MaskReveal from "@/components/MaskReveal";
import ContactCta from "@/components/ContactCta";

// Private pitch page for A Rolley & Sons (arolleyandsons.com.au). Same play as
// /lindon and /oj-pippin: reachable by URL, kept out of the index, the sitemap
// and the public nav. Something Finbar sends, not something people find. Reuses
// the pitch CTA / card styles (.lindon-cta / .lindon-demo-card).
export const metadata: Metadata = {
  title: { absolute: "For A Rolley & Sons · Finbar Studio" },
  description:
    "A note and a working demo for A Rolley & Sons, from Brisbane designer Finbar Skitini.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

const DEMO_HREF = "/a-rolley/site";

// Their strengths, framed positively as the stat row.
const STATS = [
  {
    value: "1968",
    label: "On the Coast since",
    note: "Hardly any builder up here can say that. The heritage should be the first thing a visitor feels, and right now the site barely mentions it.",
  },
  {
    value: "4",
    label: "Generations",
    note: "A fourth-generation family builder is a rare story on the Sunshine Coast. It is exactly what people choose a builder for, and it deserves to lead.",
  },
  {
    value: "Word of mouth",
    label: "How the work comes in",
    note: "A reputation built on referrals is the hard part, and you have it. A site that does it justice turns the people you get sent into real enquiries.",
  },
];

// The honest gap, all verified (June 2026): SimilarWeb shows no measurable
// traffic, social reach is small for a 75-year name, the footer is stuck at 2023.
const GAP = [
  {
    value: "Off the radar",
    label: "Search presence",
    note: "SimilarWeb can't even register the site, it sits below their measurement threshold. For a name this established, it means new clients basically can't find you in a search.",
  },
  {
    value: "260 · 333",
    label: "Instagram · Facebook",
    note: "260 followers and 333 likes is modest for a 75-year-old business. The homes and the story could be pulling a lot more than that.",
  },
  {
    value: "© 2023",
    label: "Last visible update",
    note: "The footer still reads 2023. The site feels parked, when the business clearly isn't. A fresh build that you can keep current fixes that for good.",
  },
];

const OFFERINGS = [
  {
    title: "Web design & build",
    body: "A site designed by someone who cares, written in custom code, that works as well on a phone as it does on a desktop.",
  },
  {
    title: "Headless CMS",
    body: "You run your own content. Add a finished home, swap the photos, update a page, no developer and no waiting.",
  },
  {
    title: "SEO",
    body: "A proper audit and the work to back it. With the code in my hands, fixes go live the same day.",
  },
  {
    title: "Brand & polish",
    body: "A cleaner logo and a tighter identity if you want it, as much or as little as makes sense.",
  },
];

export default function ARolleyPitchPage() {
  return (
    <div className="px-5 md:px-10 pb-10">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="pt-[5svh] md:pt-[7svh] pb-16 md:pb-24" aria-label="Introduction">
        <Reveal as="p" immediate className="mono-label text-pink mb-6">
          For A Rolley &amp; Sons
        </Reveal>
        <MaskReveal as="h1" className="home-display">
          Four generations of homes. A website that does not tell the story.
        </MaskReveal>
        <Reveal as="div" immediate delay={0.5} className="mt-10 max-w-[62ch]">
          <p className="text-ink-soft" style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.35rem)", lineHeight: 1.5 }}>
            I&rsquo;m Finbar, a Brisbane designer. I built this page, and a working demo of your site,
            because a name that has been on Sunshine Coast homes since 1968 deserves better than a
            site stuck in another era. I&rsquo;d rather show you than just say it.
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
      <Reveal as="section" section className="home-section py-24 md:py-36 grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-5" aria-label="Why I reached out">
        <div className="md:col-span-5">
          <h2 className="home-display-sm">The story is rare. The website hides it.</h2>
        </div>
        <div className="md:col-span-7">
          <p className="text-ink" style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.35rem)", lineHeight: 1.55 }}>
            I went looking at builders on the Sunshine Coast and the Rolley name kept coming up.
            A family that started in 1943, building homes on the Coast since 1968, now four generations
            in. That is a story most builders would give anything for. Then I went looking for the site,
            and almost could not find it. It still works, but it reads like it was last touched years
            ago, and barely registers online. For a builder with your history, the site could be the
            thing that makes people choose you.
          </p>
        </div>
      </Reveal>

      {/* ── 02 · What stood out (their strengths as the stat row) ── */}
      <Reveal as="section" section className="home-section py-24 md:py-36" aria-label="What stood out">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-4 mb-12">
          <div className="md:col-span-5">
            <h2 className="home-display-sm">You&rsquo;ve earned the reputation. The site can carry more of it.</h2>
          </div>
          <div className="md:col-span-7 flex md:items-end">
            <p className="text-ink-soft" style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.3rem)", lineHeight: 1.5 }}>
              I went through the site the way someone planning a home would. Here is what stood out.
            </p>
          </div>
        </div>
        <p className="mono-label text-ink-soft mb-5">The strengths</p>
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

        <p className="mono-label text-ink-soft mb-5 mt-16">Where the site is letting it down</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
          {GAP.map((s) => (
            <div key={s.label} className="border-t border-line pt-5">
              <p className="text-ink font-mono leading-none" style={{ fontSize: "clamp(1.5rem, 3.4vw, 2.6rem)" }}>
                {s.value}
              </p>
              <p className="mono-label text-ink mt-3 mb-2">{s.label}</p>
              <p className="text-ink-soft" style={{ fontSize: "0.95rem", lineHeight: 1.5 }}>{s.note}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-6 mt-16">
          <div className="md:col-span-8 flex md:items-center">
            <p className="text-ink" style={{ fontSize: "clamp(1.15rem, 1.9vw, 1.6rem)", lineHeight: 1.4 }}>
              A builder four generations deep should feel one of one online, and be easy to find. The
              current site does the minimum. It could be unmistakably yours.
            </p>
          </div>
          <div className="md:col-span-4 flex md:items-center">
            <p className="text-ink-soft" style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>
              Most people will meet you on a phone first, so the mobile version gets the same care as
              the desktop one, designed together from the start.
            </p>
          </div>
        </div>
      </Reveal>

      {/* ── 03 · The demo ─────────────────────────────────────── */}
      <Reveal as="section" section className="home-section py-24 md:py-36 grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-5" aria-label="The demo">
        <div className="md:col-span-5">
          <h2 className="home-display-sm">A working demo, built around your story.</h2>
        </div>
        <div className="md:col-span-7">
          <p className="text-ink" style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.35rem)", lineHeight: 1.55 }}>
            A few pages to show the direction, written from scratch in custom code, no template. It
            opens on your homes, puts the four-generation story front and centre, and reads properly on
            a phone. This is one version. A builder like you could go a dozen directions.
          </p>
          <div className="lindon-demo-card mt-8">
            <Link href={DEMO_HREF} className="lindon-cta lindon-cta-pink">
              See the demo &rarr;
            </Link>
            <p className="text-ink-soft mt-5" style={{ fontSize: "0.95rem", lineHeight: 1.5 }}>
              It&rsquo;s an early build and still growing, so treat it as a direction rather than the
              finished article. It is a responsive build, but at its best on desktop, so open it there
              and have a click around.
            </p>
          </div>
        </div>
      </Reveal>

      {/* ── 04 · What I see in it ─────────────────────────────── */}
      <Reveal as="section" section className="home-section py-24 md:py-36" aria-label="What I see in it">
        <h2 className="home-display-sm mb-10 max-w-[20ch]">Honestly, I&rsquo;m keen on this one.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
          <div className="border-t border-line pt-5">
            <h3 className="mono-heading text-ink mb-3">The story</h3>
            <p className="text-ink-soft" style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)", lineHeight: 1.55 }}>
              Furniture-makers in 1943, home builders on the Coast since 1968, the fourth generation now
              on the tools. I&rsquo;d build the whole site around that. It is the reason someone trusts
              you with the biggest thing they will ever build.
            </p>
          </div>
          <div className="border-t border-line pt-5">
            <h3 className="mono-heading text-ink mb-3">The homes</h3>
            <p className="text-ink-soft" style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)", lineHeight: 1.55 }}>
              Light-filled subtropical homes deserve big, immersive photography, not small thumbnails.
              Give the best ones room to breathe and let someone fall for a build before they read a
              word.
            </p>
          </div>
        </div>
      </Reveal>

      {/* ── 05 · How I can help ───────────────────────────────── */}
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
            who is genuinely into your project.
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
