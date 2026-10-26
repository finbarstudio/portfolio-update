/** Shown when the shop has no database to talk to yet (no DATABASE_URL). */
export default function NotConnected() {
  return (
    <div className="ds-page">
      <div className="ds-empty">
        <p className="ds-empty-title">Not connected yet</p>
        <p>This shop isn&apos;t linked to its list of products yet. It should be sorted soon. Nothing you did caused this.</p>
      </div>
    </div>
  );
}
