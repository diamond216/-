import type { Category, CategoryId } from "./Category";
import type { Genre } from "./Genre";
import type { LocalizedText } from "./LocalizedText";
import type { Stage, StageId } from "./Stage";

export interface ProjectProps {
  id: string;
  name: string;
  category: Category;
  /** Main genre first. */
  genres: readonly Genre[];
  /** Short labels shown as hashtags. */
  tags: readonly string[];
  stage: Stage;
  blurb: LocalizedText;
  makerId: string;
  openToInvestment?: boolean;
  /** Where to play or try it, if there's something to try. */
  demoUrl?: string;
  followers?: number;
  /** Editorial quality signal, 0 to 1. */
  quality: number;
  /** Trust signal from checks and endorsements, 0 to 1. */
  trust: number;
  coverColor: string;
  /** The maker marked it as paused. */
  paused?: boolean;
}

/** Something on the shelf. */
export class Project {
  readonly id: string;
  readonly name: string;
  readonly category: Category;
  readonly genres: readonly Genre[];
  readonly tags: readonly string[];
  readonly stage: Stage;
  readonly blurb: LocalizedText;
  readonly makerId: string;
  readonly openToInvestment: boolean;
  readonly demoUrl?: string;
  readonly followers: number;
  readonly quality: number;
  readonly trust: number;
  readonly coverColor: string;
  readonly paused: boolean;

  constructor(props: ProjectProps) {
    if (props.genres.length === 0) throw new Error(`${props.id} needs at least one genre`);
    Project.assertUnit("quality", props.quality, props.id);
    Project.assertUnit("trust", props.trust, props.id);
    this.id = props.id;
    this.name = props.name;
    this.category = props.category;
    this.genres = props.genres;
    this.tags = props.tags;
    this.stage = props.stage;
    this.blurb = props.blurb;
    this.makerId = props.makerId;
    this.openToInvestment = props.openToInvestment ?? false;
    this.demoUrl = props.demoUrl;
    this.followers = props.followers ?? 0;
    this.quality = props.quality;
    this.trust = props.trust;
    this.coverColor = props.coverColor;
    this.paused = props.paused ?? false;
  }

  private static assertUnit(field: string, value: number, id: string): void {
    if (!(value >= 0 && value <= 1)) throw new RangeError(`${field} must be between 0 and 1 (${id})`);
  }

  get primaryGenre(): Genre {
    return this.genres[0];
  }

  get hasDemo(): boolean {
    return Boolean(this.demoUrl);
  }

  isIn(categoryId: CategoryId): boolean {
    return this.category.id === categoryId;
  }

  hasGenre(genreId: string): boolean {
    return this.genres.some((genre) => genre.id === genreId);
  }

  isAt(stageId: StageId): boolean {
    return this.stage.id === stageId;
  }

  hashtags(): string[] {
    return this.tags.map((tag) => `#${tag}`);
  }
}
