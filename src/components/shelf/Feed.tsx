"use client";

import Link from "next/link";
import type { FeedEntry } from "@/services/shelf";
import { paths } from "../common/links";
import { TimeAgo } from "../common/TimeAgo";
import { useLocalizer } from "../providers/NestProvider";
import { RevealList } from "./RevealList";

/** "Just posted": the newest updates across the shelf. */
export function Feed({ entries }: { entries: readonly FeedEntry[] }) {
  const localizer = useLocalizer();
  return (
    <aside className="feed" aria-labelledby="feed-title">
      <h2 id="feed-title">
        <span className="dot" aria-hidden="true" />
        <span>{localizer.t("feed.title")}</span>
      </h2>
      <RevealList
        items={entries}
        keyOf={(entry) => entry.update.id}
        render={({ update, listing }) => (
          <>
            <p className="feed__meta mono">
              <TimeAgo at={update.postedAt} style="short" />
              <span className="kind">{localizer.text(update.type.label)}</span>
              <span className="react" aria-label={localizer.t("feed.reactions", update)}>
                <span aria-hidden="true">
                  ♥ {update.hearts} · ↩ {update.replies}
                </span>
              </span>
            </p>
            <p>
              <strong>
                <Link className="feed__link" href={paths.update(listing.project.id, update.id)}>
                  {listing.project.name}
                </Link>
              </strong>{" "}
              <span>{localizer.text(update.summary)}</span>
            </p>
          </>
        )}
      />
      <a className="feed__all" href="#">
        {localizer.t("feed.all")}
      </a>
      <p className="feed__hub">
        <span>{localizer.t("feed.hub")}</span> <a href="#trust">{localizer.t("feed.hubLink")}</a>
      </p>
    </aside>
  );
}
