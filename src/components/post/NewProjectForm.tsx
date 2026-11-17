"use client";

import { type FormEvent, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Category, type CategoryId, Stage } from "@/domain";
import {
  type DraftCheck,
  emptyProjectDraft,
  MAX_GENRES,
  type ProjectDraft,
  type ProjectError,
  type ProjectField,
} from "@/services/submissions";
import { toggled } from "@/services/shelf";
import { useLocalizer, useNest } from "../providers/NestProvider";
import { FieldError } from "./FieldError";
import { PhotoDrop, usePhotoSlot } from "./PhotoDrop";

type Status = "writing" | "sending" | "sent" | "failed";
type Note = "saved" | "saveFailed" | null;

/** "A new project": what it is, where it lives, two photos, and the five things Hamster Hub checks. */
export function NewProjectForm({ initialRoom }: { initialRoom: CategoryId | null }) {
  const localizer = useLocalizer();
  const { posting } = useNest();
  const { desk, projectValidator, checklist, sender, drafts } = posting;
  const id = useId();

  const [draft, setDraft] = useState<ProjectDraft>(() => emptyProjectDraft(initialRoom));
  const [before, chooseBefore] = usePhotoSlot();
  const [now, chooseNow] = usePhotoSlot();
  const [check, setCheck] = useState<DraftCheck<ProjectField, ProjectError> | null>(null);
  const [status, setStatus] = useState<Status>("writing");
  const [note, setNote] = useState<Note>(null);
  const form = useRef<HTMLFormElement>(null);
  const saved = useSyncExternalStore(drafts.subscribe, () => drafts.raw("project"), () => null);

  const genres = useMemo(() => (draft.room ? desk.genresFor(draft.room) : []), [desk, draft.room]);
  const review = checklist.review(draft);
  const missing = review.filter((result) => !result.met).length;

  const change = (patch: Partial<ProjectDraft>) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    setNote(null);
    if (check) setCheck(projectValidator.validate(next));
  };

  const pickRoom = (room: CategoryId) => {
    // Genres belong to a room, so the ones from another room drop off.
    const keep = new Set(desk.genresFor(room).map((genre) => genre.id));
    change({ room, genreIds: draft.genreIds.filter((genreId) => keep.has(genreId)) });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const result = projectValidator.validate(draft);
    setCheck(result);
    const invalid = result.firstInvalidField();
    if (invalid) {
      form.current?.querySelector<HTMLElement>(`[data-field="${invalid}"]`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      await sender.send({ kind: "project", draft: { ...draft, name: draft.name.trim(), blurb: draft.blurb.trim() } });
      drafts.clear("project");
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  };

  const save = () => setNote(drafts.save("project", draft) ? "saved" : "saveFailed");

  const resume = () => {
    const loaded = drafts.load<ProjectDraft>("project");
    if (!loaded) return;
    chooseBefore(null);
    chooseNow(null);
    setDraft({ ...emptyProjectDraft(), ...loaded, beforePhotoName: null, nowPhotoName: null });
    setCheck(null);
  };

  const startOver = () => {
    chooseBefore(null);
    chooseNow(null);
    setDraft(emptyProjectDraft(draft.room));
    setCheck(null);
    setStatus("writing");
  };

  const errorFor = (field: ProjectField) => {
    const error = check?.errors[field];
    return error ? localizer.t(`newproj.error.${error}`) : null;
  };
  const describe = (field: ProjectField, hint?: string) =>
    [hint, check?.errors[field] ? `${id}-${field}-error` : undefined].filter(Boolean).join(" ") || undefined;

  const aside = (
    <aside className="pw__aside" aria-labelledby={`${id}-checks`}>
      <div className="pw-card">
        <h2 id={`${id}-checks`}>{localizer.t("newproj.checks")}</h2>
        <ul className="pw-todo">
          {review.map((result) => (
            <li key={result.id} data-met={result.met || undefined}>
              <i aria-hidden="true" />
              <span>{localizer.t(`newproj.check.${result.id}`)}</span>
            </li>
          ))}
        </ul>
        <p className="pw-card__note" aria-live="polite">
          {localizer.t("newproj.missing", { count: missing })}
        </p>
      </div>
    </aside>
  );

  if (status === "sent") {
    return (
      <div className="wrap pw">
        <div className="pw__form pw-done" role="status">
          <h2>{localizer.t("newproj.sent", { name: draft.name.trim() })}</h2>
          <p>{localizer.t("postpage.preview")}</p>
          <p className="pw__acts">
            <button className="b" type="button" onClick={startOver}>
              {localizer.t("newproj.another")}
            </button>
          </p>
        </div>
        {aside}
      </div>
    );
  }

  return (
    <div className="wrap pw">
      <form className="pw__form" ref={form} onSubmit={submit} noValidate>
        {saved && (
          <p className="pw-resume">
            <span>{localizer.t("postpage.resume")}</span>
            <button type="button" onClick={resume}>
              {localizer.t("postpage.resumeCta")}
            </button>
          </p>
        )}

        <div className="pw__f">
          <label className="pw__lab" htmlFor={`${id}-name`}>
            {localizer.t("newproj.name")}
          </label>
          <input
            id={`${id}-name`}
            className="pw__inp"
            data-field="name"
            type="text"
            maxLength={60}
            value={draft.name}
            onChange={(event) => change({ name: event.target.value })}
            aria-invalid={check?.errors.name ? true : undefined}
            aria-describedby={describe("name")}
          />
          <FieldError id={`${id}-name-error`} message={errorFor("name")} />
        </div>

        <div className="pw__f">
          <label className="pw__lab" htmlFor={`${id}-blurb`}>
            {localizer.t("newproj.blurb")}
          </label>
          <p className="pw__hint" id={`${id}-blurb-hint`}>
            {localizer.t("newproj.blurbHint")}
          </p>
          <input
            id={`${id}-blurb`}
            className="pw__inp"
            data-field="blurb"
            type="text"
            maxLength={140}
            value={draft.blurb}
            onChange={(event) => change({ blurb: event.target.value })}
            aria-invalid={check?.errors.blurb ? true : undefined}
            aria-describedby={describe("blurb", `${id}-blurb-hint`)}
          />
          <FieldError id={`${id}-blurb-error`} message={errorFor("blurb")} />
        </div>

        <fieldset className="pw__f" data-field="room" tabIndex={-1} aria-describedby={describe("room")}>
          <legend className="pw__lab">{localizer.t("newproj.room")}</legend>
          <div className="pw-rooms">
            {Category.rooms().map((room) => (
              <label key={room.id} className={`pw-room pw-room--${room.id}`}>
                <input
                  className="sr-only"
                  type="radio"
                  name={`${id}-room`}
                  value={room.id}
                  checked={draft.room === room.id}
                  onChange={() => pickRoom(room.id)}
                />
                <b>{room.tag}</b>
              </label>
            ))}
          </div>
          <FieldError id={`${id}-room-error`} message={errorFor("room")} />
        </fieldset>

        <fieldset
          className="pw__f"
          data-field="genres"
          tabIndex={-1}
          aria-describedby={describe("genres", `${id}-genres-hint`)}
        >
          <legend className="pw__lab">{localizer.t("newproj.genres")}</legend>
          <p className="pw__hint" id={`${id}-genres-hint`}>
            {draft.room ? localizer.t("newproj.genresHint") : localizer.t("newproj.genresPickRoom")}
          </p>
          {genres.length > 0 && (
            <div className="pw-pills">
              {genres.map((genre) => {
                const picked = draft.genreIds.includes(genre.id);
                return (
                  <label key={genre.id} className="pw-pill">
                    <input
                      className="sr-only"
                      type="checkbox"
                      checked={picked}
                      disabled={!picked && draft.genreIds.length >= MAX_GENRES}
                      onChange={() => change({ genreIds: toggled(draft.genreIds, genre.id) })}
                    />
                    {localizer.text(genre.label)}
                  </label>
                );
              })}
            </div>
          )}
          <FieldError id={`${id}-genres-error`} message={errorFor("genres")} />
        </fieldset>

        <fieldset className="pw__f" data-field="stage" tabIndex={-1} aria-describedby={describe("stage")}>
          <legend className="pw__lab">{localizer.t("newproj.stage")}</legend>
          <div className="pw-pills">
            {Stage.all().map((stage) => (
              <label key={stage.id} className="pw-pill">
                <input
                  className="sr-only"
                  type="radio"
                  name={`${id}-stage`}
                  value={stage.id}
                  checked={draft.stageId === stage.id}
                  onChange={() => change({ stageId: stage.id })}
                />
                {localizer.text(stage.label)}
              </label>
            ))}
          </div>
          <FieldError id={`${id}-stage-error`} message={errorFor("stage")} />
        </fieldset>

        <div className="pw__f">
          <label className="pw__lab" htmlFor={`${id}-try`}>
            {localizer.t("newproj.try")}
          </label>
          <p className="pw__hint" id={`${id}-try-hint`}>
            {localizer.t("newproj.tryHint")}
          </p>
          <input
            id={`${id}-try`}
            className="pw__inp"
            data-field="tryUrl"
            type="url"
            inputMode="url"
            placeholder="https://"
            value={draft.tryUrl}
            onChange={(event) => change({ tryUrl: event.target.value })}
            aria-invalid={check?.errors.tryUrl ? true : undefined}
            aria-describedby={describe("tryUrl", `${id}-try-hint`)}
          />
          <FieldError id={`${id}-tryUrl-error`} message={errorFor("tryUrl")} />
        </div>

        <div className="pw__f">
          <p className="pw__lab">{localizer.t("newproj.photos")}</p>
          <p className="pw__hint" id={`${id}-photos-hint`}>
            {localizer.t("newproj.photosHint")}
          </p>
          <div className="pw-two">
            <PhotoDrop
              picture={before}
              caption={localizer.t("progress.before")}
              emptyLabel={localizer.t("newproj.addBefore")}
              describedBy={`${id}-photos-hint`}
              onChoose={(file) => {
                chooseBefore(file);
                change({ beforePhotoName: file?.name ?? null });
              }}
            />
            <PhotoDrop
              picture={now}
              caption={localizer.t("newproj.now")}
              emptyLabel={localizer.t("newproj.addNow")}
              describedBy={`${id}-photos-hint`}
              onChoose={(file) => {
                chooseNow(file);
                change({ nowPhotoName: file?.name ?? null });
              }}
            />
          </div>
        </div>

        <div className="pw__f">
          <label className="pw__lab" htmlFor={`${id}-money`}>
            {localizer.t("newproj.money")}
          </label>
          <p className="pw__hint" id={`${id}-money-hint`}>
            {localizer.t("newproj.moneyHint")}
          </p>
          <textarea
            id={`${id}-money`}
            className="pw__inp pw__inp--tall"
            placeholder={localizer.t("newproj.moneyPlaceholder")}
            value={draft.money}
            onChange={(event) => change({ money: event.target.value })}
            aria-describedby={`${id}-money-hint`}
          />
          <label className="pw-ck">
            <input
              type="checkbox"
              checked={draft.openToInvestment}
              onChange={(event) => change({ openToInvestment: event.target.checked })}
            />
            {localizer.t("filters.open")}
          </label>
        </div>

        <fieldset className="pw__f">
          <legend className="pw__lab">{localizer.t("newproj.promises")}</legend>
          <label className="pw-ck">
            <input
              type="checkbox"
              checked={draft.madeAtHub}
              onChange={(event) => change({ madeAtHub: event.target.checked })}
            />
            {localizer.t("newproj.madeHere")}
          </label>
          <label className="pw-ck">
            <input
              type="checkbox"
              checked={draft.willReply}
              onChange={(event) => change({ willReply: event.target.checked })}
            />
            {localizer.t("newproj.willReply")}
          </label>
        </fieldset>

        {status === "failed" && (
          <p className="pw__error" role="alert">
            {localizer.t("postpage.sendFailed")}
          </p>
        )}

        <div className="pw__acts">
          <button className="b" type="submit" disabled={status === "sending"}>
            {status === "sending" ? localizer.t("newproj.sending") : localizer.t("newproj.submit")}
          </button>
          <button className="b b--line" type="button" onClick={save}>
            {localizer.t("postpage.save")}
          </button>
          <p className="pw__small" role="status">
            {note ? localizer.t(note === "saved" ? "postpage.saved" : "postpage.saveFailed") : localizer.t("newproj.note")}
          </p>
        </div>
        <p className="pw__small pw__preview-note">{localizer.t("postpage.preview")}</p>
      </form>
      {aside}
    </div>
  );
}
