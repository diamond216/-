export type Locale = "en" | "th";

export const LOCALES: readonly Locale[] = ["en", "th"];

/** A piece of copy that exists in both languages the Nest speaks. */
export class LocalizedText {
  constructor(
    readonly en: string,
    readonly th: string,
  ) {}

  /** For names that read the same in both languages (product names, genre names). */
  static same(text: string): LocalizedText {
    return new LocalizedText(text, text);
  }

  in(locale: Locale): string {
    return locale === "th" ? this.th : this.en;
  }

  /** Every distinct wording, for search indexing. */
  variants(): string[] {
    return this.en === this.th ? [this.en] : [this.en, this.th];
  }
}
