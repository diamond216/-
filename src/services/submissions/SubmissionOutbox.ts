import type { Clock } from "@/domain";
import type { KeyValueStore } from "../storage/KeyValueStore";
import type { ProjectDraft, UpdateDraft } from "./drafts";

export type Submission = { kind: "update"; draft: UpdateDraft } | { kind: "project"; draft: ProjectDraft };

export type SentSubmission = Submission & {
  id: string;
  /** ISO timestamp. */
  sentAt: string;
};

/** Takes a finished post. The forms only know this interface. */
export interface SubmissionSender {
  send(submission: Submission): Promise<SentSubmission>;
}

export const SUBMISSIONS_KEY = "hamster-nest:submissions";

/**
 * Prototype delivery: posts are kept in this browser. Nothing leaves the machine.
 * A sender that uploads to a real backend can replace this in createNest.
 */
export class LocalSubmissionOutbox implements SubmissionSender {
  constructor(
    private readonly store: KeyValueStore,
    private readonly clock: Clock,
    private readonly key = SUBMISSIONS_KEY,
  ) {}

  async send(submission: Submission): Promise<SentSubmission> {
    const sent: SentSubmission = {
      ...submission,
      id: `post-${this.all().length + 1}-${Date.now().toString(36)}`,
      sentAt: this.clock.now().toISOString(),
    };
    this.store.set(this.key, JSON.stringify([...this.all(), sent]));
    return sent;
  }

  /** Everything posted from this browser so far, oldest first. */
  all(): SentSubmission[] {
    try {
      const parsed: unknown = JSON.parse(this.store.get(this.key) ?? "[]");
      return Array.isArray(parsed) ? (parsed as SentSubmission[]) : [];
    } catch {
      return [];
    }
  }
}

type Listener = () => void;
export type DraftKind = Submission["kind"];

/** "Save for later": one saved draft of each kind, in this browser. Photos aren't kept, only their names. */
export class SavedDrafts {
  private readonly listeners = new Set<Listener>();

  constructor(
    private readonly store: KeyValueStore,
    private readonly prefix = "hamster-nest:draft:",
  ) {}

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  /** The saved draft as stored text, so it can be compared cheaply. Null when there's none. */
  raw(kind: DraftKind): string | null {
    try {
      return this.store.get(this.prefix + kind);
    } catch {
      return null;
    }
  }

  load<D>(kind: DraftKind): D | null {
    const text = this.raw(kind);
    if (!text) return null;
    try {
      return JSON.parse(text) as D;
    } catch {
      return null;
    }
  }

  /** Returns false when the browser won't let us store anything. */
  save(kind: DraftKind, draft: UpdateDraft | ProjectDraft): boolean {
    try {
      this.store.set(this.prefix + kind, JSON.stringify(draft));
    } catch {
      return false;
    }
    this.listeners.forEach((listener) => listener());
    return true;
  }

  clear(kind: DraftKind): void {
    try {
      this.store.set(this.prefix + kind, "");
    } catch {
      // Nothing to clear.
    }
    this.listeners.forEach((listener) => listener());
  }
}
