import type { Clock, Genre, Listing, Maker, ProjectUpdate } from "@/domain";
import type { GenreRepository, UpdateRepository } from "@/data/repositories";
import type { FlowRanking } from "../ranking";
import type { ListingDirectory } from "./ListingDirectory";
import { THIS_WEEK_DAYS } from "./ListingSpecificationBuilder";

export const ACTIVITY_WINDOW_DAYS = 30;

export interface ShelfStats {
  projects: number;
  /** Updates posted inside the activity window. */
  updates: number;
  windowDays: number;
  projectsUpdatedToday: number;
  openToInvestment: number;
  paused: number;
  /** Share of the window's updates that landed in the last week, 0 to 1. */
  thisWeekShare: number;
}

export interface FeedEntry {
  update: ProjectUpdate;
  listing: Listing;
}

export interface MakerSpotlight {
  maker: Maker;
  projectCount: number;
  update: ProjectUpdate;
  listing: Listing;
}

/** One mark on the update wheel. */
export interface WheelTick {
  id: string;
  today: boolean;
  /** 0 to 1: how much this kind of update counts towards ranking. */
  strength: number;
}

/** The "what's been happening" numbers: totals, the latest posts, who posted last. */
export class ActivityDigest {
  constructor(
    private readonly directory: ListingDirectory,
    private readonly updates: UpdateRepository,
    private readonly genres: GenreRepository,
    private readonly flow: FlowRanking,
    private readonly clock: Clock,
    private readonly windowDays = ACTIVITY_WINDOW_DAYS,
  ) {}

  stats(): ShelfStats {
    const now = this.clock.now();
    const listings = this.directory.all();
    const inWindow = this.recentUpdates();
    const thisWeek = inWindow.filter((update) => update.isWithinDays(THIS_WEEK_DAYS, now)).length;
    return {
      projects: listings.length,
      updates: inWindow.length,
      windowDays: this.windowDays,
      projectsUpdatedToday: listings.filter((listing) => listing.updatedWithin(1, now)).length,
      openToInvestment: listings.filter((listing) => listing.project.openToInvestment).length,
      paused: listings.filter((listing) => listing.project.paused).length,
      thisWeekShare: inWindow.length === 0 ? 0 : thisWeek / inWindow.length,
    };
  }

  /** The newest posts across the whole shelf. */
  feed(limit: number): FeedEntry[] {
    return this.updates
      .latest(limit)
      .map((update) => ({ update, listing: this.directory.forProject(update.projectId) }))
      .filter((entry): entry is FeedEntry => entry.listing !== undefined);
  }

  /** The maker behind the most recent update anywhere on the shelf. */
  spotlight(): MakerSpotlight | undefined {
    const [latest] = this.feed(1);
    if (!latest) return undefined;
    const { maker } = latest.listing;
    return {
      maker,
      projectCount: this.directory.all().filter((listing) => listing.maker.id === maker.id).length,
      update: latest.update,
      listing: latest.listing,
    };
  }

  /** One tick per update in the window, oldest first. */
  wheel(): WheelTick[] {
    const now = this.clock.now();
    const heaviest = Math.max(...Object.values(this.flow.weights));
    return [...this.recentUpdates()].reverse().map((update) => ({
      id: update.id,
      today: update.isWithinDays(1, now),
      strength: this.flow.weights[update.type.weightClass] / heaviest,
    }));
  }

  /** Genres whose projects have the most going on right now. */
  busyGenres(limit: number): Genre[] {
    const flowByGenre = new Map<string, number>();
    for (const listing of this.directory.all()) {
      const flow = this.flow.flow(listing.activity);
      // Each project counts once, towards its main genre.
      const { id } = listing.project.primaryGenre;
      flowByGenre.set(id, (flowByGenre.get(id) ?? 0) + flow);
    }
    return this.genres
      .all()
      .filter((genre) => (flowByGenre.get(genre.id) ?? 0) > 0)
      .sort((a, b) => (flowByGenre.get(b.id) ?? 0) - (flowByGenre.get(a.id) ?? 0))
      .slice(0, limit);
  }

  private recentUpdates(): ProjectUpdate[] {
    const now = this.clock.now();
    return this.updates.all().filter((update) => update.isWithinDays(this.windowDays, now));
  }
}
