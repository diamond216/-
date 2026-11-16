import type { LocalizedText } from "./LocalizedText";

/** How long a maker usually takes to write back, in days. */
export class ReplyTime {
  constructor(readonly days: number) {
    if (!Number.isInteger(days) || days < 1) throw new RangeError(`Reply time is a whole number of days (got ${days})`);
  }
}

export type LanguageId = "th" | "en" | "ja" | "zh";

/** A step on "How I got here". */
export class TimelineEntry {
  constructor(
    readonly year: number,
    readonly text: LocalizedText,
  ) {}
}

export type RecognitionKind = "award" | "mention";

/** An entry under "Awards and mentions". Only awards count towards the number at the top. */
export class Recognition {
  constructor(
    readonly year: number,
    readonly title: LocalizedText,
    readonly from: LocalizedText,
    readonly kind: RecognitionKind,
  ) {}

  get isAward(): boolean {
    return this.kind === "award";
  }
}

/** Something made before it had a page on the shelf. */
export class EarlierWork {
  constructor(
    readonly year: number,
    readonly name: LocalizedText,
    readonly note: LocalizedText,
  ) {}
}

export interface MakerStoryProps {
  intro: LocalizedText;
  /** For search engines and link previews. */
  description: LocalizedText;
  talkTopics: readonly LocalizedText[];
  replyTime: ReplyTime;
  languages: readonly LanguageId[];
  portraitCaption?: LocalizedText;
  timeline: readonly TimelineEntry[];
  recognitions: readonly Recognition[];
  earlier: readonly EarlierWork[];
}

/** The longer, more personal part of a maker's profile. */
export class MakerStory {
  readonly intro: LocalizedText;
  readonly description: LocalizedText;
  readonly talkTopics: readonly LocalizedText[];
  readonly replyTime: ReplyTime;
  readonly languages: readonly LanguageId[];
  readonly portraitCaption?: LocalizedText;
  readonly timeline: readonly TimelineEntry[];
  readonly recognitions: readonly Recognition[];
  readonly earlier: readonly EarlierWork[];

  constructor(props: MakerStoryProps) {
    this.intro = props.intro;
    this.description = props.description;
    this.talkTopics = props.talkTopics;
    this.replyTime = props.replyTime;
    this.languages = props.languages;
    this.portraitCaption = props.portraitCaption;
    this.timeline = [...props.timeline].sort((a, b) => a.year - b.year);
    this.recognitions = [...props.recognitions].sort((a, b) => b.year - a.year);
    this.earlier = [...props.earlier].sort((a, b) => b.year - a.year);
  }

  awardCount(): number {
    return this.recognitions.filter((recognition) => recognition.isAward).length;
  }
}
