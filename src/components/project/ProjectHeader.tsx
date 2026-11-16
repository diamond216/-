"use client";

import type { ProjectPage } from "@/services/pages";
import { ACTIVITY_WINDOW_DAYS } from "@/services/shelf";
import { paths } from "../common/links";
import { useLocalizer, useNest } from "../providers/NestProvider";
import { ActivityStrip } from "../shelf/ActivityStrip";

export function ProjectHeader({ page }: { page: ProjectPage }) {
  const localizer = useLocalizer();
  const { clock } = useNest();
  const { project } = page.listing;
  const genre = project.primaryGenre;

  return (
    <>
      <nav aria-label={localizer.t("crumb.label")}>
        <p className="mono crumb">
          <a href={paths.shelfCategory(project.category.id)}>{localizer.text(project.category.label)}</a>
          {" / "}
          <a href={paths.shelfGenre(genre.id)}>{localizer.text(genre.label)}</a>
          {" / "}
          <span aria-current="page">{project.name}</span>
        </p>
      </nav>

      <header className="proj__head">
        <div>
          <h1>{project.name}</h1>
          <p className="proj__line">{localizer.text(project.blurb)}</p>
          <p className="tags">{project.hashtags().join(" ")}</p>
        </div>
        <div className="proj__status">
          <ActivityStrip days={page.strip} />
          <p className="mono">
            <span className="dot" aria-hidden="true" />
            {page.latest
              ? localizer.t("project.status", {
                  count: page.updatesInWindow,
                  days: ACTIVITY_WINDOW_DAYS,
                  ago: localizer.ago(page.latest.postedAt, clock.now()),
                })
              : localizer.t("project.quiet")}
          </p>
          <p className="chips">
            <span className="chip">{localizer.text(project.stage.label)}</span>
            {project.paused && <span className="chip">{localizer.t("card.paused")}</span>}
            {project.openToInvestment && <span className="chip chip--accent">{localizer.t("filters.open")}</span>}
            {page.position && <span className="chip">{localizer.t("project.position", { n: page.position })}</span>}
          </p>
        </div>
      </header>
    </>
  );
}
