"use client";

import { parseAsArrayOf, parseAsBoolean, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import { useCallback, useMemo } from "react";
import { Stage, type StageId } from "@/domain";
import { ShelfQuery, toggled } from "@/services/shelf";

/** How a room's state is spelled in the address bar: /game/?q=cave&genre=puzzle&stage=beta,live&open=true&demo=true&week=true */
const urlState = {
  q: parseAsString.withDefault(""),
  genre: parseAsString,
  stage: parseAsArrayOf(parseAsStringLiteral(Stage.ids())).withDefault([]),
  demo: parseAsBoolean.withDefault(false),
  open: parseAsBoolean.withDefault(false),
  week: parseAsBoolean.withDefault(false),
};

export interface RoomQueryControls {
  query: ShelfQuery;
  /** The one genre picked, or null for everything in the room. */
  genre: string | null;
  search(text: string): void;
  pickGenre(genreId: string | null): void;
  toggleStage(stageId: StageId): void;
  toggleDemo(): void;
  toggleOpen(): void;
  toggleWeek(): void;
  clear(): void;
}

/** A room's search and filters, kept in the URL so a view can be shared. Rooms always list the newest first. */
export function useRoomQuery(): RoomQueryControls {
  const [state, setState] = useQueryStates(urlState, { history: "replace" });

  const query = useMemo(
    () =>
      new ShelfQuery({
        text: state.q,
        genres: state.genre ? [state.genre] : [],
        stages: state.stage,
        hasDemo: state.demo,
        openToInvestment: state.open,
        updatedThisWeek: state.week,
        sort: "newest",
      }),
    [state],
  );

  const search = useCallback((text: string) => void setState({ q: text || null }), [setState]);
  const pickGenre = useCallback((genre: string | null) => void setState({ genre }), [setState]);
  const toggleStage = useCallback(
    (stageId: StageId) =>
      void setState((now) => {
        const stage = toggled(now.stage, stageId);
        return { stage: stage.length > 0 ? stage : null };
      }),
    [setState],
  );
  const toggleDemo = useCallback(() => void setState((now) => ({ demo: !now.demo || null })), [setState]);
  const toggleOpen = useCallback(() => void setState((now) => ({ open: !now.open || null })), [setState]);
  const toggleWeek = useCallback(() => void setState((now) => ({ week: !now.week || null })), [setState]);
  const clear = useCallback(
    () => void setState({ q: null, genre: null, stage: null, demo: null, open: null, week: null }),
    [setState],
  );

  return { query, genre: state.genre, search, pickGenre, toggleStage, toggleDemo, toggleOpen, toggleWeek, clear };
}
