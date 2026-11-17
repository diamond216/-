"use client";

import type { Project, ProjectUpdate } from "@/domain";
import { useLocalizer, useNest } from "../providers/NestProvider";
import { Cover } from "../shelf/Cover";

/**
 * A project as it looked before, next to how it looks now, labelled with how fresh the change is.
 * Until makers can upload photos, both sides are the project's generated cover, with the "before" one faded.
 * Purely a picture: whoever uses it says the same thing in words nearby.
 */
export function BeforeNowPair({ project, update }: { project: Project; update: ProjectUpdate }) {
  const localizer = useLocalizer();
  const { clock } = useNest();
  const freshness = update.freshness(clock.now());

  return (
    <div className="pair__two" aria-hidden="true">
      <figure>
        <Cover project={project} />
        <figcaption>{localizer.t("progress.before")}</figcaption>
      </figure>
      <figure>
        <Cover project={project} />
        <figcaption className={freshness.isToday ? "hi" : undefined}>{localizer.t(`when.${freshness.id}`)}</figcaption>
      </figure>
    </div>
  );
}
