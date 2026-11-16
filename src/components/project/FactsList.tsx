"use client";

import type { Project } from "@/domain";
import { useLocalizer } from "../providers/NestProvider";

/** "The basics": a short table of facts. Rows without data are left out. */
export function FactsList({ project }: { project: Project }) {
  const localizer = useLocalizer();
  const rows: Array<[string, string | undefined]> = [
    [localizer.t("facts.category"), localizer.text(project.category.singular)],
    [localizer.t("facts.genre"), localizer.list(project.genres.map((genre) => localizer.text(genre.label)))],
    [localizer.t("facts.stage"), localizer.text(project.stage.label)],
    [localizer.t("facts.started"), project.startedOn && localizer.monthYear(project.startedOn)],
    [
      localizer.t("facts.platforms"),
      project.platforms.length > 0 ? localizer.list(project.platforms.map((p) => localizer.text(p.label))) : undefined,
    ],
    [localizer.t("facts.team"), project.team && localizer.text(project.team)],
  ];
  return (
    <div className="facts">
      <h2 className="mono">{localizer.t("facts.title")}</h2>
      <dl>
        {rows
          .filter((row): row is [string, string] => Boolean(row[1]))
          .map(([term, value]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{value}</dd>
            </div>
          ))}
      </dl>
    </div>
  );
}
