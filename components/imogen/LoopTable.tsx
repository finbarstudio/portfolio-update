import { loopHostels, loopNote } from "@/content/imogen";

/**
 * LoopTable — the Ha Giang Loop hostels compared, ordered most → least party,
 * with a little party meter, rough long-loop price, versions and a note. Reads
 * as a ranked comparison on mobile rather than a wide table.
 */
export default function LoopTable() {
  return (
    <div className="im-loop">
      <p className="im-loop-intro">Ordered top = biggest party, down to quietest. {loopNote}</p>
      {loopHostels.map((h) => (
        <div className="im-loop-row" key={h.name}>
          <div className="im-loop-head">
            <span className="im-loop-name">
              {h.name}
              {h.pick && <span className="im-loop-pick">My pick</span>}
            </span>
            <span className="im-loop-price">{h.longEasyRider}</span>
          </div>
          <div className="im-loop-party" aria-label={`Party level ${h.party} of 4`}>
            {[0, 1, 2, 3].map((i) => (
              <i key={i} className={i < h.party ? "on" : ""} aria-hidden="true">
                ●
              </i>
            ))}
            <span>party</span>
          </div>
          <p className="im-loop-meta">
            {h.versions}
            {h.selfRide ? ` · self-ride ${h.selfRide}` : ""}
          </p>
          <p className="im-loop-note">{h.note}</p>
        </div>
      ))}
    </div>
  );
}
