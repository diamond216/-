export const CONTACT_REASONS = ["play", "invest", "collaborate", "hello"] as const;
export type ContactReason = (typeof CONTACT_REASONS)[number];

/** What a visitor has typed into the "write to a maker" form. */
export interface MessageDraft {
  makerId: string;
  name: string;
  contact: string;
  reason: ContactReason;
  body: string;
}

export function emptyDraft(makerId: string): MessageDraft {
  return { makerId, name: "", contact: "", reason: "hello", body: "" };
}

/** A draft that has been accepted for delivery. */
export interface SentMessage extends MessageDraft {
  id: string;
  /** ISO timestamp. */
  sentAt: string;
}
