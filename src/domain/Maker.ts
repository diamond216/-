import type { LocalizedText } from "./LocalizedText";
import type { MakerStory } from "./MakerStory";

export type AvatarTone = "clay" | "moss" | "sand" | "plum";

export interface MakerProps {
  id: string;
  /** The name shown next to their work. Latin script in both languages. */
  name: string;
  /** What you'd call them when writing to them. */
  nickname: LocalizedText;
  role: LocalizedText;
  /** The year they started at Hamster Hub. */
  joinedYear: number;
  /** A line of their own, shown on their note. */
  motto: LocalizedText;
  initials: string;
  tone: AvatarTone;
  story: MakerStory;
}

/** A person at Hamster Hub who makes things. */
export class Maker {
  readonly id: string;
  readonly name: string;
  readonly nickname: LocalizedText;
  readonly role: LocalizedText;
  readonly joinedYear: number;
  readonly motto: LocalizedText;
  readonly initials: string;
  readonly tone: AvatarTone;
  readonly story: MakerStory;

  constructor(props: MakerProps) {
    if (!Number.isInteger(props.joinedYear)) throw new RangeError(`joinedYear has to be a year (${props.id})`);
    this.id = props.id;
    this.name = props.name;
    this.nickname = props.nickname;
    this.role = props.role;
    this.joinedYear = props.joinedYear;
    this.motto = props.motto;
    this.initials = props.initials;
    this.tone = props.tone;
    this.story = props.story;
  }

  /** Whole calendar years since they joined. */
  yearsAtHub(now: Date): number {
    return Math.max(0, now.getUTCFullYear() - this.joinedYear);
  }
}
