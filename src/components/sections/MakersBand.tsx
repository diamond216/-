"use client";

import { useLocalizer } from "../providers/NestProvider";

export function MakersBand() {
  const localizer = useLocalizer();
  return (
    <section className="makers" id="makers" aria-labelledby="makers-title">
      <div className="wrap makers__in">
        <h2 id="makers-title">{localizer.t("makers.title")}</h2>
        <div>
          <p>{localizer.t("makers.body")}</p>
          <p className="makers__cta">
            <a className="btn" href="#">
              {localizer.t("nav.post")}
            </a>
            <a href="#">{localizer.t("makers.link")}</a>
          </p>
        </div>
      </div>
    </section>
  );
}
