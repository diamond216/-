import {
  type CategoryId,
  CoverArt,
  type Genre,
  LocalizedText,
  type Maker,
  type Project,
  ProjectPhoto,
} from "@/domain";
import type { GenreRepository } from "@/data/repositories";
import type { ListingDirectory } from "../shelf/ListingDirectory";

export interface MakerProjects {
  maker: Maker;
  projects: readonly Project[];
}

/** How many older photos the "this is the after of…" picker offers. */
export const PHOTOS_OFFERED = 9;

/** What the posting forms need to show: whose projects there are, which genres fit a room, and a project's older photos. */
export class PostingDesk {
  constructor(
    private readonly directory: ListingDirectory,
    private readonly genres: GenreRepository,
  ) {}

  /** Every project, grouped by the maker who posts it. Until sign-in exists, the form lets you pick any. */
  projectsByMaker(): MakerProjects[] {
    const groups = new Map<string, { maker: Maker; projects: Project[] }>();
    for (const listing of this.directory.all()) {
      const group = groups.get(listing.maker.id) ?? { maker: listing.maker, projects: [] };
      group.projects.push(listing.project);
      groups.set(listing.maker.id, group);
    }
    return [...groups.values()];
  }

  project(projectId: string): Project | undefined {
    return this.directory.forProject(projectId)?.project;
  }

  maker(projectId: string): Maker | undefined {
    return this.directory.forProject(projectId)?.maker;
  }

  /** Genres that usually live in this room, in list order. */
  genresFor(room: CategoryId): Genre[] {
    return this.genres.all().filter((genre) => genre.home === room);
  }

  /**
   * The photos a new one can be the "after" of, newest first: pictures posted with updates,
   * then the gallery, then the cover. The same picture is offered once, at its newest.
   */
  photosFor(projectId: string): ProjectPhoto[] {
    const listing = this.directory.forProject(projectId);
    if (!listing) return [];
    const { project } = listing;
    const photos: ProjectPhoto[] = [];
    for (const update of listing.activity.all()) {
      if (update.image) photos.push(new ProjectPhoto(`update-${update.id}`, update.title, update.image, update.postedAt));
    }
    project.screens.forEach((art, index) => {
      photos.push(new ProjectPhoto(`screen-${index + 1}`, new LocalizedText(`Screenshot ${index + 1}`, `ภาพหน้าจอ ${index + 1}`), art));
    });
    photos.push(
      new ProjectPhoto("cover", new LocalizedText("The cover", "ภาพปก"), new CoverArt(project.category.id, project.coverColor), project.startedOn),
    );

    const seen = new Set<string>();
    return photos
      .filter((photo) => {
        const { picture } = photo;
        const key = picture instanceof CoverArt ? `${picture.pattern}:${picture.color.toLowerCase()}` : picture.url;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, PHOTOS_OFFERED);
  }
}
