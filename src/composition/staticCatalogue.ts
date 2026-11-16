import { buildSampleRepositories } from "@/data";
import { FrozenClock } from "@/domain";

/**
 * Read-only access to the catalogue while pages are built ahead of time: which slugs
 * exist, and the words for each page's title and description. No browser needed.
 */
export const staticCatalogue = buildSampleRepositories(FrozenClock.atLoad());
