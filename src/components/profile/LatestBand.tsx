"use client";

import Link from "next/link";
import type { Maker } from "@/domain";
import { PROFILE_WINDOW_DAYS } from "@/services/pages";
import type { FeedEntry } from "@/services/shelf";
import { paths } from "../common/links";
import { useLocalizer, useNest } from "../providers/NestProvider";
import { ActivityStrip } from "../shelf/ActivityStrip";

/** "Latest from Pim": their newest post, and a 90-day strip of how often they post. */
export function LatestBand({ maker, latest, strip }: { maker: Maker; latest: FeedEntry; strip: boolean[] }) {
  const localizer = useLocalizer();
  const { clock } = useNest();
  const { update, listing } = latest;

  return (
    <section className="now" aria-labelledby="now-title">
      <div className="wrap now__in">
        <div className="now__main">
          <p className="mono">
            <span className="dot" aria-hidden="true" />
            {localizer.t("profile.latest", { name: localizer.text(maker.nickname) })} ·{" "}
            {localizer.ago(update.postedAt, clock.now())} · <span className="kind">{localizer.text(update.type.label)}</span> ·{" "}
            {listing.project.name}
          </p>
          <h2 id="now-title">{localizer.text(update.title)}</h2>
          <p>{localizer.text(update.body)}</p>
          <Link href={paths.update(listing.project.id, update.id)}>{localizer.t("profile.readUpdate")}</Link>
        </div>
        <div className="now__strip">
          <ActivityStrip days={strip} />
          <p className="mono">
            {localizer.t("profile.posted", { active: strip.filter(Boolean).length, days: PROFILE_WINDOW_DAYS })}
          </p>
        </div>
      </div>
    </section>
  );
}
