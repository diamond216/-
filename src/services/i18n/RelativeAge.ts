import { DAY_MS, HOUR_MS, MINUTE_MS } from "@/domain";

export type AgeUnit = "now" | "minute" | "hour" | "yesterday" | "day" | "week";

/** How long ago something happened, in the roughest unit that's still honest. */
export class RelativeAge {
  private constructor(
    readonly unit: AgeUnit,
    readonly count: number,
  ) {}

  static between(then: Date, now: Date): RelativeAge {
    const elapsed = Math.max(0, now.getTime() - then.getTime());
    if (elapsed < MINUTE_MS) return new RelativeAge("now", 0);
    if (elapsed < HOUR_MS) return new RelativeAge("minute", Math.floor(elapsed / MINUTE_MS));
    if (elapsed < DAY_MS) return new RelativeAge("hour", Math.floor(elapsed / HOUR_MS));
    if (elapsed < 2 * DAY_MS) return new RelativeAge("yesterday", 1);
    // From two weeks on, weeks read better than "17 days".
    if (elapsed < 14 * DAY_MS) return new RelativeAge("day", Math.floor(elapsed / DAY_MS));
    return new RelativeAge("week", Math.floor(elapsed / (7 * DAY_MS)));
  }
}
