import type { Listing } from "@/domain";

export const SORT_IDS = ["active", "newest", "followed"] as const;
export type SortId = (typeof SORT_IDS)[number];

/** One way of deciding what goes at the top of the shelf. */
export interface RankingStrategy {
  readonly id: SortId;
  /** Returns a new list, best first. Never mutates the input. */
  rank(listings: readonly Listing[]): Listing[];
}

/**
 * Skeleton for rankings that boil down to "give each listing a number, biggest first".
 * Subclasses only say what the number is.
 */
export abstract class ScoreRanking implements RankingStrategy {
  abstract readonly id: SortId;

  abstract score(listing: Listing): number;

  rank(listings: readonly Listing[]): Listing[] {
    return listings
      .map((listing) => ({ listing, score: this.score(listing) }))
      .sort((a, b) => b.score - a.score || a.listing.project.name.localeCompare(b.listing.project.name))
      .map((entry) => entry.listing);
  }
}
