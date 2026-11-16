import { DAY_MS } from "./Clock";
import type { LocalizedText } from "./LocalizedText";
import type { UpdateType } from "./UpdateType";

export interface ProjectUpdateProps {
  id: string;
  projectId: string;
  type: UpdateType;
  postedAt: Date;
  /** Reads as the rest of a sentence that starts with the project's name. */
  summary: LocalizedText;
  /** A tighter wording for places with less room. Falls back to the summary. */
  note?: LocalizedText;
  hearts?: number;
  replies?: number;
}

/** One thing a maker posted about a project. */
export class ProjectUpdate {
  readonly id: string;
  readonly projectId: string;
  readonly type: UpdateType;
  readonly postedAt: Date;
  readonly summary: LocalizedText;
  readonly note: LocalizedText;
  readonly hearts: number;
  readonly replies: number;

  constructor(props: ProjectUpdateProps) {
    this.id = props.id;
    this.projectId = props.projectId;
    this.type = props.type;
    this.postedAt = props.postedAt;
    this.summary = props.summary;
    this.note = props.note ?? props.summary;
    this.hearts = props.hearts ?? 0;
    this.replies = props.replies ?? 0;
  }

  ageMs(now: Date): number {
    return Math.max(0, now.getTime() - this.postedAt.getTime());
  }

  /** Whole days since this was posted, counted in rolling 24-hour windows: 0 means "today". */
  daysAgo(now: Date): number {
    return Math.floor(this.ageMs(now) / DAY_MS);
  }

  isWithinDays(days: number, now: Date): boolean {
    return this.postedAt.getTime() <= now.getTime() && this.daysAgo(now) < days;
  }
}
