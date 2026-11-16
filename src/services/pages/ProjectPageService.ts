import { type Clock, type Endorsement, HubCheck, type Listing, type ProjectUpdate } from "@/domain";
import type { EndorsementRepository } from "@/data/repositories";
import { ACTIVITY_WINDOW_DAYS, type ListingDirectory, type Shelf } from "../shelf";
import { UpdateStream } from "./UpdateStream";

export interface ProjectPage {
  listing: Listing;
  stream: UpdateStream;
  /** One flag per day for the last 30 days, oldest first. */
  strip: boolean[];
  updatesInWindow: number;
  latest?: ProjectUpdate;
  /** "No. 3 this week". */
  position?: number;
  /** Checks a person signed off, plus "updated in the last 30 days" when that's true. */
  hubChecks: HubCheck[];
  endorsements: readonly Endorsement[];
}

/** Gathers what a project page needs, looked up by its slug. */
export class ProjectPageService {
  constructor(
    private readonly directory: ListingDirectory,
    private readonly shelf: Shelf,
    private readonly endorsements: EndorsementRepository,
    private readonly clock: Clock,
  ) {}

  slugs(): string[] {
    return this.directory.all().map((listing) => listing.id);
  }

  forSlug(slug: string): ProjectPage | undefined {
    const listing = this.directory.forProject(slug);
    if (!listing) return undefined;
    const now = this.clock.now();
    const { activity, project } = listing;
    const recent = activity.hasUpdateWithin(ACTIVITY_WINDOW_DAYS, now);
    const hubChecks = [...(project.hub?.checks ?? []), ...(project.hub && recent ? [HubCheck.RECENT] : [])].sort(
      (a, b) => HubCheck.order(a) - HubCheck.order(b),
    );
    return {
      listing,
      stream: new UpdateStream(activity.all()),
      strip: activity.dailyStrip(ACTIVITY_WINDOW_DAYS, now),
      updatesInWindow: activity.countWithin(ACTIVITY_WINDOW_DAYS, now),
      latest: activity.latest(),
      position: this.shelf.positionOf(project.id),
      hubChecks,
      endorsements: this.endorsements.forProject(project.id),
    };
  }
}
