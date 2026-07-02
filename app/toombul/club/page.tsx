import type { Metadata } from "next";
import Nav from "@/components/toombul/Nav";
import Footer from "@/components/toombul/Footer";
import Reveal from "@/components/toombul/Reveal";
import Grades from "@/components/toombul/sections/Grades";
import Community from "@/components/toombul/sections/Community";
import GetInvolved from "@/components/toombul/sections/GetInvolved";
import Sponsors from "@/components/toombul/sections/Sponsors";

export const metadata: Metadata = {
  title: "The Club | Toombul District Cricket Club",
  robots: { index: false, follow: false },
};

// Everything that isn't the story: grades, community, joining, sponsors.
export default function ToombulClubPage() {
  return (
    <>
      <Nav forceSolid />
      <main>
        <section className="tc-section" style={{ paddingTop: "clamp(120px, 20vh, 180px)" }}>
          <div className="tc-wrap">
            <Reveal>
              <span className="tc-eyebrow">The club</span>
              <h1 className="tc-section-title" style={{ marginTop: 10 }}>
                Every age, every level
              </h1>
              <p className="tc-section-lead">
                From Friday Night Blasters to Premier Grade, Toombul fields teams across every
                level of Queensland cricket.
              </p>
            </Reveal>
          </div>
        </section>
        <Grades />
        <Community />
        <GetInvolved />
        <Sponsors />
      </main>
      <Footer />
    </>
  );
}
