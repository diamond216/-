export const MINUTE_MS = 60_000;
export const HOUR_MS = 60 * MINUTE_MS;
export const DAY_MS = 24 * HOUR_MS;

/** Time is injected so rules stay deterministic and testable. */
export interface Clock {
  now(): Date;
}

/** A clock that always answers with the same instant: one page load, one "now". */
export class FrozenClock implements Clock {
  private readonly instant: number;

  constructor(at: Date | number | string) {
    this.instant = new Date(at).getTime();
  }

  static atLoad(): FrozenClock {
    return new FrozenClock(Date.now());
  }

  now(): Date {
    return new Date(this.instant);
  }
}
