import type { CoverArt } from "./CoverArt";
import type { LocalizedText } from "./LocalizedText";

/** A photo a maker picked from their own device. Lives only as long as the page that holds it. */
export class UploadedPicture {
  constructor(
    /** An object URL or any URL an <img> can show. */
    readonly url: string,
    readonly fileName: string,
  ) {}
}

/** What a photo shows: a real upload, or a generated cover standing in for one. */
export type Picture = CoverArt | UploadedPicture;

/** One photo in a project's history, the kind a new photo can be the "after" of. */
export class ProjectPhoto {
  constructor(
    readonly id: string,
    readonly caption: LocalizedText,
    readonly picture: Picture,
    /** When it was posted, if anyone knows. */
    readonly postedAt?: Date,
  ) {}
}
