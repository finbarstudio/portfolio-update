import { describe, expect, test } from "bun:test";
import { storeView, timeLabel } from "./store";

describe("timeLabel", () => {
  test("UK time, lower case, no space", () => {
    expect(timeLabel("2026-10-26T14:15:00Z")).toBe("2:15pm");
    expect(timeLabel("2026-07-01T13:05:00Z")).toBe("2:05pm");
    expect(timeLabel("2026-10-26T09:00:00Z")).toBe("9:00am");
  });
  test("nonsense gives nothing", () => {
    expect(timeLabel("later")).toBe("");
  });
});

describe("storeView", () => {
  test("yes with nothing fresh is just the status", () => {
    expect(storeView("yes", null)).toMatchObject({ text: "At Chislehurst ✓", tone: "g" });
    expect(storeView("likely", "Listed on the feed.", null, null).detail).toBe("Listed on the feed.");
  });
  test("in stock and fresh adds the time to the tap detail", () => {
    const v = storeView("yes", "Listed on the feed", "in", "2026-10-26T14:15:00Z");
    expect(v.tone).toBe("g");
    expect(v.text).toBe("At Chislehurst ✓");
    expect(v.detail).toBe("Listed on the feed. In stock at 2:15pm.");
  });
  test("out of stock today is amber, for yes and likely", () => {
    for (const s of ["yes", "likely"] as const) {
      const v = storeView(s, "whatever", "out", "2026-10-26T14:15:00Z");
      expect(v.text).toBe("At Chislehurst · out today");
      expect(v.tone).toBe("a");
      expect(v.detail).toBe("Chislehurst usually has it, but it's showing out of stock right now (checked 2:15pm)");
    }
  });
  test("a stock reading means nothing for no, unlikely or unknown", () => {
    expect(storeView("no", null, "out", "2026-10-26T14:15:00Z")).toMatchObject({ text: "Not at Chislehurst", tone: "r" });
    expect(storeView("unknown", null, "in", "2026-10-26T14:15:00Z")).toMatchObject({ text: "Check in store", tone: "n" });
    expect(storeView("unlikely", null, "out", "2026-10-26T14:15:00Z")).toMatchObject({ text: "Check in store", tone: "n" });
  });
  test("without a time the out message still reads", () => {
    expect(storeView("yes", null, "out", null).detail).toBe("Chislehurst usually has it, but it's showing out of stock right now");
  });
});
