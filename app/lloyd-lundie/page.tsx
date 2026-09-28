import content from "@/content/lloyd-lundie";
import SmoothScroll from "@/components/lloyd-lundie/SmoothScroll";
import Nav from "@/components/lloyd-lundie/Nav";
import Hero from "@/components/lloyd-lundie/Hero";
import Story from "@/components/lloyd-lundie/Story";
import SelectedWork from "@/components/lloyd-lundie/SelectedWork";
import ServicesList from "@/components/lloyd-lundie/ServicesList";
import Testimonials from "@/components/lloyd-lundie/Testimonials";
import Areas from "@/components/lloyd-lundie/Areas";
import ContactSection from "@/components/lloyd-lundie/ContactSection";
import Footer from "@/components/lloyd-lundie/Footer";

/**
 * Home: nav, hero, story beat, selected work (4 photos), services list,
 * testimonials, areas covered, contact, footer. A composition only — every
 * string and photograph comes from content/lloyd-lundie.ts.
 */
export default function LloydLundieHome() {
  const { site, nav, hero, story, selectedWork, services, testimonials, areas, contact, footer } = content;

  return (
    <>
      <SmoothScroll />
      <Nav nav={nav} phone={site.phoneMobile} phoneHref={site.phoneMobileHref} overHero />
      <main>
        <Hero heading={hero.heading} sub={hero.sub} image={hero.image} imageAlt={hero.imageAlt} cta={hero.cta} />
        <Story paragraph={story.paragraph} mottos={story.mottos} facts={story.facts} />
        <SelectedWork items={selectedWork} />
        <ServicesList services={services} />
        <Testimonials testimonials={testimonials} />
        <Areas areas={areas} />
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
