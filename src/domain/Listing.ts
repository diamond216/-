import type { ActivityLog } from "./ActivityLog";
import type { Maker } from "./Maker";
import type { Project } from "./Project";
import type { ProjectUpdate } from "./ProjectUpdate";

/** A project as it appears on the shelf: the work, who made it, and what's been happening. */
export class Listing {
  constructor(
    readonly project: Project,
    readonly maker: Maker,
    readonly activity: ActivityLog,
  ) {}

  get id(): string {
    return this.project.id;
  }

  latestUpdate(): ProjectUpdate | undefined {
    return this.activity.latest();
  }

  /** Milliseconds since epoch of the last update, or 0 if it never posted one. */
  lastUpdatedAt(): number {
    return this.latestUpdate()?.postedAt.getTime() ?? 0;
  }

  updatedWithin(days: number, now: Date): boolean {
    return this.activity.hasUpdateWithin(days, now);
  }
}
