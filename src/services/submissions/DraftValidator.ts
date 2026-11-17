import { isOpenableLink, MAX_GENRES, type ProjectDraft, type UpdateDraft } from "./drafts";

/** One thing a draft has to get right before it can be sent. */
export interface FieldRule<D, F extends string, E extends string> {
  field: F;
  error: E;
  passes(draft: D): boolean;
}

export class DraftCheck<F extends string, E extends string> {
  constructor(
    readonly errors: Readonly<Partial<Record<F, E>>>,
    private readonly order: readonly F[],
  ) {}

  get ok(): boolean {
    return Object.keys(this.errors).length === 0;
  }

  /** The first field with a problem, in form order, so focus can go there. */
  firstInvalidField(): F | undefined {
    return this.order.find((field) => this.errors[field]);
  }
}

/** Checks a draft against a list of rules. Rules are data: add one to the list to add a check. */
export class DraftValidator<D, F extends string, E extends string> {
  private readonly order: readonly F[];

  constructor(private readonly rules: readonly FieldRule<D, F, E>[]) {
    this.order = [...new Set(rules.map((rule) => rule.field))];
  }

  validate(draft: D): DraftCheck<F, E> {
    const errors: Partial<Record<F, E>> = {};
    for (const rule of this.rules) {
      if (!errors[rule.field] && !rule.passes(draft)) errors[rule.field] = rule.error;
    }
    return new DraftCheck(errors, this.order);
  }
}

export type UpdateField = "project" | "title" | "afterOf";
export type UpdateError = "pickProject" | "emptyTitle" | "pickBefore";

/** An update needs a project and a line about what changed. A photo needs to say what it's the after of. */
export function updateValidator(): DraftValidator<UpdateDraft, UpdateField, UpdateError> {
  return new DraftValidator<UpdateDraft, UpdateField, UpdateError>([
    { field: "project", error: "pickProject", passes: (draft) => draft.projectId !== "" },
    { field: "title", error: "emptyTitle", passes: (draft) => draft.title.trim().length > 0 },
    { field: "afterOf", error: "pickBefore", passes: (draft) => draft.photoName === null || draft.afterOf !== null },
  ]);
}

export type ProjectField = "name" | "blurb" | "room" | "genres" | "stage" | "tryUrl";
export type ProjectError = "emptyName" | "emptyBlurb" | "pickRoom" | "pickGenre" | "tooManyGenres" | "pickStage" | "badLink";

/**
 * What a new project needs before Hamster Hub can look at it. The five screening checks
 * are separate (PickChecklist): a project can be sent with some of those still missing.
 */
export function projectValidator(): DraftValidator<ProjectDraft, ProjectField, ProjectError> {
  return new DraftValidator<ProjectDraft, ProjectField, ProjectError>([
    { field: "name", error: "emptyName", passes: (draft) => draft.name.trim().length > 0 },
    { field: "blurb", error: "emptyBlurb", passes: (draft) => draft.blurb.trim().length > 0 },
    { field: "room", error: "pickRoom", passes: (draft) => draft.room !== null },
    { field: "genres", error: "pickGenre", passes: (draft) => draft.genreIds.length > 0 },
    { field: "genres", error: "tooManyGenres", passes: (draft) => draft.genreIds.length <= MAX_GENRES },
    { field: "stage", error: "pickStage", passes: (draft) => draft.stageId !== null },
    { field: "tryUrl", error: "badLink", passes: (draft) => draft.tryUrl.trim() === "" || isOpenableLink(draft.tryUrl) },
  ]);
}
