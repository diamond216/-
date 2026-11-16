import MiniSearch from "minisearch";
import type { Listing } from "@/domain";
import { ThaiAwareTokenizer } from "./ThaiAwareTokenizer";

/** Free-text search over the shelf. A server-side search can stand in for this later. */
export interface ProjectSearch {
  /** Ids of matching projects, best match first. An empty query matches nothing. */
  search(query: string): string[];
}

interface SearchDocument {
  id: string;
  name: string;
  genres: string;
  tags: string;
  blurb: string;
  people: string;
  facts: string;
  updates: string;
}

const RECENT_UPDATES_INDEXED = 3;

/** In-browser search with MiniSearch: prefix and typo tolerant, in English and Thai. */
export class MiniSearchProjectSearch implements ProjectSearch {
  private readonly index: MiniSearch<SearchDocument>;

  constructor(listings: readonly Listing[], tokenizer: ThaiAwareTokenizer = new ThaiAwareTokenizer()) {
    this.index = new MiniSearch<SearchDocument>({
      fields: ["name", "genres", "tags", "blurb", "people", "facts", "updates"],
      tokenize: (text) => tokenizer.tokenize(text),
      searchOptions: {
        boost: { name: 3, genres: 2, tags: 2 },
        prefix: true,
        fuzzy: (term) => (term.length > 4 ? 0.2 : false),
        // Every word has to match somewhere, so "co-op roguelike" doesn't return every roguelike.
        combineWith: "AND",
      },
    });
    this.index.addAll(listings.map((listing) => MiniSearchProjectSearch.toDocument(listing)));
  }

  search(query: string): string[] {
    const text = query.trim();
    if (!text) return [];
    return this.index.search(text).map((hit) => String(hit.id));
  }

  private static toDocument({ project, maker, activity }: Listing): SearchDocument {
    return {
      id: project.id,
      name: project.name,
      genres: project.genres.flatMap((genre) => genre.searchTerms()).join(" "),
      tags: project.tags.join(" "),
      blurb: project.blurb.variants().join(" "),
      people: [maker.name, ...maker.nickname.variants(), ...maker.role.variants()].join(" "),
      facts: [
        project.category.tag,
        ...project.category.label.variants(),
        project.stage.badge,
        ...project.stage.label.variants(),
      ].join(" "),
      updates: activity
        .all()
        .slice(0, RECENT_UPDATES_INDEXED)
        .flatMap((update) => [...update.summary.variants(), update.type.label.en])
        .join(" "),
    };
  }
}
