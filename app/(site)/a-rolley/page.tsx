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

const DEMO_HREF = "/a-rolley/site"; // the faithful grey/sans direction (primary)
const EDITORIAL_HREF = "/a-rolley/editorial"; // the warm editorial alternate

// Their strengths, framed positively as the stat row.
const STATS = [
  {
    value: "1968",
    label: "On the Coast since",
    note: "Hardly any builder up here can say that. The heritage is a real asset, and the site could lean on it harder than it does now.",
  },
  {
    value: "4",
    label: "Generations",
    note: "A fourth-generation family builder is a rare story on the Sunshine Coast. It is exactly what people choose a builder for, and it deserves to lead.",
  },
  {
    value: "Word of mouth",
    label: "How the work comes in",
    note: "A reputation built on referrals is the hard part, and you have it. A sharper site turns the people you get sent into real enquiries.",
  },
];

// Framed as opportunity, not failure: the site is good, it is just due an update.
const ADD = [
  {
    value: "~3 years",
    label: "Since the last update",
    note: "The footer still reads 2023. The site has held up, it is simply due, and a fresh build is one you can keep current without a developer.",
  },
  {
    value: "Search & SEO",
    label: "Room to grow",
    note: "A name this established should be easy to find. A proper SEO pass, with the code in my hands so fixes go live the same day, would put you in front of people searching for a Coast builder.",
  },
  {
    value: "Features",
    label: "Plenty we can add",
    note: "Immersive project galleries, a story that carries the four generations, enquiry that actually converts, a CMS you run yourself. The current site does the basics, there is a lot of headroom.",
  },
];

const OFFERINGS = [
  {
    title: "Web design & build",
    body: "A site designed by someone who cares, written in custom code, that works as well on a phone as it does on a desktop.",
  },
  {
    title: "A proper CMS, on Sanity",
    body: "Built on Sanity so you stay on top of your own content. Add a finished home, swap the photos, update a page, no developer and no waiting.",
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
          Your site has held up well. It is just due for an update.
        </MaskReveal>
        <Reveal as="div" immediate delay={0.5} className="mt-10 max-w-[64ch]">
          <p className="text-ink-soft" style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.35rem)", lineHeight: 1.5 }}>
            I&rsquo;m Finbar, a Brisbane designer. Your site still looks good, but it has not had an
            update in about three years, and there is a lot we could add now: new features, proper SEO,
            a build you can keep current. I put together a demo and a few ideas to show what that could
            look like, rather than just tell you.
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
          <h2 className="home-display-sm">A great story, and a site ready for its next version.</h2>
        </div>
        <div className="md:col-span-7">
          <p className="text-ink" style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.35rem)", lineHeight: 1.55 }}>
            I went looking at builders on the Sunshine Coast and the Rolley name kept coming up. A family
            that started in 1943, building homes on the Coast since 1968, now four generations in. That
            is a story most builders would give anything for. The current site does a solid job of it,
            it has just been a few years, and the tools have moved on. With a refresh there is a lot we
            could do, from the way the homes are shown to how easily people find you.
          </p>
        </div>
      </Reveal>

      {/* ── What stood out (their strengths as the stat row) ── */}
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

        <p className="mono-label text-ink-soft mb-5 mt-16">What an update would add</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
          {ADD.map((s) => (
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
              A builder four generations deep should feel one of a kind online, and be easy to find. The
              current site does the job. An update could make it unmistakably yours.
            </p>
          </div>
          <div className="md:col-span-4 flex md:items-center">
            <p className="text-ink-soft" style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>
              Most people will meet you on a phone first, so the mobile version gets the same care as the
              desktop one, designed together from the start.
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
            A few pages to show the direction, written from scratch in custom code, no template. It opens
            on your homes, puts the four-generation story up front, and reads properly on a phone. I built
            it two ways so you have something to react to: one that follows your current look, in your
            colours and type, and a warmer editorial take. Same content, two feels.
          </p>
          <div className="lindon-demo-card mt-8">
            <div className="flex flex-wrap items-center gap-3">
              <Link href={DEMO_HREF} className="lindon-cta lindon-cta-pink">
                See the demo &rarr;
              </Link>
              <Link href={EDITORIAL_HREF} className="lindon-cta lindon-cta-ghost">
                The editorial version &rarr;
              </Link>
            </div>
            <p className="text-ink-soft mt-5" style={{ fontSize: "0.95rem", lineHeight: 1.5 }}>
              This is a first draft, built to show the kind of uplift I can bring, not a finished site.
              There are plenty of directions it could go and a lot of refinement still to do. That part
              comes from a proper consultation and design process, working through your homes, your
              priorities and your audience together. For now, treat it as a demonstration. It is a
              responsive build but at its best on desktop, so open it there and have a click around.
            </p>
          </div>
        </div>
      </Reveal>

      {/* ── What I see in it ──────────────────────────────────── */}
      <Reveal as="section" section className="home-section py-24 md:py-36" aria-label="What I see in it">
        <h2 className="home-display-sm mb-10 max-w-[22ch]">Honestly, I&rsquo;ve got a lot of ideas for this one.</h2>
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
              Give the best ones room to breathe and let someone fall for a build before they read a word.
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
            And you&rsquo;d deal with me directly. No account managers, no agency layers. One designer who
            is genuinely into your project.
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
