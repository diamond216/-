"use client";

import { useId, useState } from "react";
import { type CategoryId, Stage } from "@/domain";
import type { RoomQueryControls } from "@/hooks/useRoomQuery";
import type { GenreFacet } from "@/services/shelf";
import { useLocalizer } from "../providers/NestProvider";

/** A room's left sidebar: one genre at a time, then stage and investor checkboxes. Folds behind a button on small screens. */
export function RoomSidebar({
  roomId,
  roomSize,
  facets,
  controls,
}: {
  roomId: CategoryId;
  /** How many projects the room holds before any filter. */
  roomSize: number;
  facets: readonly GenreFacet[];
  controls: RoomQueryControls;
}) {
  const localizer = useLocalizer();
  const { query, genre, pickGenre, toggleStage, toggleDemo, toggleOpen, toggleWeek, clear } = controls;
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <aside className="side" aria-label={localizer.t("room.filters")}>
      <button
        className="side__toggle"
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        {localizer.t("filters.toggle", { active: query.sidebarFilterCount })}
      </button>

      <div className="side__panel" id={panelId} data-open={open}>
        <h2>{localizer.t("filters.genre")}</h2>
        <ul className="side__list">
          <li>
            <button type="button" aria-pressed={genre === null} onClick={() => pickGenre(null)}>
              <span>{localizer.t(`room.${roomId}.everything`)}</span>
              <span className="side__n">{roomSize}</span>
            </button>
          </li>
          {facets.map((facet) => (
            <li key={facet.genre.id}>
              <button
                type="button"
                aria-pressed={genre === facet.genre.id}
                onClick={() => pickGenre(genre === facet.genre.id ? null : facet.genre.id)}
              >
                <span>{localizer.text(facet.genre.label)}</span>
                <span className="side__n">{facet.count}</span>
              </button>
            </li>
          ))}
        </ul>

        <h2>{localizer.t("room.side.stage")}</h2>
        {Stage.all().map((stage) => (
          <label className="ck" key={stage.id}>
            <input type="checkbox" checked={query.hasStage(stage.id)} onChange={() => toggleStage(stage.id)} />
            {stage.badge}
          </label>
        ))}

        <h2>{localizer.t("room.side.investors")}</h2>
        <label className="ck">
          <input type="checkbox" checked={query.openToInvestment} onChange={toggleOpen} />
          {localizer.t("filters.open")}
        </label>
        <label className="ck">
          <input type="checkbox" checked={query.hasDemo} onChange={toggleDemo} />
          {localizer.t("room.demo")}
        </label>
        <label className="ck">
          <input type="checkbox" checked={query.updatedThisWeek} onChange={toggleWeek} />
          {localizer.t("room.week")}
        </label>

        {query.isNarrowed && (
          <button className="side__clear" type="button" onClick={clear}>
            {localizer.t("room.clear")}
          </button>
        )}
      </div>
    </aside>
  );
}
