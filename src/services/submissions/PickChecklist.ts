import { isOpenableLink, type ProjectDraft } from "./drafts";

export type PickCheckId = "madeHere" | "somethingToTry" | "beforeAndNow" | "money" | "willReply";

/** One of the five things Hamster Hub checks before a project goes on the shelf. */
interface PickCheck {
  id: PickCheckId;
  isMet(draft: ProjectDraft): boolean;
}

export interface PickCheckResult {
  id: PickCheckId;
  met: boolean;
}

/** The screening list, in the order "How we pick" will show it. */
const CHECKS: readonly PickCheck[] = [
  { id: "madeHere", isMet: (draft) => draft.madeAtHub },
  { id: "somethingToTry", isMet: (draft) => isOpenableLink(draft.tryUrl) },
  { id: "beforeAndNow", isMet: (draft) => draft.beforePhotoName !== null && draft.nowPhotoName !== null },
  { id: "money", isMet: (draft) => draft.money.trim().length > 0 },
  { id: "willReply", isMet: (draft) => draft.willReply },
];

/** Tells a maker which of the five checks their draft already passes. Missing ones don't block sending. */
export class PickChecklist {
  review(draft: ProjectDraft): PickCheckResult[] {
    return CHECKS.map((check) => ({ id: check.id, met: check.isMet(draft) }));
  }

  missingCount(draft: ProjectDraft): number {
    return this.review(draft).filter((result) => !result.met).length;
  }
}
