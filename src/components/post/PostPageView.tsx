"use client";

import { parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import { Category } from "@/domain";
import { SiteFrame } from "../layout/SiteFrame";
import { useLocalizer } from "../providers/NestProvider";
import { NewProjectForm } from "./NewProjectForm";
import { UpdateForm } from "./UpdateForm";

const MODES = ["new", "update"] as const;

/** How the page is spelled in the address bar: /post/?room=game, or /post/?mode=update&project=burrow-knights */
const urlState = {
  mode: parseAsStringLiteral(MODES).withDefault("new"),
  project: parseAsString.withDefault(""),
  room: parseAsStringLiteral(Category.ids()),
};

/** "Post your work": one page, two forms. A new project, or an update to one already on the shelf. */
export function PostPageView() {
  const localizer = useLocalizer();
  const [state, setState] = useQueryStates(urlState, { history: "replace" });

  return (
    <SiteFrame title={localizer.t("page.post.title")}>
      <section className="wrap pw-lead">
        <h1>{localizer.t("postpage.title")}</h1>
        <div className="pw-modes" role="group" aria-label={localizer.t("postpage.modes")}>
          {MODES.map((mode) => (
            <button
              key={mode}
              type="button"
              aria-pressed={state.mode === mode}
              onClick={() => void setState({ mode: mode === "new" ? null : mode })}
            >
              {localizer.t(`postpage.mode.${mode}`)}
            </button>
          ))}
        </div>
      </section>
      {/* Keyed by what the address bar asked for, so a link to another project starts a fresh form. */}
      {state.mode === "update" ? (
        <UpdateForm key={`update-${state.project}`} initialProjectId={state.project} />
      ) : (
        <NewProjectForm key={`new-${state.room ?? ""}`} initialRoom={state.room} />
      )}
    </SiteFrame>
  );
}
