import { LocalizedText } from "./LocalizedText";

export type UpdateTypeId = "release" | "feature" | "milestone" | "demo" | "field-test" | "devlog" | "media" | "patch";

/** How much an update says about real progress. Ranking weighs each class differently. */
export type UpdateWeightClass = "release" | "milestone" | "devlog" | "media" | "changelog";

/** The kind of thing a maker posted. */
export class UpdateType {
  static readonly RELEASE = new UpdateType("release", "Release", "Releases", "release");
  static readonly FEATURE = new UpdateType("feature", "Feature", "Features", "milestone");
  static readonly MILESTONE = new UpdateType("milestone", "Milestone", "Milestones", "milestone");
  static readonly DEMO = new UpdateType("demo", "Demo", "Demos", "milestone");
  static readonly FIELD_TEST = new UpdateType("field-test", "Field test", "Field tests", "devlog");
  static readonly DEVLOG = new UpdateType("devlog", "Devlog", "Devlogs", "devlog");
  static readonly MEDIA = new UpdateType("media", "Media", "Media", "media");
  static readonly PATCH = new UpdateType("patch", "Patch", "Patches", "changelog");

  private static readonly registry: readonly UpdateType[] = [
    UpdateType.RELEASE,
    UpdateType.FEATURE,
    UpdateType.MILESTONE,
    UpdateType.DEMO,
    UpdateType.FIELD_TEST,
    UpdateType.DEVLOG,
    UpdateType.MEDIA,
    UpdateType.PATCH,
  ];

  readonly label: LocalizedText;
  /** For filter chips: "Demos 2". Update type names stay in English in both languages. */
  readonly plural: LocalizedText;

  private constructor(
    readonly id: UpdateTypeId,
    name: string,
    plural: string,
    readonly weightClass: UpdateWeightClass,
  ) {
    this.label = LocalizedText.same(name);
    this.plural = LocalizedText.same(plural);
  }

  static all(): readonly UpdateType[] {
    return UpdateType.registry;
  }

  static byId(id: string): UpdateType | undefined {
    return UpdateType.registry.find((type) => type.id === id);
  }
}
