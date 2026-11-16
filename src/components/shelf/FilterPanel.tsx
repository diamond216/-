"use client";

import { SlidersHorizontal } from "lucide-react";
import { useId, useState } from "react";
import { Stage } from "@/domain";
import type { ShelfQueryControls } from "@/hooks/useShelfQuery";
import { type GenreFacet, toggled } from "@/services/shelf";
import { useLocalizer } from "../providers/NestProvider";

const GENRES_SHOWN = 8;

/** The filter sidebar. On small screens it folds behind a "Filters" button. */
export function FilterPanel({ facets, shelfQuery }: { facets: readonly GenreFacet[]; shelfQuery: ShelfQueryControls }) {
  const localizer = useLocalizer();
  const { query, update, clear } = shelfQuery;
  const [open, setOpen] = useState(false);
  const [allGenres, setAllGenres] = useState(false);
  const panelId = useId();

  // Keep a selected genre visible even when the list is folded.
  const visible = allGenres
    ? facets
    : facets.filter((facet, index) => index < GENRES_SHOWN || query.hasGenre(facet.genre.id));
  const canFold = facets.length > GENRES_SHOWN;

  return (
    <aside className="filters" aria-label={localizer.t("filters.label")}>
      <button
        className="filters__toggle"
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <SlidersHorizontal aria-hidden="true" />
        {localizer.t("filters.toggle", { active: query.sidebarFilterCount })}
      </button>

      <div className="filters__panel" id={panelId} data-open={open}>
        <h2 className="mono">{localizer.t("filters.genre")}</h2>
        <ul className="filters__list">
          {visible.map(({ genre, count }) => (
            <li key={genre.id}>
              <button
                type="button"
                aria-pressed={query.hasGenre(genre.id)}
                onClick={() => update({ genres: toggled(query.genres, genre.id) })}
              >
                {localizer.text(genre.label)} <small>{count}</small>
              </button>
            </li>
          ))}
          {canFold && (
            <li>
              <button
                type="button"
                className="filters__all"
                aria-expanded={allGenres}
                onClick={() => setAllGenres((value) => !value)}
              >
                {allGenres ? localizer.t("filters.fewerGenres") : localizer.t("filters.allGenres", { count: facets.length })}
              </button>
            </li>
          )}
        </ul>

        <h2 className="mono">{localizer.t("filters.stage")}</h2>
        {Stage.all().map((stage) => (
          <label key={stage.id}>
            <input
              type="checkbox"
              checked={query.hasStage(stage.id)}
              onChange={() => update({ stages: toggled(query.stages, stage.id) })}
            />{" "}
            <span>{localizer.text(stage.label)}</span>
          </label>
        ))}

        <h2 className="mono">{localizer.t("filters.investing")}</h2>
        <label>
          <input
            type="checkbox"
            checked={query.openToInvestment}
            onChange={(event) => update({ openToInvestment: event.target.checked })}
          />{" "}
          <span>{localizer.t("filters.open")}</span>
        </label>
        <label>
          <input type="checkbox" checked={query.hasDemo} onChange={(event) => update({ hasDemo: event.target.checked })} />{" "}
          <span>{localizer.t("filters.hasDemo")}</span>
        </label>
        <label>
          <input
            type="checkbox"
            checked={query.updatedThisWeek}
            onChange={(event) => update({ updatedThisWeek: event.target.checked })}
          />{" "}
          <span>{localizer.t("filters.week")}</span>
        </label>

        {query.isNarrowed && (
          <button className="filters__clear" type="button" onClick={clear}>
            {localizer.t("filters.clear")}
          </button>
        )}
        <p className="filters__help">
          <span>{localizer.t("filters.help")}</span> <a href="#">{localizer.t("filters.helpLink")}</a>
        </p>
      </div>
    </aside>
  );
}
