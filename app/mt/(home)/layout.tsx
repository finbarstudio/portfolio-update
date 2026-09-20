import content from "@/content/moto-technique";
import Preloader from "@/components/moto-technique/Preloader";
import SmoothScroll from "@/components/moto-technique/SmoothScroll";
import TopBar from "@/components/moto-technique/TopBar";
import ViewCursor from "@/components/moto-technique/ViewCursor";

/**
 * Decides, before anything is painted, whether the intro plays this load, and
 * marks the wrapper `data-intro` if so. The stylesheet shows the preloader only
 * under that mark, so a refresh never flashes white and then hides it again.
 *
 * It has to be an inline script and it has to come first inside the wrapper:
 * by the time React hydrates, the first frame is already on screen. It marks
 * its own parent rather than <html> because React owns <html> too, and the
 * wrapper can carry suppressHydrationWarning for the attribute React never
 * rendered. Must match SEEN_KEY in Preloader.tsx.
 *
 * In development it plays on every refresh, because that is how it gets worked
 * on. The once-a-session rule only exists in a production build. ALWAYS is
 * decided here on the server and baked into the script as a literal. In
 * development only, `?nointro` skips it, for screenshot tools.
 */
const ALWAYS = process.env.NODE_ENV !== "production";
const INTRO_GATE = `(function(){var r=document.currentScript.parentElement;try{if(${ALWAYS}&&/[?&]nointro\\b/.test(location.search))return;if(${ALWAYS}||/[?&]intro\\b/.test(location.search)||!sessionStorage.getItem("mt-intro-seen"))r.setAttribute("data-intro","1")}catch(e){r.setAttribute("data-intro","1")}})()`;

/**
 * The home page's furniture. A route group, so the URL is still /mt. It returns
 * a fragment on purpose: the intro script marks its PARENT element, which has
 * to be the .mt-site wrapper from the layout above.
 */
export default function MotoTechniqueHomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: INTRO_GATE }} />
      {/* SmoothScroll first: the preloader pauses the scroll it sets up. */}
      <SmoothScroll />
      <Preloader />
      <ViewCursor />
      <TopBar name={content.site.name} nav={content.site.nav} contact={content.contact} home={content.site.home} />
      {children}
    </>
  );
}
