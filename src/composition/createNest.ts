import { buildSampleRepositories } from "@/data";
import type { EndorsementRepository } from "@/data/repositories";
import { type Clock, FrozenClock, type Locale, LOCALES } from "@/domain";
import { LocalOutboxSender, type MessageSender, MessageValidator } from "@/services/contact";
import {
  LOCALE_STORAGE_KEY,
  PreferenceStore,
  type Theme,
  THEME_STORAGE_KEY,
  THEMES,
} from "@/services/preferences/PreferenceStore";
import { FlowRanking, MostFollowed, NewestFirst, RankingRegistry } from "@/services/ranking";
import { MiniSearchProjectSearch } from "@/services/search";
import { FollowStore } from "@/services/follow/FollowStore";
import { MakerProfileService, ProjectPageService } from "@/services/pages";
import { ActivityDigest, ListingDirectory, ListingSpecificationBuilder, Shelf } from "@/services/shelf";
import { BrowserStore, type KeyValueStore } from "@/services/storage/KeyValueStore";
import {
  type DraftValidator,
  LocalSubmissionOutbox,
  PickChecklist,
  PostingDesk,
  type ProjectDraft,
  type ProjectError,
  type ProjectField,
  projectValidator,
  SavedDrafts,
  type SubmissionSender,
  type UpdateDraft,
  type UpdateError,
  type UpdateField,
  updateValidator,
} from "@/services/submissions";

/** Everything the interface needs, already wired together. */
export interface Nest {
  clock: Clock;
  shelf: Shelf;
  digest: ActivityDigest;
  endorsements: EndorsementRepository;
  projectPages: ProjectPageService;
  makerProfiles: MakerProfileService;
  follows: FollowStore;
  contact: { validator: MessageValidator; sender: MessageSender };
  /** "Post your work": the forms for a new project and for an update. */
  posting: {
    desk: PostingDesk;
    updateValidator: DraftValidator<UpdateDraft, UpdateField, UpdateError>;
    projectValidator: DraftValidator<ProjectDraft, ProjectField, ProjectError>;
    checklist: PickChecklist;
    sender: SubmissionSender;
    drafts: SavedDrafts;
  };
  preferences: { locale: PreferenceStore<Locale>; theme: PreferenceStore<Theme> };
}

export interface NestOptions {
  clock?: Clock;
  storage?: KeyValueStore;
}

/**
 * The composition root: the one place that knows which concrete classes are in play.
 * To move to a real backend, build different repositories and a different MessageSender
 * here. Nothing in components or services needs to change.
 */
export function createNest({ clock = FrozenClock.atLoad(), storage = new BrowserStore() }: NestOptions = {}): Nest {
  const repositories = buildSampleRepositories(clock);
  const directory = new ListingDirectory(repositories.projects, repositories.makers, repositories.updates);

  const flow = new FlowRanking(clock);
  const rankings = new RankingRegistry([flow, new NewestFirst(), new MostFollowed()]);
  const search = new MiniSearchProjectSearch(directory.all());
  const specifications = new ListingSpecificationBuilder(search, clock);

  const shelf = new Shelf(directory, repositories.genres, specifications, rankings, flow);

  return {
    clock,
    shelf,
    digest: new ActivityDigest(directory, repositories.updates, repositories.genres, flow, clock),
    endorsements: repositories.endorsements,
    projectPages: new ProjectPageService(directory, shelf, repositories.endorsements, clock),
    makerProfiles: new MakerProfileService(repositories.makers, directory, repositories.endorsements, flow, clock),
    follows: new FollowStore(storage),
    contact: { validator: new MessageValidator(), sender: new LocalOutboxSender(storage, clock) },
    posting: {
      desk: new PostingDesk(directory, repositories.genres),
      updateValidator: updateValidator(),
      projectValidator: projectValidator(),
      checklist: new PickChecklist(),
      sender: new LocalSubmissionOutbox(storage, clock),
      drafts: new SavedDrafts(storage),
    },
    preferences: {
      locale: new PreferenceStore<Locale>(LOCALE_STORAGE_KEY, LOCALES, "en", storage, "lang"),
      theme: new PreferenceStore<Theme>(THEME_STORAGE_KEY, THEMES, "day", storage, "theme"),
    },
  };
}
