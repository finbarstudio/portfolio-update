import type { Metadata } from "next";
import BriefForm from "@/components/BriefForm";

/* Unlisted: shared by direct link with people who have asked about a site. */
export const metadata: Metadata = {
  title: "Website brief",
  description: "A short form about your business and what you need from a website, so I can plan it properly.",
  robots: { index: false, follow: false },
};

export default function WebformPage() {
  return (
    <div className="px-5 md:px-10 pt-8 md:pt-12 pb-16">
      <h1
        className="font-bold text-ink leading-[1.02]"
        style={{ fontSize: "var(--text-h1)", letterSpacing: "-0.01em" }}
      >
        Website brief
      </h1>

      <div className="mt-8 max-w-2xl">
        <p className="text-ink leading-relaxed" style={{ fontSize: "var(--text-body)" }}>
          This takes about ten minutes. I can already see your current site, so these questions are about the things I cannot see: how your business gets work, how you run the site day to day, and what you want from a new one. Skip anything you are not sure about.
        </p>

        <BriefForm />
      </div>
    </div>
  );
}
