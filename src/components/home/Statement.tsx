"use client";

import { useLocalizer } from "../providers/NestProvider";

/** The first thing a visitor reads: what people say when they see the work, and our answer. */
export function Statement() {
  const localizer = useLocalizer();
  return (
    <section className="wrap say" aria-labelledby="say-title">
      <h1 id="say-title">
        <span>{localizer.t("say.title.first")}</span> <span>{localizer.t("say.title.second")}</span>
      </h1>
      <p>{localizer.t("say.lede")}</p>
    </section>
  );
}
