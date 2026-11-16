"use client";

import type { Listing, Maker } from "@/domain";
import type { MessageKey } from "@/services/i18n";
import { useLocalizer } from "../providers/NestProvider";
import { ProjectCard } from "../shelf/ProjectCard";
import { RevealList } from "../shelf/RevealList";

/** The short line at the bottom of a card on a profile, picked from where the project is at. */
function statusKey(listing: Listing): MessageKey {
  const { project } = listing;
  if (project.paused) return "profile.status.paused";
  if (project.stage.id === "live") return "profile.status.live";
  return "profile.status.building";
}

/** "What Pim's made": current projects as cards, and older work in a short list. */
export function WorkSection({ maker, listings }: { maker: Maker; listings: readonly Listing[] }) {
  const localizer = useLocalizer();
  const { earlier } = maker.story;
  if (listings.length === 0 && earlier.length === 0) return null;

  return (
    <section className="wrap work" aria-labelledby="work-title">
      <h2 className="sec" id="work-title">
        {localizer.t("profile.made", { name: localizer.text(maker.nickname) })}
      </h2>
      <div className={earlier.length > 0 ? "work__grid" : "work__grid work__grid--wide"}>
        <RevealList
          className="work__now"
          items={listings}
          keyOf={(listing) => listing.id}
          render={(listing) => (
            <ProjectCard
              listing={listing}
              footer={<span>{localizer.t(statusKey(listing) as "profile.status.live")}</span>}
            />
          )}
        />
        {earlier.length > 0 && (
          <div className="work__then">
            <h3>{localizer.t("profile.earlier")}</h3>
            <ul>
              {earlier.map((work) => (
                <li key={`${work.year}-${work.name.en}`}>
                  <span className="mono">{work.year}</span>
                  <div>
                    <strong>{localizer.text(work.name)}</strong>
                    <span>{localizer.text(work.note)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
