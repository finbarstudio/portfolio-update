/**
 * CountryFlag — renders a team's mark for its 3-letter code. Priority: the
 * single-colour pink national crest (/public/crests/<slug>.svg, already brand
 * pink with transparent inner detail) when we have one; otherwise the colour
 * flag (/public/flags/<code>.svg) given the studio pink-tint. Crests are NOT
 * tinted — they're authored in the brand pink already.
 */

// 3-letter code -> crest slug (only codes we have a single-colour crest for).
const CREST: Record<string, string> = {
  ALG: "algeria", ARG: "argentina", AUS: "australia", AUT: "austria",
  BEL: "belgium", BIH: "bosnia-and-herzegovina", BRA: "brazil", CPV: "cabo-verde",
  CAN: "canada", COL: "colombia", COD: "congo-dr", CIV: "cote-d-ivoire",
  CRO: "croatia", CUW: "curacao", CZE: "czech-republic", ECU: "ecuador",
  EGY: "egypt", ENG: "england", FRA: "france", GER: "germany", GHA: "ghana",
  HAI: "haiti", IRN: "iran", IRQ: "iraq", JPN: "japan", JOR: "jordan",
  MEX: "mexico", MAR: "morocco", NED: "netherlands", NZL: "new-zealand",
  NOR: "norway", PAN: "panama", PAR: "paraguay", POR: "portugal", QAT: "qatar",
  KSA: "saudi-arabia", SEN: "senegal", RSA: "south-africa", KOR: "south-korea",
  ESP: "spain", SWE: "sweden", SUI: "switzerland", TUN: "tunisia", TUR: "turkey",
  URU: "uruguay", USA: "usa", UZB: "uzbekistan", SCO: "scotland",
};

export default function CountryFlag({ code }: { code: string }) {
  const slug = CREST[code.toUpperCase()];
  /* eslint-disable @next/next/no-img-element */
  if (slug) {
    return <img className="wc-crest-img" src={`/crests/${slug}.svg`} alt={code} width={16} height={16} />;
  }
  return <img className="wc-flag-img wc-brand-tint" src={`/flags/${code.toLowerCase()}.svg`} alt={code} width={21} height={14} />;
}
