export type FreshnessId = "today" | "yesterday" | "thisWeek" | "thisMonth" | "earlier";

/**
 * How recently something moved, as a word a visitor reads at a glance.
 * The home page and the rooms show this instead of counts or charts.
 */
export class Freshness {
  static readonly TODAY = new Freshness("today", 1);
  static readonly YESTERDAY = new Freshness("yesterday", 2);
  static readonly THIS_WEEK = new Freshness("thisWeek", 7);
  static readonly THIS_MONTH = new Freshness("thisMonth", 30);
  static readonly EARLIER = new Freshness("earlier", Number.POSITIVE_INFINITY);

  private static readonly ladder: readonly Freshness[] = [
    Freshness.TODAY,
    Freshness.YESTERDAY,
    Freshness.THIS_WEEK,
    Freshness.THIS_MONTH,
    Freshness.EARLIER,
  ];

  private constructor(
    readonly id: FreshnessId,
    /** Posts younger than this many whole days land on this step. */
    private readonly withinDays: number,
  ) {}

  /** The first step the age fits on. Days are rolling 24-hour windows, so 0 means "today". */
  static of(daysAgo: number): Freshness {
    return Freshness.ladder.find((step) => daysAgo < step.withinDays) ?? Freshness.EARLIER;
  }

  /** Today is the only step that gets the highlighter. */
  get isToday(): boolean {
    return this === Freshness.TODAY;
  }
}
