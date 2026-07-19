/**
 * A figure caption. Image credits are often just a bare URL (the source or the
 * tool used) — linkify those so they're clickable; anything else (a written
 * credit, a description) renders as plain text.
 */
export default function Caption({ text }: { text: string }) {
  const trimmed = text.trim();
  if (/^https?:\/\/\S+$/.test(trimmed)) {
    return (
      <a href={trimmed} target="_blank" rel="noopener noreferrer" className="jr-caption-link">
        {trimmed.replace(/^https?:\/\//, "").replace(/\/$/, "")}
      </a>
    );
  }
  return <>{text}</>;
}
