"use client";

import { parseAsArrayOf, parseAsBoolean, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import { useCallback, useMemo } from "react";
import { Category, Stage } from "@/domain";
import { SORT_IDS } from "@/services/ranking";
import { ShelfQuery, type ShelfQueryState } from "@/services/shelf";

/** How the shelf's state is spelled in the address bar: ?q=…&cat=game&genre=puzzle&stage=beta&open=true&sort=newest */
const urlState = {
  q: parseAsString.withDefault(""),
  cat: parseAsStringLiteral(Category.ids()),
  genre: parseAsArrayOf(parseAsString).withDefault([]),
  stage: parseAsArrayOf(parseAsStringLiteral(Stage.ids())).withDefault([]),
  open: parseAsBoolean.withDefault(false),
  demo: parseAsBoolean.withDefault(false),
  week: parseAsBoolean.withDefault(false),
  sort: parseAsStringLiteral(SORT_IDS).withDefault("active"),
};

export interface ShelfQueryControls {
  query: ShelfQuery;
  /** Change part of the query. The address bar follows, so the view can be shared. */
  update(patch: Partial<ShelfQueryState>): void;
  /** Drop the search words and every filter. Keeps the sort. */
  clear(): void;
}

/** The shelf's search, filters and sort, kept in the URL. */
export function useShelfQuery(): ShelfQueryControls {
  const [state, setState] = useQueryStates(urlState, { history: "replace" });

  const query = useMemo(
    () =>
      new ShelfQuery({
        text: state.q,
        category: state.cat,
        genres: state.genre,
        stages: state.stage,
        openToInvestment: state.open,
        hasDemo: state.demo,
        updatedThisWeek: state.week,
        sort: state.sort,
      }),
    [state],
  );

  const update = useCallback(
    (patch: Partial<ShelfQueryState>) => {
      void setState({
        ...("text" in patch && { q: patch.text }),
        ...("category" in patch && { cat: patch.category }),
        ...("genres" in patch && { genre: [...(patch.genres ?? [])] }),
        ...("stages" in patch && { stage: [...(patch.stages ?? [])] }),
        ...("openToInvestment" in patch && { open: patch.openToInvestment }),
        ...("hasDemo" in patch && { demo: patch.hasDemo }),
        ...("updatedThisWeek" in patch && { week: patch.updatedThisWeek }),
        ...("sort" in patch && { sort: patch.sort }),
      });
    },
    [setState],
  );

  const clear = useCallback(() => {
    void setState({ q: null, cat: null, genre: null, stage: null, open: null, demo: null, week: null });
  }, [setState]);

  return { query, update, clear };
}
