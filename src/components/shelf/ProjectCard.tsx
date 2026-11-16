"use client";

import { CardBody, CardContainer } from "@/components/ui/3d-card";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Listing } from "@/domain";
import { ACTIVITY_WINDOW_DAYS } from "@/services/shelf";
import { Avatar } from "../common/Avatar";
import { paths } from "../common/links";
import { TimeAgo } from "../common/TimeAgo";
import { useLocalizer, useNest } from "../providers/NestProvider";
import { ActivityStrip } from "./ActivityStrip";
import { Cover } from "./Cover";

/** A project card: in "Fresh updates" on the shelf, and on a maker's profile with a different footer. */
export function ProjectCard({
  listing,
  footer,
  tagLimit = 2,
}: {
  listing: Listing;
  /** Replaces the maker line at the bottom. The latest update's time still shows. */
  footer?: ReactNode;
  tagLimit?: number;
}) {
  const localizer = useLocalizer();
  const { clock } = useNest();
  const { project, maker, activity } = listing;
  const latest = listing.latestUpdate();
  const now = clock.now();

  return (
    <CardContainer>
      <CardBody>
        <article className="card">
          <Cover project={project}>
            <span className="cat mono">{project.category.tag}</span>
            {project.openToInvestment && <span className="tag">{localizer.t("filters.open")}</span>}
            {project.paused && <span className="tag tag--paused">{localizer.t("card.paused")}</span>}
          </Cover>
          <div className="card__body">
            <h3>
              <Link href={paths.project(project.id)}>{project.name}</Link>
              <span className="badge mono">{project.stage.badge}</span>
            </h3>
            <p className="tags">{project.hashtags().slice(0, tagLimit).join(" ")}</p>
            <p className="blurb">{localizer.text(project.blurb)}</p>
            <p className="pulse-row">
              <ActivityStrip days={activity.dailyStrip(ACTIVITY_WINDOW_DAYS, now)} />
              <span className="mono">
                {localizer.t("card.updates", { count: activity.countWithin(ACTIVITY_WINDOW_DAYS, now) })}
              </span>
            </p>
          </div>
          <p className="by">
            {footer ?? (
              <>
                <Avatar maker={maker} />
                <Link className="by__name" href={paths.maker(maker.id)}>
                  {maker.name}
                </Link>
              </>
            )}
            {latest && <TimeAgo className="mono" at={latest.postedAt} />}
          </p>
        </article>
        <span className="glare" aria-hidden="true" />
      </CardBody>
    </CardContainer>
  );
}
