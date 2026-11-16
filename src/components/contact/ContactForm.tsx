"use client";

import { type FormEvent, useId, useRef, useState } from "react";
import type { Maker } from "@/domain";
import {
  CONTACT_REASONS,
  emptyDraft,
  type MessageDraft,
  type MessageField,
  type ValidationResult,
} from "@/services/contact";
import { useLocalizer, useNest } from "../providers/NestProvider";

type Status = "writing" | "sending" | "sent" | "failed";

/** The form itself. It only knows a validator and a MessageSender; where messages go is not its business. */
export function ContactForm({ maker, noteId, onDone }: { maker: Maker; noteId: string; onDone(): void }) {
  const localizer = useLocalizer();
  const { contact } = useNest();
  const [draft, setDraft] = useState<MessageDraft>(() => emptyDraft(maker.id));
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [status, setStatus] = useState<Status>("writing");
  const fields = useRef<Partial<Record<MessageField, HTMLElement | null>>>({});
  const id = useId();
  const name = localizer.text(maker.nickname);

  const change = (patch: Partial<MessageDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
    // Once a field has been flagged, re-check as they type so the message clears when it's fixed.
    if (result) setResult(contact.validator.validate({ ...draft, ...patch }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const checked = contact.validator.validate(draft);
    setResult(checked);
    const invalid = checked.firstInvalidField();
    if (invalid) {
      fields.current[invalid]?.focus();
      return;
    }
    setStatus("sending");
    try {
      await contact.sender.send(draft);
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  };

  if (status === "sent") {
    return (
      <div className="contact__sent" role="status">
        <p>
          <span className="dot" aria-hidden="true" />
          <span>{localizer.t("contact.sent", { name })}</span>
        </p>
        <button className="btn btn--ink" type="button" onClick={onDone} autoFocus>
          {localizer.t("contact.close")}
        </button>
      </div>
    );
  }

  const errorFor = (field: MessageField) => {
    const error = result?.errors[field];
    return error ? localizer.t(`contact.error.${error}`) : null;
  };
  const contactError = errorFor("contact");
  const bodyError = errorFor("body");

  return (
    <form className="contact" onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor={`${id}-name`}>{localizer.t("contact.name")}</label>
        <input
          id={`${id}-name`}
          type="text"
          autoComplete="name"
          value={draft.name}
          onChange={(event) => change({ name: event.target.value })}
        />
      </div>

      <div className="field">
        <label htmlFor={`${id}-contact`}>{localizer.t("contact.reach", { name })}</label>
        <input
          id={`${id}-contact`}
          ref={(element) => {
            fields.current.contact = element;
          }}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={localizer.t("contact.reachPlaceholder")}
          value={draft.contact}
          onChange={(event) => change({ contact: event.target.value })}
          aria-invalid={contactError ? true : undefined}
          aria-describedby={contactError ? `${id}-contact-error` : undefined}
        />
        {contactError && (
          <p className="field__error" id={`${id}-contact-error`} role="alert">
            {contactError}
          </p>
        )}
      </div>

      <fieldset className="field">
        <legend>{localizer.t("contact.reason")}</legend>
        <div className="reasons">
          {CONTACT_REASONS.map((reason) => (
            <label key={reason}>
              <input
                type="radio"
                name={`${id}-reason`}
                value={reason}
                checked={draft.reason === reason}
                onChange={() => change({ reason })}
              />
              {localizer.t(`contact.reason.${reason}`)}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="field">
        <label htmlFor={`${id}-body`}>{localizer.t("contact.body")}</label>
        <textarea
          id={`${id}-body`}
          ref={(element) => {
            fields.current.body = element;
          }}
          placeholder={localizer.t("contact.bodyPlaceholder")}
          value={draft.body}
          onChange={(event) => change({ body: event.target.value })}
          aria-invalid={bodyError ? true : undefined}
          aria-describedby={bodyError ? `${id}-body-error` : undefined}
        />
        {bodyError && (
          <p className="field__error" id={`${id}-body-error`} role="alert">
            {bodyError}
          </p>
        )}
      </div>

      {status === "failed" && (
        <p className="contact__error" role="alert">
          {localizer.t("contact.error.sendFailed")}
        </p>
      )}

      <div className="contact__actions">
        <button className="btn" type="submit" disabled={status === "sending"}>
          {status === "sending" ? localizer.t("contact.sending") : localizer.t("contact.send")}
        </button>
        <p className="contact__note" id={noteId}>
          {localizer.t("contact.copyNote")}
        </p>
      </div>
    </form>
  );
}
