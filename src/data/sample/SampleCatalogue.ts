import {
  Category,
  type CategoryId,
  type Clock,
  CoverArt,
  DAY_MS,
  EarlierWork,
  Endorsement,
  EndorsementKind,
  type Genre,
  HubCheck,
  HubContribution,
  LocalizedText,
  Maker,
  MakerStory,
  MINUTE_MS,
  Money,
  MoneyLedger,
  NotedAmount,
  OwnershipShare,
  Platform,
  Project,
  ProjectUpdate,
  RaisingTarget,
  Recognition,
  ReplyTime,
  Stage,
  TimelineEntry,
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
import { makerStories, type MakerStorySeed } from "./makerStories";
import { type LedgerSeed, postTemplates, postVariants, projectDetails, type ProjectDetailSeed } from "./projectDetails";
import {
  type Bilingual,
  endorsementSeeds,
  historyTemplates,
  type MakerSeed,
  makerSeeds,
  projectSeeds,
  type ProjectSeed,
} from "./seeds";

/** Patterns and colours that generated screenshots cycle through when a project has none of its own. */
const SCREEN_PATTERNS: readonly CategoryId[] = ["game", "idea", "iot", "web"];
const SCREEN_COLORS: readonly string[] = ["#c9553a", "#4a5b4a", "#3d5a6c", "#d39a2f", "#2f5d50", "#b9785a"];

/** Turns the placeholder seeds into domain objects, anchoring every "ago" to the given clock. */
class SampleCatalogue {
  private readonly genres: ReadonlyMap<string, Genre>;

  constructor(private readonly clock: Clock) {
    this.genres = new Map(sampleGenres.map((genre) => [genre.id, genre]));
  }

  build(): Repositories {
    return {
      genres: new InMemoryGenreRepository(sampleGenres),
      projects: new InMemoryProjectRepository(projectSeeds.map((seed, index) => this.project(seed, index))),
      makers: new InMemoryMakerRepository(makerSeeds.map((seed) => this.maker(seed))),
      updates: new InMemoryUpdateRepository(projectSeeds.flatMap((seed, index) => this.updates(seed, index))),
      endorsements: new InMemoryEndorsementRepository(
        endorsementSeeds.map(
          (seed) =>
            new Endorsement({
              ...seed,
              kind: required(EndorsementKind.byId(seed.kind), `endorsement kind ${seed.kind}`),
              quote: text(seed.quote),
              quoteInContext: seed.quoteInContext && text(seed.quoteInContext),
              author: text(seed.author),
              authorRole: text(seed.authorRole),
            }),
        ),
      ),
    };
  }

  private maker(seed: MakerSeed): Maker {
    const story = required(makerStories[seed.id], `story for maker ${seed.id}`);
    return new Maker({
      ...seed,
      nickname: text(seed.nickname),
      role: text(seed.role),
      motto: text(seed.motto),
      joinedYear: story.joinedYear,
      story: this.story(story),
    });
  }

  private story(seed: MakerStorySeed): MakerStory {
    return new MakerStory({
      intro: text(seed.intro),
      description: text(seed.description),
      talkTopics: seed.talkTopics.map(text),
      replyTime: new ReplyTime(seed.replyDays),
      languages: seed.languages,
      portraitCaption: seed.portraitCaption && text(seed.portraitCaption),
      timeline: seed.timeline.map(([year, line]) => new TimelineEntry(year, text(line))),
      recognitions: seed.recognitions.map(
        ([year, title, from, kind]) => new Recognition(year, text(title), text(from), kind),
      ),
      earlier: seed.earlier.map(([year, name, note]) => new EarlierWork(year, text(name), text(note))),
    });
  }

  private project(seed: ProjectSeed, index: number): Project {
    const detail = this.detail(seed.id);
    const category = required(Category.byId(seed.category), `category ${seed.category}`);
    return new Project({
      id: seed.id,
      name: seed.name,
      category,
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
      screens: detail.screens
        ? detail.screens.map(([pattern, color]) => new CoverArt(pattern, color))
        : SampleCatalogue.generatedScreens(index, seed.coverColor),
      platforms: detail.platforms.map((id) => required(Platform.byId(id), `platform ${id}`)),
      team: text(detail.team),
      startedOn: SampleCatalogue.month(detail.started),
      ledger: detail.ledger && this.ledger(detail.ledger),
      hub:
        detail.hub &&
        new HubContribution(
          text(detail.hub.summary),
          detail.hub.checks.map((id) => required(HubCheck.byId(id), `hub check ${id}`)),
        ),
    });
  }

  private ledger(seed: LedgerSeed): MoneyLedger {
    return new MoneyLedger({
      earns: text(seed.earns),
      ownership: seed.owners.map(([holder, percent]) => new OwnershipShare(text(holder), percent)),
      raising: seed.raising && new RaisingTarget(Money.baht(seed.raising[0]), text(seed.raising[1])),
      spent: new NotedAmount(Money.baht(seed.spent[0]), text(seed.spent[1])),
      earned: new NotedAmount(Money.baht(seed.earned[0]), text(seed.earned[1])),
      checkedOn: new Date(this.clock.now().getTime() - seed.checkedDaysAgo * DAY_MS),
    });
  }

  private updates(seed: ProjectSeed, projectIndex: number): ProjectUpdate[] {
    const now = this.clock.now().getTime();
    const detail = this.detail(seed.id);
    const type = (id: string) => required(UpdateType.byId(id), `update type ${id}`);
    // Spread older posts through their day so they don't all land on the same minute.
    const postedDaysAgo = (daysAgo: number) =>
      new Date(now - daysAgo * DAY_MS - (60 + ((daysAgo * 137 + projectIndex * 53) % 1100)) * MINUTE_MS);

    const latest = new ProjectUpdate({
      id: `${seed.id}-latest`,
      projectId: seed.id,
      type: type(seed.latest.type),
      postedAt: new Date(now - seed.latest.minutesAgo * MINUTE_MS),
      summary: text(seed.latest.summary),
      note: seed.latest.note ? text(seed.latest.note) : undefined,
      title: text(detail.latest.title),
      body: text(detail.latest.body),
      image: detail.latest.image ? new CoverArt(seed.category, seed.coverColor) : undefined,
      hearts: seed.latest.hearts,
      replies: seed.latest.replies,
    });
    const written = (detail.posts ?? []).map(
      (post) =>
        new ProjectUpdate({
          id: `${seed.id}-${post.daysAgo}d`,
          projectId: seed.id,
          type: type(post.type),
          postedAt: postedDaysAgo(post.daysAgo),
          summary: text(post.summary),
          title: text(post.title),
          body: text(post.body),
          hearts: post.hearts,
          replies: post.replies,
        }),
    );
    const older = seed.history.map(([daysAgo, typeId], index) => {
      // Rotate through the wordings for this kind of post, so neighbours in a stream differ.
      const wordings = [postTemplates[typeId], ...(postVariants[typeId] ?? [])];
      const wording = wordings[(index + projectIndex) % wordings.length];
      return new ProjectUpdate({
          id: `${seed.id}-${daysAgo}d`,
          projectId: seed.id,
          type: type(typeId),
          postedAt: postedDaysAgo(daysAgo),
          summary: text(historyTemplates[typeId]),
        title: text(wording.title),
        body: text(wording.body),
        hearts: 2 + ((daysAgo + index * 3) % 9),
        replies: (daysAgo + index) % 4,
      });
    });
    return [latest, ...written, ...older];
  }

  private detail(projectId: string): ProjectDetailSeed {
    return required(projectDetails[projectId], `details for project ${projectId}`);
  }

  /** Three stand-in screenshots, varied by the project's position so neighbours don't match. */
  private static generatedScreens(index: number, coverColor: string): CoverArt[] {
    const colors = SCREEN_COLORS.filter((color) => color !== coverColor);
    return [0, 1, 2].map(
      (n) =>
        new CoverArt(
          SCREEN_PATTERNS[(index + n) % SCREEN_PATTERNS.length],
          colors[(index * 2 + n) % colors.length],
        ),
    );
  }

  /** "2026-02" → the first of February 2026, UTC. */
  private static month(value: string): Date {
    const [year, month] = value.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, 1));
  }
}

function text(pair: Bilingual): LocalizedText {
  return new LocalizedText(pair.en, pair.th);
}

function required<T>(value: T | undefined | null, what: string): T {
  if (value === undefined || value === null) throw new Error(`Sample data refers to an unknown ${what}`);
  return value;
}

/** In-memory repositories filled with the placeholder shelf. */
export function buildSampleRepositories(clock: Clock): Repositories {
  return new SampleCatalogue(clock).build();
}
