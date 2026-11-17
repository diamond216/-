"use client";

import type { ProjectPage } from "@/services/pages";
import { BeforeNowPair } from "../common/BeforeNowPair";
import { FreshnessLabel } from "../common/FreshnessLabel";
import { paths } from "../common/links";
import { useLocalizer, useNest } from "../providers/NestProvider";

/** The top of a project page: its name and line on the left, how it looked before and now on the right. */
export function ProjectHeader({ page }: { page: ProjectPage }) {
  const localizer = useLocalizer();
  const { clock } = useNest();
  const { project } = page.listing;
  const genre = project.primaryGenre;

  return (
    <>
      <nav aria-label={localizer.t("crumb.label")}>
        <p className="mono crumb">
          <a href={paths.room(project.category.id)}>{localizer.text(project.category.label)}</a>
          {" / "}
          <a href={paths.roomGenre(project.category.id, genre.id)}>{localizer.text(genre.label)}</a>
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
          {page.latest ? (
            <>
              <BeforeNowPair project={project} update={page.latest} />
              <p className="proj__now">
                <span className="sr-only">
                  <FreshnessLabel freshness={page.latest.freshness(clock.now())} />{" "}
                </span>
                <span className="hand">{localizer.text(page.latest.title)}</span>
              </p>
            </>
          ) : (
            <p className="proj__now">{localizer.t("project.quiet")}</p>
          )}
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
