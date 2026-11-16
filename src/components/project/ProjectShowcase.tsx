"use client";

import { useSyncExternalStore } from "react";
import { CoverArt, type Project } from "@/domain";
import { CoverArtView } from "../common/CoverArtView";
import { useLocalizer, useNest } from "../providers/NestProvider";

/** Cover and screenshots, then "Try the demo", the follow button and the follower count. */
export function ProjectShowcase({ project }: { project: Project }) {
  const localizer = useLocalizer();
  const { follows } = useNest();
  const following = useSyncExternalStore(
    follows.subscribe,
    () => follows.isFollowing(project.id),
    () => false,
  );
  const cover = new CoverArt(project.category.id, project.coverColor);

  return (
    <>
      <div className="shots">
        <CoverArtView art={cover} />
        {project.screens.length > 0 && (
          <div className="shots__thumbs">
            {project.screens.slice(0, 3).map((art, index) => (
              <CoverArtView key={index} art={art} />
            ))}
          </div>
        )}
      </div>
      <p className="actions">
        {project.demoUrl && (
          <a className="btn" href={project.demoUrl}>
            {localizer.t("project.demo")}
          </a>
        )}
        <button
          className="btn btn--ghost"
          type="button"
          aria-pressed={following}
          onClick={() => follows.toggle(project.id)}
        >
          {following ? localizer.t("project.following") : localizer.t("project.follow")}
        </button>
        <span className="mono" aria-live="polite">
          {localizer.t("project.followers", { count: project.followers + (following ? 1 : 0) })}
        </span>
      </p>
    </>
  );
}
