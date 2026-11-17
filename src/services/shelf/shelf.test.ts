import { describe, expect, it } from "vitest";
import { createNest } from "@/composition/createNest";
import { NOW } from "@/test/fixtures";
import { MemoryStore } from "@/services/storage/KeyValueStore";
import { ShelfQuery } from ".";

const nest = createNest({ clock: NOW, storage: new MemoryStore() });
const names = (query: ShelfQuery) => {
  const view = nest.shelf.browse(query);
  return [...view.featured, ...view.rest].map((l) => l.project.name);
};

describe("Shelf with the sample data", () => {
  it("counts come from the data", () => {
    const counts = nest.shelf.categoryCounts().reduce((sum, c) => sum + c.count, 0);
    expect(counts).toBe(nest.shelf.size());
    expect(nest.shelf.size()).toBeGreaterThanOrEqual(12);
    expect(nest.digest.stats().updates).toBeGreaterThan(50);
  });

  it("the busiest three are computed, WheelSense first", () => {
    const view = nest.shelf.browse(ShelfQuery.EVERYTHING);
    expect(view.featured.map((l) => l.project.name)).toEqual(["WheelSense", "NestBoard", "Burrow Knights"]);
    expect(view.featured.length + view.rest.length).toBe(view.total);
  });

  it("the home highlight is the top project of each room, in room order", () => {
    const best = nest.shelf.bestOfEachRoom();
    expect(best.map((l) => l.project.category.id)).toEqual(["game", "iot", "web", "idea"]);
    expect(best.map((l) => l.project.name).slice(0, 3)).toEqual(["Burrow Knights", "WheelSense", "NestBoard"]);
  });

  it("a room only holds its own category, newest first when asked", () => {
    const games = nest.shelf.room("game", new ShelfQuery({ sort: "newest" }));
    expect(games.length).toBeGreaterThan(1);
    expect(games.every((l) => l.project.isIn("game"))).toBe(true);
    const times = games.map((l) => l.lastUpdatedAt());
    expect(times).toEqual([...times].sort((a, b) => b - a));
    expect(nest.shelf.room("game", new ShelfQuery({ genres: ["puzzle"] })).map((l) => l.project.name)).toEqual(["Moonwheel"]);
  });

  it("a room's strongest three come from its matches and stay in the full list", () => {
    const view = nest.shelf.roomView("game", new ShelfQuery({ sort: "newest" }));
    expect(view.strongest.length).toBeLessThanOrEqual(3);
    expect(view.strongest[0].project.name).toBe("Burrow Knights");
    const ids = new Set(view.latest.map((l) => l.id));
    expect(view.strongest.every((l) => ids.has(l.id))).toBe(true);
    expect(view.latest).toHaveLength(nest.shelf.roomSize("game"));
  });

  it("a room narrows by stage and by the investor filters together", () => {
    const all = nest.shelf.roomView("game", ShelfQuery.EVERYTHING).latest;
    const view = nest.shelf.roomView("game", new ShelfQuery({ stages: ["beta", "live"], openToInvestment: true }));
    const expected = all.filter((l) => (l.project.isAt("beta") || l.project.isAt("live")) && l.project.openToInvestment);
    expect(view.latest.map((l) => l.id).sort()).toEqual(expected.map((l) => l.id).sort());
    expect(view.strongest.every((l) => expected.includes(l))).toBe(true);
  });

  it("before-and-now shows each project once, newest first", () => {
    const entries = nest.digest.latestPerProject(3);
    expect(entries).toHaveLength(3);
    expect(new Set(entries.map((e) => e.listing.id)).size).toBe(3);
    expect(entries.every((e) => e.update === e.listing.latestUpdate())).toBe(true);
  });

  it("filters compose with category and sort", () => {
    const query = new ShelfQuery({ category: "iot", openToInvestment: true, sort: "followed" });
    expect(names(query)).toEqual(["AquaNode", "Coop Watch"]);
    expect(names(query.with({ stages: ["beta"] }))).toEqual([]);
  });

  it("searches in English and Thai, including mid-phrase Thai", () => {
    expect(names(new ShelfQuery({ text: "soil sensor" }))).toEqual(["WheelSense"]);
    expect(names(new ShelfQuery({ text: "co-op roguelike" }))).toEqual(["Burrow Knights"]);
    expect(names(new ShelfQuery({ text: "กุ้ง" }))).toEqual(["AquaNode"]);
    expect(names(new ShelfQuery({ text: "เซนเซอร์วัดดิน" }))).toContain("WheelSense");
    expect(names(new ShelfQuery({ text: "zzzz nothing" }))).toEqual([]);
  });

  it("the spotlight is the maker of the most recent update", () => {
    expect(nest.digest.spotlight()?.maker.name).toBe("Pim");
  });
});

describe("Hero donut slices", () => {
  it("put every project in exactly one slice, in a fixed order", () => {
    const slices = nest.digest.momentum();
    expect(slices.map((s) => s.key)).toEqual(["today", "open", "building", "paused"]);
    expect(slices.reduce((sum, s) => sum + s.count, 0)).toBe(nest.shelf.size());
    const today = slices.find((s) => s.key === "today")!;
    expect(today.count).toBe(nest.digest.stats().projectsUpdatedToday);
  });
});
