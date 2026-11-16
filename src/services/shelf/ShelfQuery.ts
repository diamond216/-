import type { CategoryId, StageId } from "@/domain";
import type { SortId } from "../ranking";

export interface ShelfQueryState {
  text: string;
  /** null means every category. */
  category: CategoryId | null;
  genres: readonly string[];
  stages: readonly StageId[];
  openToInvestment: boolean;
  hasDemo: boolean;
  updatedThisWeek: boolean;
  sort: SortId;
}

const DEFAULTS: ShelfQueryState = {
  text: "",
  category: null,
  genres: [],
  stages: [],
  openToInvestment: false,
  hasDemo: false,
  updatedThisWeek: false,
  sort: "active",
};

/** What the visitor has asked the shelf for: search words, filters and a sort. Immutable. */
export class ShelfQuery implements ShelfQueryState {
  static readonly EVERYTHING = new ShelfQuery();

  readonly text: string;
  readonly category: CategoryId | null;
  readonly genres: readonly string[];
  readonly stages: readonly StageId[];
  readonly openToInvestment: boolean;
  readonly hasDemo: boolean;
  readonly updatedThisWeek: boolean;
  readonly sort: SortId;

  constructor(state: Partial<ShelfQueryState> = {}) {
    const full = { ...DEFAULTS, ...state };
    this.text = full.text;
    this.category = full.category;
    this.genres = full.genres;
    this.stages = full.stages;
    this.openToInvestment = full.openToInvestment;
    this.hasDemo = full.hasDemo;
    this.updatedThisWeek = full.updatedThisWeek;
    this.sort = full.sort;
  }

  with(patch: Partial<ShelfQueryState>): ShelfQuery {
    return new ShelfQuery({ ...this.state(), ...patch });
  }

  state(): ShelfQueryState {
    return {
      text: this.text,
      category: this.category,
      genres: this.genres,
      stages: this.stages,
      openToInvestment: this.openToInvestment,
      hasDemo: this.hasDemo,
      updatedThisWeek: this.updatedThisWeek,
      sort: this.sort,
    };
  }

  get hasText(): boolean {
    return this.text.trim().length > 0;
  }

  hasGenre(id: string): boolean {
    return this.genres.includes(id);
  }

  hasStage(id: StageId): boolean {
    return this.stages.includes(id);
  }

  /** How many sidebar filters are switched on. Category and search aren't counted. */
  get sidebarFilterCount(): number {
    return (
      this.genres.length +
      this.stages.length +
      Number(this.openToInvestment) +
      Number(this.hasDemo) +
      Number(this.updatedThisWeek)
    );
  }

  /** True when anything narrows the shelf. Sorting alone doesn't. */
  get isNarrowed(): boolean {
    return this.hasText || this.category !== null || this.sidebarFilterCount > 0;
  }
}

/** Adds the value if it's missing, removes it if it's there. */
export function toggled<T>(values: readonly T[], value: T): T[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}
