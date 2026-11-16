import type { KeyValueStore } from "../storage/KeyValueStore";

type Listener = () => void;

/**
 * One remembered choice (language, theme). Anything can subscribe and is told when it
 * changes; the choice survives a reload. Shaped to plug straight into useSyncExternalStore.
 */
export class PreferenceStore<T extends string> {
  private readonly listeners = new Set<Listener>();
  private current: T | undefined;

  constructor(
    private readonly key: string,
    private readonly allowed: readonly T[],
    readonly fallback: T,
    private readonly storage: KeyValueStore,
    /** A query-string parameter that wins over the stored value, handy for previews (?lang=th). */
    private readonly urlParam?: string,
  ) {}

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  get = (): T => {
    if (this.current === undefined) this.current = this.fromUrl() ?? this.fromStorage() ?? this.fallback;
    return this.current;
  };

  /** What a page rendered ahead of time shows before the browser has had a say. */
  getDefault = (): T => this.fallback;

  set(value: T): void {
    if (!this.allowed.includes(value) || value === this.current) return;
    this.current = value;
    try {
      this.storage.set(this.key, value);
    } catch {
      // Private mode or storage full: the choice still holds for this visit.
    }
    this.listeners.forEach((listener) => listener());
  }

  private accept(value: string | null | undefined): T | undefined {
    return this.allowed.find((candidate) => candidate === value);
  }

  private fromStorage(): T | undefined {
    return this.accept(this.storage.get(this.key));
  }

  private fromUrl(): T | undefined {
    if (!this.urlParam || typeof window === "undefined") return undefined;
    return this.accept(new URLSearchParams(window.location.search).get(this.urlParam));
  }
}

export const THEMES = ["day", "night"] as const;
export type Theme = (typeof THEMES)[number];

export const LOCALE_STORAGE_KEY = "hamster-nest:lang";
export const THEME_STORAGE_KEY = "hamster-nest:theme";
