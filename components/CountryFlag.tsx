/**
 * CountryFlag — renders the national flag SVG for a team's 3-letter code. Flags
 * live in /public/flags (downloaded per-nation by scripts/fetch_worldcup.py, so
 * every code present in the data has a file).
 */
export default function CountryFlag({ code }: { code: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="wc-flag-img" src={`/flags/${code.toLowerCase()}.svg`} alt={code} width={21} height={14} />;
}
