import { describe, expect, it } from "vitest";
import { UpdateType } from "@/domain";
import { listing, NOW, update } from "@/test/fixtures";
import { FlowRanking, MostFollowed, NewestFirst, RankingRegistry } from ".";

const flow = new FlowRanking(NOW);

describe("FlowRanking", () => {
  it("weighs a fresh release at 5 and halves it every 14 days", () => {
    const fresh = listing("a", [update("a", 0, UpdateType.RELEASE)]);
    const old = listing("b", [update("b", 14 * 24, UpdateType.RELEASE)]);
    expect(flow.flow(fresh.activity)).toBeCloseTo(5, 5);
    expect(flow.flow(old.activity)).toBeCloseTo(2.5, 5);
  });

  it("caps what one calendar day can earn at 6 points", () => {
    const spam = Array.from({ length: 40 }, (_, n) => update("spam", 1, UpdateType.PATCH, n));
    const spammer = listing("spam", spam);
    expect(flow.flow(spammer.activity)).toBeLessThanOrEqual(6);
    expect(flow.flow(spammer.activity)).toBeGreaterThan(5.9);
  });

  it("puts a steady poster above a one-day spammer and a dormant project", () => {
    const steady = listing(
      "steady",
      [0, 3, 7, 10, 14, 17, 21].map((day) => update("steady", day * 24 + 1, UpdateType.DEVLOG)),
    );
    const spammer = listing(
      "spammer",
      Array.from({ length: 40 }, (_, n) => update("spammer", 1, UpdateType.PATCH, n)),
    );
    const dormant = listing("dormant", [update("dormant", 120 * 24, UpdateType.RELEASE)], { quality: 0.9, trust: 0.9 });
    expect(flow.rank([dormant, spammer, steady]).map((l) => l.id)).toEqual(["steady", "spammer", "dormant"]);
  });

  it("blends flow 60%, quality 25%, trust 15%", () => {
    const quiet = listing("q", [], { quality: 1, trust: 1 });
    expect(flow.score(quiet)).toBeCloseTo(0.4, 5);
  });

  it("ignores updates dated in the future", () => {
    expect(flow.flow(listing("f", [update("f", -5, UpdateType.RELEASE)]).activity)).toBe(0);
  });
});

describe("other sorts", () => {
  const a = listing("a", [update("a", 30)], { followers: 10 });
  const b = listing("b", [update("b", 2)], { followers: 300 });
  const c = listing("c", [update("c", 10)], { followers: 50 });

  it("NewestFirst orders by the latest update", () => {
    expect(new NewestFirst().rank([a, b, c]).map((l) => l.id)).toEqual(["b", "c", "a"]);
  });

  it("MostFollowed orders by followers", () => {
    expect(new MostFollowed().rank([a, b, c]).map((l) => l.id)).toEqual(["b", "c", "a"]);
  });

  it("the registry finds strategies by tab id", () => {
    const registry = new RankingRegistry([flow, new NewestFirst(), new MostFollowed()]);
    expect(registry.get("newest")).toBeInstanceOf(NewestFirst);
    expect(registry.ids()).toEqual(["active", "newest", "followed"]);
  });
});
