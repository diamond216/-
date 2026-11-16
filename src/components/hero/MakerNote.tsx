"use client";

import Link from "next/link";
import { useState } from "react";
import { paths } from "../common/links";
import type { MakerSpotlight } from "@/services/shelf";
import { Avatar } from "../common/Avatar";
import { ContactDialog } from "../contact/ContactDialog";
import { useLocalizer, useNest } from "../providers/NestProvider";

const OTHER_PROJECTS_NAMED = 2;

/**
 * The note beside the highlight: the maker of the project on show, in their own words,
 * what else they're building, and a way to write to them.
 */
export function MakerNote({
  spotlight,
  onWritingChange,
}: {
  spotlight: MakerSpotlight;
  /** Tells the hero a message is being written, so the highlight holds still. */
  onWritingChange?(writing: boolean): void;
}) {
  const localizer = useLocalizer();
  const { clock } = useNest();
  const [writing, setWriting] = useState(false);
  const { maker, listing, projectCount, otherProjects } = spotlight;
  const named = otherProjects.slice(0, OTHER_PROJECTS_NAMED).map((other) => other.project.name);
  const toggleWriting = (open: boolean) => {
    setWriting(open);
    onWritingChange?.(open);
  };

  return (
    <aside
      key={maker.id}
      className="note panel"
      aria-label={localizer.t("note.behind")}
      style={{ "--c": listing.project.coverColor } as React.CSSProperties}
    >
      <p className="mono note__label">{localizer.t("note.behind")}</p>
      <blockquote>“{localizer.text(maker.motto)}”</blockquote>
      <div className="who">
        <Avatar maker={maker} />
        <p>
          <strong>
            <Link className="by__name" href={paths.maker(maker.id)}>
              {maker.name}
            </Link>
          </strong>
          <span>
            {localizer.t("note.who", {
              role: localizer.text(maker.role),
              years: maker.yearsAtHub(clock.now()),
              projects: projectCount,
            })}
          </span>
        </p>
      </div>
      {named.length > 0 && (
        <p className="note__last">
          <span className="dot" aria-hidden="true" />
          <span>{localizer.t("note.also", { names: named, more: otherProjects.length - named.length })}</span>
        </p>
      )}
      <ContactDialog
        maker={maker}
        open={writing}
        onOpenChange={toggleWriting}
        trigger={
          <button className="btn" type="button">
            {localizer.t("note.cta", { name: localizer.text(maker.nickname) })}
          </button>
        }
      />
    </aside>
  );
}
