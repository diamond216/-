import type { CategoryId, StageId, UpdateTypeId } from "@/domain";

/** "This photo isn't the after of anything": show it on its own. */
export const NO_BEFORE = "none";

/** The update types a maker can pick when posting. The rest are for imported history. */
export const POSTABLE_UPDATE_TYPES: readonly UpdateTypeId[] = ["demo", "milestone", "devlog", "media", "patch"];

/** At most this many genres per project. */
export const MAX_GENRES = 2;

/** What a maker has filled in on "an update to one you've posted". Photos are kept by name only. */
export interface UpdateDraft {
  projectId: string;
  /** "What changed?", in one line. */
  title: string;
  typeId: UpdateTypeId;
  /** File name of the new photo, or null for a post without one. */
  photoName: string | null;
  /** Id of the older photo this one is the after of, NO_BEFORE, or null while undecided. */
  afterOf: string | null;
}

export function emptyUpdateDraft(projectId = ""): UpdateDraft {
  return { projectId, title: "", typeId: "demo", photoName: null, afterOf: null };
}

/** What a maker has filled in on "a new project". */
export interface ProjectDraft {
  name: string;
  blurb: string;
  room: CategoryId | null;
  genreIds: readonly string[];
  stageId: StageId | null;
  tryUrl: string;
  beforePhotoName: string | null;
  nowPhotoName: string | null;
  money: string;
  openToInvestment: boolean;
  madeAtHub: boolean;
  willReply: boolean;
}

export function emptyProjectDraft(room: CategoryId | null = null): ProjectDraft {
  return {
    name: "",
    blurb: "",
    room,
    genreIds: [],
    stageId: null,
    tryUrl: "",
    beforePhotoName: null,
    nowPhotoName: null,
    money: "",
    openToInvestment: false,
    madeAtHub: false,
    willReply: false,
  };
}

/** True for a link someone could open: http or https, with a host. */
export function isOpenableLink(text: string): boolean {
  try {
    const url = new URL(text.trim());
    return (url.protocol === "http:" || url.protocol === "https:") && url.hostname.includes(".");
  } catch {
    return false;
  }
}
