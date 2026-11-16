import type { LocalizedText } from "./LocalizedText";

export type AvatarTone = "clay" | "moss" | "sand" | "plum";

export interface MakerProps {
  id: string;
  /** The name shown next to their work. Latin script in both languages. */
  name: string;
  /** What you'd call them when writing to them. */
  nickname: LocalizedText;
  role: LocalizedText;
  yearsAtHub: number;
  /** A line of their own, shown on their note. */
  motto: LocalizedText;
  initials: string;
  tone: AvatarTone;
}

/** A person at Hamster Hub who makes things. */
export class Maker {
  readonly id: string;
  readonly name: string;
  readonly nickname: LocalizedText;
  readonly role: LocalizedText;
  readonly yearsAtHub: number;
  readonly motto: LocalizedText;
  readonly initials: string;
  readonly tone: AvatarTone;

  constructor(props: MakerProps) {
    if (props.yearsAtHub < 0) throw new RangeError(`yearsAtHub can't be negative (${props.id})`);
    this.id = props.id;
    this.name = props.name;
    this.nickname = props.nickname;
    this.role = props.role;
    this.yearsAtHub = props.yearsAtHub;
    this.motto = props.motto;
    this.initials = props.initials;
    this.tone = props.tone;
  }
}
