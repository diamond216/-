import type { ProjectUpdate, UpdateType, UpdateTypeId } from "@/domain";

export interface UpdateTypeFacet {
  type: UpdateType;
  count: number;
}

/** A project's updates as the page shows them: newest first, filterable by type, older ones folded. */
export class UpdateStream {
  private readonly updates: readonly ProjectUpdate[];

  constructor(updates: readonly ProjectUpdate[]) {
    this.updates = [...updates].sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());
  }

  get size(): number {
    return this.updates.length;
  }

  /** Each kind of update that appears, in the order it first turns up (newest first), with how many there are. */
  facets(): UpdateTypeFacet[] {
    const counts = new Map<UpdateType, number>();
    for (const update of this.updates) counts.set(update.type, (counts.get(update.type) ?? 0) + 1);
    return [...counts].map(([type, count]) => ({ type, count }));
  }

  /** null means every type. */
  ofType(typeId: UpdateTypeId | null): ProjectUpdate[] {
    return typeId ? this.updates.filter((update) => update.type.id === typeId) : [...this.updates];
  }

  /** The first few to show, and the rest behind "Show N older updates". */
  page(typeId: UpdateTypeId | null, visible: number): { shown: ProjectUpdate[]; older: ProjectUpdate[] } {
    const all = this.ofType(typeId);
    return { shown: all.slice(0, visible), older: all.slice(visible) };
  }
}
