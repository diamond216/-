"use client";

import { useState } from "react";
import type { UpdateTypeId } from "@/domain";
import type { UpdateStream } from "@/services/pages";
import { CoverArtView } from "../common/CoverArtView";
import { TimeAgo } from "../common/TimeAgo";
import { useLocalizer } from "../providers/NestProvider";
import { RevealList } from "../shelf/RevealList";

const FIRST_SHOWN = 4;

/** "What's been happening": every update, filterable by kind, newest first and drawn larger. */
export function UpdateStreamSection({ stream }: { stream: UpdateStream }) {
  const localizer = useLocalizer();
  const [type, setType] = useState<UpdateTypeId | null>(null);
  const [expanded, setExpanded] = useState(false);
  const { shown, older } = stream.page(type, expanded ? Number.POSITIVE_INFINITY : FIRST_SHOWN);
  const pick = (next: UpdateTypeId | null) => {
    setType(next);
    setExpanded(false);
  };

  if (stream.size === 0) return null;

  return (
    <section aria-labelledby="stream-title">
      <header className="stream__head">
        <h2 className="sec" id="stream-title">
          {localizer.t("stream.title")}
        </h2>
        <p className="chips" role="group" aria-label={localizer.t("stream.filter")}>
          <button className="chip" type="button" aria-pressed={type === null} onClick={() => pick(null)}>
            {localizer.t("stream.all", { count: stream.size })}
          </button>
          {stream.facets().map(({ type: kind, count }) => (
            <button
              key={kind.id}
              className="chip"
              type="button"
              aria-pressed={type === kind.id}
              onClick={() => pick(kind.id)}
            >
              {localizer.text(kind.plural)} {count}
            </button>
          ))}
        </p>
      </header>

      <RevealList
        className="stream"
        items={shown}
        keyOf={(update) => update.id}
        step={0.05}
        render={(update, index) => (
          <>
            <TimeAgo className="mono" at={update.postedAt} />
            <article id={`update-${update.id}`}>
              <span className="kind mono">{localizer.text(update.type.label)}</span>
              <h3>{localizer.text(update.title)}</h3>
              <p>{localizer.text(update.body)}</p>
              {index === 0 && update.image && <CoverArtView art={update.image} />}
              <p className="feed__meta mono">
                <span aria-label={localizer.t("feed.reactions", update)}>
                  <span aria-hidden="true">
                    ♥ {update.hearts} · ↩ {update.replies} {localizer.t("stream.replies", { count: update.replies })}
                  </span>
                </span>
                {index === 0 && (
                  <a className="stream__reply" href="#">
                    {localizer.t("stream.readReply")}
                  </a>
                )}
              </p>
            </article>
          </>
        )}
      />
      {older.length > 0 && (
        <button className="stream__more" type="button" onClick={() => setExpanded(true)}>
          {localizer.t("stream.older", { count: older.length })}
        </button>
      )}
    </section>
  );
}
