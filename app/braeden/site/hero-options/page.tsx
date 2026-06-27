import { HeroF, HeroG, HeroH, HeroI, HeroJ, HeroK } from "@/components/braeden/herochooser/heroes";

export const metadata = {
  title: { absolute: "Hero options · Braeden" },
  robots: { index: false, follow: false },
};

/**
 * Hero chooser, round 2 — five image-led options with small/restrained type (the
 * real logo carries them), each badged F–J. Not linked or indexed; once Finbar
 * picks, the chosen hero replaces components/braeden/home/Hero.
 */
const OPTIONS: { id: string; name: string; el: React.ReactNode }[] = [
  { id: "F", name: "Pure image · logo low-left", el: <HeroF /> },
  { id: "G", name: "Gallery caption bar", el: <HeroG /> },
  { id: "H", name: "Centred logo lockup", el: <HeroH /> },
  { id: "I", name: "Split · small type", el: <HeroI /> },
  { id: "J", name: "Magazine corners", el: <HeroJ /> },
  { id: "K", name: "Minimal on white · logo + air", el: <HeroK /> },
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
