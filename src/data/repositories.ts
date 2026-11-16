import type { Endorsement, Genre, Maker, Project, ProjectUpdate } from "@/domain";

/**
 * Where the shelf reads from. The UI never touches these directly: it talks to
 * services, and services are handed repositories by the composition root. Swap the
 * in-memory versions for ones backed by an API and nothing above this file changes.
 */
export interface ProjectRepository {
  all(): readonly Project[];
  byId(id: string): Project | undefined;
  byMaker(makerId: string): readonly Project[];
}

export interface MakerRepository {
  all(): readonly Maker[];
  byId(id: string): Maker | undefined;
}

export interface UpdateRepository {
  /** Every update, newest first. */
  all(): readonly ProjectUpdate[];
  forProject(projectId: string): readonly ProjectUpdate[];
  /** The most recent updates across every project, newest first. */
  latest(limit: number): readonly ProjectUpdate[];
}

export interface EndorsementRepository {
  /** Quotes we're allowed to show with a name. */
  quotable(): readonly Endorsement[];
  forProject(projectId: string): readonly Endorsement[];
  /** Quotes about a person, from people who work with them. */
  forMaker(makerId: string): readonly Endorsement[];
}

export interface GenreRepository {
  /** Every genre, in the order the filter list shows them. */
  all(): readonly Genre[];
  byId(id: string): Genre | undefined;
}

export interface Repositories {
  genres: GenreRepository;
  projects: ProjectRepository;
  makers: MakerRepository;
  updates: UpdateRepository;
  endorsements: EndorsementRepository;
}
