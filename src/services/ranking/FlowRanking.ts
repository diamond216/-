import { type ActivityLog, type Clock, DAY_MS, type Listing, type UpdateWeightClass } from "@/domain";
import { ScoreRanking } from "./RankingStrategy";

export interface FlowRankingConfig {
  /** An update counts half as much after this many days. */
  halfLifeDays: number;
  /** How much each kind of update is worth when it's brand new. */
  weights: Readonly<Record<UpdateWeightClass, number>>;
  /** The most weight a project can earn in one calendar day, so posting forty patches doesn't help. */
  dailyCap: number;
  /** Bigger means flow has to be higher before it stops mattering. */
  saturation: number;
  blend: { flow: number; quality: number; trust: number };
}

export const DEFAULT_FLOW_CONFIG: FlowRankingConfig = {
  halfLifeDays: 14,
  weights: { release: 5, milestone: 4, devlog: 3, media: 1.5, changelog: 1 },
  dailyCap: 6,
  saturation: 6,
  blend: { flow: 0.6, quality: 0.25, trust: 0.15 },
};

/**
 * "Most active": projects that keep posting real updates rise.
 *
 *   flow = Σ weight(type) × 2^(−ageDays / halfLife)     (capped per calendar day)
 *   rank = 0.60 × (1 − e^(−flow / 6)) + 0.25 × quality + 0.15 × trust
 */
export class FlowRanking extends ScoreRanking {
  readonly id = "active" as const;

  constructor(
    private readonly clock: Clock,
    private readonly config: FlowRankingConfig = DEFAULT_FLOW_CONFIG,
  ) {
    super();
  }

  get weights(): Readonly<Record<UpdateWeightClass, number>> {
    return this.config.weights;
  }

  /** The decayed sum of a project's updates. */
  flow(activity: ActivityLog): number {
    const now = this.clock.now().getTime();
    const { halfLifeDays, weights, dailyCap } = this.config;
    const earnedPerDay = new Map<number, number>();
    let flow = 0;
    // Oldest first, so when a day hits its cap it's the later posts that stop counting.
    const chronological = [...activity.all()].reverse();
    for (const update of chronological) {
      const postedAt = update.postedAt.getTime();
      if (postedAt > now) continue;
      const day = Math.floor(postedAt / DAY_MS);
      const earned = earnedPerDay.get(day) ?? 0;
      const counted = Math.min(weights[update.type.weightClass], dailyCap - earned);
      if (counted <= 0) continue;
      earnedPerDay.set(day, earned + counted);
      const ageDays = (now - postedAt) / DAY_MS;
      flow += counted * 2 ** (-ageDays / halfLifeDays);
    }
    return flow;
  }

  /** Flow squashed into 0..1, so a very busy project can't drown out everything else. */
  flowNorm(activity: ActivityLog): number {
    return 1 - Math.exp(-this.flow(activity) / this.config.saturation);
  }

  score(listing: Listing): number {
    const { blend } = this.config;
    return (
      blend.flow * this.flowNorm(listing.activity) +
      blend.quality * listing.project.quality +
      blend.trust * listing.project.trust
    );
  }
}
