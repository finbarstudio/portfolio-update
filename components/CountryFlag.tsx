/**
 * CountryFlag — colour flag SVGs (from flagcdn, bundled in /public/flags) for the
 * codes we have, else a small mono country-code chip.
 */
const FLAG_FILES: Record<string, string> = {
  ENG: "eng", GRE: "gre", SEN: "sen", SRB: "srb", FRA: "fra", ARG: "arg", BRA: "bra",
};

export default function CountryFlag({ code }: { code: string }) {
  const file = FLAG_FILES[code];
  if (file) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="wc-flag-img" src={`/flags/${file}.svg`} alt="" width={21} height={14} />;
  }
  return <span className="wc-code" aria-hidden="true">{code}</span>;
}
