import { ActivityLog, Listing } from "@/domain";
import type { MakerRepository, ProjectRepository, UpdateRepository } from "@/data/repositories";

/** Joins projects with their makers and updates once, so everything else can work with Listings. */
export class ListingDirectory {
  private readonly listings: readonly Listing[];
  private readonly byProject: ReadonlyMap<string, Listing>;

  constructor(projects: ProjectRepository, makers: MakerRepository, updates: UpdateRepository) {
    this.listings = projects.all().map((project) => {
      const maker = makers.byId(project.makerId);
      if (!maker) throw new Error(`${project.id} points at a maker that doesn't exist: ${project.makerId}`);
      return new Listing(project, maker, new ActivityLog(updates.forProject(project.id)));
    });
    this.byProject = new Map(this.listings.map((listing) => [listing.id, listing]));
  }

  all(): readonly Listing[] {
    return this.listings;
  }

  forProject(projectId: string): Listing | undefined {
    return this.byProject.get(projectId);
  }
}
