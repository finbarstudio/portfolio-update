/**
 * CountryFlag — renders a pink SVG flag for the codes we have artwork for, else a
 * small mono country code. Add more flags to Flags.tsx + the map as needed.
 */
import { EngFlag, GreeceFlag } from "./Flags";

const FLAGS: Record<string, () => React.ReactElement> = {
  ENG: EngFlag,
  GRE: GreeceFlag,
};

export default function CountryFlag({ code }: { code: string }) {
  const Flag = FLAGS[code];
  if (Flag) return <Flag />;
  return <span className="wc-code" aria-hidden="true">{code}</span>;
}
