// Bookmania (Adobe Typekit) is the Journal's serif. Loaded here so it's scoped
// to /journal/* only — the rest of the site stays on its sans + mono, and this
// external stylesheet never weighs on other routes. React hoists + dedupes the
// tag via `precedence`, so both the index and post pages share the one load.
export default function JournalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="stylesheet" href="https://use.typekit.net/rlo3ixj.css" precedence="default" />
      {children}
    </>
  );
}
