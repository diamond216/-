import type { LocalizedText } from "./LocalizedText";
import type { Money } from "./Money";

/** One holder's slice of a project. */
export class OwnershipShare {
  constructor(
    readonly holder: LocalizedText,
    readonly percent: number,
  ) {
    if (percent <= 0 || percent > 100) throw new RangeError(`A share must be between 0 and 100 (got ${percent})`);
  }
}

/** An amount with a short note after it: "฿320,000, all of it from Hamster Hub." */
export class NotedAmount {
  constructor(
    readonly amount: Money,
    readonly note: LocalizedText,
  ) {}
}

export class RaisingTarget {
  constructor(
    readonly target: Money,
    /** What the money is for, as the rest of a sentence. */
    readonly purpose: LocalizedText,
  ) {}
}

export interface MoneyLedgerProps {
  /** How it earns. Amounts inside can be marked **like this** to stand out. */
  earns: LocalizedText;
  ownership: readonly OwnershipShare[];
  /** null when it isn't raising. */
  raising: RaisingTarget | null;
  spent: NotedAmount;
  earned: NotedAmount;
  checkedOn: Date;
}

/** "The money part": how a project earns, who owns it, and what's gone in and come out. */
export class MoneyLedger {
  readonly earns: LocalizedText;
  readonly ownership: readonly OwnershipShare[];
  readonly raising: RaisingTarget | null;
  readonly spent: NotedAmount;
  readonly earned: NotedAmount;
  readonly checkedOn: Date;

  constructor(props: MoneyLedgerProps) {
    const total = props.ownership.reduce((sum, share) => sum + share.percent, 0);
    if (Math.abs(total - 100) > 0.001) throw new RangeError(`Ownership has to add up to 100% (got ${total}%)`);
    this.earns = props.earns;
    this.ownership = props.ownership;
    this.raising = props.raising;
    this.spent = props.spent;
    this.earned = props.earned;
    this.checkedOn = props.checkedOn;
  }

  get isRaising(): boolean {
    return this.raising !== null;
  }

  /** Earned minus spent, in baht. Negative while a project is still being paid for. */
  balance(): number {
    return this.earned.amount.baht - this.spent.amount.baht;
  }
}
