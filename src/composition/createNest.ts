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
import { ActivityDigest, ListingDirectory, ListingSpecificationBuilder, Shelf } from "@/services/shelf";
import { BrowserStore, type KeyValueStore } from "@/services/storage/KeyValueStore";

/** Everything the interface needs, already wired together. */
export interface Nest {
  clock: Clock;
  shelf: Shelf;
  digest: ActivityDigest;
  endorsements: EndorsementRepository;
  contact: { validator: MessageValidator; sender: MessageSender };
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

  return {
    clock,
    shelf: new Shelf(directory, repositories.genres, specifications, rankings, flow),
    digest: new ActivityDigest(directory, repositories.updates, repositories.genres, flow, clock),
    endorsements: repositories.endorsements,
    contact: { validator: new MessageValidator(), sender: new LocalOutboxSender(storage, clock) },
    preferences: {
      locale: new PreferenceStore<Locale>(LOCALE_STORAGE_KEY, LOCALES, "en", storage, "lang"),
      theme: new PreferenceStore<Theme>(THEME_STORAGE_KEY, THEMES, "day", storage, "theme"),
    },
  };
}
