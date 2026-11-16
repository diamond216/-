"use client";

import { type FormEvent, useEffect, useId, useRef } from "react";
import { useLocalizer } from "../providers/NestProvider";

function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

/** The search field in the hero. Filters the shelf as you type; "/" jumps to it from anywhere. */
export function SearchBox({
  value,
  onChange,
  onSubmit,
}: {
  value: string;
  onChange(text: string): void;
  onSubmit(): void;
}) {
  const localizer = useLocalizer();
  const input = useRef<HTMLInputElement>(null);
  const id = useId();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey || isTyping(event.target)) return;
      event.preventDefault();
      input.current?.focus();
      input.current?.select();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className="search" role="search" action="#shelf" onSubmit={submit}>
      <label htmlFor={id}>{localizer.t("search.label")}</label>
      <div className="search__row">
        <span className="search__field">
          <input
            id={id}
            ref={input}
            name="q"
            type="search"
            autoComplete="off"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={localizer.t("search.placeholder")}
            aria-keyshortcuts="/"
          />
          <kbd className="mono" title={localizer.t("search.hint")} aria-hidden="true">
            /
          </kbd>
        </span>
        <button className="btn btn--ink" type="submit">
          {localizer.t("search.submit")}
        </button>
      </div>
    </form>
  );
}
