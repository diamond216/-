import type { CategoryId } from "./Category";
import { LocalizedText } from "./LocalizedText";

/** A kind of project inside a category: Roguelike, SaaS, Smart farm… */
export class Genre {
  readonly label: LocalizedText;

  constructor(
    readonly id: string,
    name: string,
    /** The category this genre usually lives in. */
    readonly home: CategoryId,
    /** Extra words people might type when they mean this genre. */
    readonly keywords: readonly string[] = [],
  ) {
    this.label = LocalizedText.same(name);
  }

  get name(): string {
    return this.label.en;
  }

  searchTerms(): string[] {
    return [this.name, ...this.keywords];
  }
}
