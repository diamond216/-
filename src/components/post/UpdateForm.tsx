"use client";

import Link from "next/link";
import { type FormEvent, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { DAY_MS, Freshness, type ProjectPhoto, UpdateType } from "@/domain";
import {
  type DraftCheck,
  emptyUpdateDraft,
  NO_BEFORE,
  POSTABLE_UPDATE_TYPES,
  type UpdateDraft,
  type UpdateError,
  type UpdateField,
} from "@/services/submissions";
import { Avatar } from "../common/Avatar";
import { paths } from "../common/links";
import { useLocalizer, useNest } from "../providers/NestProvider";
import { FieldError } from "./FieldError";
import { PhotoDrop, usePhotoSlot } from "./PhotoDrop";
import { PictureView } from "./PictureView";

type Status = "writing" | "sending" | "sent" | "failed";
type Note = "saved" | "saveFailed" | null;

/** "An update to one you've posted": a line, a photo, and which older photo the new one is the after of. */
export function UpdateForm({ initialProjectId }: { initialProjectId: string }) {
  const localizer = useLocalizer();
  const { posting, clock } = useNest();
  const { desk, updateValidator, sender, drafts } = posting;
  const id = useId();

  const [draft, setDraft] = useState<UpdateDraft>(() =>
    emptyUpdateDraft(desk.project(initialProjectId) ? initialProjectId : ""),
  );
  const [photo, choosePhoto] = usePhotoSlot();
  const [check, setCheck] = useState<DraftCheck<UpdateField, UpdateError> | null>(null);
  const [status, setStatus] = useState<Status>("writing");
  const [note, setNote] = useState<Note>(null);
  const fields = useRef<Partial<Record<UpdateField, HTMLElement | null>>>({});
  const saved = useSyncExternalStore(drafts.subscribe, () => drafts.raw("update"), () => null);

  const groups = useMemo(() => desk.projectsByMaker(), [desk]);
  const project = desk.project(draft.projectId);
  const maker = desk.maker(draft.projectId);
  const photos = useMemo(() => desk.photosFor(draft.projectId), [desk, draft.projectId]);
  const before = photos.find((item) => item.id === draft.afterOf);
  const now = clock.now();

  const change = (patch: Partial<UpdateDraft>) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    setNote(null);
    // Once a field has been flagged, re-check as they type so the message clears when it's fixed.
    if (check) setCheck(updateValidator.validate(next));
  };

  const pickProject = (projectId: string) => change({ projectId, afterOf: photo ? defaultBefore(desk.photosFor(projectId)) : null });

  const pickPhoto = (file: File | null) => {
    choosePhoto(file);
    // A fresh photo is most often the after of the newest one, so that's picked to start with.
    change({ photoName: file?.name ?? null, afterOf: file ? (draft.afterOf ?? defaultBefore(photos)) : null });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const result = updateValidator.validate(draft);
    setCheck(result);
    const invalid = result.firstInvalidField();
    if (invalid) {
      fields.current[invalid]?.focus();
      return;
    }
    setStatus("sending");
    try {
      await sender.send({ kind: "update", draft: { ...draft, title: draft.title.trim() } });
      drafts.clear("update");
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  };

  const save = () => setNote(drafts.save("update", draft) ? "saved" : "saveFailed");

  const resume = () => {
    const loaded = drafts.load<UpdateDraft>("update");
    if (!loaded) return;
    choosePhoto(null);
    setDraft({ ...emptyUpdateDraft(), ...loaded, photoName: null, afterOf: null });
    setCheck(null);
  };

  const startOver = () => {
    choosePhoto(null);
    setDraft(emptyUpdateDraft(draft.projectId));
    setCheck(null);
    setStatus("writing");
  };

  const errorFor = (field: UpdateField) => {
    const error = check?.errors[field];
    return error ? localizer.t(`update.error.${error}`) : null;
  };
  const describe = (field: UpdateField, hint?: string) =>
    [hint, check?.errors[field] ? `${id}-${field}-error` : undefined].filter(Boolean).join(" ") || undefined;

  const whenFor = (item: ProjectPhoto) =>
    item.postedAt
      ? localizer.t(`when.${Freshness.of(Math.floor(Math.max(0, now.getTime() - item.postedAt.getTime()) / DAY_MS)).id}`)
      : localizer.t("update.gallery");

  const preview = (
    <aside className="pw__aside" aria-labelledby={`${id}-preview`}>
      <div className="pw-card">
        <h2 id={`${id}-preview`}>{localizer.t("update.preview")}</h2>
        {project && maker ? (
          <div className="pair">
            {photo && (
              <div className={before ? "pair__two" : "pair__two pair__two--one"} aria-hidden="true">
                {before && (
                  <figure>
                    <PictureView picture={before.picture} />
                    <figcaption>{localizer.t("progress.before")}</figcaption>
                  </figure>
                )}
                <figure>
                  <PictureView picture={photo} />
                  <figcaption className="hi">{localizer.t("when.today")}</figcaption>
                </figure>
              </div>
            )}
            <h3>{project.name}</h3>
            <p className={draft.title.trim() ? "hand" : "hand pw-card__soft"}>
              {draft.title.trim() || localizer.t("update.yourLine")}
            </p>
            <p className="who2">
              <Avatar maker={maker} />
              {localizer.text(maker.nickname)}
            </p>
            <p className="pw-card__note">
              {!photo
                ? localizer.t("update.noPhoto")
                : before
                  ? localizer.t("update.becomesBefore", { caption: localizer.text(before.caption) })
                  : localizer.t("update.onItsOwn")}
            </p>
          </div>
        ) : (
          <p className="pw-card__soft">{localizer.t("update.previewEmpty")}</p>
        )}
      </div>
    </aside>
  );

  if (status === "sent" && project) {
    return (
      <div className="wrap pw">
        <div className="pw__form pw-done" role="status">
          <h2>{localizer.t("update.sent", { project: project.name })}</h2>
          <p>{localizer.t("postpage.preview")}</p>
          <p className="pw__acts">
            <Link className="b" href={paths.project(project.id)}>
              {localizer.t("update.seeProject")}
            </Link>
            <button className="b b--line" type="button" onClick={startOver}>
              {localizer.t("update.another")}
            </button>
          </p>
        </div>
        {preview}
      </div>
    );
  }

  return (
    <div className="wrap pw">
      <form className="pw__form" onSubmit={submit} noValidate>
        {saved && (
          <p className="pw-resume">
            <span>{localizer.t("postpage.resume")}</span>
            <button type="button" onClick={resume}>
              {localizer.t("postpage.resumeCta")}
            </button>
          </p>
        )}

        <div className="pw__f">
          <label className="pw__lab" htmlFor={`${id}-project`}>
            {localizer.t("update.project")}
          </label>
          <p className="pw__hint" id={`${id}-project-hint`}>
            {localizer.t("update.projectHint")}
          </p>
          <select
            id={`${id}-project`}
            className="pw__inp"
            ref={(element) => {
              fields.current.project = element;
            }}
            value={draft.projectId}
            onChange={(event) => pickProject(event.target.value)}
            aria-invalid={check?.errors.project ? true : undefined}
            aria-describedby={describe("project", `${id}-project-hint`)}
          >
            <option value="">{localizer.t("update.projectPick")}</option>
            {groups.map(({ maker: owner, projects }) => (
              <optgroup key={owner.id} label={localizer.text(owner.nickname)}>
                {projects.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <FieldError id={`${id}-project-error`} message={errorFor("project")} />
        </div>

        <div className="pw__f">
          <label className="pw__lab" htmlFor={`${id}-title`}>
            {localizer.t("update.title")}
          </label>
          <p className="pw__hint" id={`${id}-title-hint`}>
            {localizer.t("update.titleHint")}
          </p>
          <input
            id={`${id}-title`}
            className="pw__inp pw__inp--hand"
            ref={(element) => {
              fields.current.title = element;
            }}
            type="text"
            maxLength={120}
            placeholder={localizer.t("update.titlePlaceholder")}
            value={draft.title}
            onChange={(event) => change({ title: event.target.value })}
            aria-invalid={check?.errors.title ? true : undefined}
            aria-describedby={describe("title", `${id}-title-hint`)}
          />
          <FieldError id={`${id}-title-error`} message={errorFor("title")} />
        </div>

        <div className="pw__f">
          <p className="pw__lab" id={`${id}-photo-label`}>
            {localizer.t("update.photo")}
          </p>
          <p className="pw__hint" id={`${id}-photo-hint`}>
            {localizer.t("update.photoHint")}
          </p>
          <PhotoDrop
            picture={photo}
            onChoose={pickPhoto}
            emptyLabel={localizer.t("postpage.photo.add")}
            describedBy={`${id}-photo-label ${id}-photo-hint`}
          />
        </div>

        {photo && project && (
          <fieldset
            className="pw__f"
            ref={(element) => {
              fields.current.afterOf = element;
            }}
            tabIndex={-1}
            aria-describedby={describe("afterOf", `${id}-after-hint`)}
          >
            <legend className="pw__lab">{localizer.t("update.afterOf")}</legend>
            <p className="pw__hint" id={`${id}-after-hint`}>
              {localizer.t("update.afterOfHint")}
            </p>
            <div className="pw-olds">
              {photos.map((item) => (
                <label key={item.id} className="pw-old">
                  <input
                    className="sr-only"
                    type="radio"
                    name={`${id}-after`}
                    value={item.id}
                    checked={draft.afterOf === item.id}
                    onChange={() => change({ afterOf: item.id })}
                  />
                  <PictureView picture={item.picture} />
                  <b>{localizer.text(item.caption)}</b>
                  <span>{whenFor(item)}</span>
                </label>
              ))}
              <label className="pw-old pw-old--none">
                <input
                  className="sr-only"
                  type="radio"
                  name={`${id}-after`}
                  value={NO_BEFORE}
                  checked={draft.afterOf === NO_BEFORE}
                  onChange={() => change({ afterOf: NO_BEFORE })}
                />
                <b>{localizer.t("update.none")}</b>
                <span>{localizer.t("update.noneHint")}</span>
              </label>
            </div>
            <FieldError id={`${id}-afterOf-error`} message={errorFor("afterOf")} />
          </fieldset>
        )}

        <fieldset className="pw__f">
          <legend className="pw__lab">{localizer.t("update.type")}</legend>
          <div className="pw-pills">
            {POSTABLE_UPDATE_TYPES.map((typeId) => (
              <label key={typeId} className="pw-pill">
                <input
                  className="sr-only"
                  type="radio"
                  name={`${id}-type`}
                  value={typeId}
                  checked={draft.typeId === typeId}
                  onChange={() => change({ typeId })}
                />
                {localizer.text(UpdateType.byId(typeId)!.label)}
              </label>
            ))}
          </div>
        </fieldset>

        {status === "failed" && (
          <p className="pw__error" role="alert">
            {localizer.t("postpage.sendFailed")}
          </p>
        )}

        <div className="pw__acts">
          <button className="b" type="submit" disabled={status === "sending"}>
            {status === "sending" ? localizer.t("update.posting") : localizer.t("update.submit")}
          </button>
          <button className="b b--line" type="button" onClick={save}>
            {localizer.t("postpage.save")}
          </button>
          <p className="pw__small" role="status">
            {note ? localizer.t(note === "saved" ? "postpage.saved" : "postpage.saveFailed") : localizer.t("update.note")}
          </p>
        </div>
        <p className="pw__small pw__preview-note">{localizer.t("postpage.preview")}</p>
      </form>
      {preview}
    </div>
  );
}

/** The newest older photo, or "none" for a project that has no photos yet. */
function defaultBefore(photos: readonly ProjectPhoto[]): string {
  return photos[0]?.id ?? NO_BEFORE;
}
