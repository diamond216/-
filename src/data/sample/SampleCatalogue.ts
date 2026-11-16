import {
  Category,
  type Clock,
  DAY_MS,
  Endorsement,
  type Genre,
  LocalizedText,
  Maker,
  MINUTE_MS,
  Project,
  ProjectUpdate,
  Stage,
  UpdateType,
} from "@/domain";
import {
  InMemoryEndorsementRepository,
  InMemoryGenreRepository,
  InMemoryMakerRepository,
  InMemoryProjectRepository,
  InMemoryUpdateRepository,
} from "../inMemory";
import type { Repositories } from "../repositories";
import { sampleGenres } from "./genres";
import {
  type Bilingual,
  endorsementSeeds,
  historyTemplates,
  makerSeeds,
  projectSeeds,
  type ProjectSeed,
} from "./seeds";

/** Turns the placeholder seeds into domain objects, anchoring every "ago" to the given clock. */
class SampleCatalogue {
  private readonly genres: ReadonlyMap<string, Genre>;

  constructor(private readonly clock: Clock) {
    this.genres = new Map(sampleGenres.map((genre) => [genre.id, genre]));
  }

  build(): Repositories {
    return {
      genres: new InMemoryGenreRepository(sampleGenres),
      projects: new InMemoryProjectRepository(projectSeeds.map((seed) => this.project(seed))),
      makers: new InMemoryMakerRepository(makerSeeds.map((seed) => this.maker(seed))),
      updates: new InMemoryUpdateRepository(projectSeeds.flatMap((seed, index) => this.updates(seed, index))),
      endorsements: new InMemoryEndorsementRepository(
        endorsementSeeds.map(
          (seed) =>
            new Endorsement({
              ...seed,
              quote: text(seed.quote),
              author: text(seed.author),
              authorRole: text(seed.authorRole),
            }),
        ),
      ),
    };
  }

  private maker(seed: (typeof makerSeeds)[number]): Maker {
    return new Maker({
      ...seed,
      nickname: text(seed.nickname),
      role: text(seed.role),
      motto: text(seed.motto),
    });
  }

  private project(seed: ProjectSeed): Project {
    return new Project({
      id: seed.id,
      name: seed.name,
      category: required(Category.byId(seed.category), `category ${seed.category}`),
      genres: seed.genres.map((id) => required(this.genres.get(id), `genre ${id}`)),
      tags: seed.tags,
      stage: required(Stage.byId(seed.stage), `stage ${seed.stage}`),
      blurb: text(seed.blurb),
      makerId: seed.maker,
      openToInvestment: seed.openToInvestment,
      demoUrl: seed.demoUrl,
      followers: seed.followers,
      quality: seed.quality,
      trust: seed.trust,
      coverColor: seed.coverColor,
      paused: seed.paused,
    });
  }

  private updates(seed: ProjectSeed, projectIndex: number): ProjectUpdate[] {
    const now = this.clock.now().getTime();
    const latest = new ProjectUpdate({
      id: `${seed.id}-latest`,
      projectId: seed.id,
      type: required(UpdateType.byId(seed.latest.type), `update type ${seed.latest.type}`),
      postedAt: new Date(now - seed.latest.minutesAgo * MINUTE_MS),
      summary: text(seed.latest.summary),
      note: seed.latest.note ? text(seed.latest.note) : undefined,
      hearts: seed.latest.hearts,
      replies: seed.latest.replies,
    });
    const older = seed.history.map(([daysAgo, typeId], index) => {
      // Spread older posts through their day so they don't all land on the same minute.
      const minutesIntoDay = 60 + ((daysAgo * 137 + projectIndex * 53) % 1100);
      return new ProjectUpdate({
        id: `${seed.id}-${daysAgo}d`,
        projectId: seed.id,
        type: required(UpdateType.byId(typeId), `update type ${typeId}`),
        postedAt: new Date(now - daysAgo * DAY_MS - minutesIntoDay * MINUTE_MS),
        summary: text(historyTemplates[typeId]),
        hearts: 2 + ((daysAgo + index * 3) % 9),
        replies: (daysAgo + index) % 4,
      });
    });
    return [latest, ...older];
  }
}

function text(pair: Bilingual): LocalizedText {
  return new LocalizedText(pair.en, pair.th);
}

function required<T>(value: T | undefined, what: string): T {
  if (value === undefined) throw new Error(`Sample data refers to an unknown ${what}`);
  return value;
}

/** In-memory repositories filled with the placeholder shelf. */
export function buildSampleRepositories(clock: Clock): Repositories {
  return new SampleCatalogue(clock).build();
}
