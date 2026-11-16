import type { LocalizedText } from "./LocalizedText";

export interface EndorsementProps {
  id: string;
  quote: LocalizedText;
  author: LocalizedText;
  authorRole: LocalizedText;
  /** The project they're talking about, when it's about one in particular. */
  projectId?: string;
  /** True once the person has agreed to be quoted by name. */
  namedWithConsent: boolean;
}

/** Something a player, customer or investor said, on the record. */
export class Endorsement {
  readonly id: string;
  readonly quote: LocalizedText;
  readonly author: LocalizedText;
  readonly authorRole: LocalizedText;
  readonly projectId?: string;
  readonly namedWithConsent: boolean;

  constructor(props: EndorsementProps) {
    this.id = props.id;
    this.quote = props.quote;
    this.author = props.author;
    this.authorRole = props.authorRole;
    this.projectId = props.projectId;
    this.namedWithConsent = props.namedWithConsent;
  }

  /** We only quote people who said we could use their name. */
  isQuotable(): boolean {
    return this.namedWithConsent;
  }
}
