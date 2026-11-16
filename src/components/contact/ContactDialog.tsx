"use client";

import { X } from "lucide-react";
import { useId } from "react";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { Maker } from "@/domain";
import { useLocalizer } from "../providers/NestProvider";
import { ContactForm } from "./ContactForm";

/** The "write to a maker" form in a modal. Focus is trapped while it's open and returns to the button after. */
export function ContactDialog({
  maker,
  open,
  onOpenChange,
}: {
  maker: Maker;
  open: boolean;
  onOpenChange(open: boolean): void;
}) {
  const localizer = useLocalizer();
  const noteId = useId();
  const name = localizer.text(maker.nickname);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        aria-describedby={noteId}
        className="max-h-[calc(100dvh-2rem)] gap-5 overflow-y-auto rounded-lg border border-line bg-surface p-6 text-base text-ink ring-0 sm:max-w-[520px] sm:p-7"
      >
        <DialogTitle className="contact__title">{localizer.t("contact.title", { name })}</DialogTitle>
        <ContactForm maker={maker} noteId={noteId} onDone={() => onOpenChange(false)} />
        <DialogClose
          className="absolute top-4 right-4 grid size-9 place-items-center rounded-md text-ink-soft hover:bg-muted hover:text-ink"
          aria-label={localizer.t("contact.close")}
        >
          <X className="size-5" aria-hidden="true" />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
