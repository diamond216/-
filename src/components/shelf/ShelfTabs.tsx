"use client";

import type { CategoryId } from "@/domain";
import type { ShelfQueryControls } from "@/hooks/useShelfQuery";
import { SORT_IDS } from "@/services/ranking";
import type { CategoryCount } from "@/services/shelf";
import { CategoryIcon } from "../common/CategoryIcon";
import { useLocalizer } from "../providers/NestProvider";

/** Category tabs on the left, sort tabs on the right. */
export function ShelfTabs({
  counts,
  total,
  shelfQuery,
}: {
  counts: readonly CategoryCount[];
  total: number;
  shelfQuery: ShelfQueryControls;
}) {
  const localizer = useLocalizer();
  const { query, update } = shelfQuery;
  // Switching category drops genres that don't belong to it, so the two never contradict each other.
  const pick = (category: CategoryId | null) => update({ category, genres: [] });

  return (
    <nav className="tabs wrap" aria-label={localizer.t("tabs.label")}>
      <button type="button" aria-pressed={query.category === null} onClick={() => pick(null)}>
        <span>{localizer.t("tabs.everything")}</span> <small>{total}</small>
      </button>
      {counts.map(({ category, count }) => (
        <button
          key={category.id}
          type="button"
          aria-pressed={query.category === category.id}
          onClick={() => pick(category.id)}
        >
          <CategoryIcon category={category.id} />
          <span>{localizer.text(category.label)}</span> <small>{count}</small>
        </button>
      ))}
      <div className="tabs__sort" role="group" aria-label={localizer.t("sort.label")}>
        <span aria-hidden="true">{localizer.t("sort.label")}</span>
        {SORT_IDS.map((sort) => (
          <button key={sort} type="button" aria-pressed={query.sort === sort} onClick={() => update({ sort })}>
            {localizer.t(`sort.${sort}`)}
          </button>
        ))}
      </div>
    </nav>
  );
}
