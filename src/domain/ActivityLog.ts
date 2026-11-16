import type { ProjectUpdate } from "./ProjectUpdate";

/** A project's updates, newest first, with the questions the shelf keeps asking of them. */
export class ActivityLog {
  private readonly updates: readonly ProjectUpdate[];

  constructor(updates: readonly ProjectUpdate[]) {
    this.updates = [...updates].sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());
  }

  all(): readonly ProjectUpdate[] {
    return this.updates;
  }

  latest(): ProjectUpdate | undefined {
    return this.updates[0];
  }

  within(days: number, now: Date): ProjectUpdate[] {
    return this.updates.filter((update) => update.isWithinDays(days, now));
  }

  countWithin(days: number, now: Date): number {
    return this.within(days, now).length;
  }

  hasUpdateWithin(days: number, now: Date): boolean {
    return this.updates.some((update) => update.isWithinDays(days, now));
  }

  /** One flag per day, oldest first: did anything get posted that day? */
  dailyStrip(days: number, now: Date): boolean[] {
    const strip = new Array<boolean>(days).fill(false);
    for (const update of this.within(days, now)) {
      strip[days - 1 - update.daysAgo(now)] = true;
    }
    return strip;
  }
}
