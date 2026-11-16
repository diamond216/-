/** An amount of Thai baht. Whole baht only; the shelf never needs satang. */
export class Money {
  private constructor(readonly baht: number) {}

  static baht(amount: number): Money {
    if (!Number.isFinite(amount) || amount < 0) throw new RangeError(`Not a sensible amount: ${amount}`);
    return new Money(Math.round(amount));
  }

  static readonly ZERO = Money.baht(0);

  isZero(): boolean {
    return this.baht === 0;
  }

  plus(other: Money): Money {
    return Money.baht(this.baht + other.baht);
  }

  /** ฿320,000, or ฿1.5M once it's a million or more. */
  format(): string {
    if (this.baht >= 1_000_000) {
      const millions = this.baht / 1_000_000;
      return `฿${Number.isInteger(millions) ? millions : millions.toFixed(1).replace(/\.0$/, "")}M`;
    }
    return `฿${this.baht.toLocaleString("en-US")}`;
  }
}
