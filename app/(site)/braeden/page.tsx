import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import MaskReveal from "@/components/MaskReveal";
import ContactCta from "@/components/ContactCta";

// Private pitch page for Braeden Constructions (braedenconstructions.com.au).
// Same play as /lindon, /oj-pippin and /a-rolley: reachable by URL, kept out of
// the index, the sitemap and the public nav. Something Finbar sends, not
// something people find. Reuses the pitch CTA / card styles.
export const metadata: Metadata = {
  title: { absolute: "For Braeden Constructions · Finbar Studio" },
  description:
    "A note and a working demo for Braeden Constructions, from Brisbane designer Finbar Skitini.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

const DEMO_HREF = "/braeden/site";

// Their strengths, framed positively as the stat row.
const STATS = [
  {
    value: "1996",
    label: "Building on the Coast since",
    note: "Thirty years and 35 in the trade for Mick. That depth is exactly what people want from a custom builder, and the site could lean on it harder than it does now.",
  },
  {
    value: "5×",
    label: "House of the Year",
    note: "Three times for the Sunshine Coast, twice for Queensland, plus the first Coast builder to win it nationally. One of the most decorated records up here, and it should be impossible to miss.",
  },
  {
    value: "Word of mouth",
    label: "How the work comes in",
    note: "A reputation built on referrals and repeat clients is the hard part, and you have it. A sharper site turns the people you get sent into real enquiries.",
  },
];

// Framed as opportunity, not failure: the site is good, it is just due an update.
const ADD = [
  {
    value: "Dated tech",
    label: "Under the hood",
    note: "The site is image-forward and the content is strong. It is just running on old jQuery and a Slick carousel, which is starting to show. A fresh custom build is faster, sharper on a phone, and yours to keep current.",
  },
  {
    value: "Search & SEO",
    label: "Room to grow",
    note: "A builder this decorated should own the search for a Noosa custom home. A proper SEO pass, with the code in my hands so fixes go live the same day, would put you in front of the people already looking.",
  },
  {
    value: "Features",
    label: "Plenty we can add",
    note: "Immersive project galleries, the award story up front, enquiry that actually converts, a CMS you run yourself. The current site covers the basics, there is a lot of headroom.",
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
    body: "Keep your Montserrat and your red, just tightened and elevated, as much or as little as makes sense.",
  },
];

export default function BraedenPitchPage() {
  return (
    <div className="px-5 md:px-10 pb-10">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="pt-[5svh] md:pt-[7svh] pb-16 md:pb-24" aria-label="Introduction">
        <Reveal as="p" immediate className="mono-label text-pink mb-6">
          For Braeden Constructions
        </Reveal>
        <MaskReveal as="h1" className="home-display">
          Your homes are stunning. The site could do them justice.
        </MaskReveal>
        <Reveal as="div" immediate delay={0.5} className="mt-10 max-w-[64ch]">
          <p className="text-ink-soft" style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.35rem)", lineHeight: 1.5 }}>
            I&rsquo;m Finbar, a Brisbane designer. Your site is image-forward and the content is strong,
            it is just running on dated tech and selling your work a little short. I put together a demo
            and a few ideas to show what a refresh could look like, rather than just tell you, keeping
            your fonts and your red and building around the homes themselves.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={DEMO_HREF} className="lindon-cta lindon-cta-pink">
              See the demo &rarr;
            </a>
            <ContactCta className="lindon-cta lindon-cta-ghost">Talk to me</ContactCta>
          </div>
        </Reveal>
      </section>

      {/* ── Why I reached out ─────────────────────────────────── */}
      <Reveal as="section" section className="home-section py-24 md:py-36 grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-5" aria-label="Why I reached out">
        <div className="md:col-span-5">
          <h2 className="home-display-sm">A serious record, and a site ready for its next version.</h2>
        </div>
        <div className="md:col-span-7">
          <p className="text-ink" style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.35rem)", lineHeight: 1.55 }}>
            I went looking at builders around Noosa and the Braeden name kept coming up. Started by Mick
            in 1996, House of the Year on the Coast three times and for Queensland twice, the first Coast
            builder to win it nationally. That is a story most builders would give anything for. The
            current site does a solid job of it, the homes look great, it has just been built on tools
            that have since moved on. With a refresh there is a lot we could do, from the way the homes
            are shown to how easily people find you.
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
              A builder this decorated should feel one of a kind online, and be easy to find. The current
              site does the job. An update could make it unmistakably yours.
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
            A homepage to show the direction, written from scratch in custom code, no template. It opens
            on your award homes, puts the deal-direct-with-Mick story up front, and reads properly on a
            phone. It keeps your Montserrat, your Quicksand and your red, so it still feels like Braeden,
            just elevated.
          </p>
          <div className="lindon-demo-card mt-8">
            <div className="flex flex-wrap items-center gap-3">
              <a href={DEMO_HREF} className="lindon-cta lindon-cta-pink">
                See the demo &rarr;
              </a>
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
              Mick on every build, since 1996, one of the most decorated records on the Coast. I&rsquo;d
              build the whole site around that. It is the reason someone trusts you with the biggest thing
              they will ever build.
            </p>
          </div>
          <div className="border-t border-line pt-5">
            <h3 className="mono-heading text-ink mb-3">The homes</h3>
            <p className="text-ink-soft" style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)", lineHeight: 1.55 }}>
              Award-winning Noosa homes deserve big, immersive photography, not a dated carousel. Give the
              best ones room to breathe and let someone fall for a build before they read a word.
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
            is genuinely into your project, the same way you build.
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
            <a href={DEMO_HREF} className="lindon-cta lindon-cta-ghost">
              See the demo &rarr;
            </a>
          </div>
          <p className="mono-label text-ink-soft mt-10">Finbar Skitini · finbar.studio</p>
        </div>
      </Reveal>
    </div>
  );
}
