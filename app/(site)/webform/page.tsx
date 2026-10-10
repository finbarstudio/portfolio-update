import type { Metadata } from "next";
import BriefForm from "@/components/BriefForm";

/* Unlisted: shared by direct link with people who have asked about a site. */
export const metadata: Metadata = {
  title: "Website brief",
  description: "A short form about your business and what you need, so I can scope your website and give you a fixed price.",
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
          This takes about ten minutes. Your answers tell me what the site needs to do and how big
          it is, so I can come back with a clear plan and a fixed price. Skip anything you are not
          sure about.
        </p>

        <BriefForm />
      </div>
    </div>
  );
}
