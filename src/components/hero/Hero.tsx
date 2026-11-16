"use client";

import { useMemo, useState } from "react";
import { useLocalizer, useNest } from "../providers/NestProvider";
import { HighlightReel } from "./HighlightReel";
import { MakerNote } from "./MakerNote";
import { UpdateDonut } from "./UpdateDonut";

/** The top of the home page: a few highlighted projects on the left, the shelf's pulse and the maker on show on the right. */
export function Hero() {
  const localizer = useLocalizer();
  const { shelf, digest } = useNest();
  const [active, setActive] = useState(0);
  const [writing, setWriting] = useState(false);

  const stats = useMemo(() => digest.stats(), [digest]);
  const momentum = useMemo(() => digest.momentum(), [digest]);
  const highlights = useMemo(() => shelf.highlights(), [shelf]);
  const spotlight = useMemo(
    () => (highlights[active] ? digest.spotlightFor(highlights[active]) : undefined),
    [digest, highlights, active],
  );

  return (
    <section className="hero wrap" aria-labelledby="hero-title">
      <h1 id="hero-title" className="sr-only">
        {localizer.t("hero.title.lead")} {localizer.t("hero.title.accent")}
      </h1>
      <div className="hero__main">
        <p className="mono hero__count">
          <span className="dot" aria-hidden="true" />
          <span>{localizer.t("hero.highlights")}</span>
        </p>
        <HighlightReel
          highlights={highlights}
          active={active}
          paused={writing}
          onPick={setActive}
          onNext={() => setActive((index) => (index + 1) % highlights.length)}
        />
      </div>

      <div className="hero__side">
        <div className="panel">
          <UpdateDonut slices={momentum} stats={stats} />
        </div>
        {spotlight && <MakerNote spotlight={spotlight} onWritingChange={setWriting} />}
      </div>
    </section>
  );
}
