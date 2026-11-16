import { ActivityLog, type Clock, type Endorsement, type Listing, type Maker } from "@/domain";
import type { EndorsementRepository, MakerRepository } from "@/data/repositories";
import type { RankingStrategy } from "../ranking";
import type { FeedEntry, ListingDirectory } from "../shelf";

export const PROFILE_WINDOW_DAYS = 90;

export interface MakerNumbers {
  projects: number;
  /** Updates posted in the last 90 days, across all their projects. */
  updates: number;
  /** Different days they posted on, in the same window. */
  postingDays: number;
  awards: number;
}

export interface MakerProfile {
  maker: Maker;
  /** Their projects, busiest first. Paused ones go last. */
  listings: Listing[];
  numbers: MakerNumbers;
  latest?: FeedEntry;
  /** One flag per day for the last 90 days, oldest first. */
  strip: boolean[];
  /** A quote about them from someone they work with. */
  colleague?: Endorsement;
}

/** Gathers what a maker's profile needs, looked up by their slug. */
export class MakerProfileService {
  constructor(
    private readonly makers: MakerRepository,
    private readonly directory: ListingDirectory,
    private readonly endorsements: EndorsementRepository,
    private readonly ranking: RankingStrategy,
    private readonly clock: Clock,
  ) {}

  slugs(): string[] {
    return this.makers.all().map((maker) => maker.id);
  }

  forSlug(slug: string): MakerProfile | undefined {
    const maker = this.makers.byId(slug);
    if (!maker) return undefined;
    const now = this.clock.now();
    const own = this.directory.all().filter((listing) => listing.maker.id === maker.id);
    const ranked = this.ranking.rank(own);
    const listings = [...ranked.filter((l) => !l.project.paused), ...ranked.filter((l) => l.project.paused)];
    const log = ActivityLog.merge(own.map((listing) => listing.activity));
    const latestUpdate = log.latest();
    const latestListing = latestUpdate && this.directory.forProject(latestUpdate.projectId);

    return {
      maker,
      listings,
      numbers: {
        projects: own.length,
        updates: log.countWithin(PROFILE_WINDOW_DAYS, now),
        postingDays: log.activeDaysWithin(PROFILE_WINDOW_DAYS, now),
        awards: maker.story.awardCount(),
      },
      latest: latestUpdate && latestListing ? { update: latestUpdate, listing: latestListing } : undefined,
      strip: log.dailyStrip(PROFILE_WINDOW_DAYS, now),
      colleague: this.endorsements.forMaker(maker.id)[0],
    };
  }
}
