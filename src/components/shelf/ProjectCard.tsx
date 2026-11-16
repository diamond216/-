"use client";

import { CardBody, CardContainer } from "@/components/ui/3d-card";
import type { Listing } from "@/domain";
import { ACTIVITY_WINDOW_DAYS } from "@/services/shelf";
import { Avatar } from "../common/Avatar";
import { TimeAgo } from "../common/TimeAgo";
import { useLocalizer, useNest } from "../providers/NestProvider";
import { ActivityStrip } from "./ActivityStrip";
import { Cover } from "./Cover";

/** A card in "Fresh updates". */
export function ProjectCard({ listing }: { listing: Listing }) {
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
              <a href="#">{project.name}</a>
              <span className="badge mono">{project.stage.badge}</span>
            </h3>
            <p className="tags">{project.hashtags().join(" ")}</p>
            <p className="blurb">{localizer.text(project.blurb)}</p>
            <p className="pulse-row">
              <ActivityStrip days={activity.dailyStrip(ACTIVITY_WINDOW_DAYS, now)} />
              <span className="mono">
                {localizer.t("card.updates", { count: activity.countWithin(ACTIVITY_WINDOW_DAYS, now) })}
              </span>
            </p>
          </div>
          <p className="by">
            <Avatar maker={maker} />
            <span>{maker.name}</span>
            {latest && <TimeAgo className="mono" at={latest.postedAt} />}
          </p>
        </article>
        <span className="glare" aria-hidden="true" />
      </CardBody>
    </CardContainer>
  );
}
