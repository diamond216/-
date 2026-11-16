import type { KeyValueStore } from "../storage/KeyValueStore";

type Listener = () => void;

export const FOLLOW_STORAGE_KEY = "hamster-nest:following";

/**
 * Which projects this visitor asked to hear about. Kept in their own browser for the
 * prototype; a real account would replace the store, not this class's callers.
 */
export class FollowStore {
  private readonly listeners = new Set<Listener>();
  private following: ReadonlySet<string> | undefined;

  constructor(
    private readonly storage: KeyValueStore,
    private readonly key = FOLLOW_STORAGE_KEY,
  ) {}

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  isFollowing(projectId: string): boolean {
    return this.load().has(projectId);
  }

  /** Follows if not following, stops if already following. Returns the new state. */
  toggle(projectId: string): boolean {
    const next = new Set(this.load());
    const nowFollowing = !next.delete(projectId);
    if (nowFollowing) next.add(projectId);
    this.following = next;
    try {
      this.storage.set(this.key, JSON.stringify([...next]));
    } catch {
      // Storage unavailable: still holds for this visit.
    }
    this.listeners.forEach((listener) => listener());
    return nowFollowing;
  }

  /** The follower count to show, counting this visitor in when they follow. */
  countWith(base: number, projectId: string): number {
    return base + (this.isFollowing(projectId) ? 1 : 0);
  }

  private load(): ReadonlySet<string> {
    if (!this.following) {
      try {
        const parsed: unknown = JSON.parse(this.storage.get(this.key) ?? "[]");
        this.following = new Set(Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : []);
      } catch {
        this.following = new Set();
      }
    }
    return this.following;
  }
}
