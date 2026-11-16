import type { Listing } from "@/domain";
import { ScoreRanking } from "./RankingStrategy";

/** "Most followed": the projects the most people asked to hear about. */
export class MostFollowed extends ScoreRanking {
  readonly id = "followed" as const;

  score(listing: Listing): number {
    return listing.project.followers;
  }
}
