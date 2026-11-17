import { describe, expect, it } from "vitest";
import { createNest } from "@/composition/createNest";
import { CoverArt } from "@/domain";
import { MemoryStore } from "@/services/storage/KeyValueStore";
import { NOW } from "@/test/fixtures";
import {
  emptyProjectDraft,
  emptyUpdateDraft,
  LocalSubmissionOutbox,
  NO_BEFORE,
  PickChecklist,
  projectValidator,
  SavedDrafts,
  updateValidator,
} from ".";

const nest = createNest({ clock: NOW, storage: new MemoryStore() });

describe("PostingDesk", () => {
  it("offers a project's older photos newest first, each picture once", () => {
    const photos = nest.posting.desk.photosFor("burrow-knights");
    expect(photos.length).toBeGreaterThan(1);
    const keys = photos.map((photo) => {
      const art = photo.picture as CoverArt;
      return `${art.pattern}:${art.color}`;
    });
    expect(new Set(keys).size).toBe(keys.length);
    const dated = photos.filter((photo) => photo.postedAt && photo.id.startsWith("update-"));
    const times = dated.map((photo) => photo.postedAt!.getTime());
    expect(times).toEqual([...times].sort((a, b) => b - a));
    expect(nest.posting.desk.photosFor("no-such-project")).toEqual([]);
  });

  it("groups every project under its maker, and lists a room's own genres", () => {
    const groups = nest.posting.desk.projectsByMaker();
    const count = groups.reduce((sum, group) => sum + group.projects.length, 0);
    expect(count).toBe(nest.shelf.size());
    expect(groups.every((group) => group.projects.every((project) => project.makerId === group.maker.id))).toBe(true);
    expect(nest.posting.desk.genresFor("game").map((genre) => genre.id)).toContain("roguelike");
    expect(nest.posting.desk.genresFor("game").every((genre) => genre.home === "game")).toBe(true);
  });
});

describe("Update form rules", () => {
  const validator = updateValidator();

  it("needs a project and a line about what changed", () => {
    const check = validator.validate(emptyUpdateDraft());
    expect(check.errors).toEqual({ project: "pickProject", title: "emptyTitle" });
    expect(check.firstInvalidField()).toBe("project");
  });

  it("asks which photo a new one is the after of, and accepts 'none of these'", () => {
    const draft = { ...emptyUpdateDraft("burrow-knights"), title: "Two players now", photoName: "new.png" };
    expect(validator.validate(draft).errors).toEqual({ afterOf: "pickBefore" });
    expect(validator.validate({ ...draft, afterOf: "cover" }).ok).toBe(true);
    expect(validator.validate({ ...draft, afterOf: NO_BEFORE }).ok).toBe(true);
    expect(validator.validate({ ...draft, photoName: null }).ok).toBe(true);
  });
});

describe("New project form rules", () => {
  const validator = projectValidator();
  const ready = {
    ...emptyProjectDraft("game"),
    name: "Burrow Knights",
    blurb: "Dig with a friend.",
    genreIds: ["roguelike"],
    stageId: "beta" as const,
  };

  it("needs a name, a line, a room, one or two genres and a stage", () => {
    expect(validator.validate(emptyProjectDraft()).firstInvalidField()).toBe("name");
    expect(validator.validate(ready).ok).toBe(true);
    expect(validator.validate({ ...ready, genreIds: ["a", "b", "c"] }).errors).toEqual({ genres: "tooManyGenres" });
  });

  it("only flags the link when there is one and it can't be opened", () => {
    expect(validator.validate({ ...ready, tryUrl: "burrow knights" }).errors).toEqual({ tryUrl: "badLink" });
    expect(validator.validate({ ...ready, tryUrl: "https://pim.itch.io/burrow" }).ok).toBe(true);
  });

  it("the five screening checks don't block sending, they just count what's missing", () => {
    const checklist = new PickChecklist();
    expect(checklist.missingCount(ready)).toBe(5);
    const done = {
      ...ready,
      madeAtHub: true,
      tryUrl: "https://pim.itch.io/burrow",
      beforePhotoName: "first-cave.png",
      nowPhotoName: "today.png",
      money: "Free demo. Not raising yet.",
      willReply: true,
    };
    expect(checklist.review(done).every((result) => result.met)).toBe(true);
  });
});

describe("Sending and saving", () => {
  it("keeps sent posts in this browser, timestamped", async () => {
    const outbox = new LocalSubmissionOutbox(new MemoryStore(), NOW);
    const sent = await outbox.send({ kind: "update", draft: { ...emptyUpdateDraft("burrow-knights"), title: "Hi" } });
    expect(sent.sentAt).toBe(NOW.now().toISOString());
    expect(outbox.all()).toHaveLength(1);
  });

  it("saves one draft of each kind for later and tells listeners", () => {
    const drafts = new SavedDrafts(new MemoryStore());
    let heard = 0;
    drafts.subscribe(() => heard++);
    drafts.save("project", { ...emptyProjectDraft("iot"), name: "AquaNode" });
    expect(drafts.load<{ name: string }>("project")?.name).toBe("AquaNode");
    expect(drafts.load("update")).toBeNull();
    drafts.clear("project");
    expect(drafts.load("project")).toBeNull();
    expect(heard).toBe(2);
  });
});
