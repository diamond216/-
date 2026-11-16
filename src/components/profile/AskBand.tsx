"use client";

import type { Maker } from "@/domain";
import { useLocalizer } from "../providers/NestProvider";

export function AskBand({ maker, onWrite }: { maker: Maker; onWrite(): void }) {
  const localizer = useLocalizer();
  const name = localizer.text(maker.nickname);
  return (
    <section className="ask" aria-labelledby="ask-title">
      <div className="wrap ask__in">
        <div>
          <h2 id="ask-title">{localizer.t("profile.ask", { name })}</h2>
          <p>{localizer.t("profile.askBody")}</p>
        </div>
        <button className="btn" type="button" aria-haspopup="dialog" onClick={onWrite}>
          {localizer.t("note.cta", { name })}
        </button>
      </div>
    </section>
  );
}
