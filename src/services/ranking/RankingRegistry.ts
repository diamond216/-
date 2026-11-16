import type { RankingStrategy, SortId } from "./RankingStrategy";

/** Looks up the strategy behind a sort tab. To add a sort: write a strategy and register it. */
export class RankingRegistry {
  private readonly strategies = new Map<SortId, RankingStrategy>();

  constructor(
    strategies: readonly RankingStrategy[],
    private readonly fallback: SortId = "active",
  ) {
    strategies.forEach((strategy) => this.register(strategy));
    if (!this.strategies.has(fallback)) throw new Error(`No ranking registered for "${fallback}"`);
  }

  register(strategy: RankingStrategy): void {
    this.strategies.set(strategy.id, strategy);
  }

  get(id: SortId): RankingStrategy {
    return this.strategies.get(id) ?? (this.strategies.get(this.fallback) as RankingStrategy);
  }

  ids(): SortId[] {
    return [...this.strategies.keys()];
  }
}
