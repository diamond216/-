import type { Locale, LocalizedText } from "@/domain";
import { en, type MessageKey, type Messages } from "./en";
import { RelativeAge } from "./RelativeAge";
import { th } from "./th";

type MessageArgs<K extends MessageKey> = Messages[K] extends (params: infer P) => string ? [params: P] : [];

export type TimeStyle = "long" | "short" | "sentence";

const DICTIONARIES: Readonly<Record<Locale, Messages>> = { en, th };

/** Speaks one language. Components ask it for words instead of knowing about dictionaries. */
export class Localizer {
  private static readonly cache = new Map<Locale, Localizer>();

  private constructor(
    readonly locale: Locale,
    private readonly messages: Messages,
  ) {}

  static for(locale: Locale): Localizer {
    let localizer = Localizer.cache.get(locale);
    if (!localizer) {
      localizer = new Localizer(locale, DICTIONARIES[locale]);
      Localizer.cache.set(locale, localizer);
    }
    return localizer;
  }

  /** A fixed interface string, with its parameters filled in. */
  t<K extends MessageKey>(key: K, ...args: MessageArgs<K>): string {
    const message = this.messages[key] as string | ((params: unknown) => string);
    return typeof message === "function" ? message(args[0]) : message;
  }

  /** Content that carries its own translations. */
  text(value: LocalizedText): string {
    return value.in(this.locale);
  }

  /** "40 min ago", "yesterday", "2 days ago". */
  ago(then: Date, now: Date, style: TimeStyle = "long"): string {
    return this.t(`time.${style}`, RelativeAge.between(then, now));
  }

  /** Two digits, the way the wheel labels and rank badges write numbers. */
  twoDigits(count: number): string {
    return String(count).padStart(2, "0");
  }
}
