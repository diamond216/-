import type { Clock } from "@/domain";
import type { KeyValueStore } from "../storage/KeyValueStore";
import type { MessageDraft, SentMessage } from "./MakerMessage";

/** Delivers a visitor's message to a maker. The form only knows this interface. */
export interface MessageSender {
  /** Resolves with the stored message, or rejects if it couldn't be delivered. */
  send(draft: MessageDraft): Promise<SentMessage>;
}

export const OUTBOX_KEY = "hamster-nest:outbox";

/**
 * Prototype delivery: messages are kept in an outbox in the visitor's own browser.
 * Nothing leaves the machine. A sender that posts to a real endpoint can replace this.
 */
export class LocalOutboxSender implements MessageSender {
  constructor(
    private readonly store: KeyValueStore,
    private readonly clock: Clock,
    private readonly key = OUTBOX_KEY,
  ) {}

  async send(draft: MessageDraft): Promise<SentMessage> {
    const outbox = this.outbox();
    const message: SentMessage = {
      ...draft,
      name: draft.name.trim(),
      contact: draft.contact.trim(),
      body: draft.body.trim(),
      id: `msg-${outbox.length + 1}-${Date.now().toString(36)}`,
      sentAt: this.clock.now().toISOString(),
    };
    this.store.set(this.key, JSON.stringify([...outbox, message]));
    return message;
  }

  /** Everything sent from this browser so far, oldest first. */
  outbox(): SentMessage[] {
    try {
      const parsed: unknown = JSON.parse(this.store.get(this.key) ?? "[]");
      return Array.isArray(parsed) ? (parsed as SentMessage[]) : [];
    } catch {
      return [];
    }
  }
}
