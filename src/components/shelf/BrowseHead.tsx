"use client";

import { useMemo } from "react";
import type { ShelfQueryControls } from "@/hooks/useShelfQuery";
import { useLocalizer, useNest } from "../providers/NestProvider";
import { SearchBox } from "./SearchBox";

const BUSY_GENRES_SHOWN = 4;

/** The top of Browse: the title, the search field, and a few busy genres to start from. */
export function BrowseHead({ shelfQuery, onSubmit }: { shelfQuery: ShelfQueryControls; onSubmit(): void }) {
  const localizer = useLocalizer();
  const { shelf, digest } = useNest();
  const { query, update } = shelfQuery;
  const busyGenres = useMemo(() => digest.busyGenres(BUSY_GENRES_SHOWN), [digest]);

  return (
    <header className="browse wrap">
      <div className="browse__title">
        <h2>{localizer.t("browse.title")}</h2>
        <p>{localizer.t("browse.sub", { count: shelf.size() })}</p>
      </div>
      <SearchBox value={query.text} onChange={(text) => update({ text })} onSubmit={onSubmit} />
      <p className="browse__busy">
        <span>{localizer.t("browse.busy")}</span>
        {busyGenres.map((genre) => (
          <a key={genre.id} href="#shelf" onClick={() => update({ category: null, genres: [genre.id] })}>
            {localizer.text(genre.label)}
          </a>
        ))}
        <a href="#shelf" onClick={() => update({ openToInvestment: true })}>
          {localizer.t("filters.open")}
        </a>
      </p>
    </header>
  );
}
