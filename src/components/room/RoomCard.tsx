"use client";

import Link from "next/link";
import type { Listing } from "@/domain";
import { Avatar } from "../common/Avatar";
import { FreshnessLabel } from "../common/FreshnessLabel";
import { paths } from "../common/links";
import { useLocalizer, useNest } from "../providers/NestProvider";
import { Cover } from "../shelf/Cover";

/** One project in a room: the cover, what it is, who made it, and the last thing they posted in their own words. */
export function RoomCard({ listing }: { listing: Listing }) {
  const localizer = useLocalizer();
  const { clock } = useNest();
  const { project, maker } = listing;
  const latest = listing.latestUpdate();

  return (
    <article className="rcard">
      <Cover project={project} />
      <h3>
        <Link href={paths.project(project.id)}>{project.name}</Link>
      </h3>
      <p>{localizer.text(project.blurb)}</p>
      <p className="who2">
        <Avatar maker={maker} />
        <Link href={paths.maker(maker.id)}>
          {localizer.t("best.by", { name: localizer.text(maker.nickname) })}
        </Link>
        <span className="stage">{project.stage.badge}</span>
      </p>
      {latest && (
        <p className="rcard__new">
          {project.paused ? (
            <span className="when">{localizer.t("card.paused")}</span>
          ) : (
            <FreshnessLabel freshness={latest.freshness(clock.now())} />
          )}
          <span className="hand">{localizer.text(latest.title)}</span>
        </p>
      )}
    </article>
  );
}
