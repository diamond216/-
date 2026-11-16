import { LocalizedText } from "./LocalizedText";

export type EndorsementKindId = "played" | "used" | "invested" | "colleague";

/** How the person knows the work. Shown as a small label above their quote. */
export class EndorsementKind {
  static readonly PLAYED = new EndorsementKind("played", new LocalizedText("Played it", "เคยเล่น"));
  static readonly USED = new EndorsementKind("used", new LocalizedText("Used it", "เคยใช้"));
  static readonly INVESTED = new EndorsementKind("invested", new LocalizedText("Put money in", "ลงเงินไปแล้ว"));
  static readonly COLLEAGUE = new EndorsementKind("colleague", new LocalizedText("Works with them", "ทำงานด้วยกัน"));

  private static readonly registry: readonly EndorsementKind[] = [
    EndorsementKind.PLAYED,
    EndorsementKind.USED,
    EndorsementKind.INVESTED,
    EndorsementKind.COLLEAGUE,
  ];

  private constructor(
    readonly id: EndorsementKindId,
    readonly label: LocalizedText,
  ) {}

  static byId(id: string): EndorsementKind | undefined {
    return EndorsementKind.registry.find((kind) => kind.id === id);
  }
}

export interface EndorsementProps {
  id: string;
  quote: LocalizedText;
  author: LocalizedText;
  authorRole: LocalizedText;
  kind: EndorsementKind;
  /** The same quote, trimmed for a page where the project is already named ("the demo" rather than "the Burrow Knights demo"). */
  quoteInContext?: LocalizedText;
  /** The project they're talking about, when it's about one in particular. */
  projectId?: string;
  /** The maker they're talking about, for quotes about a person rather than a project. */
  makerId?: string;
  /** True once the person has agreed to be quoted by name. */
  namedWithConsent: boolean;
}

/** Something a player, customer or investor said, on the record. */
export class Endorsement {
  readonly id: string;
  readonly quote: LocalizedText;
  readonly author: LocalizedText;
  readonly authorRole: LocalizedText;
  readonly kind: EndorsementKind;
  readonly quoteInContext: LocalizedText;
  readonly projectId?: string;
  readonly makerId?: string;
  readonly namedWithConsent: boolean;

  constructor(props: EndorsementProps) {
    this.id = props.id;
    this.quote = props.quote;
    this.author = props.author;
    this.authorRole = props.authorRole;
    this.kind = props.kind;
    this.quoteInContext = props.quoteInContext ?? props.quote;
    this.projectId = props.projectId;
    this.makerId = props.makerId;
    this.namedWithConsent = props.namedWithConsent;
  }

  /** We only quote people who said we could use their name. */
  isQuotable(): boolean {
    return this.namedWithConsent;
  }
}
