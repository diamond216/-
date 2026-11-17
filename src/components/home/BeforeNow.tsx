"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Avatar } from "../common/Avatar";
import { BeforeNowPair } from "../common/BeforeNowPair";
import { FreshnessLabel } from "../common/FreshnessLabel";
import { paths } from "../common/links";
import { useLocalizer, useNest } from "../providers/NestProvider";

const PAIRS_SHOWN = 3;

/**
 * How visitors see that work is moving, without numbers or charts: the project as it
 * looked before, next to how it looks now.
 */
export function BeforeNow() {
  const localizer = useLocalizer();
  const { digest, clock } = useNest();
  const entries = useMemo(() => digest.latestPerProject(PAIRS_SHOWN), [digest]);
  const now = clock.now();

  return (
    <section className="wrap sec" aria-labelledby="progress-title">
      <h2 id="progress-title">{localizer.t("progress.title")}</h2>
      <p className="sec__lede">{localizer.t("progress.lede")}</p>
      <div className="pairs">
        {entries.map(({ listing, update }) => (
          <article key={listing.id} className="pair">
            <BeforeNowPair project={listing.project} update={update} />
            <h3>
              <Link href={paths.update(listing.id, update.id)}>{listing.project.name}</Link>
            </h3>
            <p className="hand">{localizer.text(update.title)}</p>
            <p className="who2">
              <Avatar maker={listing.maker} />
              <Link href={paths.maker(listing.maker.id)}>{localizer.text(listing.maker.nickname)}</Link>
              <span className="sr-only">
                <FreshnessLabel freshness={update.freshness(now)} />
              </span>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
