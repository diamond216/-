/** The little bit of storage the prototype needs. Lets tests and the server run without a browser. */
export interface KeyValueStore {
  get(key: string): string | null;
  set(key: string, value: string): void;
}

export class MemoryStore implements KeyValueStore {
  private readonly values = new Map<string, string>();

  get(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  set(key: string, value: string): void {
    this.values.set(key, value);
  }
}

/** localStorage, looked up lazily so nothing breaks while the page is rendered ahead of time. */
export class BrowserStore implements KeyValueStore {
  get(key: string): string | null {
    try {
      return typeof window === "undefined" ? null : window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  set(key: string, value: string): void {
    if (typeof window === "undefined") throw new Error("No browser storage here");
    window.localStorage.setItem(key, value);
  }
}
