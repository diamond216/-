"use client";

import { useState } from "react";
import type { MakerSpotlight } from "@/services/shelf";
import { Avatar } from "../common/Avatar";
import { ContactDialog } from "../contact/ContactDialog";
import { useLocalizer, useNest } from "../providers/NestProvider";

/** The paper note in the hero: whoever posted most recently, in their own words, with a way to write to them. */
export function MakerNote({ spotlight }: { spotlight: MakerSpotlight }) {
  const localizer = useLocalizer();
  const { clock } = useNest();
  const [writing, setWriting] = useState(false);
  const { maker, update, listing, projectCount } = spotlight;

  return (
    <aside className="note" aria-label={localizer.t("note.label")}>
      <p className="mono note__label">{localizer.t("note.label")}</p>
      <blockquote>“{localizer.text(maker.motto)}”</blockquote>
      <div className="who">
        <Avatar maker={maker} />
        <p>
          <strong>{maker.name}</strong>
          <span>
            {localizer.t("note.who", {
              role: localizer.text(maker.role),
              years: maker.yearsAtHub,
              projects: projectCount,
            })}
          </span>
        </p>
      </div>
      <p className="note__last">
        <span className="dot" aria-hidden="true" />
        <span>
          {localizer.t("note.last", {
            ago: localizer.ago(update.postedAt, clock.now(), "sentence"),
            project: listing.project.name,
            what: localizer.text(update.note),
          })}
        </span>
      </p>
      <button className="btn" type="button" onClick={() => setWriting(true)}>
        {localizer.t("note.cta", { name: localizer.text(maker.nickname) })}
      </button>
      <ContactDialog maker={maker} open={writing} onOpenChange={setWriting} />
    </aside>
  );
}
