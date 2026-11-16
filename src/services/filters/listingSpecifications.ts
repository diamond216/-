import type { CategoryId, Clock, Listing, StageId } from "@/domain";
import { Specification } from "./Specification";

export class InCategory extends Specification<Listing> {
  constructor(private readonly categoryId: CategoryId) {
    super();
  }

  isSatisfiedBy(listing: Listing): boolean {
    return listing.project.isIn(this.categoryId);
  }
}

export class HasGenre extends Specification<Listing> {
  constructor(private readonly genreId: string) {
    super();
  }

  isSatisfiedBy(listing: Listing): boolean {
    return listing.project.hasGenre(this.genreId);
  }
}

export class AtStage extends Specification<Listing> {
  constructor(private readonly stageId: StageId) {
    super();
  }

  isSatisfiedBy(listing: Listing): boolean {
    return listing.project.isAt(this.stageId);
  }
}

export class OpenToInvestment extends Specification<Listing> {
  isSatisfiedBy(listing: Listing): boolean {
    return listing.project.openToInvestment;
  }
}

export class HasSomethingToTry extends Specification<Listing> {
  isSatisfiedBy(listing: Listing): boolean {
    return listing.project.hasDemo;
  }
}

export class UpdatedWithinDays extends Specification<Listing> {
  constructor(
    private readonly days: number,
    private readonly clock: Clock,
  ) {
    super();
  }

  isSatisfiedBy(listing: Listing): boolean {
    return listing.updatedWithin(this.days, this.clock.now());
  }
}

/** Matches listings a text search came back with. */
export class AmongIds extends Specification<Listing> {
  private readonly ids: ReadonlySet<string>;

  constructor(ids: Iterable<string>) {
    super();
    this.ids = new Set(ids);
  }

  isSatisfiedBy(listing: Listing): boolean {
    return this.ids.has(listing.id);
  }
}
