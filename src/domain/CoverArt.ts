import type { CategoryId } from "./Category";

/** A generated picture: one of the four cover patterns in one colour. Stands in for screenshots. */
export class CoverArt {
  constructor(
    readonly pattern: CategoryId,
    readonly color: string,
  ) {
    if (!/^#[0-9a-f]{6}$/i.test(color)) throw new Error(`Cover colours are #rrggbb (got ${color})`);
  }
}
