"use client";

import { useMemo } from "react";
import type { ShelfQueryControls } from "@/hooks/useShelfQuery";
import { useLocalizer, useNest } from "../providers/NestProvider";
import { HeroHeadline } from "./HeroHeadline";
import { MakerNote } from "./MakerNote";
import { SearchBox } from "./SearchBox";
import { UpdateDonut } from "./UpdateDonut";

const BUSY_GENRES_SHOWN = 4;

export function Hero({ shelfQuery, onBrowse }: { shelfQuery: ShelfQueryControls; onBrowse(): void }) {
  const localizer = useLocalizer();
  const { digest } = useNest();
  const { query, update } = shelfQuery;

  const stats = useMemo(() => digest.stats(), [digest]);
  const momentum = useMemo(() => digest.momentum(), [digest]);
  const spotlight = useMemo(() => digest.spotlight(), [digest]);
  const busyGenres = useMemo(() => digest.busyGenres(BUSY_GENRES_SHOWN), [digest]);

  return (
    <section className="hero wrap" aria-labelledby="hero-title">
      <div className="hero__main">
        <p className="mono hero__count">
          <span className="dot" aria-hidden="true" />
          <span>
            {localizer.t("hero.count", { projects: stats.projects, updates: stats.updates, days: stats.windowDays })}
          </span>
        </p>
        <HeroHeadline id="hero-title" />
        <p className="hero__lede">{localizer.t("hero.lede")}</p>

        <SearchBox value={query.text} onChange={(text) => update({ text })} onSubmit={onBrowse} />
        <p className="hero__busy">
          <span>{localizer.t("hero.busy")}</span>
          {busyGenres.map((genre) => (
            <a key={genre.id} href="#shelf" onClick={() => update({ category: null, genres: [genre.id] })}>
              {localizer.text(genre.label)}
            </a>
          ))}
          <a href="#shelf" onClick={() => update({ openToInvestment: true })}>
            {localizer.t("filters.open")}
          </a>
        </p>
      </div>

      <div className="hero__side">
        <UpdateDonut slices={momentum} stats={stats} />
        {spotlight && <MakerNote spotlight={spotlight} />}
      </div>
    </section>
  );
}
