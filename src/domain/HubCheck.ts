import { LocalizedText } from "./LocalizedText";

export type HubCheckId = "team" | "build" | "money" | "recent";

/** One thing Hamster Hub looks at before a project goes up. */
export class HubCheck {
  static readonly TEAM = new HubCheck("team", new LocalizedText("Team checked", "ตรวจทีมแล้ว"));
  static readonly BUILD = new HubCheck("build", new LocalizedText("Playable build checked", "ตรวจของที่ลองได้แล้ว"));
  static readonly MONEY = new HubCheck("money", new LocalizedText("Money part checked", "ตรวจเรื่องเงินแล้ว"));
  /** Never stored: worked out from the project's updates each time. */
  static readonly RECENT = new HubCheck("recent", new LocalizedText("Updated in the last 30 days", "มีอัปเดตใน 30 วันที่ผ่านมา"));

  private static readonly registry: readonly HubCheck[] = [HubCheck.TEAM, HubCheck.BUILD, HubCheck.MONEY, HubCheck.RECENT];

  private constructor(
    readonly id: HubCheckId,
    readonly label: LocalizedText,
  ) {}

  static byId(id: string): HubCheck | undefined {
    return HubCheck.registry.find((check) => check.id === id);
  }

  /** The order checks are listed in. */
  static order(check: HubCheck): number {
    return HubCheck.registry.indexOf(check);
  }
}

/** What Hamster Hub put into a project, and which checks it has passed. */
export class HubContribution {
  constructor(
    readonly summary: LocalizedText,
    /** Checks a person signed off. "Updated recently" is added from activity, not stored. */
    readonly checks: readonly HubCheck[],
  ) {
    if (checks.includes(HubCheck.RECENT)) throw new Error("The recent-update check is worked out, not stored");
  }
}
