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

  it("the hero highlights are the shelf's top three, whatever the visitor has filtered", () => {
    expect(nest.shelf.highlights().map((l) => l.project.name)).toEqual(["WheelSense", "NestBoard", "Burrow Knights"]);
  });

  it("a highlight's maker note lists their other projects, not the one on show", () => {
    const burrow = nest.shelf.highlights().find((l) => l.id === "burrow-knights")!;
    const spotlight = nest.digest.spotlightFor(burrow)!;
    expect(spotlight.maker.id).toBe("pim");
    expect(spotlight.update).toBe(burrow.latestUpdate());
    expect(spotlight.otherProjects.map((l) => l.id)).not.toContain("burrow-knights");
    expect(spotlight.otherProjects.length).toBe(spotlight.projectCount - 1);
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
