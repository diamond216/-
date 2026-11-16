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

  /** The projects the hero takes turns showing: the top of the headline ranking across the whole shelf. */
  highlights(): Listing[] {
    return this.headline.rank(this.directory.all()).slice(0, this.featuredCount);
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
