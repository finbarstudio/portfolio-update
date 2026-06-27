import { HeroA, HeroB, HeroC, HeroD, HeroE } from "@/components/braeden/herochooser/heroes";

export const metadata = {
  title: { absolute: "Hero options · Braeden" },
  robots: { index: false, follow: false },
};

/**
 * Hero chooser — five image-led options stacked full-screen, each badged A–E so
 * Finbar can scroll through and call the winner. Not linked or indexed; once he
 * picks, the chosen hero replaces components/braeden/home/Hero.
 */
const OPTIONS: { id: string; name: string; el: React.ReactNode }[] = [
  { id: "A", name: "Cinematic · Fraunces serif", el: <HeroA /> },
  { id: "B", name: "Editorial split · Cormorant", el: <HeroB /> },
  { id: "C", name: "Giant type · Archivo", el: <HeroC /> },
  { id: "D", name: "Gallery frame · Space Grotesk", el: <HeroD /> },
  { id: "E", name: "Kinetic marquee · Poppins", el: <HeroE /> },
];

export default function HeroOptionsPage() {
  return (
    <main>
      {OPTIONS.map((o) => (
        <div key={o.id} style={{ position: "relative" }}>
          <span className="bx-badge ff-mono">
            {o.id} · {o.name}
          </span>
          {o.el}
        </div>
      ))}
    </main>
  );
}
