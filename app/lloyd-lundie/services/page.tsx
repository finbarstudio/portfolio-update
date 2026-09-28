import type { Metadata } from "next";
import content from "@/content/lloyd-lundie";
import SmoothScroll from "@/components/lloyd-lundie/SmoothScroll";
import Nav from "@/components/lloyd-lundie/Nav";
import Reveal from "@/components/lloyd-lundie/Reveal";
import ServiceSection from "@/components/lloyd-lundie/ServiceSection";
import ContactSection from "@/components/lloyd-lundie/ContactSection";
import Footer from "@/components/lloyd-lundie/Footer";

export const metadata: Metadata = {
  title: { absolute: "Services | Lloyd Lundie Building Contractors" },
  description:
    "Extensions, loft conversions, kitchens, bathrooms, roofing, landscaping and bi-fold doors, built by Lloyd Lundie Building Contractors across Medway, Maidstone and Kent.",
  robots: { index: false, follow: false },
};

/**
 * Services: a short intro, then one section per service with its own id
 * anchor (linked from the home page's services list) and a single photo,
 * alternating left/right. Same contact block + footer as home.
 */
export default function LloydLundieServices() {
  const { site, nav, serviceDetails, contact, footer } = content;

  return (
    <>
      <SmoothScroll />
      <Nav nav={nav} phone={site.phoneMobile} phoneHref={site.phoneMobileHref} />
      <main>
        <section className="ll-services-intro">
          <div className="ll-wrap">
            <Reveal as="h1" className="ll-page-title">
              What we build
            </Reveal>
            <Reveal as="p" className="ll-services-intro-text" delay={0.08}>
              Seven ways we help you make more of your home, from a single storey rear extension to a new bathroom.
              Every job is managed the same way: clear communication, honest pricing, and we always do what we say
              we will do.
            </Reveal>
          </div>
        </section>

        {serviceDetails.map((service, i) => (
          <ServiceSection
            key={service.id}
            id={service.id}
            name={service.name}
            intro={service.intro}
            whyPoints={service.whyPoints}
            image={service.image}
            imageAlt={service.imageAlt}
            reverse={i % 2 === 1}
          />
        ))}

        <ContactSection
          intro={contact.intro}
          pricesNote={contact.pricesNote}
          formNote={contact.formNote}
          thanks={contact.thanks}
          phoneMobile={site.phoneMobile}
          phoneMobileHref={site.phoneMobileHref}
          phoneOffice={site.phoneOffice}
          phoneOfficeHref={site.phoneOfficeHref}
          email={site.email}
          facebookHandle={site.facebookHandle}
          facebookHref={site.facebookHref}
        />
      </main>
      <Footer
        phoneMobile={site.phoneMobile}
        phoneMobileHref={site.phoneMobileHref}
        phoneOffice={site.phoneOffice}
        phoneOfficeHref={site.phoneOfficeHref}
        email={site.email}
        facebookHandle={site.facebookHandle}
        facebookHref={site.facebookHref}
        legalName={site.legalName}
        credit={footer.credit}
      />
    </>
  );
}
