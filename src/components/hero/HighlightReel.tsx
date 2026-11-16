"use client";

import Link from "next/link";
import { useId } from "react";
import type { Listing } from "@/domain";
import { paths } from "../common/links";
import { useLocalizer, useNest } from "../providers/NestProvider";
import { Cover } from "../shelf/Cover";

/**
 * The hero's big card, taking turns between a few highlighted projects.
 * The turn timer is the CSS fill on the active tab: when it finishes, the next one comes up.
 * With reduced motion there is no fill, so it only changes when you pick a tab.
 */
export function HighlightReel({
  highlights,
  active,
  paused,
  onPick,
  onNext,
}: {
  highlights: readonly Listing[];
  active: number;
  paused: boolean;
  onPick(index: number): void;
  onNext(): void;
}) {
  const localizer = useLocalizer();
  const { clock } = useNest();
  const id = useId();
  const listing = highlights[active];
  if (!listing) return null;

  const { project } = listing;
  const latest = listing.latestUpdate();
  const meta = [project.category.tag, ...project.genres.map((genre) => genre.name), project.stage.badge].join(" · ");

  return (
    <div className="reel" data-paused={paused}>
      <article
        key={project.id}
        className="hl"
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${active}`}
        style={{ "--c": project.coverColor } as React.CSSProperties}
      >
        <Cover project={project}>
          <span className="hl__tag mono">
            {localizer.twoDigits(active + 1)} / {localizer.twoDigits(highlights.length)}
          </span>
        </Cover>
        <div className="hl__body">
          <p className="mono meta">{meta}</p>
          <h2>
            <Link href={paths.project(project.id)}>{project.name}</Link>
          </h2>
          <p className="hl__blurb">{localizer.text(project.blurb)}</p>
          {latest && (
            <p className="hl__latest">
              <span className="dot" aria-hidden="true" />
              <span>
                {localizer.t("note.last", {
                  ago: localizer.ago(latest.postedAt, clock.now(), "sentence"),
                  project: project.name,
                  what: localizer.text(latest.note),
                })}
              </span>
            </p>
          )}
          <p className="hl__cta">
            <Link className="btn btn--ink" href={paths.project(project.id)}>
              {localizer.t("hero.look")}
            </Link>
            {project.hasDemo && (
              <a className="btn btn--ghost" href={project.demoUrl}>
                {localizer.t("project.demo")}
              </a>
            )}
          </p>
        </div>
      </article>

      <div className="reel__tabs" role="tablist" aria-label={localizer.t("hero.reel.label")}>
        {highlights.map((item, index) => (
          <button
            key={item.id}
            id={`${id}-tab-${index}`}
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-controls={`${id}-panel`}
            tabIndex={index === active ? 0 : -1}
            onClick={() => onPick(index)}
            onKeyDown={(event) => {
              const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
              if (!step) return;
              const next = (index + step + highlights.length) % highlights.length;
              onPick(next);
              document.getElementById(`${id}-tab-${next}`)?.focus();
            }}
          >
            <span className="reel__bar" aria-hidden="true" onAnimationEnd={index === active ? onNext : undefined} />
            <b>{item.project.name}</b>
            <span>
              {localizer.text(item.project.category.singular)} · {item.maker.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
