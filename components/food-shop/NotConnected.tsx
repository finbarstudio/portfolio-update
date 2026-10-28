/** Shown when the shop has no database to talk to (no database URL set). */
export default function NotConnected() {
  return (
    <div className="fs-empty">
      <p>
        <b>Not connected yet</b>
      </p>
      <p>The shop isn&apos;t linked to its products yet. It should be sorted soon. Nothing you did caused this.</p>
    </div>
  );
}
