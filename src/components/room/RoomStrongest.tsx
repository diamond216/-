"use client";

import Link from "next/link";
import type { Listing } from "@/domain";
import { PACE_DAYS } from "@/services/shelf";
import { Avatar } from "../common/Avatar";
import { FreshnessLabel } from "../common/FreshnessLabel";
import { paths } from "../common/links";
import { useLocalizer, useNest } from "../providers/NestProvider";
import { Cover } from "../shelf/Cover";

/** "Flowing strongest this week": the top project as one big card, the next two as smaller ones beside it. */
export function RoomStrongest({ listings }: { listings: readonly Listing[] }) {
  const localizer = useLocalizer();
  const { clock } = useNest();
  if (listings.length === 0) return null;
  const now = clock.now();

  return (
    <section aria-labelledby="room-flow">
      <div className="mhead">
        <h2 id="room-flow">{localizer.t("room.flow.title")}</h2>
        <p>{localizer.t("room.flow.sub")}</p>
      </div>
      <div className="flow">
        {listings.map((listing, index) => {
          const { project, maker } = listing;
          const latest = listing.latestUpdate();
          const pace = listing.activity.countWithin(PACE_DAYS, now);
          const big = index === 0;
          return (
            <Link key={listing.id} className={big ? "flow__big" : "flow__s"} href={paths.project(project.id)}>
              <Cover project={project}>
                <span className="shade" />
              </Cover>
              <div className="flow__t">
                <span className="flow__rank">{localizer.t("room.flow.rank", { position: index + 1 })}</span>
                <h3>{project.name}</h3>
                {big && <p>{localizer.text(project.blurb)}</p>}
                {latest && <p className="hand">{localizer.text(latest.title)}</p>}
                <div className="flow__m">
                  {big && (
                    <>
                      <Avatar maker={maker} />
                      {localizer.t("best.by", { name: localizer.text(maker.nickname) })}
                    </>
                  )}
                  {project.paused ? (
                    <span className="when">{localizer.t("card.paused")}</span>
                  ) : (
                    latest && <FreshnessLabel freshness={latest.freshness(now)} />
                  )}
                  {pace > 0 && (
                    <span className="pace">{localizer.t("card.updatesInWindow", { count: pace, days: PACE_DAYS })}</span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
