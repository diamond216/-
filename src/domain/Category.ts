import { LocalizedText } from "./LocalizedText";

export type CategoryId = "game" | "web" | "iot" | "idea";

/** One of the four shelves a project can sit on. */
export class Category {
  static readonly GAME = new Category("game", new LocalizedText("Games", "เกม"), "Game", new LocalizedText("Game", "เกม"));
  static readonly WEB = new Category("web", new LocalizedText("Web", "เว็บ"), "Web", new LocalizedText("Web app", "เว็บแอป"));
  static readonly IOT = new Category("iot", LocalizedText.same("IoT"), "IoT", new LocalizedText("IoT", "IoT"));
  static readonly IDEA = new Category("idea", new LocalizedText("Ideas", "ไอเดีย"), "Idea", new LocalizedText("Idea", "ไอเดีย"));

  private static readonly registry: readonly Category[] = [
    Category.GAME,
    Category.WEB,
    Category.IOT,
    Category.IDEA,
  ];

  private constructor(
    readonly id: CategoryId,
    /** Plural label used on the tab. */
    readonly label: LocalizedText,
    /** Singular chip shown on a cover. Stays in English in both languages. */
    readonly tag: string,
    /** One of them, in a sentence or a facts table: "Game". */
    readonly singular: LocalizedText,
  ) {}

  static all(): readonly Category[] {
    return Category.registry;
  }

  /** The four rooms in the order the home page shows them: Game, IoT, Web, Idea. */
  static rooms(): readonly Category[] {
    return [Category.GAME, Category.IOT, Category.WEB, Category.IDEA];
  }

  static ids(): CategoryId[] {
    return Category.registry.map((category) => category.id);
  }

  static byId(id: string): Category | undefined {
    return Category.registry.find((category) => category.id === id);
  }
}
