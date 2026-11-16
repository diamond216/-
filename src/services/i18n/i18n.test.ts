import { describe, expect, it } from "vitest";
import { HOUR_MS } from "@/domain";
import { NOW } from "@/test/fixtures";
import { Localizer } from ".";
import { en } from "./en";
import { th } from "./th";

const banned = /\b(elevate|delve|tapestry|seamless|empower|game-changer|unlock|transform)/i;

describe("Localizer", () => {
  it("has a Thai string for every English key", () => {
    expect(Object.keys(th).sort()).toEqual(Object.keys(en).sort());
  });

  it("formats times and counts", () => {
    const then = new Date(NOW.now().getTime() - 2 * HOUR_MS);
    expect(Localizer.for("en").ago(then, NOW.now())).toBe("2 hrs ago");
    expect(Localizer.for("th").ago(then, NOW.now(), "short")).toBe("2 ชม.");
    expect(Localizer.for("en").t("card.updates", { count: 1 })).toBe("1 update");
  });

  it("keeps to the copy rules: no exclamation marks, none of the banned words", () => {
    for (const value of Object.values(en)) {
      if (typeof value !== "string") continue;
      expect(value).not.toMatch(/!/);
      expect(value).not.toMatch(banned);
    }
  });
});
