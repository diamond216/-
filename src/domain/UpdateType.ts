import { LocalizedText } from "./LocalizedText";

export type UpdateTypeId = "release" | "feature" | "demo" | "field-test" | "devlog" | "media" | "patch";

/** How much an update says about real progress. Ranking weighs each class differently. */
export type UpdateWeightClass = "release" | "milestone" | "devlog" | "media" | "changelog";

/** The kind of thing a maker posted. */
export class UpdateType {
  static readonly RELEASE = new UpdateType("release", "Release", "release");
  static readonly FEATURE = new UpdateType("feature", "Feature", "milestone");
  static readonly DEMO = new UpdateType("demo", "Demo", "milestone");
  static readonly FIELD_TEST = new UpdateType("field-test", "Field test", "devlog");
  static readonly DEVLOG = new UpdateType("devlog", "Devlog", "devlog");
  static readonly MEDIA = new UpdateType("media", "Media", "media");
  static readonly PATCH = new UpdateType("patch", "Patch", "changelog");

  private static readonly registry: readonly UpdateType[] = [
    UpdateType.RELEASE,
    UpdateType.FEATURE,
    UpdateType.DEMO,
    UpdateType.FIELD_TEST,
    UpdateType.DEVLOG,
    UpdateType.MEDIA,
    UpdateType.PATCH,
  ];

  readonly label: LocalizedText;

  private constructor(
    readonly id: UpdateTypeId,
    name: string,
    readonly weightClass: UpdateWeightClass,
  ) {
    this.label = LocalizedText.same(name);
  }

  static all(): readonly UpdateType[] {
    return UpdateType.registry;
  }

  static byId(id: string): UpdateType | undefined {
    return UpdateType.registry.find((type) => type.id === id);
  }
}
