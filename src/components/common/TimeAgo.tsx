"use client";

import type { TimeStyle } from "@/services/i18n";
import { useLocalizer, useNest } from "../providers/NestProvider";

/** "40 min ago", with the exact time in the markup for machines. */
export function TimeAgo({ at, style = "long", className }: { at: Date; style?: TimeStyle; className?: string }) {
  const { clock } = useNest();
  const localizer = useLocalizer();
  return (
    // The sample data is anchored to the moment the page loads, so the timestamp differs between build and browser.
    <time className={className} dateTime={at.toISOString()} suppressHydrationWarning>
      {localizer.ago(at, clock.now(), style)}
    </time>
  );
}
