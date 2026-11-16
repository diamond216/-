import type { Endorsement, Genre, Maker, Project, ProjectUpdate } from "@/domain";
import type {
  EndorsementRepository,
  GenreRepository,
  MakerRepository,
  ProjectRepository,
  UpdateRepository,
} from "./repositories";

/** Shared plumbing for repositories that hold everything in a list. */
abstract class InMemoryRepository<T extends { id: string }> {
  protected readonly items: readonly T[];
  private readonly index: ReadonlyMap<string, T>;

  constructor(items: readonly T[]) {
    this.items = [...items];
    this.index = new Map(items.map((item) => [item.id, item]));
    if (this.index.size !== items.length) throw new Error("Repository ids must be unique");
  }

  all(): readonly T[] {
    return this.items;
  }

  byId(id: string): T | undefined {
    return this.index.get(id);
  }
}

export class InMemoryProjectRepository extends InMemoryRepository<Project> implements ProjectRepository {
  byMaker(makerId: string): readonly Project[] {
    return this.items.filter((project) => project.makerId === makerId);
  }
}

export class InMemoryGenreRepository extends InMemoryRepository<Genre> implements GenreRepository {}

export class InMemoryMakerRepository extends InMemoryRepository<Maker> implements MakerRepository {}

export class InMemoryUpdateRepository extends InMemoryRepository<ProjectUpdate> implements UpdateRepository {
  private readonly newestFirst: readonly ProjectUpdate[];

  constructor(updates: readonly ProjectUpdate[]) {
    super(updates);
    this.newestFirst = [...updates].sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());
  }

  override all(): readonly ProjectUpdate[] {
    return this.newestFirst;
  }

  forProject(projectId: string): readonly ProjectUpdate[] {
    return this.newestFirst.filter((update) => update.projectId === projectId);
  }

  latest(limit: number): readonly ProjectUpdate[] {
    return this.newestFirst.slice(0, limit);
  }
}

export class InMemoryEndorsementRepository
  extends InMemoryRepository<Endorsement>
  implements EndorsementRepository
{
  quotable(): readonly Endorsement[] {
    return this.items.filter((endorsement) => endorsement.isQuotable());
  }

  forProject(projectId: string): readonly Endorsement[] {
    return this.items.filter((endorsement) => endorsement.projectId === projectId);
  }
}
