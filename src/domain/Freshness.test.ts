import { describe, expect, it } from "vitest";
import { Freshness } from "./Freshness";

describe("Freshness", () => {
  it("turns an age in days into the word a visitor reads", () => {
    expect(Freshness.of(0).id).toBe("today");
    expect(Freshness.of(1).id).toBe("yesterday");
    expect(Freshness.of(2).id).toBe("thisWeek");
    expect(Freshness.of(6).id).toBe("thisWeek");
    expect(Freshness.of(7).id).toBe("thisMonth");
    expect(Freshness.of(29).id).toBe("thisMonth");
    expect(Freshness.of(30).id).toBe("earlier");
  });

  it("only highlights today", () => {
    expect(Freshness.of(0).isToday).toBe(true);
    expect(Freshness.of(1).isToday).toBe(false);
  });
});
