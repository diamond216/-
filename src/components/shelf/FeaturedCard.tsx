"use client";

import { CardBody, CardContainer } from "@/components/ui/3d-card";
import Link from "next/link";
import type { Listing } from "@/domain";
import { ACTIVITY_WINDOW_DAYS } from "@/services/shelf";
import { Avatar } from "../common/Avatar";
import { paths } from "../common/links";
import { TimeAgo } from "../common/TimeAgo";
import { useLocalizer, useNest } from "../providers/NestProvider";
import { ActivityStrip } from "./ActivityStrip";
import { Cover } from "./Cover";

/** One of the top three under "Busiest this week". The first is drawn big. */
export function FeaturedCard({ listing, rank, big }: { listing: Listing; rank: number; big: boolean }) {
  const localizer = useLocalizer();
  const { clock } = useNest();
  const { project, maker, activity } = listing;
  const latest = listing.latestUpdate();
  const now = clock.now();
  const meta = [project.category.tag, project.primaryGenre.name, project.stage.badge].join(" · ");

  return (
    <CardContainer>
      <CardBody>
        <article className={big ? "feat feat--big" : "feat"}>
          <Cover project={project}>
            <span className="rank mono">{localizer.twoDigits(rank)}</span>
          </Cover>
          <div className="feat__body">
            <p className="mono meta">{meta}</p>
            <h3>
              <Link href={paths.project(project.id)}>{project.name}</Link>
            </h3>
            <p>{localizer.text(project.blurb)}</p>
            {big && (
              <p className="pulse-row">
                <ActivityStrip days={activity.dailyStrip(ACTIVITY_WINDOW_DAYS, now)} />
                <span className="mono">
                  {localizer.t("card.updatesInWindow", {
                    count: activity.countWithin(ACTIVITY_WINDOW_DAYS, now),
                    days: ACTIVITY_WINDOW_DAYS,
                  })}
                </span>
              </p>
            )}
            <p className="by">
              <Avatar maker={maker} />
              <span>
                <strong>
                  <Link className="by__name" href={paths.maker(maker.id)}>
                    {maker.name}
                  </Link>
                </strong>
                {big && localizer.t("card.byline", { name: maker.name, role: localizer.text(maker.role) })}
              </span>
              {latest && <TimeAgo className="mono" at={latest.postedAt} />}
            </p>
          </div>
        </article>
        <span className="glare" aria-hidden="true" />
      </CardBody>
    </CardContainer>
  );
}
