import type { Clock, Listing } from "@/domain";
import {
  AllOf,
  AmongIds,
  AnyOf,
  AtStage,
  HasGenre,
  HasSomethingToTry,
  InCategory,
  OpenToInvestment,
  type Specification,
  UpdatedWithinDays,
} from "../filters";
import type { ProjectSearch } from "../search";
import type { ShelfQuery } from "./ShelfQuery";

export const THIS_WEEK_DAYS = 7;

/**
 * Turns a ShelfQuery into one combined question to ask of every listing.
 * Choices inside a group widen (Beta or Live); groups narrow each other (Beta and open to investment).
 */
export class ListingSpecificationBuilder {
  constructor(
    private readonly search: ProjectSearch,
    private readonly clock: Clock,
  ) {}

  build(query: ShelfQuery): Specification<Listing> {
    const parts: Specification<Listing>[] = [];
    if (query.hasText) parts.push(new AmongIds(this.search.search(query.text)));
    if (query.category) parts.push(new InCategory(query.category));
    if (query.genres.length > 0) parts.push(new AnyOf(query.genres.map((id) => new HasGenre(id))));
    if (query.stages.length > 0) parts.push(new AnyOf(query.stages.map((id) => new AtStage(id))));
    if (query.openToInvestment) parts.push(new OpenToInvestment());
    if (query.hasDemo) parts.push(new HasSomethingToTry());
    if (query.updatedThisWeek) parts.push(new UpdatedWithinDays(THIS_WEEK_DAYS, this.clock));
    return new AllOf(parts);
  }
}
