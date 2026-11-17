import { Category, type CategoryId, type Genre, type Listing } from "@/domain";
import type { GenreRepository } from "@/data/repositories";
import type { RankingRegistry, RankingStrategy } from "../ranking";
import type { ListingDirectory } from "./ListingDirectory";
import type { ListingSpecificationBuilder } from "./ListingSpecificationBuilder";
import type { ShelfQuery } from "./ShelfQuery";

export interface ShelfView {
  /** How many projects match the query in total. */
  total: number;
  /** The busiest few of the matches, by the headline ranking. */
  featured: Listing[];
  /** Everything else that matches, in the order the visitor asked for. */
  rest: Listing[];
}

/** What a room shows once the visitor has searched and filtered. */
export interface RoomView {
  /** The busiest few of the matches, by the headline ranking: "flowing strongest this week". */
  strongest: Listing[];
  /** Every match, in the order the visitor asked for. The strongest ones appear here too. */
  latest: Listing[];
}

/** The window behind "14 updates in 30 days" on a room's strongest cards. */
export const PACE_DAYS = 30;

export interface CategoryCount {
  category: Category;
  count: number;
}

export interface GenreFacet {
  genre: Genre;
  count: number;
}

/** The shelf itself: answers "what should I show for this query?" and "how many of each are there?". */
export class Shelf {
  constructor(
    private readonly directory: ListingDirectory,
    private readonly genres: GenreRepository,
    private readonly specifications: ListingSpecificationBuilder,
    private readonly rankings: RankingRegistry,
    /** The ranking behind "Busiest this week". */
    private readonly headline: RankingStrategy,
    private readonly featuredCount = 3,
  ) {}

  browse(query: ShelfQuery): ShelfView {
    const specification = this.specifications.build(query);
    const matches = this.directory.all().filter((listing) => specification.isSatisfiedBy(listing));
    const featured = this.headline.rank(matches).slice(0, this.featuredCount);
    const featuredIds = new Set(featured.map((listing) => listing.id));
    const rest = this.rankings
      .get(query.sort)
      .rank(matches)
      .filter((listing) => !featuredIds.has(listing.id));
    return { total: matches.length, featured, rest };
  }

  /** The highlight on the home page: the top project of each room by the headline ranking, in room order. */
  bestOfEachRoom(): Listing[] {
    const ranked = this.headline.rank(this.directory.all());
    return Category.rooms()
      .map((room) => ranked.find((listing) => listing.project.isIn(room.id)))
      .filter((listing): listing is Listing => listing !== undefined);
  }

  /** Everything in one room that matches the query, in the order the visitor asked for. */
  room(categoryId: CategoryId, query: ShelfQuery): Listing[] {
    return this.roomView(categoryId, query).latest;
  }

  /** A room's two blocks for one query: the strongest few on top, then every match. */
  roomView(categoryId: CategoryId, query: ShelfQuery): RoomView {
    const specification = this.specifications.build(query.with({ category: categoryId }));
    const matches = this.directory.all().filter((listing) => specification.isSatisfiedBy(listing));
    return {
      strongest: this.headline.rank(matches).slice(0, this.featuredCount),
      latest: this.rankings.get(query.sort).rank(matches),
    };
  }

  /** How many projects live in a room, before any filter. */
  roomSize(categoryId: CategoryId): number {
    return this.directory.all().filter((listing) => listing.project.isIn(categoryId)).length;
  }

  /** Where a project sits on the headline ranking across the whole shelf, counting from 1. */
  positionOf(projectId: string): number | undefined {
    const index = this.headline.rank(this.directory.all()).findIndex((listing) => listing.id === projectId);
    return index === -1 ? undefined : index + 1;
  }

  size(): number {
    return this.directory.all().length;
  }

  categoryCounts(): CategoryCount[] {
    return Category.all().map((category) => ({
      category,
      count: this.directory.all().filter((listing) => listing.project.isIn(category.id)).length,
    }));
  }

  /** Genres that have at least one project, in list order, counted within a category when one is given. */
  genreFacets(categoryId: CategoryId | null = null): GenreFacet[] {
    const pool = categoryId
      ? this.directory.all().filter((listing) => listing.project.isIn(categoryId))
      : this.directory.all();
    return this.genres
      .all()
      .map((genre) => ({ genre, count: pool.filter((listing) => listing.project.hasGenre(genre.id)).length }))
      .filter((facet) => facet.count > 0);
  }
}
