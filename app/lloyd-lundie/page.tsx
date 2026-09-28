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
 * The whole demo is this one page: the bar (with the travelling wordmark),
 * hero, story beat, selected work (4 photos), services list, three reviews,
 * areas covered, contact, footer. A composition only: every string and
 * photograph comes from content/lloyd-lundie.ts.
 */

/** The three reviews shown, from the five on their feedback page. */
const REVIEWS = ["Tracey Larson", "Debbie Baker", "Simon Damerell"];
export default function LloydLundieHome() {
  const { site, hero, story, selectedWork, services, testimonials, areas, contact, footer } = content;

  return (
    <>
      <SmoothScroll />
      <Nav
        email={site.email}
        phones={[
          { label: "Mobile", value: site.phoneMobile, href: site.phoneMobileHref },
          { label: "Office", value: site.phoneOffice, href: site.phoneOfficeHref },
        ]}
      />
      <main>
        <Hero image={hero.image} imageAlt={hero.imageAlt} laurel={hero.laurel} />
        <Story paragraph={story.paragraph} mottos={story.mottos} facts={story.facts} />
        <SelectedWork items={selectedWork} />
        <ServicesList services={services} />
        <Testimonials testimonials={REVIEWS.flatMap((n) => testimonials.filter((t) => t.name === n))} />
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
