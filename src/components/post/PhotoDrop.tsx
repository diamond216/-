"use client";

import { type DragEvent, useCallback, useEffect, useId, useRef, useState } from "react";
import { UploadedPicture } from "@/domain";
import { useLocalizer } from "../providers/NestProvider";
import { PictureView } from "./PictureView";

/**
 * One photo slot. Holds the picked file as an object URL and lets go of it when the
 * photo is swapped, removed, or the form goes away.
 */
export function usePhotoSlot(): [UploadedPicture | null, (file: File | null) => void] {
  const [picture, setPicture] = useState<UploadedPicture | null>(null);
  const current = useRef<UploadedPicture | null>(null);

  useEffect(
    () => () => {
      if (current.current) URL.revokeObjectURL(current.current.url);
    },
    [],
  );

  const choose = useCallback((file: File | null) => {
    if (current.current) URL.revokeObjectURL(current.current.url);
    const next = file ? new UploadedPicture(URL.createObjectURL(file), file.name) : null;
    current.current = next;
    setPicture(next);
  }, []);

  return [picture, choose];
}

/** A drop zone for one photo: tap to choose, or drag a file onto it. */
export function PhotoDrop({
  picture,
  onChoose,
  emptyLabel,
  caption,
  describedBy,
}: {
  picture: UploadedPicture | null;
  onChoose(file: File | null): void;
  emptyLabel: string;
  /** A small label above the file name, like "Before". */
  caption?: string;
  describedBy?: string;
}) {
  const localizer = useLocalizer();
  const inputId = useId();
  const [over, setOver] = useState(false);

  const drop = (event: DragEvent) => {
    event.preventDefault();
    setOver(false);
    const file = [...event.dataTransfer.files].find((item) => item.type.startsWith("image/"));
    if (file) onChoose(file);
  };

  return (
    <div
      className="pw-drop"
      data-filled={picture ? true : undefined}
      data-over={over || undefined}
      onDragOver={(event) => {
        event.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={drop}
    >
      <input
        id={inputId}
        className="sr-only"
        type="file"
        accept="image/*"
        aria-describedby={describedBy}
        onChange={(event) => {
          onChoose(event.target.files?.[0] ?? null);
          event.target.value = "";
        }}
      />
      {picture ? (
        <>
          <PictureView picture={picture} />
          <div className="pw-drop__text">
            {caption && <b>{caption}</b>}
            <span className="pw-drop__name">{picture.fileName}</span>
            <span>{localizer.t("postpage.photo.added")}</span>
          </div>
          <div className="pw-drop__acts">
            <label htmlFor={inputId}>{localizer.t("postpage.photo.swap")}</label>
            <button type="button" onClick={() => onChoose(null)}>
              {localizer.t("postpage.photo.remove")}
            </button>
          </div>
        </>
      ) : (
        <label className="pw-drop__empty" htmlFor={inputId}>
          {caption && <b>{caption}</b>}
          <span className="pw-drop__add">{emptyLabel}</span>
          <span>{localizer.t("postpage.photo.hint")}</span>
        </label>
      )}
    </div>
  );
}
