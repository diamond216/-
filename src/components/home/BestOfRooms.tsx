"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { paths } from "../common/links";
import { ContactDialog } from "../contact/ContactDialog";
import { useLocalizer, useNest } from "../providers/NestProvider";
import { Cover } from "../shelf/Cover";

/** The highlight: the best project from each room. The big stage shows whichever one is picked on the right. */
export function BestOfRooms() {
  const localizer = useLocalizer();
  const { shelf, clock } = useNest();
  const best = useMemo(() => shelf.bestOfEachRoom(), [shelf]);
  const [active, setActive] = useState(0);
  const [writing, setWriting] = useState(false);

  const listing = best[active];
  if (!listing) return null;

  const { project, maker } = listing;
  const latest = listing.latestUpdate();
  const room = project.category.tag;
  const blurb = localizer.text(project.blurb);

  return (
    <section className="wrap best" aria-label={localizer.t("best.label")}>
      <div
        className={`best__stage cover cover--${project.category.id}`}
        style={{ "--c": project.coverColor } as React.CSSProperties}
      >
        <div className="best__text" aria-live="polite">
          {latest?.freshness(clock.now()).isToday ? (
            <span className="hi">{localizer.t("best.newToday", { room })}</span>
          ) : (
            <span>{localizer.t("best.in", { room })}</span>
          )}
          <h2>
            <Link href={paths.project(project.id)}>{project.name}</Link>
          </h2>
          <p>{latest ? localizer.t("best.news", { title: localizer.text(latest.title), blurb }) : blurb}</p>
          <Link className="b" href={paths.project(project.id)}>
            {localizer.t("best.see")}
          </Link>
          <ContactDialog
            maker={maker}
            open={writing}
            onOpenChange={setWriting}
            trigger={
              <button className="b b--line" type="button">
                {localizer.t("note.cta", { name: localizer.text(maker.nickname) })}
              </button>
            }
          />
        </div>
      </div>

      <ol className="best__list">
        {best.map((item, index) => (
          <li key={item.id}>
            <button
              type="button"
              className={index === active ? "best__item best__item--on" : "best__item"}
              aria-pressed={index === active}
              onClick={() => setActive(index)}
            >
              <Cover project={item.project} />
              <span>
                <b>{localizer.t("best.of", { room: item.project.category.tag })}</b>
                <strong>{item.project.name}</strong>
                <span className="small">{localizer.t("best.by", { name: localizer.text(item.maker.nickname) })}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
