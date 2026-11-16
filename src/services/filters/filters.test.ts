import { describe, expect, it } from "vitest";
import { Category, Stage } from "@/domain";
import { listing, NOW, update } from "@/test/fixtures";
import { AllOf, AnyOf, AtStage, HasSomethingToTry, InCategory, OpenToInvestment, UpdatedWithinDays } from ".";

const game = listing("game", [update("game", 2)], { stage: Stage.BETA, demoUrl: "#" });
const web = listing("web", [update("web", 10 * 24)], { category: Category.WEB, stage: Stage.LIVE, openToInvestment: true });
const idea = listing("idea", [], { category: Category.IDEA, stage: Stage.CONCEPT, openToInvestment: true });
const all = [game, web, idea];
const ids = (spec: { isSatisfiedBy(l: typeof game): boolean }) => all.filter((l) => spec.isSatisfiedBy(l)).map((l) => l.id);

describe("listing specifications", () => {
  it("filter one thing each", () => {
    expect(ids(new InCategory("web"))).toEqual(["web"]);
    expect(ids(new OpenToInvestment())).toEqual(["web", "idea"]);
    expect(ids(new HasSomethingToTry())).toEqual(["game"]);
    expect(ids(new UpdatedWithinDays(7, NOW))).toEqual(["game"]);
  });

  it("compose: choices in a group widen, groups narrow", () => {
    const stages = new AnyOf([new AtStage("beta"), new AtStage("live")]);
    expect(ids(stages)).toEqual(["game", "web"]);
    expect(ids(new AllOf([stages, new OpenToInvestment()]))).toEqual(["web"]);
    expect(ids(new OpenToInvestment().and(new InCategory("idea")).not())).toEqual(["game", "web"]);
  });

  it("no filters means everything", () => {
    expect(ids(new AllOf([]))).toEqual(["game", "web", "idea"]);
  });
});
