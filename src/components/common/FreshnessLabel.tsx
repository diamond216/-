"use client";

import type { Freshness } from "@/domain";
import { useLocalizer } from "../providers/NestProvider";

/** "Today", "This week" and so on. Only today gets the highlighter. */
export function FreshnessLabel({ freshness }: { freshness: Freshness }) {
  const localizer = useLocalizer();
  return <span className={freshness.isToday ? "hi" : "when"}>{localizer.t(`when.${freshness.id}`)}</span>;
}
