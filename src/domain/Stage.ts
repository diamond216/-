import { LocalizedText } from "./LocalizedText";

export type StageId = "concept" | "prototype" | "beta" | "live";

/** How far along a project is. Ordered from first sketch to in people's hands. */
export class Stage {
  static readonly CONCEPT = new Stage("concept", 0, new LocalizedText("Concept", "ยังเป็นไอเดีย"), "Concept");
  static readonly PROTOTYPE = new Stage("prototype", 1, new LocalizedText("Prototype", "ต้นแบบ"), "Prototype");
  static readonly BETA = new Stage("beta", 2, LocalizedText.same("Beta"), "Beta");
  static readonly LIVE = new Stage("live", 3, new LocalizedText("Live", "ใช้งานจริงแล้ว"), "Live");

  private static readonly registry: readonly Stage[] = [Stage.CONCEPT, Stage.PROTOTYPE, Stage.BETA, Stage.LIVE];

  private constructor(
    readonly id: StageId,
    readonly order: number,
    /** Label in the filter list. */
    readonly label: LocalizedText,
    /** Short badge on a card. Stays in English in both languages. */
    readonly badge: string,
  ) {}

  static all(): readonly Stage[] {
    return Stage.registry;
  }

  static ids(): StageId[] {
    return Stage.registry.map((stage) => stage.id);
  }

  static byId(id: string): Stage | undefined {
    return Stage.registry.find((stage) => stage.id === id);
  }
}
