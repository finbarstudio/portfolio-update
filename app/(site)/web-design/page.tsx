import type { Metadata } from "next";
import Link from "next/link";
import ServiceLanding from "@/components/ServiceLanding";

const SITE_URL = "https://www.finbar.studio";

/**
 * /web-design — the local-search landing page for "web design brisbane" and
 * its variants. Structure follows what the current top-ranking Brisbane pages
 * do well (long-form keyword coverage, location-rich client mentions, a
 * meet-the-designer credentials block, process, search-phrased FAQs), told
 * with this studio's actual facts. Keyword variants are used deliberately:
 * web design / website design / web designer / website designer + Brisbane.
 */

export const metadata: Metadata = {
  title: { absolute: "Web Design Brisbane | Custom-Coded Websites | Finbar Studio" },
  description:
    "Brisbane web designer building custom-coded websites: brand-led design, a CMS you run yourself, SEO and AI-search ready. For businesses in Brisbane, across Australia and the UK.",
  alternates: { canonical: "/web-design" },
  openGraph: {
    title: "Web Design Brisbane | Custom-Coded Websites | Finbar Studio",
    description:
      "Custom-coded, brand-led websites with a CMS you run yourself, from a Brisbane web designer. Selected web projects.",
    url: `${SITE_URL}/web-design`,
    type: "website",
  },
};

export default function WebDesignPage() {
  return (
    <ServiceLanding
      slug="web-design"
      label="Service · Brisbane"
      heading="Brisbane web design & development"
      serviceName="Web Design & Development"
      description="Brisbane web design and development. Custom-coded, brand-led websites with a CMS clients run themselves, for businesses across Australia and the UK."
      intro="I'm a web designer and developer in Brisbane building websites for businesses here and across Australia and the UK. Mostly custom-coded: hand-built front ends that load fast and behave exactly how they were drawn, wired into a CMS the client runs themselves after launch. Where they earn their place, I build the extras in too, like instant estimate tools and live social feeds. It starts with the brand, from the first sketch, and the same care for type and detail carries through to the code."
      terms={["web", "ui", "framer"]}
      capsTitle="What I build"
      capabilities={[
        "Custom-coded websites",
        "A CMS you run yourself",
        "Brand-led design and UI",
        "Interactive tools, like instant estimate calculators",
        "Live social and content feeds",
        "SEO and AI-search-ready front ends",
      ]}
      sections={[
        {
          heading: "Website design for Brisbane businesses",
          body: "Most Brisbane website design is a template with your logo on it. Mine isn't. Every site I design starts from your brand and your customers, then gets built by hand, so the layout, the type and the motion are decisions rather than defaults. That's the difference visitors feel in the first few seconds, and it's why my clients' sites win work instead of just sitting there. Whether you're a trade, a consultancy or a shop, the job is the same: a website that looks like nobody else's and quietly brings in enquiries.",
        },
        {
          heading: "Custom code, not page builders",
          body: "I write the front end myself instead of assembling it in WordPress, Squarespace or Wix. Hand-written code loads faster, scores better on Google's speed checks, and never fights a theme. You still get an easy editing experience: every build is wired into a CMS, so you change words, photos, projects and prices yourself without touching code. Custom also means custom features. For Lows Design + Build I built an instant estimate calculator that turns visitors into named leads while they sleep.",
        },
        {
          heading: "From Brisbane to London",
          body: "Recent website design work: Lows Design + Build, family builders in South London. KinAya, an NDIS support provider in Adelaide. Salesmasters, a sales consultancy here in Brisbane. Plated with Issy, a candlelit supper club. Lola Audio, a composer's portfolio you can actually mix. I'm based in Brisbane and most of the work happens over calls and shared files, so where you are has never been a barrier.",
        },
      ]}
      process={[
        {
          title: "A 15 minute call",
          body: "You tell me about the business, I tell you honestly what the website needs. No pitch deck, no pressure.",
        },
        {
          title: "Design first",
          body: "I design the site around your brand before a line of code is written, so you approve what you'll actually get.",
        },
        {
          title: "The build",
          body: "Hand-coded front end, CMS wired in, SEO and speed handled as part of the build rather than bolted on after.",
        },
        {
          title: "Handover",
          body: "You get the keys and a walkthrough. You edit the site yourself from day one, and I'm an email away when you need me.",
        },
      ]}
      meet={{
        heading: "Meet your Brisbane web designer",
        body: "I'm Finbar Skitini, a designer first and a developer because the design deserves better than a template. I trained in the UK, design brands, publications and motion as well as websites, and moved the studio to Brisbane. That mix is the point: when the same person draws the brand and writes the code, the site reads as one piece of work.",
        points: [
          "BA (Hons), Brighton and Ravensbourne University",
          "Brand, editorial and motion design behind every build",
          "Based in Brisbane, clients across Australia and the UK",
          "Custom builds on Next.js, with Sanity, Payload and Framer CMS",
        ],
      }}
      ctaHeading="Thinking about a new website?"
      ctaNote={
        <>
          Not sure yet? I&rsquo;ll redesign your homepage for free, no
          obligation, so you can see the difference before spending anything.{" "}
          <Link href="/free-redesign" className="u-underline">About the free redesign →</Link>
        </>
      }
      faqs={[
        {
          q: "How much does a website cost in Brisbane?",
          a: "It depends on the size of the site and what it needs to do. A small brochure site sits at the lower end; sites with custom tools, animation or a full brand behind them cost more. I quote a fixed price per project after a 15 minute call, so there are no surprises. And if you want to see the standard first, I'll redesign your homepage for free.",
        },
        {
          q: "How long does it take to build a website?",
          a: "A straightforward site is usually a few weeks from first call to launch. Bigger builds with custom features or a brand from scratch take longer. I'll give you a real timeline once I know the scope, and I stick to it.",
        },
        {
          q: "Do you use WordPress or Squarespace?",
          a: "No. I hand-code every site instead of building on a template platform. That's why they load fast, rank well and look like nothing else. You don't lose the easy editing: every site comes wired into a CMS, so day-to-day updates are simpler than wrestling a page builder.",
        },
        {
          q: "Will I be able to update the site myself?",
          a: "Yes. Sites come wired into a CMS, and I walk you through it at handover, so you can change words, images and pages without touching code or coming back to me.",
        },
        {
          q: "Will my website show up on Google?",
          a: "Search is part of the build, not an add-on. Every site ships with clean structure, fast load times, structured data and the on-page basics done properly, and it's set up to be read by AI search tools as well as Google. Rankings take time and depend on competition, but the site will never be the thing holding you back.",
        },
        {
          q: "Do you work with businesses outside Brisbane?",
          a: "Yes. I'm a website designer based in Brisbane, and I work with clients across Australia and the UK. Most of the work happens over calls and shared files, so location isn't a barrier.",
        },
        {
          q: "Can you design the brand as well as the site?",
          a: "Yes, and it's often better that way. When the brand and the build come from one place, they read as a single piece of work rather than a logo dropped onto a template.",
        },
      ]}
    />
  );
}
