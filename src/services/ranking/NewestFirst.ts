import type { Listing } from "@/domain";
import { ScoreRanking } from "./RankingStrategy";

/** "Newest": whoever posted most recently goes first. */
export class NewestFirst extends ScoreRanking {
  readonly id = "newest" as const;

  score(listing: Listing): number {
    return listing.lastUpdatedAt();
  }
}
