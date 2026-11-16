import { describe, expect, it } from "vitest";
import { createNest } from "@/composition/createNest";
import { HubCheck, LocalizedText, Money, MoneyLedger, NotedAmount, OwnershipShare, UpdateType } from "@/domain";
import { MemoryStore } from "@/services/storage/KeyValueStore";
import { NOW, update } from "@/test/fixtures";
import { FollowStore } from "../follow/FollowStore";
import { UpdateStream } from "./UpdateStream";

const nest = createNest({ clock: NOW, storage: new MemoryStore() });

describe("ProjectPageService", () => {
  const page = nest.projectPages.forSlug("burrow-knights");

  it("finds projects by slug and nothing for an unknown one", () => {
    expect(page?.listing.project.name).toBe("Burrow Knights");
    expect(nest.projectPages.forSlug("no-such-thing")).toBeUndefined();
    expect(nest.projectPages.slugs()).toHaveLength(nest.shelf.size());
  });

  it("matches the draft: 11 updates in 30 days, No. 3 this week", () => {
    expect(page?.updatesInWindow).toBe(11);
    expect(page?.strip).toHaveLength(30);
    expect(page?.position).toBe(3);
    expect(nest.projectPages.forSlug("wheelsense")?.position).toBe(1);
  });

  it("adds the recent-update check only when there was one", () => {
    expect(page?.hubChecks).toEqual([HubCheck.TEAM, HubCheck.BUILD, HubCheck.MONEY, HubCheck.RECENT]);
    // Paused projects have no Hub section at all.
    expect(nest.projectPages.forSlug("night-wheel")?.hubChecks).toEqual([]);
  });

  it("shows only endorsements people agreed to, with their kind", () => {
    expect(page?.endorsements.map((e) => e.kind.id)).toEqual(["played", "invested"]);
    expect(nest.projectPages.forSlug("moonwheel")?.endorsements).toEqual([]);
  });
});

describe("UpdateStream", () => {
  const stream = nest.projectPages.forSlug("burrow-knights")!.stream;

  it("counts each type in the order it first appears", () => {
    expect(stream.facets().map((f) => `${f.type.label.en} ${f.count}`)).toEqual([
      "Demo 2",
      "Devlog 4",
      "Patch 4",
      "Milestone 1",
    ]);
  });

  it("filters by type and folds older updates", () => {
    expect(stream.ofType("patch").every((u) => u.type === UpdateType.PATCH)).toBe(true);
    const { shown, older } = stream.page(null, 4);
    expect(shown.map((u) => u.title.en)).toEqual([
      "The two-player demo is up",
      "Why I threw away the first cave generator",
      "0.4.2: moles hit less hard",
      "A hundred people have played it",
    ]);
    expect(older).toHaveLength(7);
  });

  it("sorts whatever order it's given", () => {
    const s = new UpdateStream([update("x", 50), update("x", 1), update("x", 10)]);
    expect(s.ofType(null).map((u) => u.id)).toEqual(["x-1-0", "x-10-0", "x-50-0"]);
  });
});

describe("MoneyLedger", () => {
  const share = (percent: number) => new OwnershipShare(LocalizedText.same("Someone"), percent);
  const amount = (baht: number) => new NotedAmount(Money.baht(baht), LocalizedText.same("."));
  const ledger = (owners: number[]) =>
    new MoneyLedger({
      earns: LocalizedText.same("Sales."),
      ownership: owners.map(share),
      raising: null,
      spent: amount(320_000),
      earned: amount(20_000),
      checkedOn: NOW.now(),
    });

  it("insists ownership adds up to 100%", () => {
    expect(() => ledger([60, 30])).toThrow(/100%/);
    expect(ledger([60, 40]).balance()).toBe(-300_000);
  });

  it("formats baht the way the draft writes it", () => {
    expect(Money.baht(320_000).format()).toBe("฿320,000");
    expect(Money.baht(1_500_000).format()).toBe("฿1.5M");
    expect(Money.baht(2_000_000).format()).toBe("฿2M");
    expect(Money.ZERO.format()).toBe("฿0");
  });

  it("Burrow Knights' ledger matches the draft", () => {
    const bk = nest.projectPages.forSlug("burrow-knights")!.listing.project.ledger!;
    expect(bk.ownership.map((s) => s.percent)).toEqual([60, 40]);
    expect(bk.raising?.target.format()).toBe("฿1.5M");
    expect(bk.spent.amount.format()).toBe("฿320,000");
    expect(bk.earned.amount.isZero()).toBe(true);
  });
});

describe("MakerProfileService", () => {
  const pim = nest.makerProfiles.forSlug("pim")!;

  it("finds makers by slug", () => {
    expect(pim.maker.name).toBe("Pim");
    expect(nest.makerProfiles.forSlug("nobody")).toBeUndefined();
    expect(nest.makerProfiles.slugs()).toEqual(["pim", "mind", "tonkla", "fahsai", "phoom"]);
  });

  it("computes the numbers at the top", () => {
    expect(pim.numbers.projects).toBe(4);
    expect(pim.numbers.awards).toBe(2); // the finalist entry is a mention, not an award
    const expected = pim.listings.reduce((sum, l) => sum + l.activity.countWithin(90, NOW.now()), 0);
    expect(pim.numbers.updates).toBe(expected);
    expect(pim.numbers.postingDays).toBe(pim.strip.filter(Boolean).length);
    expect(pim.strip).toHaveLength(90);
  });

  it("leads with the busiest project and the newest post", () => {
    expect(pim.listings[0].project.name).toBe("Burrow Knights");
    expect(pim.latest?.update.title.en).toBe("The two-player demo is up");
    expect(pim.colleague?.kind.id).toBe("colleague");
    expect(nest.makerProfiles.forSlug("phoom")?.colleague).toBeUndefined();
  });

  it("puts paused projects last", () => {
    const mind = nest.makerProfiles.forSlug("mind")!;
    expect(mind.listings.at(-1)?.project.paused).toBe(true);
  });
});

describe("FollowStore", () => {
  it("toggles, counts the visitor in, and survives a reload", () => {
    const storage = new MemoryStore();
    const follows = new FollowStore(storage);
    expect(follows.countWith(214, "bk")).toBe(214);
    expect(follows.toggle("bk")).toBe(true);
    expect(follows.countWith(214, "bk")).toBe(215);
    expect(new FollowStore(storage).isFollowing("bk")).toBe(true);
    expect(follows.toggle("bk")).toBe(false);
    expect(new FollowStore(storage).isFollowing("bk")).toBe(false);
  });
});
